const db = require('../config/database');

const Model = {
    async saveOtp(otp, expire, email) {
        const [result] = await db.query(`UPDATE gp_moi_user_master SET um_otp = ?, um_otp_exp = ? WHERE um_email=?`,
            [otp, expire, email]
        );
        return result;
    },

}
module.exports = Model;
