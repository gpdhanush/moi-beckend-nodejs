const Model = require('../models/transactionFunctions');
const DefaultModel = require('../models/moiDefaultFunctions');
const User = require('../models/user');
const logger = require('../config/logger');

exports.controller = {
    /**
     * Create transaction function
     * Body: { userId, functionName, functionDate?, location?, notes?, imageUrl? }
     */
    create: async (req, res) => {
        try {
            const { userId, functionName, functionDate, location, notes, imageUrl } = req.body;

            if (!userId || !functionName) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "தேவையான தரவுகள் வழங்கப்படவில்லை." }
                });
            }

            // Verify user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" }
                });
            }

            const payload = {
                userId,
                functionName,
                functionDate: functionDate || null,
                location: location || null,
                notes: notes || null,
                imageUrl: imageUrl || null
            };

            const result = await Model.create(payload);

            return res.status(201).json({
                responseType: "S",
                responseValue: {
                    message: "நிகழ்வு வெற்றிகரமாக உருவாக்கப்பட்டது.",
                    functionId: result.insertId
                }
            });
        } catch (error) {
            logger.error('Error creating transaction function:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all transaction functions
     * Body: { userId, startDate?, endDate?, limit, offset }
     */
    list: async (req, res) => {
        try {
            const { userId, startDate, endDate, limit = 100, offset = 0 } = req.body;

            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பயனர் ID தேவை!" }
                });
            }

            // Verify user exists
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" }
                });
            }

            const filters = {
                startDate: startDate || null,
                endDate: endDate || null,
                limit: Math.min(parseInt(limit), 500),
                offset: parseInt(offset)
            };

            const functions = await Model.readAll(userId, filters);
            if (functions.length == 0) {
                return res.status(404).json({ 
                    responseType: "F", 
                    responseValue: { message: 'விவரங்கள் எதுவும் கிடைக்கவில்லை.' } 
                });
            }
            return res.status(200).json({
                responseType: "S",
                count: functions.length,
                responseValue: functions
            });
        } catch (error) {
            logger.error('Error fetching transaction functions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Load id/name lists for use in dropdowns: transaction functions + default functions
     * Body: { userId }
     */
    dropdown: async (req, res) => {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ responseType: "F", responseValue: { message: "userId required" } });
            }
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: "User not found" } });
            }

            const txFuncs = await Model.readAll(userId, { limit: 500, offset: 0 });
            const defaultFuncs = await DefaultModel.readAll();

            const txList = txFuncs.map(f => ({ id: f.id, name: f.functionName }));
            const defList = defaultFuncs.map(f => ({ id: f.id, name: f.name }));

            // always include an "Others" option for the frontend to show a free‑text box
            defList.push({ id: 'others', name: 'Others' });

            return res.status(200).json({
                responseType: "S",
                responseValue: { transactionFunctions: txList, defaultFunctions: defList }
            });
        } catch (error) {
            logger.error('Error loading dropdown lists:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Get function details with stats
     * Body: { functionId }
     */
    detail: async (req, res) => {
        try {
            const { functionId } = req.body;

            if (!functionId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு ID தேவை!" }
                });
            }

            const func = await Model.getFunctionWithStats(functionId);

            if (!func) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு கிடைக்கவில்லை!" }
                });
            }

            return res.status(200).json({
                responseType: "S",
                responseValue: func
            });
        } catch (error) {
            logger.error('Error fetching function detail:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update transaction function
     * Body: { functionId, functionName, functionDate?, location?, notes?, imageUrl? }
     */
    update: async (req, res) => {
        try {
            const { functionId, functionName, functionDate, location, notes, imageUrl } = req.body;

            if (!functionId || !functionName) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "தேவையான தரவுகள் வழங்கப்படவில்லை." }
                });
            }

            // Verify function exists
            const func = await Model.readById(functionId);
            if (!func) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு கிடைக்கவில்லை!" }
                });
            }

            const payload = {
                functionName,
                functionDate: functionDate || null,
                location: location || null,
                notes: notes || null,
                imageUrl: imageUrl || null
            };

            const success = await Model.update(functionId, payload);

            if (success) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "நிகழ்வு வெற்றிகரமாக புதுப்பிக்கப்பட்டது." }
                });
            } else {
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு புதுப்பித்தல் தோல்வியடைந்தது!" }
                });
            }
        } catch (error) {
            logger.error('Error updating transaction function:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Delete transaction function (soft delete)
     * Body: { functionId }
     */
    delete: async (req, res) => {
        try {
            const { functionId } = req.body;

            if (!functionId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு ID தேவை!" }
                });
            }

            // Verify function exists
            const func = await Model.readById(functionId);
            if (!func) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு கிடைக்கவில்லை!" }
                });
            }

            const success = await Model.delete(functionId);

            if (success) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "நிகழ்வு வெற்றிகரமாக நீக்கப்பட்டது." }
                });
            } else {
                return res.status(500).json({
                    responseType: "F",
                    responseValue: { message: "நிகழ்வு நீக்குதல் தோல்வியடைந்தது!" }
                });
            }
        } catch (error) {
            logger.error('Error deleting transaction function:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Admin: get all transaction functions across users
     * Body: { search?, userId? }
     */
    adminList: async (req, res) => {
        try {
            const search = req.body.search ? String(req.body.search).trim() : null;
            const userId = req.body.userId ? String(req.body.userId).trim() : null;

            const functions = await Model.readAllForAdmin({
                search: search || null,
                userId: userId || null
            });

            return res.status(200).json({
                responseType: "S",
                count: functions.length,
                responseValue: functions
            });
        } catch (error) {
            logger.error('Error fetching admin transaction function list:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    }
};
