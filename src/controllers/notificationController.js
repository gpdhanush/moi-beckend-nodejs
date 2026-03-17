const admin = require('firebase-admin');
const { Notification, NotificationType, isValidNotificationType } = require('../models/notificationModels');
const logger = require('../config/logger');

const serviceAccount = {
    type: process.env.FIREBASE_TYPE,
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: (process.env.FIREBASE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: process.env.FIREBASE_AUTH_URI,
    token_uri: process.env.FIREBASE_TOKEN_URI,
    auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
    universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN,
};

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
    });
}

/**
 * Helper function to send push notification (can be called directly without HTTP request/response)
 * @param {Object} params - { userId, title, body, token, type, skipDbSave, traceId }
 * @returns {Promise<Object>} - { success: boolean, message: string, fcmSent: boolean, dbSaved: boolean, messageId?: string, fcmError?: {code?: string, message?: string} }
 */
async function sendPushNotification({ userId, title, body, token, type, skipDbSave = false, traceId = null }) {
    // Validate required fields
    if (!token || !title || !body) {
        throw new Error('Token, title, and body are required.');
    }

    if (!userId) {
        throw new Error('User ID is required.');
    }

    // Validate notification type if provided
    if (type && !isValidNotificationType(type)) {
        throw new Error(`Invalid notification type. Allowed types: ${Object.values(NotificationType).join(', ')}`);
    }

    const message = {
        notification: {
            title: title,
            body: body,
        },
        data: {
            title: title,
            body: body,
            type: type || NotificationType.GENERAL,
            timestamp: new Date().toISOString(),
            notificationType: type || 'general'
        },
        token: token, // Target device FCM token
        android: {
            priority: 'high',
            ttl: 3600 * 1000,
            notification: {
                title: title,
                body: body,
                clickAction: 'FLUTTER_NOTIFICATION_CLICK'
            }
        },
        apns: {
            headers: {
                'apns-priority': '10'
            },
            payload: {
                aps: {
                    alert: {
                        title: title,
                        body: body
                    },
                    sound: 'default',
                    badge: 1,
                    'content-available': 1
                }
            }
        }
    };

    // Save notification to database first (unless skipDbSave is true)
    let notificationId = null;
    let dbSaveError = null;
    if (!skipDbSave) {
        try {
            const notificationResult = await Notification.create({
                userId: userId,
                title: title,
                body: body,
                type: type || NotificationType.GENERAL
            });
            notificationId = notificationResult.insertId;
            logger.info('Notification saved to DB', { traceId, userId, notificationId, type: type || NotificationType.GENERAL });
        } catch (dbError) {
            dbSaveError = { message: dbError?.message || String(dbError) };
            logger.error('Error saving notification to database:', { traceId, userId, error: dbSaveError.message });
            // Continue trying to send FCM even if DB save fails
        }
    }

    try {
        // Send notification via FCM
        const tokenPrefix = String(token).substring(0, 12);
        const tokenLength = String(token).length;
        logger.info('Sending FCM push', { traceId, userId, type: type || NotificationType.GENERAL, tokenPrefix, tokenLength, skipDbSave });
        const messageId = await admin.messaging().send(message);
        logger.info('FCM sent successfully', { traceId, userId, messageId });
        return {
            success: true,
            message: 'அறிவிப்பு வெற்றிகரமாக அனுப்பப்பட்டது',
            fcmSent: true,
            dbSaved: !!notificationId,
            notificationId,
            dbSaveError,
            messageId
        };
    } catch (error) {
        // FCM send failed
        logger.error('FCM send error:', {
            traceId,
            userId,
            code: error?.code || null,
            message: error?.message || String(error)
        });
        
        // If the token is invalid, deactivate it in the database
        if (error.code === 'messaging/invalid-registration-token' || 
            error.code === 'messaging/registration-token-not-registered') {
            try {
                const db = require('../config/database');
                await db.query(
                    'UPDATE user_devices SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE fcm_token = ?',
                    [token]
                );
                logger.info('Deactivated invalid FCM token', { traceId, userId });
            } catch (dbError) {
                logger.error('Error deactivating FCM token:', { traceId, userId, error: dbError?.message || String(dbError) });
            }
        }
        
        // Return success if notification was saved to DB, even if FCM failed
        if (notificationId) {
            return {
                success: true,
                message: 'அறிவிப்பு தரவுத்தளத்தில் சேமிக்கப்பட்டது, ஆனால் FCM அனுப்ப முடியவில்லை',
                fcmSent: false,
                dbSaved: true,
                notificationId,
                dbSaveError,
                fcmError: {
                    code: error.code || null,
                    message: error.message || String(error)
                }
            };
        }
        
        if (traceId) error.traceId = traceId;
        throw error;
    }
}

exports.sendPushNotification = sendPushNotification;

exports.controller = {
    /**
     * Check Firebase and notification system status (for debugging)
     */
    checkStatus: async (req, res) => {
        try {
            const status = {
                firebase: {
                    initialized: admin.apps.length > 0,
                    projectId: process.env.FIREBASE_PROJECT_ID || 'NOT_SET',
                    hasCredentials: !!(process.env.FIREBASE_PRIVATE_KEY && process.env.FIREBASE_CLIENT_EMAIL)
                },
                database: null,
                tokens: null
            };

            // Check database connection
            try {
                const db = require('../config/database');
                const [result] = await db.query('SELECT 1');
                status.database = { connected: true };
            } catch (dbError) {
                status.database = { connected: false, error: dbError.message };
            }

            // Check sample FCM tokens
            try {
                const db = require('../config/database');
                const [tokens] = await db.query(
                    `SELECT COUNT(*) as total, 
                            SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active
                     FROM user_devices`
                );
                status.tokens = tokens[0];
            } catch (tokenError) {
                status.tokens = { error: tokenError.message };
            }

            return res.status(200).json({
                responseType: "S",
                responseValue: status
            });
        } catch (error) {
            logger.error('Error checking status:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },
    /**
     * Send push notification via FCM and save notification to database
     * Body: { userId, title, body, token, type }
     * type: moi, moiOut, function, account, settings, feedback, general (default: general)
     */
    sendNotification: async (req, res) => {
        const { userId, title, body, token, type } = req.body;
        
        try {
            const result = await sendPushNotification({ userId, title, body, token, type });
            return res.status(200).json({ 
                responseType: "S", 
                responseValue: { message: result.message } 
            });
        } catch (error) {
            // FCM send failed, don't save to database
            logger.error('FCM send error:', error);
            
            // Handle FCM-specific errors
            let errorMessage = 'அறிவிப்பை அனுப்ப முடியவில்லை.';
            let statusCode = 500;

            if (error.code) {
                switch (error.code) {
                    case 'messaging/invalid-registration-token':
                    case 'messaging/registration-token-not-registered':
                        errorMessage = 'தவறான அல்லது காலாவதியான சாதன டோக்கன். பயனர் பயன்பாட்டை நிறுவல் நீக்கியிருக்கலாம் அல்லது டோக்கன் இனி செல்லுபடியாகாது.';
                        statusCode = 400;
                        break;
                    case 'messaging/invalid-argument':
                        errorMessage = 'தவறான அறிவிப்பு தரவு வழங்கப்பட்டது.';
                        statusCode = 400;
                        break;
                    case 'messaging/unavailable':
                        errorMessage = 'FCM சேவை தற்காலிகமாக கிடைக்கவில்லை. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.';
                        statusCode = 503;
                        break;
                    case 'messaging/internal-error':
                        errorMessage = 'உள் FCM பிழை ஏற்பட்டது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்.';
                        statusCode = 500;
                        break;
                    default:
                        // Check error message for common patterns
                        if (error.message && error.message.includes('Requested entity was not found')) {
                            errorMessage = 'தவறான அல்லது காலாவதியான சாதன டோக்கன். சாதனம் நிறுவல் நீக்கப்பட்டிருக்கலாம் அல்லது டோக்கன் இனி செல்லுபடியாகாது.';
                            statusCode = 400;
                        } else if (error.message) {
                            errorMessage = error.message;
                        }
                }
            } else if (error.message) {
                // Handle error messages directly
                if (error.message.includes('Requested entity was not found')) {
                    errorMessage = 'Invalid or expired device token. The device may have been uninstalled or the token is no longer valid.';
                    statusCode = 400;
                } else {
                    errorMessage = error.message;
                }
            }

            return res.status(statusCode).json({ 
                responseType: "F", 
                responseValue: { message: errorMessage } 
            });
        }
    },

    /**
     * Get all notifications for the authenticated user (with pagination)
     * Uses userId from req.user (set by authenticateToken middleware)
     * Query: { limit?, offset? }
     */
    getAllNotifications: async (req, res) => {
        try {
            const userId = req.user.userId;
            const { limit = 50, offset = 0 } = req.body;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பயனர் ஐடி தேவையானது.' }
                });
            }

            const notifications = await Notification.findByUserId(userId, Math.min(parseInt(limit), 100), parseInt(offset));
            const unreadCount = await Notification.getUnreadCount(userId);
            
            return res.status(200).json({
                responseType: "S",
                count: notifications.length,
                unreadCount: unreadCount,
                responseValue: notifications
            });
        } catch (error) {
            logger.error('Error fetching notifications:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get unread notification count for the authenticated user
     */
    getUnreadCount: async (req, res) => {
        try {
            const userId = req.user.userId;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பயனர் ஐடி தேவையானது.' }
                });
            }

            const count = await Notification.getUnreadCount(userId);
            
            return res.status(200).json({
                responseType: "S",
                responseValue: { unreadCount: count }
            });
        } catch (error) {
            logger.error('Error fetching unread count:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Mark notification as read
     * Body: { notificationId }
     */
    markAsRead: async (req, res) => {
        try {
            const { notificationId } = req.body;

            if (!notificationId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு ஐடி தேவையானது.' }
                });
            }

            // Check if notification exists
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' }
                });
            }

            // Check if notification belongs to the authenticated user
            const userId = req.user.userId;
            if (notification.userId !== userId) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அறிவிப்பை அணுக உங்களுக்கு அனுமதி இல்லை.' }
                });
            }

            // Update read status
            const result = await Notification.markAsRead(notificationId);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: 'அறிவிப்பு வெற்றிகரமாக படிக்கப்பட்டதாக குறிக்கப்பட்டது.' }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு நிலையை புதுப்பிக்க முடியவில்லை.' }
                });
            }
        } catch (error) {
            logger.error('Error marking notification as read:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Mark notification as unread
     * Body: { notificationId }
     */
    markAsUnread: async (req, res) => {
        try {
            const { notificationId } = req.body;

            if (!notificationId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு ஐடி தேவையானது.' }
                });
            }

            // Check if notification exists
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' }
                });
            }

            // Check if notification belongs to the authenticated user
            const userId = req.user.userId;
            if (notification.userId !== userId) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அறிவிப்பை அணுக உங்களுக்கு அனுமதி இல்லை.' }
                });
            }

            // Update read status
            const result = await Notification.markAsUnread(notificationId);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: 'அறிவிப்பு வெற்றிகரமாக படிக்கப்படாததாக குறிக்கப்பட்டது.' }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு நிலையை புதுப்பிக்க முடியவில்லை.' }
                });
            }
        } catch (error) {
            logger.error('Error marking notification as unread:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Delete a notification (soft delete)
     * Body: { notificationId }
     */
    delete: async (req, res) => {
        try {
            const { notificationId } = req.body;

            if (!notificationId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு ஐடி தேவையானது.' }
                });
            }

            // Check if notification exists
            const notification = await Notification.findById(notificationId);
            if (!notification) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' }
                });
            }

            // Check if notification belongs to the authenticated user
            const userId = req.user.userId;
            if (notification.userId !== userId) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அறிவிப்பை நீக்க உங்களுக்கு அனுமதி இல்லை.' }
                });
            }

            // Soft delete notification
            const result = await Notification.delete(notificationId);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: 'அறிவிப்பு வெற்றிகரமாக நீக்கப்பட்டது.' }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பை நீக்க முடியவில்லை.' }
                });
            }
        } catch (error) {
            logger.error('Error deleting notification:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Mark all notifications as read for the authenticated user
     */
    markAllAsRead: async (req, res) => {
        try {
            const userId = req.user.userId;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பயனர் ஐடி தேவையானது.' }
                });
            }

            const result = await Notification.markAllAsRead(userId);
            
            return res.status(200).json({
                responseType: "S",
                responseValue: { 
                    message: 'அனைத்து அறிவிப்புகளும் வெற்றிகரமாக படிக்கப்பட்டதாக குறிக்கப்பட்டது.',
                    updatedCount: result.changedRows
                }
            });
        } catch (error) {
            logger.error('Error marking all as read:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Send bulk notifications to multiple users
     * Body: { userIds: [], title, body, type }
     * Steps:
     * 1. Validate users exist in users table
     * 2. Get FCM tokens from user_devices table
     * 3. Send FCM push notifications
     * 4. Save notifications to database
     * 5. Return results with success/failure counts
     */
    sendBulkNotifications: async (req, res) => {
        try {
            const { userIds, title, body, type } = req.body;
            
            // Validate input
            if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பயனர் ஐடிகளின் வரிசை தேவையானது.' }
                });
            }

            if (!title || !body) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'தலைப்பு மற்றும் பொருள் தேவையானது.' }
                });
            }

            // Validate notification type if provided
            if (type && !isValidNotificationType(type)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: `Invalid notification type. Allowed types: ${Object.values(NotificationType).join(', ')}` }
                });
            }

            const db = require('../config/database');
            const { toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

            // Step 1: Get all users and their FCM tokens
            const userIdsFormatted = userIds.map(id => toBinaryUUID(id));
            const placeholders = userIdsFormatted.map(() => '?').join(',');
            
            // Use a subquery to get the most recent active device for each user
            const [users] = await db.query(
                `SELECT u.id, u.full_name, u.email,
                        (SELECT ud.fcm_token FROM user_devices ud 
                         WHERE ud.user_id = u.id AND ud.is_active = 1 
                         ORDER BY ud.last_used_at DESC LIMIT 1) AS fcm_token
                 FROM users u
                 WHERE u.id IN (${placeholders}) AND (u.is_deleted = 0 OR u.is_deleted IS NULL)`,
                userIdsFormatted
            );

            if (users.length === 0) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'கொடுக்கப்பட்ட பயனர் ஐடிகளுக்கு பயனர்கள் கிடைக்கவில்லை.' }
                });
            }

            // Step 2 & 3: Process each user - send FCM and save to DB
            const results = {
                totalRequested: userIds.length,
                usersFound: users.length,
                successful: 0,
                failed: 0,
                noDeviceToken: 0,
                failedUsers: [],
                successfulUsers: []
            };

            for (const user of users) {
                const userId = fromBinaryUUID(user.id);
                
                // Check if user has FCM token
                if (!user.fcm_token) {
                    results.noDeviceToken++;
                    results.failedUsers.push({
                        userId: userId,
                        reason: 'FCM device token not found'
                    });
                    
                    // Still save notification to DB even without token
                    try {
                        await Notification.create({
                            userId: userId,
                            title: title,
                            body: body,
                            type: type || NotificationType.GENERAL
                        });
                    } catch (dbError) {
                        logger.error(`Error saving notification to DB for user ${userId}:`, dbError);
                    }
                    continue;
                }

                try {
                    // Send FCM notification with both notification and data payload
                    const message = {
                        notification: {
                            title: title,
                            body: body,
                        },
                        data: {
                            title: title,
                            body: body,
                            type: type || NotificationType.GENERAL,
                            timestamp: new Date().toISOString(),
                            notificationType: type || 'general'
                        },
                        token: user.fcm_token,
                        android: {
                            priority: 'high',
                            ttl: 3600 * 1000,
                            notification: {
                                title: title,
                                body: body,
                                clickAction: 'FLUTTER_NOTIFICATION_CLICK'
                            }
                        },
                        apns: {
                            headers: {
                                'apns-priority': '10'
                            },
                            payload: {
                                aps: {
                                    alert: {
                                        title: title,
                                        body: body
                                    },
                                    sound: 'default',
                                    badge: 1,
                                    'content-available': 1
                                }
                            }
                        }
                    };

                    logger.info(`Sending FCM to user ${userId} with token ${user.fcm_token.substring(0, 20)}...`);
                    await admin.messaging().send(message);
                    logger.info(`FCM sent successfully to user ${userId}`);

                    // Save notification to database
                    try {
                        await Notification.create({
                            userId: userId,
                            title: title,
                            body: body,
                            type: type || NotificationType.GENERAL
                        });
                    } catch (dbError) {
                        logger.error(`Error saving notification to DB for user ${userId}:`, dbError);
                    }

                    results.successful++;
                    results.successfulUsers.push({
                        userId: userId,
                        email: user.email || 'N/A'
                    });

                } catch (fcmError) {
                    logger.error(`FCM send error for user ${userId}:`, fcmError);
                    
                    // Handle invalid token
                    if (fcmError.code === 'messaging/invalid-registration-token' || 
                        fcmError.code === 'messaging/registration-token-not-registered') {
                        try {
                            await db.query(
                                'UPDATE user_devices SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE fcm_token = ?',
                                [user.fcm_token]
                            );
                            logger.info(`Deactivated invalid FCM token for user ${userId}`);
                        } catch (dbError) {
                            logger.error('Error deactivating FCM token:', dbError);
                        }
                    }

                    results.failed++;
                    results.failedUsers.push({
                        userId: userId,
                        email: user.email || 'N/A',
                        reason: fcmError.message || 'Unknown FCM error'
                    });

                    // Still try to save notification to DB
                    try {
                        await Notification.create({
                            userId: userId,
                            title: title,
                            body: body,
                            type: type || NotificationType.GENERAL
                        });
                    } catch (dbError) {
                        logger.error(`Error saving notification to DB for user ${userId}:`, dbError);
                    }
                }
            }

            // Return results
            return res.status(200).json({
                responseType: results.successful > 0 ? "S" : "F",
                responseValue: {
                    message: `${results.successful} பயனர்களுக்கு அறிவிப்புகள் வெற்றிகரமாக அனுப்பப்பட்டன.`,
                    ...results
                }
            });

        } catch (error) {
            logger.error('Error in sendBulkNotifications:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },
}
