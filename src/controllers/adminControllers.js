const Model = require('../models/adminModels');
const User = require('../models/user');
const { sendPushNotification } = require('./notificationController');
const { NotificationType } = require('../models/notificationModels');


exports.controller = {
    login: async (req, res) => {
        const { userName, passWord } = req.body;
        try {
            const user = await Model.login(userName, passWord);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Invalid Username or Password.' } });
            }
            const response = {
                id: user.id,
                username: user.username,
                mobile: user.mobile,
                email: user.email
            };
            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    // MOI USERS
    moiUsers: async (req, res) => {
        try {
            const moiUsers = await Model.moiUsers();
            if (!moiUsers) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: moiUsers });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiUserList: async (req, res) => {
        try {
            const list = await Model.moiUserList();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiUserListId: async (req, res) => {
        const userId = req.params.id;
        try {
            const list = await Model.moiUserListId(userId);
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    // FUNCTIONS
    moiUserFunction: async (req, res) => {
        try {
            const list = await Model.moiUserFunction();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiFunctionsUserId: async (req, res) => {
        const userId = req.params.userId;
        try {
            const list = await Model.moiFunctionsUserId(userId);
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    // FEEDBACKS
    feedbacks: async (req, res) => {
        // const userId = req.params.userId;
        try {
            const list = await Model.feedbacks();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    replyToFeedback: async (req, res) => {
        try {
            const { feedbackId, reply } = req.body;
            
            if (!feedbackId) {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'Feedback ID is required.' } });
            }
            
            if (!reply || reply.trim() === '') {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'Reply text is required.' } });
            }
            
            // Get feedback to retrieve user_id before updating
            const feedback = await Model.getFeedbackById(feedbackId);
            if (!feedback) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Feedback not found.' } });
            }
            
            const result = await Model.updateFeedbackReply(feedbackId, reply);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Feedback not found.' } });
            }
            
            // Send push notification to the user if they have a device token
            if (feedback.user_id) {
                try {
                    const user = await User.findById(feedback.user_id);
                    if (user && user.um_notification_token) {
                        await sendPushNotification({
                            userId: feedback.user_id,
                            title: 'உங்கள் கருத்துக்கு பதில்',
                            body: 'உங்கள் கருத்துக்கு பதில் வழங்கப்பட்டது. தயவுசெய்து பார்க்கவும்.',
                            token: user.um_notification_token,
                            type: NotificationType.GENERAL
                        });
                    }
                } catch (notificationError) {
                    // Log error but don't fail the request since reply was saved successfully
                    console.error('Error sending push notification for feedback reply:', notificationError);
                }
            }
            
            return res.status(200).json({ responseType: "S", responseValue: { message: 'Reply has been successfully added.' } });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    // MOI OUT ALL ----
    moiOutAll: async (req, res) => {
        try {
            const list = await Model.moiOutAll();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", count: list.length, responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiOutAllUser: async (req, res) => {
        const userId = req.params.userId;
        try {
            const list = await Model.moiOutAllUser(userId);
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", count: list.length, responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
