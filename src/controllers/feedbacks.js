const Model = require('../models/feedbacks');
const User = require('../models/user');
const moment = require('moment');
const { sendPushNotification } = require('./notificationController');
const { NotificationType } = require('../models/notificationModels');


exports.controller = {
    create: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }
            var query = await Model.create(req.body);
            if (query) {
                // Send push notification if user has a device token
                if (user.um_notification_token) {
                    try {
                        await sendPushNotification({
                            userId: req.body.userId,
                            title: 'புதிய கருத்து சமர்ப்பிக்கப்பட்டது',
                            body: 'உங்கள் கருத்து வெற்றிகரமாக சமர்ப்பிக்கப்பட்டது. நாங்கள் விரைவில் மதிப்பாய்வு செய்வோம்.',
                            token: user.um_notification_token,
                            type: NotificationType.GENERAL
                        });
                    } catch (notificationError) {
                        // Log error but don't fail the request since feedback was saved successfully
                        console.error('Error sending push notification for feedback:', notificationError);
                    }
                }
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் தரவு வெற்றிகரமாக சேமிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "தரவு சேமிப்பு தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    list: async (req, res) => {
        try {
            const feedbacks = await Model.readAll();
            if (!feedbacks || feedbacks.length === 0) {
                return res.status(200).json({ responseType: "S", count: 0, responseValue: [] });
            }
            
            const formattedFeedbacks = feedbacks.map(feedback => {
                const createdAt = moment(feedback.created_time).utc().toISOString();
                // Use updated_time as repliedAt if reply exists, otherwise null
                const repliedAt = feedback.reply ? moment(feedback.updated_time).utc().toISOString() : null;
                
                return {
                    id: feedback.id,
                    userId: feedback.user_id,
                    feedbacks: feedback.feedbacks || '',
                    reply: feedback.reply || '',
                    createdAt: createdAt,
                    repliedAt: repliedAt,
                    active: feedback.active,
                };
            });
            
            return res.status(200).json({ responseType: "S", count: formattedFeedbacks.length, responseValue: formattedFeedbacks });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
