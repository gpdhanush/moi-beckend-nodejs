const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const table = 'default_functions';

const Model = {
    async create(name) {
        const id = generateUUID();
        const [result] = await db.query(
            `INSERT INTO ${table} (id, name) VALUES (?, ?)`,
            [toBinaryUUID(id), name]
        );
        return { insertId: id };
    },

    // Read all global default functions
    async readAll() {
        const [rows] = await db.query(
            `SELECT * FROM ${table} WHERE is_deleted = 0 ORDER BY name ASC`
        );
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            name: r.name,
            isDeleted: r.is_deleted,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    async readById(id) {
        const [rows] = await db.query(`SELECT * FROM ${table} WHERE id = ? AND is_deleted = 0`, [toBinaryUUID(id)]);
        if (rows.length === 0) return null;
        const r = rows[0];
        return {
            id: fromBinaryUUID(r.id),
            name: r.name,
            isDeleted: r.is_deleted,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        };
    },

    async update(id, name) {
        const [result] = await db.query(`UPDATE ${table} SET name = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`, [name, toBinaryUUID(id)]);
        return result.affectedRows > 0;
    },

    async delete(id) {
        const [result] = await db.query(`UPDATE ${table} SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?`, [toBinaryUUID(id)]);
        return result.affectedRows > 0;
    }
};

module.exports = Model;
