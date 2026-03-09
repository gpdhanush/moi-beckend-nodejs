const Model = require('../models/feedbacks');
const User = require('../models/user');
const db = require('../config/database');
const { sendPushNotification } = require('./notificationController');
const { NotificationType } = require('../models/notificationModels');
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
    }
}
