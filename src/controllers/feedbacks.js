const Model = require('../models/feedbacks');
const User = require('../models/user');
const moment = require('moment');


exports.controller = {
    create: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "The specified user does not exist!" } });
            }
            var query = await Model.create(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "Your data has been successfully stored." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "Data saving failed. Please try again later." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    list: async (req, res) => {
        try {
            const feedbacks = await Model.readAll();
            if (!feedbacks || feedbacks.length === 0) {
                return res.status(200).json([]);
            }
            
            const formattedFeedbacks = feedbacks.map(feedback => {
                const createdAt = moment(feedback.created_time).utc().toISOString();
                // Use updated_time as repliedAt if reply exists, otherwise null
                const repliedAt = feedback.reply ? moment(feedback.updated_time).utc().toISOString() : null;
                
                return {
                    feedbacks: feedback.feedbacks || '',
                    reply: feedback.reply || null,
                    createdAt: createdAt,
                    repliedAt: repliedAt
                };
            });
            
            return res.status(200).json({ responseType: "S", count: formattedFeedbacks.length, responseValue: formattedFeedbacks });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
