const db = require('../config/database');
const table = "gp_moi_persons";

const Model = {
    async create(data) {
        const [result] = await db.query(`INSERT INTO ${table} 
            (mp_um_id, mp_first_name, mp_second_name, mp_business, mp_city, mp_mobile) 
            VALUES (?, ?, ?, ?, ?, ?)`,
            [data.userId, data.firstName, data.secondName || null, 
             data.business || null, data.city || null, data.mobile || null]);
        return result;
    },

    async readAll(userId, search = null) {
        let query = `SELECT * FROM ${table} WHERE mp_um_id = ? AND mp_active = 'Y'`;
        const params = [userId];

        if (search) {
            query += ` AND (mp_first_name LIKE ? OR mp_second_name LIKE ? OR mp_city LIKE ? OR mp_mobile LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY mp_first_name ASC, mp_second_name ASC`;
        
        const [result] = await db.query(query, params);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE mp_id = ? AND mp_active = 'Y'`, [id]);
        return rows[0];
    },

    async findByMobile(userId, mobile) {
        const [rows] = await db.query(`SELECT * FROM ${table} 
            WHERE mp_um_id = ? AND mp_mobile = ? AND mp_active = 'Y'`, [userId, mobile]);
        return rows[0];
    },

    async update(data) {
        const [result] = await db.query(`UPDATE ${table} 
            SET mp_first_name = ?, mp_second_name = ?, 
                mp_business = ?, mp_city = ?, mp_mobile = ? 
            WHERE mp_id = ? AND mp_active = 'Y'`,
            [data.firstName, data.secondName || null, 
             data.business || null, data.city || null, data.mobile || null, data.id]);
        return result;
    },

    async delete(id) {
        const [result] = await db.query(`UPDATE ${table} SET mp_active = 'N' WHERE mp_id = ?`, [id]);
        return result;
    },

    async getPersonDetails(userId) {
        const [rows] = await db.query(`SELECT * FROM ${table} 
            WHERE mp_um_id = ? AND mp_active = 'Y' 
            ORDER BY mp_create_dt DESC LIMIT 1`, [userId]);
        return rows[0];
    }
}

module.exports = Model;
