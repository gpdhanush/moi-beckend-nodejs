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
    },

    /**
     * Get specific user's session history
     * Params: userId
     */
    getUserSessionLogs: async (req, res) => {
        try {
            const { userId } = req.params;
            
            if (!userId) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "User ID is required!" }
                });
            }
            
            const sessions = await SessionModel.getUserSessions(userId);
            
            return res.status(200).json({
                responseType: "S",
                count: sessions.length,
                responseValue: sessions
            });
        } catch (error) {
            logger.error('Error fetching user session logs:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all currently active user sessions
     */
    getActiveSessions: async (req, res) => {
        try {
            const result = await SessionModel.getAllSessions({
                limit: 1000,
                offset: 0,
                status: 'active'
            });
            
            return res.status(200).json({
                responseType: "S",
                count: result.sessions.length,
                total: result.total,
                responseValue: result.sessions
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
     * Get comprehensive session statistics summary
     */
    getSessionStats: async (req, res) => {
        try {
            const stats = await SessionModel.getSessionStatistics();
            
            return res.status(200).json({
                responseType: "S",
                responseValue: {
                    summary: {
                        totalSessions: stats.totalSessions,
                        activeSessions: stats.activeSessions,
                        inactiveSessions: stats.inactiveSessions,
                        uniqueUsers: stats.uniqueUsers,
                        avgSessionDurationMinutes: stats.avgSessionDurationMinutes
                    },
                    timestamp: new Date(),
                    message: `${stats.activeSessions} active sessions, ${stats.totalSessions} total sessions across ${stats.uniqueUsers} users`
                }
            });
        } catch (error) {
            logger.error('Error fetching session statistics:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    }
};
