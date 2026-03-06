const Model = require('../models/defaults');


exports.controller = {
    paymentLists: async (req, res) => {
        try {
            const result = await Model.readAllPayment();
            if (result.length === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } });
            }
            const change = (arr) => { return arr.map(({ dp_id: id, dp_mode: mode }) => ({ id, mode })); };
            const transform = change(result);
            return res.status(200).json({ responseType: "S", responseValue: transform });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    totalAmount: async (req, res) => {
        try {
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'பயனர் ID தேவை!' } 
                });
            }
            
            const result = await Model.totalAmount(userId);
            if (!result || result.length === 0) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } 
                });
            }
            
            const data = result[0];
            const response = {
                amounts: {
                    invest: parseFloat(data.invest_amount || 0),
                    return: parseFloat(data.return_amount || 0),
                    net: parseFloat((data.invest_amount || 0) - (data.return_amount || 0))
                },
                things: {
                    invest: parseInt(data.invest_things || 0),
                    return: parseInt(data.return_things || 0)
                },
                members: {
                    total: parseInt(data.total_members || 0),
                    invest: parseInt(data.invest_members || 0),
                    return: parseInt(data.return_members || 0)
                }
            };
            
            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
