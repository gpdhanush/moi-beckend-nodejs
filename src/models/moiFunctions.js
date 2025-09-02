const db = require('../config/database');
const table = "gp_moi_functions";

const Model = {
    async create(list) {
        const [result] = await db.query(`INSERT INTO ${table} (f_um_id, function_name, function_date, first_name, second_name, place, native_place, invitation_photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [list.userId, list.functionName, list.date, list.firstName, list.secondName, list.place, list.nativePlace, list.invitationUrl]);
        return result;
    },


    async readAll(userId) {
        const [result] = await db.query(`SELECT * FROM ${table} WHERE f_um_id =? AND f_active = 'Y' ORDER BY f_id DESC`, [userId]);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE f_id =? `, [id]);
        return rows[0];
    },
    async update(list) {
        const [result] = await db.query(`UPDATE ${table} SET function_name = ?, function_date = ?, first_name = ?, second_name = ?, place = ?, native_place = ?, invitation_photo = ? WHERE f_id = ?`,
            [list.functionName, list.date, list.firstName, list.secondName, list.place, list.nativePlace, list.invitationUrl, list.id]);
        return result;
    },
    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE f_id=?`, [id]);
        return result;
    },
}
module.exports = Model;
