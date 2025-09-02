const db = require('../config/database');
const table = "gp_moi_user_master";


const User = {
    // find by user email
    async findByEmail(email) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE um_email = ?`, [email]);
        return rows[0];
    },
    // find by user id
    async findById(userId) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE um_id = ?`, [userId]);
        return rows[0];
    },
    // SELECT * FROM ${table} WHERE um_id = ?
    async checkMobileNo(mobile, id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE um_mobile = ? AND um_id != ? `, [mobile, id]);
        return rows[0];
    },

    // find by user mobile
    async findByMobile(mobile) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE um_mobile = ?`, [mobile]);
        return rows[0];
    },

    // update last login
    async updateLastLogin(id) {
        const [result] = await db.query(`UPDATE ${table} SET um_last_login = ? WHERE um_id = ?`, [new Date(), id]);
        return result;
    },

    async create(users) {
        const [result] = await db.query(`INSERT INTO ${table} (um_full_name, um_password, um_mobile, um_email) VALUES (?, ?, ?, ?)`,
            [users.name, users.password, users.mobile, users.email]);
        return result;
    },

    async update(users) {
        const [result] = await db.query(`UPDATE ${table} SET um_full_name = ?, um_mobile = ? WHERE um_id = ?`,
            [users.name, users.mobile, users.id]);
        return result;
    },
    async updatePassword(users) {
        const [result] = await db.query(`UPDATE ${table} SET um_password =? WHERE um_id=?`, [users.password, users.id]);
        return result;
    },
    async deleteUser(userId) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE um_id=?`, [userId]);
        return result;
    },

    async updateToken(id, token) {
        const [result] = await db.query(`UPDATE ${table} SET um_notification_token =? WHERE um_id=?`, [token, id]);
        return result;
    },
}
module.exports = User;
