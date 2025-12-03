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
        const [result] = await db.query(`
            SELECT 
                f.*,
                f.user_id as userID,
                u.um_full_name as userName
            FROM gp_moi_feedbacks f
            LEFT JOIN gp_moi_user_master u ON f.user_id = u.um_id
            ORDER BY f.created_time DESC
        `, []);
        return result;
    },
    async getFeedbackById(feedbackId) {
        const [result] = await db.query(`SELECT * FROM gp_moi_feedbacks WHERE id = ?`, [feedbackId]);
        return result[0];
    },
    async updateFeedbackReply(feedbackId, reply) {
        const [result] = await db.query(`UPDATE gp_moi_feedbacks SET reply = ?, updated_time = CURRENT_TIMESTAMP WHERE id = ?`, [reply, feedbackId]);
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
    async getMoiUserById(userId) {
        const [result] = await db.query(`SELECT * FROM gp_moi_user_master WHERE um_id = ?`, [userId]);
        return result[0];
    },
    async updateMoiUser(userId, updateData) {
        const fields = [];
        const values = [];
        
        if (updateData.um_full_name !== undefined) {
            fields.push('um_full_name = ?');
            values.push(updateData.um_full_name);
        }
        if (updateData.um_mobile !== undefined) {
            fields.push('um_mobile = ?');
            values.push(updateData.um_mobile);
        }
        if (updateData.um_email !== undefined) {
            fields.push('um_email = ?');
            values.push(updateData.um_email);
        }
        if (updateData.um_profile_image !== undefined) {
            fields.push('um_profile_image = ?');
            values.push(updateData.um_profile_image);
        }
        if (updateData.um_status !== undefined) {
            fields.push('um_status = ?');
            values.push(updateData.um_status);
        }
        
        if (fields.length === 0) {
            throw new Error('No fields to update');
        }
        
        fields.push('um_update_dt = CURRENT_TIMESTAMP');
        values.push(userId);
        
        const query = `UPDATE gp_moi_user_master SET ${fields.join(', ')} WHERE um_id = ?`;
        const [result] = await db.query(query, values);
        return result;
    },
    async deleteMoiUser(userId) {
        const [result] = await db.query(`DELETE FROM gp_moi_user_master WHERE um_id = ?`, [userId]);
        return result;
    },


}
module.exports = Model;
