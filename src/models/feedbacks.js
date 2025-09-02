const db = require('../config/database');
const table = "gp_moi_feedbacks";

const Model = {
    async create(list) {
        const [result] = await db.query(`INSERT INTO ${table} (user_id, feedbacks) VALUES (?, ?)`, [list.userId, list.feedbacks]);
        return result;
    },
}
module.exports = Model;
