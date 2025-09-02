const Model = require('../models/upcomingFunction');
const User = require('../models/user');
const moment = require('moment');


exports.controller = {
    list: async (req, res) => {
        const { userId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "The specified user does not exist!" } });
            }

            const result = await Model.readAll(userId);
            if (result.length === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No records available.' } });
            }

            const changeKeyNames = (arr) => {
                return arr.map(({ uf_id: id, uf_user_id: userId, uf_date: functionDate, uf_name: functionName,
                    uf_place: place, uf_invitation_url: invitationUrl
                }) => ({ id, userId, functionName, functionDate, place, invitationUrl }))
                    .map(event => {
                        return {
                            ...event,
                            functionDate: moment(event.functionDate).local().format('DD-MMM-YYYY')
                        };
                    });
            };
            const transformKeys = changeKeyNames(result);

            return res.status(200).json({ responseType: "S", responseValue: transformKeys });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
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
    update: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "The specified user does not exist!" } });
            }
            const moidata = await Model.readById(req.body.id);
            if (!moidata) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "The specified records does not exist!" } });
            }

            var query = await Model.update(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "Your data has been successfully updated." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "Data updated failed. Please try again later." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    delete: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            var already = await Model.readById(id);
            if (!already) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'The specified records does not exist!' } });
            }

            var del = await Model.delete(id);
            if (del) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "The item has been successfully removed." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "Unable to delete this records!" } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
