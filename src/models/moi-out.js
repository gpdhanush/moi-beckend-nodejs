const db = require('../config/database');
const table = "gp_moi_out_master";

const Model = {
    async create(list) {
        const [result] = await db.query(`INSERT INTO ${table} 
            (mom_user_id, mom_first_name, mom_second_name, mom_city, mom_function_date, mom_function_name, mom_amount, mom_remarks, seimurai, things) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [list.userId, list.firstName, list.secondName, list.city, list.functionDate, list.functionName, list.amount, list.remarks, list.seimurai || null, list.things || null]);
        return result;
    },


    async readAll(userId) {
        const [result] = await db.query(`SELECT * FROM ${table} WHERE mom_user_id =? ORDER BY mom_id DESC`, [userId]);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE mom_id =? `, [id]);
        return rows[0];
    },
    async update(list) {
        const [result] = await db.query(`UPDATE ${table} 
            SET mom_first_name = ?, mom_second_name = ?, mom_city = ?, mom_function_date = ?, mom_function_name = ?, mom_amount = ?, mom_remarks = ?, seimurai = ?, things = ? WHERE mom_id = ?`,
            [list.firstName, list.secondName, list.city, list.functionDate, list.functionName, list.amount, list.remarks, list.seimurai || null, list.things || null, list.id]);
        return result;
    },
    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE mom_id=?`, [id]);
        return result;
    },
}
module.exports = Model;
