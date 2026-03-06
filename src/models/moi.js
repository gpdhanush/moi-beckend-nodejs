const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const table = "transactions";

const Model = {
    async create(list) {
        const id = list.id || generateUUID();
        const personId = list.personId || list.mp_id;
        const txnFuncId = list.function ? toBinaryUUID(list.function) : null;
        
        const [result] = await db.query(`INSERT INTO ${table} 
            (id, user_id, person_id, transaction_function_id, transaction_date, type, item_type, amount, notes, created_at, updated_at) 
            VALUES (?, ?, ?, ?, CURDATE(), 'INVEST', 'MONEY', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [toBinaryUUID(id), toBinaryUUID(list.userId), 
             personId ? toBinaryUUID(personId) : null, 
             txnFuncId,
             list.amount || 0, 
             list.remarks || null]);
        return result;
    },

    async readAll(userId) {
        const [result] = await db.query(`
            SELECT 
                t.id,
                t.user_id,
                t.person_id,
                t.transaction_function_id,
                t.transaction_date,
                t.type,
                t.item_type,
                t.amount,
                t.notes,
                t.created_at,
                t.updated_at,
                p.first_name,
                p.last_name,
                p.city,
                p.occupation,
                tf.function_name,
                tf.function_date,
                tf.location
            FROM ${table} t
            LEFT JOIN persons p ON p.id = t.person_id
            LEFT JOIN transaction_functions tf ON tf.id = t.transaction_function_id
            WHERE t.user_id = ? AND t.type = 'INVEST' AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
            ORDER BY t.transaction_date DESC, t.created_at DESC`, 
            [toBinaryUUID(userId)]);
        return result.map(r => mapTransactionRow(r));
    },

    async readById(id) {
        const [rows] = await db.query(`
            SELECT 
                t.id,
                t.user_id,
                t.person_id,
                t.transaction_function_id,
                t.transaction_date,
                t.type,
                t.item_type,
                t.amount,
                t.notes,
                t.created_at,
                t.updated_at,
                p.first_name,
                p.last_name,
                p.city,
                p.occupation
            FROM ${table} t
            LEFT JOIN persons p ON p.id = t.person_id
            WHERE t.id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)`, 
            [toBinaryUUID(id)]);
        if (!rows[0]) return null;
        return mapTransactionRow(rows[0]);
    },

    async update(list) {
        const txnFuncId = list.function ? toBinaryUUID(list.function) : null;
        const [result] = await db.query(`UPDATE ${table} 
            SET transaction_function_id = ?, amount = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [txnFuncId, list.amount || 0, list.remarks || null, toBinaryUUID(list.id)]);
        return result;
    },

    async delete(id) {
        // Soft delete
        const [result] = await db.query(`UPDATE ${table} SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [toBinaryUUID(id)]);
        return result;
    },

    async getDashboard(userId) {
        // Get all INVEST transactions
        const [investTransactions] = await db.query(`
            SELECT 
                t.id,
                t.user_id as userId,
                p.first_name as personFirstName,
                p.last_name as personSecondName,
                p.city as personCity,
                p.occupation as personBusiness,
                t.amount,
                t.notes as remarks,
                t.transaction_date as createDate,
                COALESCE(t.item_type, 'MONEY') as mode,
                tf.function_name as functionName,
                tf.function_date as functionDate,
                tf.location as functionCity,
                (SELECT u.mobile FROM users u WHERE u.id = t.user_id LIMIT 1) as userMobile
            FROM ${table} t
            LEFT JOIN persons p ON p.id = t.person_id
            LEFT JOIN transaction_functions tf ON tf.id = t.transaction_function_id
            WHERE t.user_id = ? AND t.type = 'INVEST' AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
            ORDER BY t.transaction_date DESC, t.created_at DESC
        `, [toBinaryUUID(userId)]);

        // Get all RETURN transactions
        const [returnTransactions] = await db.query(`
            SELECT 
                t.id,
                t.user_id as userId,
                p.first_name as personFirstName,
                p.last_name as personSecondName,
                p.city as personCity,
                '' as personBusiness,
                t.amount,
                t.notes as remarks,
                t.transaction_date as createDate,
                COALESCE(t.item_type, 'MONEY') as mode,
                CONCAT(p.first_name, ' ', COALESCE(p.last_name, '')) as functionName,
                NULL as functionDate,
                NULL as functionCity,
                (SELECT u.mobile FROM users u WHERE u.id = t.user_id LIMIT 1) as userMobile,
                (SELECT u.full_name FROM users u WHERE u.id = t.user_id LIMIT 1) as userFullName
            FROM ${table} t
            LEFT JOIN persons p ON p.id = t.person_id
            WHERE t.user_id = ? AND t.type = 'RETURN' AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
            ORDER BY t.transaction_date DESC, t.created_at DESC
        `, [toBinaryUUID(userId)]);

        return {
            investTransactions: investTransactions.map(r => mapTransactionRow(r)),
            returnTransactions: returnTransactions.map(r => mapTransactionRow(r))
        };
    },
};

function mapTransactionRow(r) {
    const id = fromBinaryUUID(r.id);
    const userId = r.user_id ? fromBinaryUUID(r.user_id) : null;
    const personId = r.person_id ? fromBinaryUUID(r.person_id) : null;
    
    return {
        id,
        mr_id: id,
        user_id: userId,
        mr_um_id: userId,
        person_id: personId,
        mp_id: personId,
        first_name: r.first_name,
        mr_first_name: r.first_name,
        last_name: r.last_name,
        mr_second_name: r.last_name,
        city: r.city,
        mr_city_id: r.city,
        occupation: r.occupation,
        mr_occupation: r.occupation,
        amount: r.amount,
        mr_amount: r.amount,
        notes: r.notes,
        mr_remarks: r.notes,
        item_type: r.item_type,
        seimurai: r.item_type,
        transaction_date: r.transaction_date || r.createDate,
        mr_create_dt: r.transaction_date || r.createDate,
        created_at: r.created_at,
        updated_at: r.updated_at,
        is_deleted: r.is_deleted || 0
    };
}

module.exports = Model;
