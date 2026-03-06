const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const table = "persons";

const Model = {
    async create(data) {
        const id = data.id || generateUUID();
        const [result] = await db.query(`INSERT INTO ${table} 
            (id, user_id, first_name, last_name, mobile, city, occupation) 
            VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [toBinaryUUID(id), toBinaryUUID(data.userId), data.firstName, data.lastName || data.secondName || null, 
             data.mobile || null, data.city || null, data.occupation || data.business || null]);
        return { insertId: id, affectedRows: result.affectedRows };
    },

    async readAll(userId, search = null) {
        let query = `SELECT id, user_id, first_name, last_name, mobile, city, occupation, created_at, updated_at FROM ${table} 
            WHERE user_id = ?`;
        const params = [toBinaryUUID(userId)];

        if (search) {
            query += ` AND (first_name LIKE ? OR last_name LIKE ? OR city LIKE ? OR mobile LIKE ?)`;
            const searchTerm = `%${search}%`;
            params.push(searchTerm, searchTerm, searchTerm, searchTerm);
        }

        query += ` ORDER BY first_name ASC, last_name ASC`;
        
        const [result] = await db.query(query, params);
        return result.map(r => mapPersonRow(r));
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE id = ?`, [toBinaryUUID(id)]);
        if (!rows[0]) return null;
        return mapPersonRow(rows[0]);
    },

    async findByMobile(userId, mobile) {
        const [rows] = await db.query(`SELECT * FROM ${table} 
            WHERE user_id = ? AND mobile = ?`, [toBinaryUUID(userId), mobile]);
        if (!rows[0]) return null;
        return mapPersonRow(rows[0]);
    },

    async findDuplicate(userId, firstName, lastName, occupation, city, mobile) {
        let query = `SELECT * FROM ${table} 
            WHERE user_id = ? AND first_name = ?`;
        const params = [toBinaryUUID(userId), firstName];

        // Add conditions for other fields
        if (lastName) {
            query += ` AND last_name = ?`;
            params.push(lastName);
        } else {
            query += ` AND (last_name IS NULL OR last_name = '')`;
        }

        if (occupation) {
            query += ` AND occupation = ?`;
            params.push(occupation);
        } else {
            query += ` AND (occupation IS NULL OR occupation = '')`;
        }

        if (city) {
            query += ` AND city = ?`;
            params.push(city);
        } else {
            query += ` AND (city IS NULL OR city = '')`;
        }

        if (mobile) {
            query += ` AND mobile = ?`;
            params.push(mobile);
        } else {
            query += ` AND (mobile IS NULL OR mobile = '')`;
        }

        const [rows] = await db.query(query, params);
        if (!rows[0]) return null;
        return mapPersonRow(rows[0]);
    },

    async update(data) {
        const [result] = await db.query(`UPDATE ${table} 
            SET first_name = ?, last_name = ?, 
                occupation = ?, city = ?, mobile = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
            [data.firstName, data.lastName || data.secondName || null, 
             data.occupation || data.business || null, data.city || null, data.mobile || null, toBinaryUUID(data.id)]);
        return result;
    },

    async delete(id) {
        // Hard delete (persons table doesn't have is_deleted column)
        const [result] = await db.query(`DELETE FROM ${table} WHERE id = ?`, [toBinaryUUID(id)]);
        return result;
    },

    async getPersonDetails(userId) {
        const [rows] = await db.query(`SELECT * FROM ${table} 
            WHERE user_id = ?
            ORDER BY created_at DESC LIMIT 1`, [toBinaryUUID(userId)]);
        if (!rows[0]) return null;
        return mapPersonRow(rows[0]);
    }
};

function mapPersonRow(r) {
    const id = fromBinaryUUID(r.id);
    const userId = fromBinaryUUID(r.user_id);
    return {
        id,
        mp_id: id, // for backward compatibility
        user_id: userId,
        mp_um_id: userId, // for backward compatibility
        first_name: r.first_name,
        mp_first_name: r.first_name, // for backward compatibility
        last_name: r.last_name,
        mp_second_name: r.last_name, // for backward compatibility
        mobile: r.mobile,
        mp_mobile: r.mobile, // for backward compatibility
        city: r.city,
        mp_city: r.city, // for backward compatibility
        occupation: r.occupation,
        mp_business: r.occupation, // for backward compatibility
        created_at: r.created_at,
        mp_create_dt: r.created_at, // for backward compatibility
        updated_at: r.updated_at,
        mp_update_dt: r.updated_at, // for backward compatibility
        is_deleted: r.is_deleted || 0,
        mp_active: (r.is_deleted === 0 || r.is_deleted === null) ? 'Y' : 'N' // for backward compatibility
    };
}

module.exports = Model;
