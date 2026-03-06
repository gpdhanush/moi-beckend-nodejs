const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const AdminModel = {
    /**
     * Find admin by email
     */
    async findByEmail(email) {
        const [rows] = await db.query(
            `SELECT * FROM admins WHERE email = ? AND is_deleted = 0`,
            [email]
        );
        if (rows[0]) {
            return {
                ...rows[0],
                id: fromBinaryUUID(rows[0].id)
            };
        }
        return null;
    },

    /**
     * Find admin by ID
     */
    async findById(id) {
        const [rows] = await db.query(
            `SELECT * FROM admins WHERE id = ? AND is_deleted = 0`,
            [toBinaryUUID(id)]
        );
        if (rows[0]) {
            return {
                ...rows[0],
                id: fromBinaryUUID(rows[0].id)
            };
        }
        return null;
    },

    /**
     * Find admin including deleted
     */
    async findByIdIncludingDeleted(id) {
        const [rows] = await db.query(
            `SELECT * FROM admins WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        if (rows[0]) {
            return {
                ...rows[0],
                id: fromBinaryUUID(rows[0].id)
            };
        }
        return null;
    },

    /**
     * Create new admin
     */
    async create(payload) {
        const id = generateUUID();
        const { full_name, email, mobile, password_hash } = payload;
        
        const [result] = await db.query(
            `INSERT INTO admins (id, full_name, email, mobile, password_hash, status)
             VALUES (?, ?, ?, ?, ?, 'ACTIVE')`,
            [toBinaryUUID(id), full_name, email, mobile || null, password_hash]
        );
        
        return { insertId: id, affectedRows: result.affectedRows };
    },

    /**
     * Update admin details
     */
    async update(payload) {
        const { id, full_name, email, mobile, status } = payload;
        
        const [result] = await db.query(
            `UPDATE admins 
             SET full_name = ?, email = ?, mobile = ?, status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND is_deleted = 0`,
            [full_name, email, mobile || null, status, toBinaryUUID(id)]
        );
        
        return result;
    },

    /**
     * Update password and clear password_changed_at
     */
    async updatePassword(id, hashedPassword) {
        const [result] = await db.query(
            `UPDATE admins 
             SET password_hash = ?, password_changed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND is_deleted = 0`,
            [hashedPassword, toBinaryUUID(id)]
        );
        
        return result;
    },

    /**
     * Get login block status
     */
    async getLoginBlockStatus(id) {
        const [rows] = await db.query(
            `SELECT id, failed_login_attempts, locked_until, CURRENT_TIMESTAMP as now
             FROM admins WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        
        if (!rows[0]) return { is_blocked: false };
        
        const admin = rows[0];
        const now = new Date();
        const lockedUntil = admin.locked_until ? new Date(admin.locked_until) : null;
        
        return {
            is_blocked: lockedUntil && now < lockedUntil,
            blocked_until: lockedUntil
        };
    },

    /**
     * Increment failed login attempts
     */
    async incrementFailedLoginAttempts(id) {
        const [rows] = await db.query(
            `SELECT failed_login_attempts FROM admins WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        
        if (!rows[0]) return { blocked: false };
        
        const attempts = rows[0].failed_login_attempts + 1;
        let blockedUntil = null;
        
        // Block after 5 failed attempts for 15 minutes
        if (attempts >= 5) {
            blockedUntil = new Date(Date.now() + 15 * 60 * 1000);
        }
        
        await db.query(
            `UPDATE admins 
             SET failed_login_attempts = ?, locked_until = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [attempts, blockedUntil, toBinaryUUID(id)]
        );
        
        return {
            blocked: attempts >= 5,
            attempts,
            remaining_attempts: Math.max(0, 5 - attempts),
            blocked_until: blockedUntil
        };
    },

    /**
     * Reset failed login attempts
     */
    async resetFailedLoginAttempts(id) {
        const [result] = await db.query(
            `UPDATE admins 
             SET failed_login_attempts = 0, locked_until = NULL, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        
        return result;
    },

    /**
     * Update last login timestamp
     */
    async updateLastLogin(id) {
        const [result] = await db.query(
            `UPDATE admins 
             SET last_login_at = CURRENT_TIMESTAMP, last_activity_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        
        return result;
    },

    /**
     * Soft delete admin
     */
    async softDelete(id) {
        const [result] = await db.query(
            `UPDATE admins 
             SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND is_deleted = 0`,
            [toBinaryUUID(id)]
        );
        
        return result;
    },

    /**
     * Restore deleted admin
     */
    async restore(id) {
        const [result] = await db.query(
            `UPDATE admins 
             SET is_deleted = 0, deleted_at = NULL, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(id)]
        );
        
        return result;
    },

    /**
     * Get all admins (paginated)
     */
    async getAllAdmins(limit = 50, offset = 0) {
        const [rows] = await db.query(
            `SELECT id, full_name, email, mobile, status, last_login_at, created_at
             FROM admins
             WHERE is_deleted = 0
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        return rows.map(r => ({
            ...r,
            id: fromBinaryUUID(r.id)
        }));
    },

    /**
     * Get admin count
     */
    async getAdminCount() {
        const [rows] = await db.query(
            `SELECT COUNT(*) as total FROM admins WHERE is_deleted = 0`
        );
        
        return rows[0].total || 0;
    },

    /**
     * Update admin status
     */
    async updateStatus(id, status) {
        const validStatuses = ['ACTIVE', 'INACTIVE', 'BLOCKED'];
        if (!validStatuses.includes(status)) return null;
        
        const [result] = await db.query(
            `UPDATE admins 
             SET status = ?, updated_at = CURRENT_TIMESTAMP
             WHERE id = ? AND is_deleted = 0`,
            [status, toBinaryUUID(id)]
        );
        
        return result;
    }
};

module.exports = AdminModel;
