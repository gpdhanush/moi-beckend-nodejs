const db = require('../config/database');
const table = "gp_moi_upcoming_functions";

// Helper function to determine status based on date
const getStatusFromDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const functionDate = new Date(date);
    functionDate.setHours(0, 0, 0, 0);
    return functionDate < today ? 'completed' : null;
};

const Model = {
    async create(list) {
        const status = getStatusFromDate(list.date);
        const [result] = await db.query(`INSERT INTO ${table} (uf_user_id, uf_date, uf_name, uf_place, uf_invitation_url, status) VALUES (?, ?, ?, ?, ?, ?)`,
            [list.userId, list.date, list.functionName, list.place, list.invitationUrl, status]);
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
        // Calculate status based on the new date
        const status = getStatusFromDate(list.date);
        const [result] = await db.query(`UPDATE ${table} SET uf_date = ?, uf_name = ?, uf_place = ?, uf_invitation_url = ?, status = ? WHERE uf_id = ?`,
            [list.date, list.functionName, list.place, list.invitationUrl, status, list.id]);
        return result;
    },
    async updateStatus(id, status) {
        const [result] = await db.query(`UPDATE ${table} SET status = ? WHERE uf_id = ?`, [status, id]);
        return result;
    },
    async updateStatusByDate() {
        // Update all records where date has passed to 'completed'
        const [result] = await db.query(`UPDATE ${table} SET status = 'completed' WHERE uf_date < CURDATE() AND (status IS NULL OR status = '')`);
        return result;
    },
    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE uf_id=?`, [id]);
        return result;
    },
}
module.exports = Model;
