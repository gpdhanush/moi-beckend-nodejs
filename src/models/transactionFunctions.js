const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const Model = {
    /**
     * Create a new transaction function
     */
    async create(payload) {
        const { userId, functionName, functionDate, location, notes, imageUrl } = payload;
        const id = generateUUID();

        const [result] = await db.query(
            `INSERT INTO transaction_functions (id, user_id, function_name, function_date, location, notes, image_url)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                toBinaryUUID(id),
                toBinaryUUID(userId),
                functionName,
                functionDate || null,
                location || null,
                notes || null,
                imageUrl || null
            ]
        );

        return { insertId: id, affectedRows: result.affectedRows };
    },

    /**
     * Get all transaction functions for a user
     */
    async readAll(userId, filters = {}) {
        const { startDate = null, endDate = null, limit = 100, offset = 0 } = filters;

        let query = `
            SELECT id, user_id, function_name, function_date, location, notes, image_url, created_at, updated_at
            FROM transaction_functions
            WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)
        `;

        const params = [toBinaryUUID(userId)];

        if (startDate) {
            query += ` AND function_date >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND function_date <= ?`;
            params.push(endDate);
        }

        query += ` ORDER BY function_date DESC LIMIT ? OFFSET ?`;
        params.push(limit, offset);

        const [rows] = await db.query(query, params);

        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            functionName: r.function_name,
            functionDate: r.function_date,
            location: r.location,
            notes: r.notes,
            imageUrl: r.image_url,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    /**
     * Get single transaction function by ID
     */
    async readById(functionId) {
        const [rows] = await db.query(
            `SELECT id, user_id, function_name, function_date, location, notes, image_url, created_at, updated_at
             FROM transaction_functions
             WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(functionId)]
        );

        if (rows.length === 0) return null;

        const r = rows[0];
        return {
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            functionName: r.function_name,
            functionDate: r.function_date,
            location: r.location,
            notes: r.notes,
            imageUrl: r.image_url,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        };
    },

    /**
     * Update transaction function
     */
    async update(functionId, payload) {
        const { functionName, functionDate, location, notes, imageUrl } = payload;

        const [result] = await db.query(
            `UPDATE transaction_functions SET
                function_name = ?, function_date = ?, location = ?, notes = ?, image_url = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [functionName, functionDate || null, location || null, notes || null, imageUrl || null, toBinaryUUID(functionId)]
        );

        return result.changedRows > 0;
    },

    /**
     * Delete transaction function (soft delete)
     */
    async delete(functionId) {
        const [result] = await db.query(
            `UPDATE transaction_functions SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(functionId)]
        );
        return result.changedRows > 0;
    },

    /**
     * Get function with transaction summary
     */
    async getFunctionWithStats(functionId) {
        const [rows] = await db.query(
            `SELECT 
                tf.id, tf.user_id, tf.function_name, tf.function_date, tf.location, tf.notes, tf.image_url,
                tf.created_at, tf.updated_at,
                COUNT(DISTINCT t.id) as transactionCount,
                SUM(CASE WHEN t.type = 'INVEST' AND t.item_type = 'MONEY' THEN t.amount ELSE 0 END) as totalInvest,
                SUM(CASE WHEN t.type = 'RETURN' AND t.item_type = 'MONEY' THEN t.amount ELSE 0 END) as totalReturn
             FROM transaction_functions tf
             LEFT JOIN transactions t ON tf.id = t.transaction_function_id AND t.is_deleted = 0
             WHERE tf.id = ? AND (tf.is_deleted = 0 OR tf.is_deleted IS NULL)
             GROUP BY tf.id`,
            [toBinaryUUID(functionId)]
        );

        if (rows.length === 0) return null;

        const r = rows[0];
        return {
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            functionName: r.function_name,
            functionDate: r.function_date,
            location: r.location,
            notes: r.notes,
            imageUrl: r.image_url,
            transactionCount: r.transactionCount,
            totalInvest: parseFloat(r.totalInvest || 0),
            totalReturn: parseFloat(r.totalReturn || 0),
            netAmount: parseFloat(r.totalInvest || 0) - parseFloat(r.totalReturn || 0),
            createdAt: r.created_at,
            updatedAt: r.updated_at
        };
    }
};

module.exports = Model;
