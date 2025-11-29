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
    // Find functions that are 1 day away (tomorrow) and join with user to get notification token
    async findFunctionsOneDayAway() {
        const [rows] = await db.query(
            `SELECT f.*, u.um_id, u.um_notification_token, u.um_email, u.um_full_name
             FROM ${table} f
             INNER JOIN gp_moi_user_master u ON f.f_um_id = u.um_id
             WHERE f.f_active = 'Y' 
             AND u.um_status = 'Y'
             AND u.um_notification_token IS NOT NULL
             AND f.function_date = DATE_ADD(CURDATE(), INTERVAL 1 DAY)`,
            []
        );
        return rows;
    },
}
module.exports = Model;
