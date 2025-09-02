const Model = require('../models/defaults');


exports.controller = {
    paymentLists: async (req, res) => {
        try {
            const result = await Model.readAllPayment();
            if (result.length === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No records available.' } });
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
            const result = await Model.totalAmount(req.body.userId);
            if (result.length === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No records available.' } });
            }
            const change = (arr) => { return arr.map(({ moi_out_total: moiOutTotal, moi_total: moiTotal }) => ({ moiOutTotal, moiTotal })); };
            const transform = change(result);
            return res.status(200).json({ responseType: "S", responseValue: transform });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
