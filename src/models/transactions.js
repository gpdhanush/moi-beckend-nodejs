const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const Model = {
    /**
     * Create a new transaction
     * Links person + transaction_function + amount
     */
    async create(payload) {
        const {
            userId,
            personId,
            transactionFunctionId,
            transactionFunctionName,
            transactionDate,
            type, // INVEST or RETURN
            amount,
            itemName,
            notes,
            isCustom = 0,
            customFunction = null
        } = payload;

        const id = generateUUID();

        const [result] = await db.query(
            `INSERT INTO transactions (
                id, user_id, person_id, transaction_function_id, transaction_function_name,
                transaction_date, type, amount, item_name, notes, is_custom, custom_function
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                toBinaryUUID(id),
                toBinaryUUID(userId),
                toBinaryUUID(personId),
                transactionFunctionId ? toBinaryUUID(transactionFunctionId) : null,
                transactionFunctionName || null,
                transactionDate,
                type,
                amount ?? null,
                itemName || null,
                notes || null,
                isCustom ? 1 : 0,
                customFunction || null
            ]
        );

        return { insertId: id, affectedRows: result.affectedRows };
    },

    /**
     * Get all transactions for a user
     */
    async readAll(userId, filters = {}) {
        const {
            personId = null,
            transactionFunctionId = null,
            type = null,
            startDate = null,
            endDate = null
        } = filters;

        let query = `
                 SELECT t.id, t.user_id, t.person_id, t.transaction_function_id, t.transaction_function_name,
                     t.transaction_date, t.type, t.amount, t.item_name, t.notes, t.is_custom, t.custom_function,
                     t.created_at, t.updated_at,
                     p.first_name, p.last_name, p.mobile, p.city, p.occupation,
                     tf.function_name AS user_function_name, tf.function_date, tf.location,
                     df.name AS default_function_name
            FROM transactions t
            LEFT JOIN persons p ON t.person_id = p.id
            LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
            LEFT JOIN default_functions df ON t.transaction_function_id = df.id
            WHERE t.user_id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
        `;

        const params = [toBinaryUUID(userId)];

        if (personId) {
            query += ` AND t.person_id = ?`;
            params.push(toBinaryUUID(personId));
        }

        if (transactionFunctionId) {
            query += ` AND t.transaction_function_id = ?`;
            params.push(toBinaryUUID(transactionFunctionId));
        }

        if (type) {
            query += ` AND t.type = ?`;
            params.push(type);
        }

        if (startDate) {
            query += ` AND DATE(t.transaction_date) >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND DATE(t.transaction_date) <= ?`;
            params.push(endDate);
        }

        query += ` ORDER BY t.transaction_date DESC`;
        // params.push(limit, offset);

        const [rows] = await db.query(query, params);

        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            personId: fromBinaryUUID(r.person_id),
            transactionFunctionId: r.transaction_function_id ? fromBinaryUUID(r.transaction_function_id) : null,
            transactionFunctionName: r.user_function_name || r.default_function_name || r.transaction_function_name || null,
            transactionDate: r.transaction_date,
            type: r.type,
            amount: r.amount,
            itemName: r.item_name,
            notes: r.notes,
            isCustom: r.is_custom === 1,
            customFunction: r.custom_function,
            person: {
                firstName: r.first_name,
                lastName: r.last_name,
                mobile: r.mobile,
                city: r.city,
                occupation: r.occupation
            },
            function: (r.function_name || r.transaction_function_name) ? {
                name: r.function_name || r.transaction_function_name,
                date: r.function_date,
                location: r.location
            } : null,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    /**
     * Get all transactions across users for admin listing
     */
    async readAllForAdmin(filters = {}) {
        const {
            search = null,
            userId = null,
            personId = null,
            transactionFunctionId = null,
            type = null,
            startDate = null,
            endDate = null
        } = filters;

        let query = `
            SELECT t.id, t.user_id, t.person_id, t.transaction_function_id, t.transaction_function_name,
                   t.transaction_date, t.type, t.amount, t.item_name, t.notes, t.is_custom, t.custom_function,
                   t.created_at, t.updated_at,
                   p.first_name, p.last_name, p.mobile, p.city, p.occupation,
                   tf.function_name AS user_function_name, tf.function_date, tf.location,
                   df.name AS default_function_name,
                   u.full_name AS user_full_name, u.email AS user_email, u.mobile AS user_mobile
            FROM transactions t
            LEFT JOIN persons p ON t.person_id = p.id
            LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
            LEFT JOIN default_functions df ON t.transaction_function_id = df.id
            LEFT JOIN users u ON t.user_id = u.id
            WHERE (t.is_deleted = 0 OR t.is_deleted IS NULL)
        `;

        const params = [];

        if (userId) {
            query += ` AND t.user_id = ?`;
            params.push(toBinaryUUID(userId));
        }

        if (personId) {
            query += ` AND t.person_id = ?`;
            params.push(toBinaryUUID(personId));
        }

        if (transactionFunctionId) {
            query += ` AND t.transaction_function_id = ?`;
            params.push(toBinaryUUID(transactionFunctionId));
        }

        if (type) {
            query += ` AND t.type = ?`;
            params.push(type);
        }

        if (startDate) {
            query += ` AND DATE(t.transaction_date) >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND DATE(t.transaction_date) <= ?`;
            params.push(endDate);
        }

        if (search) {
            query += ` AND (
                p.first_name LIKE ? OR
                p.last_name LIKE ? OR
                p.mobile LIKE ? OR
                p.city LIKE ? OR
                p.occupation LIKE ? OR
                tf.function_name LIKE ? OR
                df.name LIKE ? OR
                t.transaction_function_name LIKE ? OR
                t.item_name LIKE ? OR
                t.notes LIKE ? OR
                t.custom_function LIKE ? OR
                u.full_name LIKE ? OR
                u.email LIKE ? OR
                u.mobile LIKE ? OR
                CAST(t.amount AS CHAR) LIKE ?
            )`;
            const searchTerm = `%${search}%`;
            params.push(
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm,
                searchTerm
            );
        }

        query += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;

        const [rows] = await db.query(query, params);

        return rows.map(r => {
            const resolvedFunctionName =
                r.user_function_name || r.default_function_name || r.transaction_function_name || null;

            return {
                id: fromBinaryUUID(r.id),
                userId: fromBinaryUUID(r.user_id),
                userName: r.user_full_name || null,
                userEmail: r.user_email || null,
                userMobile: r.user_mobile || null,
                personId: fromBinaryUUID(r.person_id),
                transactionFunctionId: r.transaction_function_id ? fromBinaryUUID(r.transaction_function_id) : null,
                transactionFunctionName: resolvedFunctionName,
                transactionDate: r.transaction_date,
                type: r.type,
                amount: r.amount,
                itemName: r.item_name,
                notes: r.notes,
                isCustom: r.is_custom === 1,
                customFunction: r.custom_function,
                person: {
                    firstName: r.first_name,
                    lastName: r.last_name,
                    mobile: r.mobile,
                    city: r.city,
                    occupation: r.occupation
                },
                function: resolvedFunctionName ? {
                    name: resolvedFunctionName,
                    date: r.function_date,
                    location: r.location
                } : null,
                createdAt: r.created_at,
                updatedAt: r.updated_at
            };
        });
    },

    /**
     * Get single transaction by ID
     */
    async readById(transactionId) {
        const [rows] = await db.query(
                `SELECT t.id, t.user_id, t.person_id, t.transaction_function_id, t.transaction_function_name,
                    t.transaction_date, t.type, t.amount, t.item_name, t.notes, t.is_custom, t.custom_function,
                    t.created_at, t.updated_at,
                    p.first_name, p.last_name, p.mobile, p.city, p.occupation,
                    tf.function_name AS user_function_name, tf.function_date, tf.location,
                    df.name AS default_function_name
             FROM transactions t
             LEFT JOIN persons p ON t.person_id = p.id
             LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
             LEFT JOIN default_functions df ON t.transaction_function_id = df.id
             WHERE t.id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)`,
            [toBinaryUUID(transactionId)]
        );

        if (rows.length === 0) return null;

        const r = rows[0];
        return {
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            personId: fromBinaryUUID(r.person_id),
            transactionFunctionId: r.transaction_function_id ? fromBinaryUUID(r.transaction_function_id) : null,
            transactionFunctionName: r.user_function_name || r.default_function_name || r.transaction_function_name || null,
            transactionDate: r.transaction_date,
            type: r.type,
            amount: r.amount,
            itemName: r.item_name,
            notes: r.notes,
            isCustom: r.is_custom === 1,
            customFunction: r.custom_function,
            person: {
                firstName: r.first_name,
                lastName: r.last_name,
                mobile: r.mobile,
                city: r.city,
                occupation: r.occupation
            },
            function: (r.function_name || r.transaction_function_name) ? {
                name: r.function_name || r.transaction_function_name,
                date: r.function_date,
                location: r.location
            } : null,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        };
    },

    /**
     * Update a transaction
     */
    async update(transactionId, payload) {
        const { transactionDate, type, amount, itemName, notes, transactionFunctionName, isCustom = 0, customFunction = null } = payload;

        const [result] = await db.query(
            `UPDATE transactions SET 
                transaction_date = ?, type = ?,
                amount = ?, item_name = ?, notes = ?, transaction_function_name = ?, is_custom = ?, custom_function = ?,
                updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [
                transactionDate,
                type,
                amount ?? null,
                itemName || null,
                notes || null,
                transactionFunctionName || null,
                isCustom ? 1 : 0,
                customFunction || null,
                toBinaryUUID(transactionId)
            ]
        );

        return result.changedRows > 0;
    },

    /**
     * Delete transaction (soft delete)
     */
    async delete(transactionId) {
        const [result] = await db.query(
            `UPDATE transactions SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(transactionId)]
        );
        return result.changedRows > 0;
    },

    /**
     * Get transaction summary statistics
     */
    async getStats(userId, filters = {}) {
        const { personId = null, transactionFunctionId = null, startDate = null, endDate = null } = filters;

        let query = `
            SELECT 
                type,
                COUNT(*) as count,
                SUM(amount) as totalAmount
            FROM transactions
            WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)
        `;

        const params = [toBinaryUUID(userId)];

        if (personId) {
            query += ` AND person_id = ?`;
            params.push(toBinaryUUID(personId));
        }

        if (transactionFunctionId) {
            query += ` AND transaction_function_id = ?`;
            params.push(toBinaryUUID(transactionFunctionId));
        }

        if (startDate) {
            query += ` AND DATE(transaction_date) >= ?`;
            params.push(startDate);
        }

        if (endDate) {
            query += ` AND DATE(transaction_date) <= ?`;
            params.push(endDate);
        }

        query += ` GROUP BY type`;

        const [rows] = await db.query(query, params);

        const stats = {
            investTotal: 0,
            returnTotal: 0,
            netAmount: 0
        };

        rows.forEach(row => {
            if (row.type === 'INVEST') {
                stats.investTotal = parseFloat(row.totalAmount || 0);
            } else if (row.type === 'RETURN') {
                stats.returnTotal = parseFloat(row.totalAmount || 0);
            }
        });

        stats.netAmount = stats.investTotal - stats.returnTotal;

        return stats;
    },

    /**
     * Get all transactions by person (history)
     */
    async getByPerson(userId, personId, limit = 50, offset = 0) {
        const [rows] = await db.query(
            `SELECT t.id, t.transaction_date, t.type, t.amount, t.item_name, t.notes, t.is_custom, t.custom_function,
                    t.transaction_function_name, t.created_at, t.updated_at,
                    tf.function_name AS user_function_name, tf.function_date,
                    df.name AS default_function_name
             FROM transactions t
             LEFT JOIN transaction_functions tf ON t.transaction_function_id = tf.id
             LEFT JOIN default_functions df ON t.transaction_function_id = df.id
             WHERE t.user_id = ? AND t.person_id = ? 
               AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
             ORDER BY t.transaction_date DESC
             LIMIT ? OFFSET ?`,
            [toBinaryUUID(userId), toBinaryUUID(personId), limit, offset]
        );

        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            transactionFunctionId: r.transaction_function_id ? fromBinaryUUID(r.transaction_function_id) : null,
            transactionFunctionName: r.user_function_name || r.default_function_name || r.transaction_function_name || null,
            transactionDate: r.transaction_date,
            type: r.type,
            amount: r.amount,
            itemName: r.item_name,
            notes: r.notes,
            isCustom: r.is_custom === 1,
            customFunction: r.custom_function,
            function: (r.function_name || r.transaction_function_name) ? {
                name: r.function_name || r.transaction_function_name,
                date: r.function_date
            } : null,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    }
};

module.exports = Model;
