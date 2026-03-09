const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const UserOTP = {
    /**
     * Create a new OTP record
     * @param {string} userId - User ID (UUID string)
     * @param {string} code - 6-digit OTP code
     * @param {string} type - OTP type: 'LOGIN', 'RESET', 'VERIFY', 'RESTORE', 'FORGOT'
     * @param {Date} expiresAt - Expiration datetime
     * @returns {Promise<Object>} Created OTP record
     */
    async create(userId, code, type, expiresAt) {
        const binaryUserId = toBinaryUUID(userId);
        const [result] = await db.query(
            `INSERT INTO user_otps (user_id, code, type, expires_at, is_used, created_at)
             VALUES (?, ?, ?, ?, 0, NOW())`,
            [binaryUserId, code, type, expiresAt]
        );

        return {
            id: result.insertId,
            user_id: userId,
            code,
            type,
            expires_at: expiresAt,
            is_used: false,
            created_at: new Date()
        };
    },

    /**
     * Find OTP by ID
     * @param {number} id - OTP record ID
     * @returns {Promise<Object|null>} OTP record or null
     */
    async findById(id) {
        const [rows] = await db.query(
            `SELECT id, user_id, code, type, expires_at, is_used, created_at
             FROM user_otps WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            id: row.id,
            user_id: fromBinaryUUID(row.user_id),
            code: row.code,
            type: row.type,
            expires_at: row.expires_at,
            is_used: Boolean(row.is_used),
            created_at: row.created_at
        };
    },

    /**
     * Find active OTP for user by type
     * @param {string} userId - User ID (UUID string)
     * @param {string} type - OTP type
     * @returns {Promise<Object|null>} Active OTP record or null
     */
    async findActiveByUserAndType(userId, type) {
        const binaryUserId = toBinaryUUID(userId);
        const [rows] = await db.query(
            `SELECT id, user_id, code, type, expires_at, is_used, created_at
             FROM user_otps
             WHERE user_id = ? AND type = ? AND is_used = 0 AND expires_at > NOW()
             ORDER BY created_at DESC LIMIT 1`,
            [binaryUserId, type]
        );

        if (rows.length === 0) return null;

        const row = rows[0];
        return {
            id: row.id,
            user_id: fromBinaryUUID(row.user_id),
            code: row.code,
            type: row.type,
            expires_at: row.expires_at,
            is_used: Boolean(row.is_used),
            created_at: row.created_at
        };
    },

    /**
     * Verify OTP code
     * @param {string} userId - User ID (UUID string)
     * @param {string} code - OTP code to verify
     * @param {string} type - OTP type
     * @returns {Promise<boolean>} True if OTP is valid and marked as used
     */
    async verify(userId, code, type) {
        const binaryUserId = toBinaryUUID(userId);
        const [result] = await db.query(
            `UPDATE user_otps
             SET is_used = 1
             WHERE user_id = ? AND code = ? AND type = ? AND is_used = 0 AND expires_at > NOW()`,
            [binaryUserId, code, type]
        );

        return result.affectedRows > 0;
    },

    /**
     * Mark OTP as used
     * @param {number} id - OTP record ID
     * @returns {Promise<boolean>} True if updated successfully
     */
    async markAsUsed(id) {
        const [result] = await db.query(
            `UPDATE user_otps SET is_used = 1 WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Get all OTPs with pagination and filtering
     * @param {Object} options - Query options
     * @param {number} options.page - Page number (1-based)
     * @param {number} options.limit - Records per page
     * @param {string} options.status - Filter by status: 'active', 'used', 'expired', 'all'
     * @param {string} options.type - Filter by type
     * @param {string} options.userId - Filter by user ID
     * @returns {Promise<Object>} Paginated results
     */
    async getAll(options = {}) {
        const { page = 1, limit = 20, status = 'all', type, userId } = options;
        const offset = (page - 1) * limit;

        let whereConditions = [];
        let params = [];

        if (status !== 'all') {
            if (status === 'active') {
                whereConditions.push('is_used = 0 AND expires_at > NOW()');
            } else if (status === 'used') {
                whereConditions.push('is_used = 1');
            } else if (status === 'expired') {
                whereConditions.push('is_used = 0 AND expires_at <= NOW()');
            }
        }

        if (type) {
            whereConditions.push('type = ?');
            params.push(type);
        }

        if (userId) {
            whereConditions.push('user_id = ?');
            params.push(toBinaryUUID(userId));
        }

        const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

        // Get total count
        const [countResult] = await db.query(
            `SELECT COUNT(*) as total FROM user_otps ${whereClause}`,
            params
        );
        const total = countResult[0].total;

        // Get records
        const [rows] = await db.query(
            `SELECT id, user_id, code, type, expires_at, is_used, created_at
             FROM user_otps ${whereClause}
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [...params, limit, offset]
        );

        const records = rows.map(row => ({
            id: row.id,
            user_id: fromBinaryUUID(row.user_id),
            code: row.code,
            type: row.type,
            expires_at: row.expires_at,
            is_used: Boolean(row.is_used),
            created_at: row.created_at
        }));

        return {
            records,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        };
    },

    /**
     * Delete OTP by ID
     * @param {number} id - OTP record ID
     * @returns {Promise<boolean>} True if deleted successfully
     */
    async delete(id) {
        const [result] = await db.query(
            `DELETE FROM user_otps WHERE id = ?`,
            [id]
        );
        return result.affectedRows > 0;
    },

    /**
     * Clean up expired OTPs
     * @returns {Promise<number>} Number of deleted records
     */
    async cleanupExpired() {
        const [result] = await db.query(
            `DELETE FROM user_otps WHERE is_used = 0 AND expires_at <= NOW()`
        );
        return result.affectedRows;
    },

    /**
     * Get OTP statistics
     * @returns {Promise<Object>} Statistics object
     */
    async getStats() {
        const [rows] = await db.query(`
            SELECT
                COUNT(*) as total,
                SUM(CASE WHEN is_used = 0 AND expires_at > NOW() THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN is_used = 1 THEN 1 ELSE 0 END) as used,
                SUM(CASE WHEN is_used = 0 AND expires_at <= NOW() THEN 1 ELSE 0 END) as expired
            FROM user_otps
        `);

        return rows[0];
    }
};

module.exports = UserOTP;