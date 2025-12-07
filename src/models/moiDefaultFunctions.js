const db = require('../config/database');
const table = "gp_moi_default_functions";

const Model = {
    async readAll(userId = null) {
        let query = `SELECT * FROM ${table} WHERE mdf_active = 'Y'`;
        const params = [];
        
        if (userId !== null) {
            query += ` AND (mdf_um_id = ? OR mdf_um_id = 0)`;
            params.push(userId);
        } else {
            query += ` AND mdf_um_id = 0`;
        }
        
        query += ` ORDER BY mdf_name ASC`;
        
        const [result] = await db.query(query, params);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE mdf_id = ? AND mdf_active = 'Y'`, [id]);
        return rows[0];
    }
}

module.exports = Model;
