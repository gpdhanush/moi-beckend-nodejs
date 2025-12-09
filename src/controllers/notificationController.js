const admin = require('firebase-admin');
const { Notification, NotificationType, isValidNotificationType } = require('../models/notificationModels');

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
 * @param {Object} params - { userId, title, body, token, type, skipDbSave }
 * @returns {Promise<Object>} - { success: boolean, message: string }
 */
async function sendPushNotification({ userId, title, body, token, type, skipDbSave = false }) {
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
        token: token, // Target device FCM token
    };

    try {
        // Send notification via FCM
        await admin.messaging().send(message);
        
        // If FCM send is successful, save notification to database (unless skipDbSave is true)
        if (!skipDbSave) {
            try {
                await Notification.create({
                    userId: userId,
                    title: title,
                    body: body,
                    type: type || NotificationType.GENERAL // Use provided type or default to 'general'
                });
            } catch (dbError) {
                // Log database error but don't fail the request since FCM send was successful
                console.error('Error saving notification to database:', dbError);
                // Continue - notification was sent successfully
            }
        }

        return { success: true, message: 'அறிவிப்பு வெற்றிகரமாக அனுப்பப்பட்டது' };
    } catch (error) {
        // FCM send failed, don't save to database
        console.error('FCM send error:', error);
        throw error;
    }
}

exports.sendPushNotification = sendPushNotification;

exports.controller = {
    /**
     * Send push notification via FCM and save notification to database
     * Body: { userId, title, body, token, type }
     * type: moi, moiOut, function, account, settings, general (default: general)
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
            console.error('FCM send error:', error);
            
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
     * Get all notifications for the authenticated user
     * Uses userId from req.user (set by authenticateToken middleware)
     */
    getAllNotifications: async (req, res) => {
        try {
            const userId = req.user.userId;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பயனர் ஐடி தேவையானது.' }
                });
            }

            const notifications = await Notification.findByUserId(userId);
            
            return res.status(200).json({
                responseType: "S",
                count: notifications.length,
                responseValue: notifications
            });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Mark notification as read
     * Params: { id } - Notification ID
     */
    markAsRead: async (req, res) => {
        try {
            const notificationId = parseInt(req.params.id);

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
            if (notification.n_um_id !== userId) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அறிவிப்பை அணுக உங்களுக்கு அனுமதி இல்லை.' }
                });
            }

            // Update read status
            const result = await Notification.markAsRead(notificationId);

            if (result && result.affectedRows > 0) {
                // Fetch updated notification
                const updatedNotification = await Notification.findById(notificationId);
                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: 'அறிவிப்பு வெற்றிகரமாக படிக்கப்பட்டதாக குறிக்கப்பட்டது.',
                        notification: updatedNotification
                    }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு நிலையை புதுப்பிக்க முடியவில்லை.' }
                });
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Mark notification as unread
     * Params: { id } - Notification ID
     */
    markAsUnread: async (req, res) => {
        try {
            const notificationId = parseInt(req.params.id);

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
            if (notification.n_um_id !== userId) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அறிவிப்பை அணுக உங்களுக்கு அனுமதி இல்லை.' }
                });
            }

            // Update read status
            const result = await Notification.markAsUnread(notificationId);

            if (result && result.affectedRows > 0) {
                // Fetch updated notification
                const updatedNotification = await Notification.findById(notificationId);
                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: 'அறிவிப்பு வெற்றிகரமாக படிக்கப்படாததாக குறிக்கப்பட்டது.',
                        notification: updatedNotification
                    }
                });
            } else {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'அறிவிப்பு நிலையை புதுப்பிக்க முடியவில்லை.' }
                });
            }
        } catch (error) {
            console.error('Error marking notification as unread:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Delete/Deactivate a notification (soft delete)
     * Params: { id } - Notification ID
     */
    delete: async (req, res) => {
        try {
            const notificationId = parseInt(req.params.id);

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
            if (notification.n_um_id !== userId) {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த அறிவிப்பை நீக்க உங்களுக்கு அனுமதி இல்லை.' }
                });
            }

            // Hard delete notification
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
            console.error('Error deleting notification:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },
}
