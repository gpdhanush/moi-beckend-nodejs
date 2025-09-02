const db = require('../config/database');

const Model = {

    async insert(id, url) {
        const [result] = await db.query(`INSERT INTO gp_moi_uploads (user_id, upload_url) VALUES (?, ?)`, [id, url]);
        return result;
    },

    async getUrl(id, url) {
        const [result] = await db.query(`SELECT * FROM gp_moi_uploads WHERE user_id = ?`, [id]);
        return result[0];
    },
    
}
module.exports = Model;
