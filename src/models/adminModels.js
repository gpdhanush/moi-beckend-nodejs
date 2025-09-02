const db = require('../config/database');

const Model = {

    async login(username, password) {
        const [result] = await db.query(`SELECT * FROM gp_moi_admin_master WHERE username = ? AND password = ?`, [username, password]);
        return result[0];
    },
    async moiUsers() {
        const [result] = await db.query(`SELECT * FROM gp_moi_user_master`);
        return result;
    },
    async moiUserList() {
        const [result] = await db.query(`SELECT * FROM gp_moi_master_records`);
        return result;
    },
    async moiUserListId(userId) {
        const [result] = await db.query(`SELECT * FROM gp_moi_master_records WHERE mr_um_id = ?`, [userId]);
        return result;
    },
    async moiUserFunction() {
        const [result] = await db.query(`SELECT * FROM gp_moi_functions`, []);
        return result;
    },
    async moiFunctionsUserId(userId) {
        const [result] = await db.query(`SELECT * FROM gp_moi_functions WHERE f_um_id = ?`, [userId]);
        return result;
    },
    async feedbacks() {
        const [result] = await db.query(`SELECT * FROM gp_moi_feedbacks`, []);
        return result;
    },
    async moiOutAll() {
        const [result] = await db.query(`SELECT * FROM gp_moi_out_master`, []);
        return result;
    },
    async moiOutAllUser(user) {
        const [result] = await db.query(`SELECT * FROM gp_moi_out_master WHERE mom_user_id = ?`, [user]);
        return result;
    },


}
module.exports = Model;
