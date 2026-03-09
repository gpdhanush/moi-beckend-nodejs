const db = require('../config/database');
const { toBinaryUUID } = require('../helpers/uuid');

const Model = {

    async totalAmount(userId) {
        const userIdBin = toBinaryUUID(userId);
        
        const [data] = await db.query(`
            SELECT 
                IFNULL(SUM(CASE WHEN type = 'INVEST' THEN amount ELSE 0 END), 0) AS invest_amount,
                IFNULL(SUM(CASE WHEN type = 'RETURN' THEN amount ELSE 0 END), 0) AS return_amount,
                -- item_type column was removed; treat transactions with a non-empty item_name as "things"
                IFNULL(SUM(CASE WHEN type = 'INVEST' AND item_name IS NOT NULL AND TRIM(item_name) <> '' THEN 1 ELSE 0 END), 0) AS invest_things,
                IFNULL(SUM(CASE WHEN type = 'RETURN' AND item_name IS NOT NULL AND TRIM(item_name) <> '' THEN 1 ELSE 0 END), 0) AS return_things,
                (SELECT COUNT(DISTINCT person_id) FROM transactions WHERE user_id = ? AND is_deleted = 0) AS total_members,
                (SELECT COUNT(DISTINCT person_id) FROM transactions WHERE user_id = ? AND type = 'INVEST' AND is_deleted = 0) AS invest_members,
                (SELECT COUNT(DISTINCT person_id) FROM transactions WHERE user_id = ? AND type = 'RETURN' AND is_deleted = 0) AS return_members
            FROM transactions
            WHERE user_id = ? AND is_deleted = 0
        `, [userIdBin, userIdBin, userIdBin, userIdBin]);
        
        return data;
    },

}
module.exports = Model;
