const db = require('../config/database');
const table = "gp_moi_master_records";

const Model = {
    async create(list) {
        const [result] = await db.query(`INSERT INTO ${table} 
            (mr_um_id, mr_function_id, mr_city_id, mr_first_name, mr_second_name, mr_amount, mr_occupation, mr_remarks, seimurai, things) VALUES 
            (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [list.userId, list.function, list.city, list.firstName, list.secondName, list.amount, list.occupation, list.remarks, list.seimurai || null, list.things || null]);
        return result;
    },


    async readAll(userId) {
        const [result] = await db.query(`SELECT mm.*, 
            mf.function_name as 'functionName', mf.function_date as 'functionDate', 
            mf.first_name as 'f_firstName', mf.second_name as 'f_secondName',
            mf.place as 'f_place', mf.native_place as 'f_native',
            mf.invitation_photo as 'f_invitation'
            FROM gp_moi_master_records as mm
            LEFT JOIN gp_moi_functions as mf ON mf.f_id = mr_function_id
            WHERE mr_um_id = ? AND mr_active = 'Y' ORDER BY mr_id DESC`, [userId]);
        return result;
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE mr_id =? `, [id]);
        return rows[0];
    },
    async update(list) {
        const [result] = await db.query(`UPDATE ${table} 
            SET mr_function_id = ?, mr_city_id = ?, mr_first_name = ?, mr_second_name = ?, mr_amount = ?, mr_occupation = ?, mr_remarks = ?, seimurai = ?, things = ? WHERE mr_id = ?`,
            [list.function, list.city, list.firstName, list.secondName, list.amount, list.occupation, list.remarks, list.seimurai || null, list.things || null, list.id]);
        return result;
    },
    async delete(id) {
        const [result] = await db.query(`DELETE FROM ${table} WHERE mr_id=?`, [id]);
        return result;
    },
}
module.exports = Model;
