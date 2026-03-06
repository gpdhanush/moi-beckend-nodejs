const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const table = "transactions";

const Model = {
    async create(list) {
        const id = list.id || generateUUID();
        const personId = list.personId || list.mp_id;
        
        const [result] = await db.query(`INSERT INTO ${table} 
            (id, user_id, person_id, transaction_date, type, item_type, amount, notes, created_at, updated_at) 
            VALUES (?, ?, ?, CURDATE(), 'RETURN', 'MONEY', ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [toBinaryUUID(id), toBinaryUUID(list.userId), 
             personId ? toBinaryUUID(personId) : null, 
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
                t.transaction_date,
                t.type,
                t.item_type,
                t.amount,
                t.notes,
                t.created_at,
                t.updated_at,
                p.first_name,
                p.last_name,
                p.city
            FROM ${table} t
            LEFT JOIN persons p ON p.id = t.person_id
            WHERE t.user_id = ? AND t.type = 'RETURN' AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
            ORDER BY t.transaction_date DESC, t.created_at DESC`, 
            [toBinaryUUID(userId)]);
        return result.map(r => mapReturnTransactionRow(r));
    },

    async readById(id) {
        const [rows] = await db.query(`
            SELECT 
                t.id,
                t.user_id,
                t.person_id,
                t.transaction_date,
                t.type,
                t.item_type,
                t.amount,
                t.notes,
                t.created_at,
                t.updated_at,
                p.first_name,
                p.last_name,
                p.city
            FROM ${table} t
            LEFT JOIN persons p ON p.id = t.person_id
            WHERE t.id = ? AND t.type = 'RETURN' AND (t.is_deleted = 0 OR t.is_deleted IS NULL)`, 
            [toBinaryUUID(id)]);
        if (!rows[0]) return null;
        return mapReturnTransactionRow(rows[0]);
    },

    async update(list) {
        const [result] = await db.query(`UPDATE ${table} 
            SET amount = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND type = 'RETURN' AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [list.amount || 0, list.remarks || null, toBinaryUUID(list.id)]);
        return result;
    },

    async delete(id) {
        // Soft delete
        const [result] = await db.query(`UPDATE ${table} SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ? AND type = 'RETURN'`, [toBinaryUUID(id)]);
        return result;
    },
};

function mapReturnTransactionRow(r) {
    const id = fromBinaryUUID(r.id);
    const userId = r.user_id ? fromBinaryUUID(r.user_id) : null;
    const personId = r.person_id ? fromBinaryUUID(r.person_id) : null;
    
    return {
        id,
        mom_id: id, // backward compatibility
        user_id: userId,
        mom_user_id: userId, // backward compatibility
        person_id: personId,
        mp_id: personId, // backward compatibility
        first_name: r.first_name,
        mom_first_name: r.first_name, // backward compatibility
        last_name: r.last_name,
        mom_second_name: r.last_name, // backward compatibility
        city: r.city,
        mom_city: r.city, // backward compatibility
        amount: r.amount,
        mom_amount: r.amount, // backward compatibility
        notes: r.notes,
        mom_remarks: r.notes, // backward compatibility
        item_type: r.item_type,
        seimurai: r.item_type, // backward compatibility
        transaction_date: r.transaction_date,
        mom_create_dt: r.transaction_date, // backward compatibility
        created_at: r.created_at,
        updated_at: r.updated_at,
        is_deleted: r.is_deleted || 0,
        mom_status: (r.is_deleted === 0 || r.is_deleted === null) ? 'Y' : 'N' // backward compatibility
    };
}

module.exports = Model;
