const db = require('../config/database');
const table = "gp_moi_credit_debit_master";

const Model = {
    async create(data) {
        const [result] = await db.query(`INSERT INTO ${table} 
            (mcd_um_id, mcd_person_id, mcd_first_name, mcd_second_name, mcd_city, mcd_function_id, mcd_type, mcd_mode, mcd_date, mcd_amount, mcd_remarks) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.userId, data.personId, data.firstName || null, data.secondName || null, data.city || null, 
             data.functionId, data.type, data.mode, data.date, data.amount || 0.00, data.remarks || null]);
        return result;
    },

    async readAll(userId, filters = {}) {
        let query = `SELECT mcd.*, 
            mp.mp_first_name, mp.mp_second_name, mp.mp_business, mp.mp_city, mp.mp_mobile,
            mdf.mdf_name as function_name
            FROM ${table} as mcd
            LEFT JOIN gp_moi_persons as mp ON mp.mp_id = mcd.mcd_person_id
            LEFT JOIN gp_moi_default_functions as mdf ON mdf.mdf_id = mcd.mcd_function_id
            WHERE mcd.mcd_um_id = ? AND mcd.mcd_active = 'Y'`;
        
        const params = [userId];

        if (filters.type) {
            query += ` AND mcd.mcd_type = ?`;
            params.push(filters.type);
        }

        if (filters.search) {
            query += ` AND (mp.mp_first_name LIKE ? OR mp.mp_second_name LIKE ? OR mp.mp_city LIKE ? OR mdf.mdf_name LIKE ?)`;
            const searchTerm = `%${filters.search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        if (filters.date) {
            query += ` AND mcd.mcd_date = ?`;
            params.push(filters.date);
        }

        query += ` ORDER BY mcd.mcd_date DESC, mcd.mcd_id DESC`;
        
        const [result] = await db.query(query, params);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT mcd.*, 
            mp.mp_first_name, mp.mp_second_name, mp.mp_business, mp.mp_city, mp.mp_mobile,
            mdf.mdf_name as function_name
            FROM ${table} as mcd
            LEFT JOIN gp_moi_persons as mp ON mp.mp_id = mcd.mcd_person_id
            LEFT JOIN gp_moi_default_functions as mdf ON mdf.mdf_id = mcd.mcd_function_id
            WHERE mcd.mcd_id = ? AND mcd.mcd_active = 'Y'`, [id]);
        return rows[0];
    },

    async update(data) {
        const [result] = await db.query(`UPDATE ${table} 
            SET mcd_person_id = ?, mcd_first_name = ?, mcd_second_name = ?, mcd_city = ?, 
                mcd_function_id = ?, mcd_type = ?, mcd_mode = ?, 
                mcd_date = ?, mcd_amount = ?, mcd_remarks = ? 
            WHERE mcd_id = ? AND mcd_active = 'Y'`,
            [data.personId, data.firstName || null, data.secondName || null, data.city || null,
             data.functionId, data.type, data.mode, data.date, data.amount || 0.00, data.remarks || null, data.id]);
        return result;
    },

    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE mcd_id = ?`, [id]);
        return result;
    },

    async getSummary(userId) {
        const [result] = await db.query(`SELECT 
            mcd_type,
            SUM(CASE WHEN mcd_mode = 'MONEY' THEN mcd_amount ELSE 0 END) as total_amount,
            COUNT(*) as count
            FROM ${table}
            WHERE mcd_um_id = ? AND mcd_active = 'Y'
            GROUP BY mcd_type`, [userId]);
        return result;
    },

    async getMemberCount(userId) {
        const [result] = await db.query(`SELECT COUNT(DISTINCT mcd_person_id) as member_count
            FROM ${table}
            WHERE mcd_um_id = ? AND mcd_active = 'Y'`, [userId]);
        return result[0]?.member_count || 0;
    },

    // Get all persons with their transaction summaries
    async getPersonsWithSummaries(userId) {
        const [result] = await db.query(`SELECT 
            mp.mp_id,
            mp.mp_first_name,
            mp.mp_second_name,
            mp.mp_business,
            mp.mp_city,
            mp.mp_mobile,
            SUM(CASE WHEN mcd.mcd_type = 'RETURN' AND mcd.mcd_mode = 'MONEY' THEN mcd.mcd_amount ELSE 0 END) as moi_return,
            SUM(CASE WHEN mcd.mcd_type = 'INVEST' AND mcd.mcd_mode = 'MONEY' THEN mcd.mcd_amount ELSE 0 END) as moi_invest
            FROM ${table} as mcd
            INNER JOIN gp_moi_persons as mp ON mp.mp_id = mcd.mcd_person_id
            WHERE mcd.mcd_um_id = ? AND mcd.mcd_active = 'Y' AND mp.mp_active = 'Y'
            GROUP BY mp.mp_id, mp.mp_first_name, mp.mp_second_name, mp.mp_business, mp.mp_city, mp.mp_mobile
            ORDER BY mp.mp_first_name ASC, mp.mp_second_name ASC`, [userId]);
        return result;
    },

    // Get transactions by personId
    async readByPersonId(userId, personId) {
        const [result] = await db.query(`SELECT mcd.*, 
            mp.mp_first_name, mp.mp_second_name, mp.mp_business, mp.mp_city, mp.mp_mobile,
            mdf.mdf_name as function_name
            FROM ${table} as mcd
            LEFT JOIN gp_moi_persons as mp ON mp.mp_id = mcd.mcd_person_id
            LEFT JOIN gp_moi_default_functions as mdf ON mdf.mdf_id = mcd.mcd_function_id
            WHERE mcd.mcd_um_id = ? AND mcd.mcd_person_id = ? AND mcd.mcd_active = 'Y'
            ORDER BY mcd.mcd_date DESC, mcd.mcd_id DESC`, [userId, personId]);
        return result;
    },

    // Get person summary by personId
    async getPersonSummary(userId, personId) {
        const [result] = await db.query(`SELECT 
            SUM(CASE WHEN mcd_type = 'RETURN' AND mcd_mode = 'MONEY' THEN mcd_amount ELSE 0 END) as moi_return,
            SUM(CASE WHEN mcd_type = 'INVEST' AND mcd_mode = 'MONEY' THEN mcd_amount ELSE 0 END) as moi_invest
            FROM ${table}
            WHERE mcd_um_id = ? AND mcd_person_id = ? AND mcd_active = 'Y'`, [userId, personId]);
        return result[0] || { moi_return: 0, moi_invest: 0 };
    }
}

module.exports = Model;
