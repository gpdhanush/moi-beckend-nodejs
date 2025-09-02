const db = require('../config/database');

const Model = {

    async readAllPayment() {
        const [result] = await db.query(`SELECT * FROM gp_moi_default_payment WHERE dp_active = 'Y' ORDER BY dp_mode ASC`);
        return result;
    },
    async totalAmount(userId) {
        const [result] = await db.query(`SELECT 
        IFNULL((SELECT SUM(mom_amount) FROM gp_moi_out_master WHERE mom_user_id = ?), 0) AS moi_out_total,
        IFNULL((SELECT SUM(mr_amount) FROM gp_moi_master_records WHERE mr_um_id = ?), 0) AS moi_total`, [userId, userId]);
        return result;
    },

}
module.exports = Model;
