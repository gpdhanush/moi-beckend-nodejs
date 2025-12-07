const Model = require('../models/moiDefaultFunctions');
const User = require('../models/user');

exports.controller = {
    list: async (req, res) => {
        const { userId } = req.body;
        try {
            const user = userId ? await User.findById(userId) : null;
            
            const functions = await Model.readAll(userId || null);

            if (functions.length === 0) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'விழா வகைகள் எதுவும் கிடைக்கவில்லை.' } 
                });
            }

            const transformed = functions.map(f => ({
                id: f.mdf_id,
                name: f.mdf_name,
                userId: f.mdf_um_id
            }));

            return res.status(200).json({ 
                responseType: "S", 
                count: transformed.length,
                responseValue: transformed 
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    },

    getById: async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const func = await Model.readById(id);
            
            if (!func) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'குறிப்பிடப்பட்ட விழா வகை இல்லை!' } 
                });
            }

            return res.status(200).json({ 
                responseType: "S", 
                responseValue: {
                    id: func.mdf_id,
                    name: func.mdf_name,
                    userId: func.mdf_um_id
                }
            });
        } catch (error) {
            return res.status(500).json({ 
                responseType: "F", 
                responseValue: { message: error.toString() } 
            });
        }
    }
}
