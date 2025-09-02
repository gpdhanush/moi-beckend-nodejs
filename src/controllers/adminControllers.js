const Model = require('../models/adminModels');


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
    // MOI OUT ALL ----
    moiOutAll: async (req, res) => {
        // const userId = req.params.userId;
        try {
            const list = await Model.moiOutAll();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No Data Found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
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
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
