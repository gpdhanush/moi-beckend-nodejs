const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const Model = {
    async create(payload) {
        const id = generateUUID();
        const { userId, title, description, functionDate, location, invitationUrl } = payload;
        await db.query(
            `INSERT INTO upcoming_functions (id, user_id, title, description, function_date,  location, invitation_url, status)
             VALUES (?, ?, ?, ?, ?, ?, ?, 'ACTIVE')`,
            [toBinaryUUID(id), toBinaryUUID(userId), title || payload.functionName || '', description || null, functionDate || payload.date, location || payload.place || '', invitationUrl || payload.invitationUrl || null]
        );
        return { insertId: id };
    },

    async readAll(userId) {
        const [rows] = await db.query(
            `SELECT id, user_id, title, description, function_date, location, invitation_url, status, created_at, updated_at
             FROM upcoming_functions
             WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)
             ORDER BY function_date DESC, created_at DESC`,
            [toBinaryUUID(userId)]
        );
        return rows.map(r => ({
            ...r,
            id: fromBinaryUUID(r.id),
            user_id: fromBinaryUUID(r.user_id)
        }));
    },

    async readById(id) {
        const [rows] = await db.query(
            `SELECT id, user_id, title, description, function_date, location, invitation_url, status
             FROM upcoming_functions
             WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(id)]
        );
        const r = rows[0];
        if (!r) return null;
        return { ...r, id: fromBinaryUUID(r.id), user_id: fromBinaryUUID(r.user_id) };
    },

    async update(payload) {
        const { id, title, description, functionDate, location, invitationUrl } = payload;
        const [result] = await db.query(
            `UPDATE upcoming_functions
             SET title = ?, description = ?, function_date = ?, location = ?, invitation_url = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [title ?? payload.functionName ?? '', description ?? null, functionDate ?? payload.date, location ?? payload.place ?? '', invitationUrl ?? payload.invitationUrl ?? null, toBinaryUUID(id)]
        );
        return result;
    },

    async updateStatus(id, status) {
        const allowed = ['ACTIVE', 'CANCELLED', 'COMPLETED'];
        const newStatus = status === 'completed' ? 'COMPLETED' : (allowed.includes(status) ? status : 'ACTIVE');
        const [result] = await db.query(
            `UPDATE upcoming_functions SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [newStatus, toBinaryUUID(id)]
        );
        return result;
    },

    async updateStatusByDate() {
        const [result] = await db.query(
            `UPDATE upcoming_functions SET status = 'COMPLETED', updated_at = CURRENT_TIMESTAMP WHERE function_date < CURDATE() AND status = 'ACTIVE'`
        );
        return result;
    },

    async delete(id) {
        const [result] = await db.query(
            `UPDATE upcoming_functions SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        return result;
    },

    /**
     * Admin: Get all upcoming functions across all users
     */
    async getAllFunctions(options = {}) {
        const { limit = 50, offset = 0, status = null, userId = null } = options;
        let query = `SELECT f.id, f.user_id, f.title, f.description, f.function_date, 
                           f.location, f.invitation_url, f.status, f.created_at, f.updated_at, 
                           u.full_name, u.email
                    FROM upcoming_functions f
                    LEFT JOIN users u ON f.user_id = u.id
                    WHERE (f.is_deleted = 0 OR f.is_deleted IS NULL)`;
        const params = [];

        if (status) {
            query += ` AND f.status = ?`;
            params.push(status);
        }

        if (userId) {
            query += ` AND f.user_id = ?`;
            params.push(toBinaryUUID(userId));
        }

        query += ` ORDER BY f.function_date DESC, f.created_at DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await db.query(query, params);
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            userName: r.full_name,
            userEmail: r.email,
            title: r.title,
            description: r.description,
            functionDate: r.function_date,
            location: r.location,
            invitationUrl: r.invitation_url,
            status: r.status,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    /**
     * Admin: Get upcoming functions statistics
     */
    async getFunctionStats() {
        const [rows] = await db.query(
            `SELECT 
                COUNT(*) as total,
                SUM(CASE WHEN status = 'ACTIVE' THEN 1 ELSE 0 END) as active,
                SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
                SUM(CASE WHEN status = 'CANCELLED' THEN 1 ELSE 0 END) as cancelled,
                SUM(CASE WHEN function_date >= CURDATE() THEN 1 ELSE 0 END) as upcoming_count,
                SUM(CASE WHEN function_date < CURDATE() THEN 1 ELSE 0 END) as past_count,
                COUNT(DISTINCT user_id) as unique_users
             FROM upcoming_functions
             WHERE (is_deleted = 0 OR is_deleted IS NULL)`
        );

        const r = rows[0];
        return {
            total: r.total || 0,
            active: r.active || 0,
            completed: r.completed || 0,
            cancelled: r.cancelled || 0,
            upcomingCount: r.upcoming_count || 0,
            pastCount: r.past_count || 0,
            uniqueUsers: r.unique_users || 0
        };
    },

    /**
     * Admin: Get upcoming functions by date range
     */
    async getFunctionsByDateRange(startDate, endDate) {
        const [rows] = await db.query(
            `SELECT f.id, f.user_id, f.title, f.function_date, f.location, f.status, 
                    u.full_name, u.email
             FROM upcoming_functions f
             LEFT JOIN users u ON f.user_id = u.id
             WHERE f.function_date BETWEEN ? AND ? 
             AND (f.is_deleted = 0 OR f.is_deleted IS NULL)
             ORDER BY f.function_date ASC`,
            [startDate, endDate]
        );

        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            userName: r.full_name,
            userEmail: r.email,
            title: r.title,
            functionDate: r.function_date,
            location: r.location,
            status: r.status
        }));
    }
};

module.exports = Model;
