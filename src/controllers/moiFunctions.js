const Model = require('../models/moiFunctions');
const User = require('../models/user');
const moment = require('moment');


exports.controller = {
    list: async (req, res) => {
        const { userId } = req.body;
        try {
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }

            const result = await Model.readAll(userId);
            if (result.length === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } });
            }

            const changeKeyNames = (arr) => {
                return arr.map(({ f_id: id, f_um_id: userId, function_name:functionName, function_date: functionDate, 
                    first_name: firstName, second_name: secondName, place: place, native_place: nativePlace, 
                    invitation_photo: invitationUrl
                    }) => ({
                        id, userId, functionName, functionDate, firstName, secondName, place, nativePlace, invitationUrl
                    }))
                    .map(event => {
                        return {    
                            ...event,
                            functionDate: moment(event.functionDate).local().format('DD-MMM-YYYY')
                        };
                    });
            };
            const transformKeys = changeKeyNames(result);

            return res.status(200).json({ responseType: "S", count: transformKeys.length, responseValue: transformKeys });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    create: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }
            var query = await Model.create(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் தரவு வெற்றிகரமாக சேமிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "தரவு சேமிப்பு தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    update: async (req, res) => {
        try {
            const user = await User.findById(req.body.userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" } });
            }
            const moidata = await Model.readById(req.body.id);
            if (!moidata) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "குறிப்பிடப்பட்ட பதிவுகள் இல்லை!" } });
            }

            var query = await Model.update(req.body);
            if (query) {
                return res.status(200).json({ responseType: "S", responseValue: { message: "உங்கள் தரவு வெற்றிகரமாக புதுப்பிக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "தரவு புதுப்பித்தல் தோல்வியடைந்தது. தயவுசெய்து பின்னர் மீண்டும் முயற்சிக்கவும்." } });
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
                return res.status(200).json({ responseType: "S", responseValue: { message: "பொருள் வெற்றிகரமாக நீக்கப்பட்டது." } });
            } else {
                return res.status(404).json({ responseType: "F", responseValue: { message: "இந்த பதிவுகளை நீக்க முடியவில்லை!" } });
            }
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
