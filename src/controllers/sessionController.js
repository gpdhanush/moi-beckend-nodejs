const SessionModel = require('../models/sessions');
const User = require('../models/user');
const tokenService = require('../middlewares/tokenService');
const logger = require('../config/logger');

exports.sessionController = {
    /**
     * Get all sessions for the current user
     * Body: { userId }
     */
    getUserSessions: async (req, res) => {
        try {
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பயனர் ID தேவை!" }
                });
            }
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" }
                });
            }
            
            const sessions = await SessionModel.getUserSessions(userId);
            
            return res.status(200).json({
                responseType: "S",
                count: sessions.length,
                responseValue: sessions
            });
        } catch (error) {
            logger.error('Error fetching user sessions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get active sessions for the current user
     * Body: { userId }
     */
    getActiveSessions: async (req, res) => {
        try {
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பயனர் ID தேவை!" }
                });
            }
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" }
                });
            }
            
            const sessions = await SessionModel.getActiveSessions(userId);
            
            return res.status(200).json({
                responseType: "S",
                count: sessions.length,
                responseValue: sessions
            });
        } catch (error) {
            logger.error('Error fetching active sessions:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Logout - End the current session and invalidate token
     * Body: { userId }
     */
    logout: async (req, res) => {
        try {
            const { userId } = req.body;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "பயனர் ID தேவை!" }
                });
            }
            
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: "குறிப்பிடப்பட்ட பயனர் இல்லை!" }
                });
            }
            
            // End session in database
            const success = await SessionModel.endSession(userId);
            
            // Remove token from in-memory storage (invalidate immediately)
            try {
                tokenService.removeToken(userId);
                logger.info(`Token invalidated for user ${userId}`);
            } catch (tokenErr) {
                logger.warn('Error invalidating token during logout:', tokenErr);
            }
            
            if (success) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "வெற்றிகரமாக வெளியேறினீர்." }
                });
            } else {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "செயல்பாடு முடிந்தது." }
                });
            }
        } catch (error) {
            logger.error('Error logging out:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    }
};
