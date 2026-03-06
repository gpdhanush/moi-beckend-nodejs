const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const table = "transactions";

const Model = {
    async create(data) {
        const id = data.id || generateUUID();
        const [result] = await db.query(`INSERT INTO ${table} 
            (id, user_id, person_id, type, item_type, transaction_date, amount, notes, created_at, updated_at) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
            [toBinaryUUID(id), toBinaryUUID(data.userId), 
             data.personId ? toBinaryUUID(data.personId) : null, 
             data.type, data.mode || 'MONEY', data.date, data.amount || 0.00, data.remarks || null]);
        return result;
    },

    async readAll(userId, filters = {}) {
        let query = `SELECT 
            t.id,
            t.user_id,
            t.person_id,
            t.type,
            t.item_type,
            t.transaction_date,
            t.amount,
            t.notes,
            t.created_at,
            t.updated_at,
            p.first_name,
            p.last_name,
            p.occupation,
            p.city,
            p.mobile
            FROM ${table} as t
            LEFT JOIN persons as p ON p.id = t.person_id
            WHERE t.user_id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)`;
        
        const params = [toBinaryUUID(userId)];

        if (filters.type) {
            query += ` AND t.type = ?`;
            params.push(filters.type);
        }

        if (filters.search) {
            query += ` AND (p.first_name LIKE ? OR p.last_name LIKE ? OR p.city LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm);
        }

        if (filters.date) {
            query += ` AND DATE(t.transaction_date) = ?`;
            params.push(filters.date);
        }

        query += ` ORDER BY t.transaction_date DESC, t.created_at DESC`;
        
        const [result] = await db.query(query, params);
        return result.map(r => mapCreditDebitRow(r));
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT 
            t.id,
            t.user_id,
            t.person_id,
            t.type,
            t.item_type,
            t.transaction_date,
            t.amount,
            t.notes,
            t.created_at,
            t.updated_at,
            p.first_name,
            p.last_name,
            p.occupation,
            p.city,
            p.mobile
            FROM ${table} as t
            LEFT JOIN persons as p ON p.id = t.person_id
            WHERE t.id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)`, [toBinaryUUID(id)]);
        if (!rows[0]) return null;
        return mapCreditDebitRow(rows[0]);
    },

    async update(data) {
        const [result] = await db.query(`UPDATE ${table} 
            SET person_id = ?, type = ?, item_type = ?, 
                transaction_date = ?, amount = ?, notes = ?, updated_at = CURRENT_TIMESTAMP 
            WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [data.personId ? toBinaryUUID(data.personId) : null, 
             data.type, data.mode || 'MONEY', data.date, data.amount || 0.00, data.remarks || null, toBinaryUUID(data.id)]);
        return result;
    },

    async delete(id) {
        // Soft delete
        const [result] = await db.query(`UPDATE ${table} SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [toBinaryUUID(id)]);
        return result;
    },

    async getSummary(userId) {
        const [result] = await db.query(`SELECT 
            type,
            SUM(CASE WHEN item_type = 'MONEY' THEN amount ELSE 0 END) as total_amount,
            COUNT(*) as count
            FROM ${table}
            WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)
            GROUP BY type`, [toBinaryUUID(userId)]);
        return result;
    },

    async getMemberCount(userId) {
        const [result] = await db.query(`SELECT COUNT(DISTINCT person_id) as member_count
            FROM ${table}
            WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`, [toBinaryUUID(userId)]);
        return result[0]?.member_count || 0;
    },

    // Get all persons with their transaction summaries
    async getPersonsWithSummaries(userId) {
        const [result] = await db.query(`SELECT 
            p.id,
            p.first_name,
            p.last_name,
            p.occupation,
            p.city,
            p.mobile,
            SUM(CASE WHEN t.type = 'RETURN' AND t.item_type = 'MONEY' THEN t.amount ELSE 0 END) as moi_return,
            SUM(CASE WHEN t.type = 'INVEST' AND t.item_type = 'MONEY' THEN t.amount ELSE 0 END) as moi_invest
            FROM ${table} as t
            INNER JOIN persons as p ON p.id = t.person_id
            WHERE t.user_id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL) AND (p.is_deleted = 0 OR p.is_deleted IS NULL)
            GROUP BY p.id, p.first_name, p.last_name, p.occupation, p.city, p.mobile
            ORDER BY p.first_name ASC, p.last_name ASC`, [toBinaryUUID(userId)]);
        return result.map(r => mapPersonSummaryRow(r));
    },

    // Get transactions by personId
    async readByPersonId(userId, personId) {
        const [result] = await db.query(`SELECT 
            t.id,
            t.user_id,
            t.person_id,
            t.type,
            t.item_type,
            t.transaction_date,
            t.amount,
            t.notes,
            t.created_at,
            t.updated_at,
            p.first_name,
            p.last_name,
            p.occupation,
            p.city,
            p.mobile
            FROM ${table} as t
            LEFT JOIN persons as p ON p.id = t.person_id
            WHERE t.user_id = ? AND t.person_id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
            ORDER BY t.transaction_date DESC, t.created_at DESC`, [toBinaryUUID(userId), toBinaryUUID(personId)]);
        return result.map(r => mapCreditDebitRow(r));
    },

    // Get person summary by personId
    async getPersonSummary(userId, personId) {
        const [result] = await db.query(`SELECT 
            SUM(CASE WHEN type = 'RETURN' AND item_type = 'MONEY' THEN amount ELSE 0 END) as moi_return,
            SUM(CASE WHEN type = 'INVEST' AND item_type = 'MONEY' THEN amount ELSE 0 END) as moi_invest
            FROM ${table}
            WHERE user_id = ? AND person_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`, [toBinaryUUID(userId), toBinaryUUID(personId)]);
        return result[0] || { moi_return: 0, moi_invest: 0 };
    }
};

function mapCreditDebitRow(r) {
    const id = fromBinaryUUID(r.id);
    const userId = r.user_id ? fromBinaryUUID(r.user_id) : null;
    const personId = r.person_id ? fromBinaryUUID(r.person_id) : null;
    
    return {
        id,
        mcd_id: id, // backward compatibility
        user_id: userId,
        mcd_um_id: userId, // backward compatibility
        person_id: personId,
        mcd_person_id: personId, // backward compatibility
        first_name: r.first_name,
        mcd_first_name: r.first_name, // backward compatibility
        last_name: r.last_name,
        mcd_second_name: r.last_name, // backward compatibility
        occupation: r.occupation,
        mcd_business: r.occupation, // backward compatibility
        city: r.city,
        mcd_city: r.city, // backward compatibility
        mobile: r.mobile,
        mcd_mobile: r.mobile, // backward compatibility
        type: r.type,
        mcd_type: r.type, // backward compatibility
        item_type: r.item_type,
        mcd_mode: r.item_type, // backward compatibility
        amount: r.amount,
        mcd_amount: r.amount, // backward compatibility
        notes: r.notes,
        mcd_remarks: r.notes, // backward compatibility
        transaction_date: r.transaction_date,
        mcd_date: r.transaction_date, // backward compatibility
        created_at: r.created_at,
        mcd_create_dt: r.created_at, // backward compatibility
        updated_at: r.updated_at,
        is_deleted: r.is_deleted || 0,
        mcd_active: (r.is_deleted === 0 || r.is_deleted === null) ? 'Y' : 'N' // backward compatibility
    };
}

function mapPersonSummaryRow(r) {
    const personId = fromBinaryUUID(r.id);
    
    return {
        id: personId,
        mp_id: personId, // backward compatibility
        first_name: r.first_name,
        mp_first_name: r.first_name, // backward compatibility
        last_name: r.last_name,
        mp_second_name: r.last_name, // backward compatibility
        occupation: r.occupation,
        mp_business: r.occupation, // backward compatibility
        city: r.city,
        mp_city: r.city, // backward compatibility
        mobile: r.mobile,
        mp_mobile: r.mobile, // backward compatibility
        moi_return: r.moi_return,
        moi_invest: r.moi_invest
    };
}

module.exports = Model;
