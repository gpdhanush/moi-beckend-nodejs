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
}
