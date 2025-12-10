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
    async getDashboard(userId) {
        // Get all INVEST transactions (from gp_moi_master_records) with function owner details
        const [investTransactions] = await db.query(`
            SELECT 
                mr.mr_id as id,
                mr.mr_um_id as userId,
                mr.mr_first_name as personFirstName,
                mr.mr_second_name as personSecondName,
                mr.mr_city_id as personCity,
                mr.mr_occupation as personBusiness,
                mr.mr_amount as amount,
                mr.mr_remarks as remarks,
                mr.mr_create_dt as createDate,
                COALESCE(mr.seimurai, 'Money') as mode,
                mf.function_name as functionName,
                mf.function_date as functionDate,
                mf.first_name as functionFirstName,
                mf.second_name as functionSecondName,
                mf.place as functionCity,
                um.um_mobile as userMobile
            FROM gp_moi_master_records mr
            LEFT JOIN gp_moi_functions mf ON mf.f_id = mr.mr_function_id
            LEFT JOIN gp_moi_user_master um ON um.um_id = mr.mr_um_id
            WHERE mr.mr_um_id = ? AND mr.mr_active = 'Y'
            ORDER BY mr.mr_create_dt DESC
        `, [userId]);

        // Get all RETURN transactions (from gp_moi_out_master) 
        const [returnTransactions] = await db.query(`
            SELECT 
                mom.mom_id as id,
                mom.mom_user_id as userId,
                mom.mom_first_name as personFirstName,
                mom.mom_second_name as personSecondName,
                mom.mom_city as personCity,
                '' as personBusiness,
                mom.mom_amount as amount,
                mom.mom_remarks as remarks,
                mom.mom_create_dt as createDate,
                COALESCE(mom.seimurai, 'Money') as mode,
                mom.mom_function_name as functionName,
                mom.mom_function_date as functionDate,
                um.um_full_name as userFullName,
                um.um_mobile as userMobile
            FROM gp_moi_out_master mom
            LEFT JOIN gp_moi_user_master um ON um.um_id = mom.mom_user_id
            WHERE mom.mom_user_id = ? AND mom.mom_status = 'Y'
            ORDER BY mom.mom_create_dt DESC
        `, [userId]);

        return {
            investTransactions,
            returnTransactions
        };
    },
}
module.exports = Model;
