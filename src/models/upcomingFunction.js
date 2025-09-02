const db = require('../config/database');
const table = "gp_moi_upcoming_functions";

const Model = {
    async create(list) {
        const [result] = await db.query(`INSERT INTO ${table} (uf_user_id, uf_date, uf_name, uf_place, uf_invitation_url) VALUES (?, ?, ?, ?, ?)`,
            [list.userId, list.date, list.functionName, list.place, list.invitationUrl]);
        return result;
    },

    async readAll(userId) {
        const [result] = await db.query(`SELECT * FROM ${table} WHERE uf_user_id =? ORDER BY uf_id DESC`, [userId]);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE uf_id =? `, [id]);
        return rows[0];
    },
    async update(list) {
        const [result] = await db.query(`UPDATE ${table} SET uf_date = ?, uf_name = ?, uf_place = ?, uf_invitation_url = ? WHERE uf_id = ?`,
            [list.date, list.functionName, list.place, list.invitationUrl, list.id]);
        return result;
    },
    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE uf_id=?`, [id]);
        return result;
    },
}
module.exports = Model;
