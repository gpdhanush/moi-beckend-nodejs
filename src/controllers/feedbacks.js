const Model = require('../models/feedbacks');
const User = require('../models/user');
const db = require('../config/database');
const { generateUUID, toBinaryUUID } = require('../helpers/uuid');
const { sendPushNotification } = require('./notificationController');
const { Notification, NotificationType } = require('../models/notificationModels');
const { sendFeedbackConfirmationEmail, sendFeedbackReplyEmail } = require('../services/emailService');
const logger = require('../config/logger');

const FEEDBACK_TYPES = ['GENERAL', 'BUG', 'FEATURE', 'COMPLAINT'];
const FEEDBACK_STATUSES = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

const toISOStringOrNull = (value) => {
    if (!value) return null;
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date.toISOString();
};

exports.controller = {
    create: async (req, res) => {
        try {
            const userId = req.body.userId;
            const message = String(req.body.message ?? req.body.feedbacks ?? '').trim();
            const type = String(req.body.type || 'GENERAL').toUpperCase();

            if (!userId || !message) {
                return res.status(400).json({ responseType: "F", responseValue: { message: "பயனர் ID மற்றும் செய்தி தேவை!" } });
            }

            if (!FEEDBACK_TYPES.includes(type)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Invalid feedback type!" }
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }

            const payload = {
                userId,
                message,
                type
            };

            const query = await Model.create(payload);

            if (query) {
                if (user.um_notification_token) {
                    try {
                        await sendPushNotification({
                            userId,
                            title: 'புதிய கருத்து சமர்ப்பிக்கப்பட்டது',
                            body: 'உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நாங்கள் விரைவில் மதிப்பாய்வு செய்வோம்.',
                            token: user.um_notification_token,
                            type: NotificationType.GENERAL
                        });
                    } catch (notificationError) {
                        logger.error('Error sending push notification for feedback', notificationError);
                    }
                }
                // TODO: Send email confirmation to user
                if (user.um_email) {
                    sendFeedbackConfirmationEmail(user.um_email, user.um_full_name).catch(() => {});
                }

                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: "உங்கள் தரவு வெற்றிகரமாக சேமிக்கப்பட்டது.",
                        id: query.insertId
                    }
                });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "தரவு சேமிப்பு தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    list: async (req, res) => {
        try {
            const userId =  req.body.userId;
            const status = req.body.status ? String(req.body.status).toUpperCase() : null;
            const type = req.body.type ? String(req.body.type).toUpperCase() : null;
            
            if (!userId) {
                return res.status(400).json({ responseType: "F", responseValue: { message: "பயனர் ID தேவை!" } });
            }

            if (status && !FEEDBACK_STATUSES.includes(status)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Invalid feedback status!" }
                });
            }

            if (type && !FEEDBACK_TYPES.includes(type)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "Invalid feedback type!" }
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }

            const feedbacks = await Model.readAll(userId, { status, type });
            if (!feedbacks || feedbacks.length === 0) {
                return res.status(200).json({ responseType: "S", count: 0, responseValue: [] });
            }
            
            const formattedFeedbacks = feedbacks.map(feedback => {
                return {
                    id: feedback.id,
                    userId: feedback.userId,
                    userName: feedback.userName,
                    userEmail: feedback.userEmail,
                    userMobile: feedback.userMobile,
                    type: feedback.type,
                    message: feedback.message || '',
                    adminResponse: feedback.adminResponse || '',
                    status: feedback.status,
                    respondedAt: toISOStringOrNull(feedback.respondedAt),
                    createdAt: toISOStringOrNull(feedback.createdAt),
                    updatedAt: toISOStringOrNull(feedback.updatedAt)
                };
            });
            
            return res.status(200).json({ responseType: "S", count: formattedFeedbacks.length, responseValue: formattedFeedbacks });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

        adminAllFeedbackLists: async (req, res) => {
            try {
                const limit = parseInt(req.query.limit) || 100;
                const offset = parseInt(req.query.offset) || 0;
                const status = req.query.status || null;
                const type = req.query.type || null;

                const feedbacks = await Model.getAllFeedbacks({ limit, offset, status, type });
                
                if (!feedbacks || feedbacks.length === 0) {
                    return res.status(200).json({ responseType: "S", count: 0, responseValue: [] });
                }
                
                const formattedFeedbacks = feedbacks.map(feedback => {
                    return {
                        id: feedback.id,
                        userId: feedback.userId,
                        userName: feedback.userName,
                        userEmail: feedback.userEmail,
                        type: feedback.type,
                        message: feedback.message || '',
                        adminResponse: feedback.adminResponse || '',
                        status: feedback.status,
                        respondedAt: toISOStringOrNull(feedback.respondedAt),
                        createdAt: toISOStringOrNull(feedback.createdAt),
                        updatedAt: toISOStringOrNull(feedback.updatedAt)
                    };
                });
                
                return res.status(200).json({ 
                    responseType: "S", 
                    count: formattedFeedbacks.length, 
                    responseValue: formattedFeedbacks 
                });
            } catch (error) {
                logger.error('Error fetching all feedbacks: ', error);
                return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
            }
        },

        adminReplyFeedback: async (req, res) => {
            try {
                const traceId = generateUUID();
                const { feedbackId, adminResponse, status } = req.body;

                if (!feedbackId || !adminResponse) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: "Feedback ID and admin response are required!" } 
                    });
                }

                logger.info('adminReplyFeedback start', { traceId, feedbackId });

                const adminResponseText = String(adminResponse).trim();
                if (adminResponseText.length === 0) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: "Admin response cannot be empty!" } 
                    });
                }

                // Validate status if provided
                const feedbackStatus = status || 'RESOLVED';
                if (!FEEDBACK_STATUSES.includes(feedbackStatus)) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: "Invalid feedback status!" } 
                    });
                }

                // Get feedback details to find user
                const feedback = await Model.readById(feedbackId);
                if (!feedback) {
                    return res.status(404).json({ 
                        responseType: "F", 
                        responseValue: { message: "Feedback not found!" } 
                    });
                }

                logger.info('adminReplyFeedback loaded feedback', { traceId, feedbackId, userId: feedback.userId });

                // Update feedback with admin response
                const updated = await Model.addResponse(feedbackId, adminResponseText);
                if (!updated) {
                    return res.status(500).json({ 
                        responseType: "F", 
                        responseValue: { message: "Failed to update feedback!" } 
                    });
                }

                // Update status if provided and different from RESOLVED
                if (status && status !== 'RESOLVED') {
                    await Model.updateStatus(feedbackId, status);
                }

                // Get updated feedback
                const updatedFeedback = await Model.readById(feedbackId);

                // Send email notification to user
                if (feedback.userEmail) {
                    try {
                        await sendFeedbackReplyEmail(feedback.userEmail, feedback.userName, adminResponseText);
                    } catch (emailError) {
                        logger.error('Error sending feedback reply email: ', emailError);
                    }
                }

                // Send push notification if token exists
                const notificationTitle = 'Feedback Response';
                const notificationBody = adminResponseText.length > 120
                    ? `${adminResponseText.slice(0, 117)}...`
                    : adminResponseText;

                let pushNotification = {
                    traceId,
                    attempted: false,
                    fcmSent: false,
                    dbSaved: false,
                    notificationId: null,
                    dbSaveError: null,
                    message: null,
                    reason: null,
                    tokensFound: 0,
                    tokensTried: 0,
                    tokensSent: 0,
                    fcmError: null,
                    attempts: req.body?.debug ? [] : undefined
                };
                try {
                    const [deviceRows] = await db.query(
                        `SELECT fcm_token
                         FROM user_devices
                         WHERE user_id = ?
                           AND is_active = 1
                           AND (is_deleted = 0 OR is_deleted IS NULL)
                         ORDER BY last_used_at DESC, updated_at DESC`,
                        [toBinaryUUID(feedback.userId)]
                    );

                    const tokens = (deviceRows || []).map(r => r.fcm_token).filter(Boolean);
                    pushNotification.tokensFound = tokens.length;
                    logger.info('adminReplyFeedback device tokens', { traceId, userId: feedback.userId, tokensFound: tokens.length });

                    if (tokens.length === 0) {
                        pushNotification.reason = 'NO_ACTIVE_FCM_TOKEN';
                        logger.info(`User ${feedback.userId} has no active FCM token; skipping FCM send (will still save notification).`);

                        // Still save to DB so user can see it in in-app notifications list
                        try {
                            const n = await Notification.create({
                                userId: feedback.userId,
                                title: notificationTitle,
                                body: notificationBody,
                                type: NotificationType.GENERAL
                            });
                            pushNotification.dbSaved = true;
                            pushNotification.notificationId = n?.insertId || null;
                            pushNotification.message = 'Notification saved to DB (no active device token)';
                        } catch (dbError) {
                            pushNotification.reason = 'NOTIFICATION_DB_SAVE_FAILED';
                            pushNotification.message = dbError?.message || String(dbError);
                            logger.error('Error saving notification to DB (no token): ', dbError);
                        }
                    } else {
                        pushNotification.attempted = true;

                        for (let i = 0; i < tokens.length; i++) {
                            pushNotification.tokensTried++;
                            const tokenPrefix = String(tokens[i]).substring(0, 12);
                            const tokenLength = String(tokens[i]).length;
                            try {
                                const result = await sendPushNotification({
                                    userId: feedback.userId,
                                    title: notificationTitle,
                                    body: notificationBody,
                                    token: tokens[i],
                                    type: NotificationType.GENERAL,
                                    skipDbSave: i > 0,
                                    traceId
                                });

                                if (result?.fcmSent) pushNotification.tokensSent++;
                                if (pushNotification.attempts) {
                                    pushNotification.attempts.push({
                                        tokenPrefix,
                                        tokenLength,
                                        fcmSent: !!result?.fcmSent,
                                        dbSaved: !!result?.dbSaved,
                                        messageId: result?.messageId || null,
                                        fcmError: result?.fcmError || null
                                    });
                                }

                                // Keep first token result as the primary status details
                                if (i === 0) {
                                    pushNotification.fcmSent = !!result?.fcmSent;
                                    pushNotification.dbSaved = !!result?.dbSaved;
                                    pushNotification.notificationId = result?.notificationId || null;
                                    pushNotification.dbSaveError = result?.dbSaveError || null;
                                    pushNotification.message = result?.message || null;
                                    pushNotification.fcmError = result?.fcmError || null;
                                } else if (result?.fcmSent) {
                                    pushNotification.fcmSent = true;
                                }
                            } catch (tokenError) {
                                if (pushNotification.attempts) {
                                    pushNotification.attempts.push({
                                        tokenPrefix,
                                        tokenLength,
                                        fcmSent: false,
                                        dbSaved: false,
                                        messageId: null,
                                        fcmError: {
                                            code: tokenError?.code || null,
                                            message: tokenError?.message || String(tokenError)
                                        }
                                    });
                                }
                                logger.error(
                                    `Error sending push notification (token ${i + 1}/${tokens.length}) for user ${feedback.userId}: `,
                                    tokenError
                                );
                            }
                        }

                        if (!pushNotification.fcmSent && pushNotification.tokensSent === 0) {
                            pushNotification.reason = 'FCM_SEND_FAILED';
                        }

                        // If DB save failed inside sendPushNotification, attempt DB save here (avoid losing in-app notification)
                        if (!pushNotification.dbSaved) {
                            try {
                                const n = await Notification.create({
                                    userId: feedback.userId,
                                    title: notificationTitle,
                                    body: notificationBody,
                                    type: NotificationType.GENERAL
                                });
                                pushNotification.dbSaved = true;
                                pushNotification.notificationId = n?.insertId || pushNotification.notificationId;
                            } catch (dbError) {
                                logger.error('Fallback notification DB save failed: ', dbError);
                            }
                        }
                    }
                } catch (notifyError) {
                    pushNotification.reason = notifyError?.message || 'PUSH_NOTIFICATION_ERROR';
                    logger.error('Error sending push notification: ', notifyError);
                }

                return res.status(200).json({ 
                    responseType: "S", 
                    responseValue: {
                        message: "Feedback reply sent successfully!",
                        pushNotification,
                        feedback: {
                            id: updatedFeedback.id,
                            userId: updatedFeedback.userId,
                            userName: updatedFeedback.userName,
                            userEmail: updatedFeedback.userEmail,
                            type: updatedFeedback.type,
                            message: updatedFeedback.message,
                            adminResponse: updatedFeedback.adminResponse,
                            status: updatedFeedback.status,
                            respondedAt: toISOStringOrNull(updatedFeedback.respondedAt),
                            createdAt: toISOStringOrNull(updatedFeedback.createdAt),
                            updatedAt: toISOStringOrNull(updatedFeedback.updatedAt)
                        }
                    } 
                });
            } catch (error) {
                logger.error('Error replying to feedback: ', error);
                return res.status(500).json({ 
                    responseType: "F", 
                    responseValue: { message: error.toString() } 
                });
            }
        },

        adminDeleteFeedback: async (req, res) => {
            try {
                const traceId = generateUUID();
                const { feedbackId } = req.body;

                if (!feedbackId) {
                    return res.status(400).json({
                        responseType: "F",
                        responseValue: { message: "Feedback ID is required!" }
                    });
                }

                logger.info('adminDeleteFeedback start', { traceId, feedbackId });

                const feedback = await Model.readById(feedbackId);
                if (!feedback) {
                    return res.status(404).json({
                        responseType: "F",
                        responseValue: { message: "Feedback not found!" }
                    });
                }

                const deleted = await Model.delete(feedbackId);
                if (!deleted) {
                    return res.status(500).json({
                        responseType: "F",
                        responseValue: { message: "Failed to delete feedback!" }
                    });
                }

                return res.status(200).json({
                    responseType: "S",
                    responseValue: {
                        message: "Feedback deleted successfully!",
                        traceId,
                        feedbackId
                    }
                });
            } catch (error) {
                logger.error('Error deleting feedback: ', error);
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: error.toString() }
                });
            }
        }
};
