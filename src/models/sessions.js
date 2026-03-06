const db = require('../config/database');
const { toBinaryUUID, fromBinaryUUID, generateUUID } = require('../helpers/uuid');

/**
 * User Sessions Model
 * Tracks user login and logout events
 */
const Model = {
    /**
     * Create a new session when user logs in
     * @param {string} userId - UUID of the user
     * @returns {Promise<{sessionId: string, loginAt: Date}>}
     */
    async createSession(userId) {
        try {
            const [result] = await db.query(
                `INSERT INTO user_sessions (user_id, login_at)
                 VALUES (?, CURRENT_TIMESTAMP)`,
                [toBinaryUUID(userId)]
            );
            return {
                sessionId: result.insertId,
                loginAt: new Date(),
                userId
            };
        } catch (error) {
            throw new Error(`Failed to create session: ${error.message}`);
        }
    },

    /**
     * End a session when user logs out
     * @param {string} userId - UUID of the user
     * @returns {Promise<boolean>} - true if session was updated
     */
    async endSession(userId) {
        try {
            const [result] = await db.query(
                `UPDATE user_sessions 
                 SET logout_at = CURRENT_TIMESTAMP 
                 WHERE user_id = ? AND logout_at IS NULL
                 ORDER BY login_at DESC 
                 LIMIT 1`,
                [toBinaryUUID(userId)]
            );
            return result.changedRows > 0;
        } catch (error) {
            throw new Error(`Failed to end session: ${error.message}`);
        }
    },

    /**
     * Get all sessions for a user
     * @param {string} userId - UUID of the user
     * @returns {Promise<Array>} - List of sessions
     */
    async getUserSessions(userId) {
        try {
            const [rows] = await db.query(
                `SELECT id, user_id, login_at, logout_at,
                        TIMESTAMPDIFF(MINUTE, login_at, IFNULL(logout_at, CURRENT_TIMESTAMP)) as duration_minutes
                 FROM user_sessions
                 WHERE user_id = ?
                 ORDER BY login_at DESC 
                 LIMIT 50`,
                [toBinaryUUID(userId)]
            );
            return rows.map(r => ({
                id: r.id,
                userId: fromBinaryUUID(r.user_id),
                loginAt: r.login_at,
                logoutAt: r.logout_at,
                durationMinutes: r.duration_minutes,
                isActive: !r.logout_at
            }));
        } catch (error) {
            throw new Error(`Failed to fetch user sessions: ${error.message}`);
        }
    },

    /**
     * Get active sessions for a user
     * @param {string} userId - UUID of the user
     * @returns {Promise<Array>} - List of active sessions
     */
    async getActiveSessions(userId) {
        try {
            const [rows] = await db.query(
                `SELECT id, user_id, login_at
                 FROM user_sessions
                 WHERE user_id = ? AND logout_at IS NULL`,
                [toBinaryUUID(userId)]
            );
            return rows.map(r => ({
                id: r.id,
                userId: fromBinaryUUID(r.user_id),
                loginAt: r.login_at
            }));
        } catch (error) {
            throw new Error(`Failed to fetch active sessions: ${error.message}`);
        }
    },

    /**
     * Get all sessions across all users (for admin)
     * @param {Object} options - Filter options {limit, offset, userId, status}
     * @returns {Promise<{total: number, sessions: Array}>}
     */
    async getAllSessions(options = {}) {
        try {
            const { limit = 100, offset = 0, userId = null, status = 'all' } = options;
            
            let whereClause = '';
            const params = [];
            
            if (userId) {
                whereClause = 'WHERE user_id = ?';
                params.push(toBinaryUUID(userId));
            } else if (status === 'active') {
                whereClause = 'WHERE logout_at IS NULL';
            } else if (status === 'inactive') {
                whereClause = 'WHERE logout_at IS NOT NULL';
            }
            
            // Get total count
            const [countRows] = await db.query(
                `SELECT COUNT(*) as total FROM user_sessions ${whereClause}`,
                params
            );
            const total = countRows[0].total;
            
            // Get paginated results with user info
            const [rows] = await db.query(
                `SELECT s.id, s.user_id, s.login_at, s.logout_at, u.full_name, u.email,
                        TIMESTAMPDIFF(MINUTE, s.login_at, IFNULL(s.logout_at, CURRENT_TIMESTAMP)) as duration_minutes
                 FROM user_sessions s
                 LEFT JOIN users u ON s.user_id = u.id
                 ${whereClause}
                 ORDER BY s.login_at DESC 
                 LIMIT ? OFFSET ?`,
                [...params, limit, offset]
            );
            
            const sessions = rows.map(r => ({
                id: r.id,
                userId: fromBinaryUUID(r.user_id),
                userName: r.full_name,
                userEmail: r.email,
                loginAt: r.login_at,
                logoutAt: r.logout_at,
                durationMinutes: r.duration_minutes,
                isActive: !r.logout_at
            }));
            
            return { total, sessions };
        } catch (error) {
            throw new Error(`Failed to fetch all sessions: ${error.message}`);
        }
    },

    /**
     * Get session statistics
     * @returns {Promise<Object>} - Statistics object
     */
    async getSessionStatistics() {
        try {
            const [stats] = await db.query(
                `SELECT 
                    COUNT(*) as total_sessions,
                    SUM(CASE WHEN logout_at IS NULL THEN 1 ELSE 0 END) as active_sessions,
                    SUM(CASE WHEN logout_at IS NOT NULL THEN 1 ELSE 0 END) as inactive_sessions,
                    COUNT(DISTINCT user_id) as unique_users,
                    ROUND(AVG(TIMESTAMPDIFF(MINUTE, login_at, IFNULL(logout_at, CURRENT_TIMESTAMP)))) as avg_session_duration_minutes
                 FROM user_sessions`
            );
            
            return {
                totalSessions: stats[0].total_sessions,
                activeSessions: stats[0].active_sessions || 0,
                inactiveSessions: stats[0].inactive_sessions || 0,
                uniqueUsers: stats[0].unique_users || 0,
                avgSessionDurationMinutes: stats[0].avg_session_duration_minutes || 0
            };
        } catch (error) {
            throw new Error(`Failed to fetch session statistics: ${error.message}`);
        }
    }
};

module.exports = Model;
