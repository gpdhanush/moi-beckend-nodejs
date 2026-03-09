const SessionModel = require('../models/sessions');
const logger = require('../config/logger');

/**
 * Logs Controller - User Session Logs & Activity Tracking for Admin Panel
 */
exports.logsController = {
    /**
     * Get all user sessions logs (paginated)
     * Query: { limit, offset, userId, status }
     */
    getSessionLogs: async (req, res) => {
        try {
            const { limit = 50, offset = 0, userId = null, status = 'all' } = req.query;
            
            const result = await SessionModel.getAllSessions({
                limit: Math.min(parseInt(limit), 500),
                offset: parseInt(offset),
                userId,
                status
            });
            
            return res.status(200).json({
                responseType: "S",
                count: result.sessions.length,
                total: result.total,
                responseValue: result.sessions
            });
        } catch (error) {
            logger.error('Error fetching session logs:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    }
};
