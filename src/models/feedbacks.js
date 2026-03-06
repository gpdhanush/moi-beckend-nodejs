const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const Model = {
    async create(payload) {
        const id = generateUUID();
        const { userId, type, message } = payload;
        const feedbackType = ['GENERAL', 'BUG', 'FEATURE', 'COMPLAINT'].includes(type) ? type : 'GENERAL';
        await db.query(
            `INSERT INTO feedbacks (id, user_id, type, message, status)
             VALUES (?, ?, ?, ?, 'OPEN')`,
            [toBinaryUUID(id), toBinaryUUID(userId), feedbackType, message]
        );
        return { insertId: id };
    },

    async readAll(userId, options = {}) {
        const { status = null, type = null } = options;
        let query = `SELECT f.id, f.user_id, f.type, f.message, 
                           f.admin_response, f.responded_at, f.status, 
                           f.created_at, f.updated_at, u.full_name, u.email, u.mobile
                    FROM feedbacks f
                    LEFT JOIN users u ON f.user_id = u.id
                    WHERE f.user_id = ? AND (f.is_deleted = 0 OR f.is_deleted IS NULL)`;
        const params = [toBinaryUUID(userId)];

        if (status) {
            query += ` AND f.status = ?`;
            params.push(status);
        }

        if (type) {
            query += ` AND f.type = ?`;
            params.push(type);
        }

        query += ` ORDER BY f.created_at DESC`;

        const [rows] = await db.query(query, params);
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            userName: r.full_name,
            userEmail: r.email,
            userMobile: r.mobile,
            type: r.type,
            message: r.message,
            adminResponse: r.admin_response,
            respondedAt: r.responded_at,
            status: r.status,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    /**
     * Admin: Get all feedbacks with pagination
     */
    async getAllFeedbacks(options = {}) {
        const { limit = 50, offset = 0, status = null, type = null } = options;
        let query = `SELECT f.id, f.user_id, f.type, f.message, 
                           f.admin_response, f.responded_at, f.status, 
                           f.created_at, f.updated_at, u.full_name, u.email
                    FROM feedbacks f
                    LEFT JOIN users u ON f.user_id = u.id
                    WHERE (f.is_deleted = 0 OR f.is_deleted IS NULL)`;
        const params = [];

        if (status) {
            query += ` AND f.status = ?`;
            params.push(status);
        }

        if (type) {
            query += ` AND f.type = ?`;
            params.push(type);
        }

        query += ` ORDER BY f.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await db.query(query, params);
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            userName: r.full_name,
            userEmail: r.email,
            type: r.type,
            message: r.message,
            adminResponse: r.admin_response,
            respondedAt: r.responded_at,
            status: r.status,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    /**
     * Admin: Get feedback count by status
     */
    async getFeedbackStats() {
        const [rows] = await db.query(
            `SELECT status, COUNT(*) as count FROM feedbacks 
             WHERE (is_deleted = 0 OR is_deleted IS NULL)
             GROUP BY status`
        );
        const stats = {
            total: 0,
            open: 0,
            inProgress: 0,
            resolved: 0,
            rejected: 0
        };
        rows.forEach(row => {
            stats.total += row.count;
            if (row.status === 'OPEN') stats.open = row.count;
            else if (row.status === 'IN_PROGRESS') stats.inProgress = row.count;
            else if (row.status === 'RESOLVED') stats.resolved = row.count;
            else if (row.status === 'REJECTED') stats.rejected = row.count;
        });
        return stats;
    },

    /**
     * Admin: Get a specific feedback
     */
    async readById(id) {
        const [rows] = await db.query(
            `SELECT f.id, f.user_id, f.type, f.message, 
                    f.admin_response, f.responded_at, f.status, 
                    f.created_at, f.updated_at, u.full_name, u.email, u.mobile
             FROM feedbacks f
             LEFT JOIN users u ON f.user_id = u.id
             WHERE f.id = ? AND (f.is_deleted = 0 OR f.is_deleted IS NULL)`,
            [toBinaryUUID(id)]
        );
        if (rows.length === 0) return null;
        
        const r = rows[0];
        return {
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            userName: r.full_name,
            userEmail: r.email,
            userMobile: r.mobile,
            type: r.type,
            message: r.message,
            adminResponse: r.admin_response,
            respondedAt: r.responded_at,
            status: r.status,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        };
    },

    /**
     * Admin: Update feedback status
     */
    async updateStatus(id, status) {
        const validStatuses = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
        if (!validStatuses.includes(status)) {
            throw new Error('Invalid status');
        }
        
        const [result] = await db.query(
            `UPDATE feedbacks 
             SET status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [status, toBinaryUUID(id)]
        );
        return result.changedRows > 0;
    },

    /**
     * Admin: Add response to feedback
     */
    async addResponse(id, adminResponse) {
        const [result] = await db.query(
            `UPDATE feedbacks 
             SET admin_response = ?, responded_at = CURRENT_TIMESTAMP, status = 'RESOLVED', updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [adminResponse, toBinaryUUID(id)]
        );
        return result.changedRows > 0;
    },

    /**
     * Admin: Delete feedback (soft delete)
     */
    async delete(id) {
        const [result] = await db.query(
            `UPDATE feedbacks 
             SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        return result.changedRows > 0;
    }
};

module.exports = Model;
