const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const table = "upcoming_functions";
const txnFunctionTable = "transaction_functions";

const Model = {
    async create(list) {
        const id = list.id || generateUUID();
        const txnFuncId = list.txnFunctionId || generateUUID();
        
        // Create tracking record in transaction_functions
        await db.query(`INSERT INTO ${txnFunctionTable} (id, user_id, function_name, function_date, location, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [toBinaryUUID(txnFuncId), toBinaryUUID(list.userId), list.functionName, list.date, list.place || null]);
        
        // Create upcoming event record
        const [result] = await db.query(`INSERT INTO ${table} (id, user_id, title, function_date, location, status, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [toBinaryUUID(id), toBinaryUUID(list.userId), list.functionName, list.date, list.place || null]);
        
        return result;
    },

    async readAll(userId) {
        const [result] = await db.query(
            `SELECT id, user_id, title, function_date, location, status, created_at, updated_at FROM ${table} 
            WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)
            ORDER BY function_date DESC`, 
            [toBinaryUUID(userId)]);
        return result.map(r => mapFunctionRow(r));
    },

    async readById(id) {
        const [rows] = await db.query(
            `SELECT * FROM ${table} WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`, 
            [toBinaryUUID(id)]);
        if (!rows[0]) return null;
        return mapFunctionRow(rows[0]);
    },

    async update(list) {
        const [result] = await db.query(
            `UPDATE ${table} SET title = ?, function_date = ?, location = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [list.functionName, list.date, list.place || null, toBinaryUUID(list.id)]);
        return result;
    },

    async delete(id) {
        // Soft delete
        const [result] = await db.query(
            `UPDATE ${table} SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, 
            [toBinaryUUID(id)]);
        return result;
    },

    // Find functions that are 1 day away (tomorrow) and join with user to get notification token
    async findFunctionsOneDayAway() {
        const [rows] = await db.query(
            `SELECT 
                f.id,
                f.user_id,
                f.title,
                f.function_date,
                f.location,
                f.status,
                u.id as um_id,
                (SELECT fcm_token FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1 ORDER BY ud.last_used_at DESC LIMIT 1) AS um_notification_token,
                u.email as um_email,
                u.full_name as um_full_name
             FROM ${table} f
             INNER JOIN users u ON f.user_id = u.id
             WHERE f.status = 'ACTIVE' 
             AND (f.is_deleted = 0 OR f.is_deleted IS NULL)
             AND u.status = 'ACTIVE'
             AND u.is_deleted = 0
             AND (SELECT COUNT(*) FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1) > 0
             AND f.function_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
            []
        );
        return rows;
    },
};

function mapFunctionRow(r) {
    const id = fromBinaryUUID(r.id);
    const userId = fromBinaryUUID(r.user_id);
    return {
        id,
        f_id: id, // backward compatibility
        user_id: userId,
        f_um_id: userId, // backward compatibility
        title: r.title,
        function_name: r.title,
        f_name: r.title, // backward compatibility
        function_date: r.function_date,
        f_date: r.function_date, // backward compatibility
        location: r.location,
        place: r.location, // backward compatibility
        status: r.status,
        f_status: r.status, // backward compatibility
        created_at: r.created_at,
        f_create_dt: r.created_at, // backward compatibility
        updated_at: r.updated_at,
        f_update_dt: r.updated_at, // backward compatibility
        is_deleted: r.is_deleted || 0
    };
}

module.exports = Model;
