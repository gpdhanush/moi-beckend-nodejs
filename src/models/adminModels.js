const db = require('../config/database');
const { toBinaryUUID, fromBinaryUUID, generateUUID } = require('../helpers/uuid');
const bcrypt = require('bcryptjs');

/**
 * LOGIN SECURITY FEATURE STATUS for ADMINS
 * ========================================
 * CURRENT: Enabled (database columns exist)
 * FEATURE: Block account after 3 failed login attempts for 15 minutes
 * COLUMNS IN admins: failed_login_attempts, locked_until
 * PASSWORD RESET: Uses token-based approach (reset_token, reset_token_expires_at)
 */

const Model = {
    async login(emailOrMobile, password) {
        const [rows] = await db.query(
            `SELECT id, full_name, email, mobile, password_hash, status,
                    last_login_at, last_activity_at, is_deleted, failed_login_attempts, locked_until
             FROM admins
             WHERE (email = ? OR mobile = ?) AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [emailOrMobile, emailOrMobile]
        );
        const admin = rows[0];
        if (!admin || !password) return null;
        
        // Check if admin is currently blocked (login attempt limit exceeded)
        const blockStatus = await this.getLoginBlockStatus(fromBinaryUUID(admin.id));
        if (blockStatus.is_blocked) {
            return null; // Return null so controller can handle block response
        }
        
        const valid = await bcrypt.compare(password, admin.password_hash);
        if (!valid) {
            // Increment failed login attempts
            await this.incrementFailedLoginAttempts(fromBinaryUUID(admin.id));
            return null;
        }
        
        // Reset failed attempts on successful login
        await this.resetFailedLoginAttempts(fromBinaryUUID(admin.id));
        
        // Update last login timestamp
        await db.query(
            `UPDATE admins SET last_login_at = CURRENT_TIMESTAMP, last_activity_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [admin.id]
        );
        
        return {
            id: fromBinaryUUID(admin.id),
            username: admin.full_name,
            full_name: admin.full_name,
            email: admin.email,
            mobile: admin.mobile
        };
    },

    /**
     * Increment failed login attempts and block if >= 3
     * Returns: { blocked: boolean, remaining_attempts: number, blocked_until: Date }
     */
    async incrementFailedLoginAttempts(adminId) {
        const MAX_ATTEMPTS = 3;
        const BLOCK_DURATION_MINUTES = 15;
        
        const idBin = toBinaryUUID(adminId);
        const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
        
        const [result] = await db.query(
            `UPDATE admins 
             SET failed_login_attempts = failed_login_attempts + 1,
                 locked_until = CASE 
                    WHEN failed_login_attempts + 1 >= ? THEN ?
                    ELSE locked_until
                 END
             WHERE id = ?`,
            [MAX_ATTEMPTS, blockedUntil, idBin]
        );
        
        // Fetch updated credentials to return current status
        const [rows] = await db.query(
            `SELECT failed_login_attempts, locked_until FROM admins WHERE id = ?`,
            [idBin]
        );
        
        const creds = rows[0];
        const blocked = creds.failed_login_attempts >= MAX_ATTEMPTS;
        const remainingAttempts = Math.max(0, MAX_ATTEMPTS - creds.failed_login_attempts);
        
        return {
            blocked,
            remaining_attempts: remainingAttempts,
            blocked_until: creds.locked_until,
            attempts: creds.failed_login_attempts
        };
    },

    /**
     * Reset failed login attempts after successful login
     */
    async resetFailedLoginAttempts(adminId) {
        const [result] = await db.query(
            `UPDATE admins 
             SET failed_login_attempts = 0, locked_until = NULL
             WHERE id = ?`,
            [toBinaryUUID(adminId)]
        );
        return result;
    },

    /**
     * Check if admin is currently blocked and if block has expired
     * Returns: { is_blocked: boolean, blocked_until: Date }
     */
    async getLoginBlockStatus(adminId) {
        const [rows] = await db.query(
            `SELECT locked_until FROM admins WHERE id = ?`,
            [toBinaryUUID(adminId)]
        );
        
        if (!rows[0]) return { is_blocked: false, blocked_until: null };
        
        const lockedUntil = rows[0].locked_until;
        const now = new Date();
        
        // If locked_until is in the past, the block has expired
        if (lockedUntil && lockedUntil > now) {
            return { is_blocked: true, blocked_until: lockedUntil };
        }
        
        // Block has expired, clear it
        if (lockedUntil && lockedUntil <= now) {
            await db.query(
                `UPDATE admins SET locked_until = NULL, failed_login_attempts = 0 WHERE id = ?`,
                [toBinaryUUID(adminId)]
            );
        }
        
        return { is_blocked: false, blocked_until: null };
    },

    /**
     * Create a new admin user
     */
    async createAdmin(payload) {
        const id = payload.id || generateUUID();
        const { full_name, email, mobile, password } = payload;
        const now = new Date();
        const idBin = toBinaryUUID(id);
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.query(
            `INSERT INTO admins (id, full_name, email, mobile, password_hash, password_changed_at, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
            [idBin, full_name, email, mobile || null, hashedPassword, now, now, now]
        );

        return { insertId: id };
    },

    /**
     * Find admin by ID (active only)
     */
    async findById(adminId) {
        const [rows] = await db.query(
            `SELECT id, full_name, email, mobile, status, email_verified_at,
                    failed_login_attempts, locked_until, last_login_at, last_activity_at,
                    is_deleted, deleted_at, created_at, updated_at
             FROM admins
             WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(adminId)]
        );
        const r = rows[0];
        if (!r) return null;
        return {
            id: fromBinaryUUID(r.id),
            full_name: r.full_name,
            email: r.email,
            mobile: r.mobile,
            status: r.status,
            email_verified_at: r.email_verified_at,
            failed_login_attempts: r.failed_login_attempts,
            locked_until: r.locked_until,
            last_login_at: r.last_login_at,
            last_activity_at: r.last_activity_at,
            created_at: r.created_at,
            updated_at: r.updated_at
        };
    },

    /**
     * Find admin by email or mobile (active only)
     */
    async findByEmailOrMobile(email, mobile) {
        const [rows] = await db.query(
            `SELECT id FROM admins 
             WHERE (email = ? OR mobile = ?) AND (is_deleted = 0 OR is_deleted IS NULL) LIMIT 1`,
            [email, mobile]
        );
        return rows[0] ? { id: fromBinaryUUID(rows[0].id) } : null;
    },

    /**
     * Update admin profile
     */
    async updateAdmin(adminId, updateData) {
        const { full_name, email, mobile, status } = updateData;
        const fields = [];
        const values = [];

        if (full_name !== undefined) {
            fields.push('full_name = ?');
            values.push(full_name);
        }
        if (email !== undefined) {
            fields.push('email = ?');
            values.push(email);
        }
        if (mobile !== undefined) {
            fields.push('mobile = ?');
            values.push(mobile);
        }
        if (status !== undefined) {
            fields.push('status = ?');
            values.push(status);
        }

        if (fields.length === 0) return null;

        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(toBinaryUUID(adminId));

        const [result] = await db.query(
            `UPDATE admins SET ${fields.join(', ')} WHERE id = ?`,
            values
        );

        return result;
    },

    /**
     * Update admin password
     */
    async updateAdminPassword(adminId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        const [result] = await db.query(
            `UPDATE admins SET password_hash = ?, password_changed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [hashedPassword, toBinaryUUID(adminId)]
        );
        return result;
    },

    /**
     * Soft delete admin
     */
    async deleteAdmin(adminId) {
        const [result] = await db.query(
            `UPDATE admins SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, status = 'INACTIVE', updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(adminId)]
        );
        return result;
    },

    /**
     * Get admin block status from stored details
     */
    async getAdminBlockStatus(adminId) {
        const [rows] = await db.query(
            `SELECT locked_until FROM admins WHERE id = ?`,
            [toBinaryUUID(adminId)]
        );
        if (!rows[0]) return { is_blocked: false, blocked_until: null };
        const lockedUntil = rows[0].locked_until;
        const now = new Date();
        if (lockedUntil && lockedUntil > now) {
            return { is_blocked: true, blocked_until: lockedUntil };
        }
        if (lockedUntil && lockedUntil <= now) {
            await db.query(
                `UPDATE admins SET locked_until = NULL, failed_login_attempts = 0 WHERE id = ?`,
                [toBinaryUUID(adminId)]
            );
        }
        return { is_blocked: false, blocked_until: null };
    },

    // ==================== USER MANAGEMENT (ADMIN FUNCTIONS) ====================

    async moiUsers() {
        const [result] = await db.query(
            `SELECT 
                u.id, 
                u.full_name, 
                u.email, 
                u.mobile, 
                u.referral_code,
                u.status, 
                u.is_verified,
                u.email_verified_at,
                u.last_activity_at,
                u.created_at, 
                u.updated_at,
                -- user_credentials (excluding password_hash)
                uc.password_changed_at,
                uc.failed_login_attempts,
                uc.login_blocked_until,
                -- user_profiles
                up.gender,
                up.date_of_birth,
                up.profile_image_url,
                up.address_line1,
                up.address_line2,
                up.city,
                up.state,
                up.country,
                up.postal_code,
                -- user_devices (most recent device)
                ud.device_name,
                ud.device_id,
                ud.brand,
                ud.manufacturer,
                ud.model,
                ud.ram_size,
                ud.android_version,
                ud.is_active as device_is_active,
                ud.last_used_at as device_last_used_at
             FROM users u
             LEFT JOIN user_credentials uc ON u.id = uc.user_id
             LEFT JOIN user_profiles up ON u.id = up.user_id
             LEFT JOIN (
                 SELECT 
                     user_id,
                     device_name,
                     device_id,
                     brand,
                     manufacturer,
                     model,
                     ram_size,
                     android_version,
                     is_active,
                     last_used_at,
                     ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY last_used_at DESC, created_at DESC) as rn
                 FROM user_devices
                
             ) ud ON u.id = ud.user_id AND ud.rn = 1
             ORDER BY u.created_at DESC`
        );
        return result.map(r => ({ ...r, id: fromBinaryUUID(r.id) }));
    },

    async moiUserList() {
        const [result] = await db.query(
            `SELECT 
                u.id, 
                u.full_name, 
                u.email, 
                u.mobile, 
                u.referral_code,
                u.status, 
                u.is_verified,
                u.email_verified_at,
                u.last_activity_at,
                u.created_at,
                -- user_credentials (excluding password_hash)
                uc.password_changed_at,
                uc.failed_login_attempts,
                uc.login_blocked_until,
                -- user_profiles (all fields)
                up.gender,
                up.date_of_birth,
                up.profile_image_url,
                up.address_line1,
                up.address_line2,
                up.city,
                up.state,
                up.country,
                up.postal_code,
                -- user_devices (most recent device)
                ud.device_name,
                ud.brand,
                ud.model,
                ud.is_active as device_is_active,
                ud.last_used_at as device_last_used_at
             FROM users u
             LEFT JOIN user_credentials uc ON u.id = uc.user_id
             LEFT JOIN user_profiles up ON u.id = up.user_id
             LEFT JOIN (
                 SELECT 
                     user_id,
                     device_name,
                     brand,
                     model,
                     is_active,
                     last_used_at,
                     ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY last_used_at DESC, created_at DESC) as rn
                 FROM user_devices
                 
             ) ud ON u.id = ud.user_id AND ud.rn = 1
             ORDER BY u.created_at DESC`
        );
        return result.map(r => ({ ...r, id: fromBinaryUUID(r.id) }));
    },

    async moiUserListId(userId) {
        const [result] = await db.query(
            `SELECT 
                u.id, 
                u.full_name, 
                u.email, 
                u.mobile, 
                u.referral_code,
                u.status, 
                u.is_verified,
                u.email_verified_at,
                u.last_activity_at,
                u.created_at,
                u.updated_at,
                -- user_credentials (excluding password_hash)
                uc.password_changed_at,
                uc.failed_login_attempts,
                uc.login_blocked_until,
                -- user_profiles
                up.gender,
                up.date_of_birth,
                up.profile_image_url,
                up.address_line1,
                up.address_line2,
                up.city,
                up.state,
                up.country,
                up.postal_code,
                -- All user_devices (not just most recent)
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'device_name', ud.device_name,
                        'device_id', ud.device_id,
                        'brand', ud.brand,
                        'manufacturer', ud.manufacturer,
                        'model', ud.model,
                        'ram_size', ud.ram_size,
                        'android_version', ud.android_version,
                        'is_active', ud.is_active,
                        'last_used_at', ud.last_used_at,
                        'created_at', ud.created_at
                    )
                    ORDER BY ud.last_used_at DESC
                ) as devices
             FROM users u
             LEFT JOIN user_credentials uc ON u.id = uc.user_id
             LEFT JOIN user_profiles up ON u.id = up.user_id
             LEFT JOIN user_devices ud ON u.id = ud.user_id AND (ud.is_deleted = 0 OR ud.is_deleted IS NULL)
             WHERE u.id = ? AND (u.is_deleted = 0 OR u.is_deleted IS NULL)
             GROUP BY u.id, u.full_name, u.email, u.mobile, u.referral_code, u.status, 
                      u.is_verified, u.email_verified_at, u.last_activity_at, u.created_at, u.updated_at,
                      uc.password_changed_at, uc.failed_login_attempts, uc.login_blocked_until,
                      up.gender, up.date_of_birth, up.profile_image_url, up.address_line1, 
                      up.address_line2, up.city, up.state, up.country, up.postal_code`,
            [toBinaryUUID(userId)]
        );
        return result.map(r => ({ 
            ...r, 
            id: fromBinaryUUID(r.id),
            devices: r.devices ? JSON.parse(`[${r.devices}]`) : []
        }));
    },

    async moiUserFunction() {
        const [result] = await db.query(
            `SELECT tf.id, tf.user_id, tf.function_name, tf.function_date, tf.location, tf.notes, tf.created_at
             FROM transaction_functions tf
             WHERE (tf.is_deleted = 0 OR tf.is_deleted IS NULL)
             ORDER BY tf.function_date DESC, tf.created_at DESC`
        );
        return result.map(r => ({ ...r, id: fromBinaryUUID(r.id), user_id: fromBinaryUUID(r.user_id) }));
    },

    async moiFunctionsUserId(userId) {
        const [result] = await db.query(
            `SELECT tf.id, tf.user_id, tf.function_name, tf.function_date, tf.location, tf.notes, tf.created_at
             FROM transaction_functions tf
             WHERE tf.user_id = ? AND (tf.is_deleted = 0 OR tf.is_deleted IS NULL)
             ORDER BY tf.function_date DESC, tf.created_at DESC`,
            [toBinaryUUID(userId)]
        );
        return result.map(r => ({ ...r, id: fromBinaryUUID(r.id), user_id: fromBinaryUUID(r.user_id) }));
    },

    async feedbacks() {
        const [result] = await db.query(
            `SELECT f.id, f.user_id, f.type, f.subject, f.message, f.rating, f.admin_response, f.responded_at,
                    f.status, f.created_at AS created_time, u.full_name AS userName
             FROM feedbacks f
             LEFT JOIN users u ON u.id = f.user_id
             WHERE (f.is_deleted = 0 OR f.is_deleted IS NULL)
             ORDER BY f.created_at DESC`
        );
        return result.map(r => ({
            ...r,
            id: fromBinaryUUID(r.id),
            userID: fromBinaryUUID(r.user_id),
            user_id: fromBinaryUUID(r.user_id)
        }));
    },

    async getFeedbackById(feedbackId) {
        const [rows] = await db.query(
            `SELECT id, user_id, type, subject, message, rating, admin_response, responded_at, status, created_at
             FROM feedbacks WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(feedbackId)]
        );
        const r = rows[0];
        if (!r) return null;
        return { ...r, id: fromBinaryUUID(r.id), user_id: fromBinaryUUID(r.user_id) };
    },

    async updateFeedbackReply(feedbackId, reply) {
        const [result] = await db.query(
            `UPDATE feedbacks SET admin_response = ?, responded_at = CURRENT_TIMESTAMP, status = 'RESOLVED', updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [reply, toBinaryUUID(feedbackId)]
        );
        return result;
    },

    async moiOutAll() {
        const [result] = await db.query(
            `SELECT t.id, t.user_id, t.transaction_date, t.type, t.amount, t.notes
             FROM transactions t
             WHERE (t.is_deleted = 0 OR t.is_deleted IS NULL)
             ORDER BY t.transaction_date DESC, t.created_at DESC`
        );
        return result.map(r => ({ ...r, id: fromBinaryUUID(r.id), user_id: fromBinaryUUID(r.user_id) }));
    },

    async moiOutAllUser(userId) {
        const [result] = await db.query(
            `SELECT t.id, t.user_id, t.transaction_date, t.type, t.amount, t.notes
             FROM transactions t
             WHERE t.user_id = ? AND (t.is_deleted = 0 OR t.is_deleted IS NULL)
             ORDER BY t.transaction_date DESC, t.created_at DESC`,
            [toBinaryUUID(userId)]
        );
        return result.map(r => ({ ...r, id: fromBinaryUUID(r.id), user_id: fromBinaryUUID(r.user_id) }));
    },

    async getMoiUserById(userId) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name AS um_full_name, u.email AS um_email, u.mobile AS um_mobile,
                    u.status AS um_status, u.created_at AS um_create_dt, u.updated_at AS um_update_dt,
                    up.profile_image_url AS um_profile_image
             FROM users u
             LEFT JOIN user_profiles up ON up.user_id = u.id
             WHERE u.id = ? AND (u.is_deleted = 0 OR u.is_deleted IS NULL)`,
            [toBinaryUUID(userId)]
        );
        const r = rows[0];
        if (!r) return null;
        return { ...r, id: fromBinaryUUID(r.id) };
    },

    async updateMoiUser(userId, updateData) {
        const fields = [];
        const values = [];
        if (updateData.um_full_name !== undefined) {
            fields.push('full_name = ?');
            values.push(updateData.um_full_name);
        }
        if (updateData.um_mobile !== undefined) {
            fields.push('mobile = ?');
            values.push(updateData.um_mobile);
        }
        if (updateData.um_email !== undefined) {
            fields.push('email = ?');
            values.push(updateData.um_email);
        }
        if (updateData.um_profile_image !== undefined) {
            const [r] = await db.query(
                `UPDATE user_profiles SET profile_image_url = ? WHERE user_id = ?`,
                [updateData.um_profile_image, toBinaryUUID(userId)]
            );
            if (r.affectedRows) return r;
        }
        if (fields.length === 0 && updateData.um_profile_image === undefined) {
            throw new Error('No fields to update');
        }
        fields.push('updated_at = CURRENT_TIMESTAMP');
        values.push(toBinaryUUID(userId));
        const [result] = await db.query(
            `UPDATE users SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        return result;
    },

    async deleteMoiUser(userId) {
        // Soft delete: Set is_deleted flag instead of permanently removing the record
        const [result] = await db.query(
            `UPDATE users SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, status = 'DELETED' WHERE id = ?`, 
            [toBinaryUUID(userId)]
        );
        return result;
    },

    // ==================== ANALYTICS & DASHBOARD ====================

    /**
     * Get total user count (active and deleted)
     */
    async getTotalUserCount() {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total, 
                    SUM(CASE WHEN is_deleted = 0 OR is_deleted IS NULL THEN 1 ELSE 0 END) AS active,
                    SUM(CASE WHEN is_deleted = 1 THEN 1 ELSE 0 END) AS deleted
             FROM users`
        );
        return rows[0] || { total: 0, active: 0, deleted: 0 };
    },

    /**
     * Get total transaction count and amount
     */
    async getTransactionStats() {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total_transactions,
                    COUNT(DISTINCT user_id) AS users_with_transactions,
                    COUNT(DISTINCT person_id) AS total_persons,
                    SUM(CASE WHEN type = 'INVEST' THEN 1 ELSE 0 END) AS invest_count,
                    SUM(CASE WHEN type = 'RETURN' THEN 1 ELSE 0 END) AS return_count,
                    SUM(CASE WHEN amount IS NOT NULL THEN amount ELSE 0 END) AS total_money,
                    SUM(CASE WHEN item_name IS NOT NULL THEN 1 ELSE 0 END) AS total_items
             FROM transactions
             WHERE (is_deleted = 0 OR is_deleted IS NULL)`
        );
        return rows[0] || {};
    },

    /**
     * Get feedback statistics
     */
    async getFeedbackStats() {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total_feedbacks,
                    SUM(CASE WHEN status = 'OPEN' THEN 1 ELSE 0 END) AS open_count,
                    SUM(CASE WHEN status = 'IN_PROGRESS' THEN 1 ELSE 0 END) AS in_progress_count,
                    SUM(CASE WHEN status = 'RESOLVED' THEN 1 ELSE 0 END) AS resolved_count,
                    SUM(CASE WHEN status = 'REJECTED' THEN 1 ELSE 0 END) AS rejected_count,
                    SUM(CASE WHEN type = 'BUG' THEN 1 ELSE 0 END) AS bug_count,
                    SUM(CASE WHEN type = 'FEATURE' THEN 1 ELSE 0 END) AS feature_count,
                    SUM(CASE WHEN type = 'COMPLAINT' THEN 1 ELSE 0 END) AS complaint_count,
                    SUM(CASE WHEN type = 'GENERAL' THEN 1 ELSE 0 END) AS general_count,
                    COUNT(DISTINCT user_id) AS users_who_gave_feedback
             FROM feedbacks
             WHERE (is_deleted = 0 OR is_deleted IS NULL)`
        );
        return rows[0] || {};
    },

    /**
     * Get user verification statistics
     */
    async getVerificationStats() {
        const [rows] = await db.query(
            `SELECT COUNT(*) AS total_users,
                    SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) AS verified_users,
                    SUM(CASE WHEN is_verified = 0 THEN 1 ELSE 0 END) AS unverified_users,
                    ROUND(SUM(CASE WHEN is_verified = 1 THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) AS verification_percentage
             FROM users
             WHERE (is_deleted = 0 OR is_deleted IS NULL)`
        );
        return rows[0] || {};
    },

    /**
     * Get user registration trends (last 7 days)
     */
    async getRegistrationTrends() {
        const [rows] = await db.query(
            `SELECT DATE(created_at) AS date, COUNT(*) AS new_users
             FROM users
             WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
             GROUP BY DATE(created_at)
             ORDER BY date ASC`
        );
        return rows || [];
    },

    /**
     * Get referral statistics
     */
    async getReferralStats() {
        const [rows] = await db.query(
            `SELECT COUNT(DISTINCT referrer_user_id) AS total_referrers,
                    COUNT(*) AS total_referred,
                    AVG(referred_count) AS avg_referrals_per_user
             FROM (
                SELECT referrer_user_id, COUNT(*) AS referred_count
                FROM user_referrals
                GROUP BY referrer_user_id
             ) AS referral_stats`
        );
        return rows[0] || {};
    },

    /**
     * Get top referrers (by number of referrals)
     */
    async getTopReferrers(limit = 10) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, COUNT(ur.referred_user_id) AS referral_count
             FROM users u
             LEFT JOIN user_referrals ur ON u.id = ur.referrer_user_id
             WHERE (u.is_deleted = 0 OR u.is_deleted IS NULL)
             GROUP BY u.id
             ORDER BY referral_count DESC
             LIMIT ?`,
            [limit]
        );
        return rows.map(r => ({
            ...r,
            id: fromBinaryUUID(r.id)
        }));
    },

    /**
     * Get active user count (with last activity in last 7 days)
     */
    async getActiveUserCount() {
        const [rows] = await db.query(
            `SELECT COUNT(DISTINCT id) AS active_users_7d,
                    COUNT(DISTINCT CASE WHEN last_activity_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN id END) AS active_users_30d,
                    COUNT(DISTINCT CASE WHEN last_activity_at >= DATE_SUB(NOW(), INTERVAL 1 DAY) THEN id END) AS active_users_24h
             FROM users
             WHERE (is_deleted = 0 OR is_deleted IS NULL)
               AND last_activity_at IS NOT NULL`
        );
        return rows[0] || {};
    },

    /**
     * Get platform overview (combined stats)
     */
    async getPlatformOverview() {
        const userStats = await this.getTotalUserCount();
        const transactionStats = await this.getTransactionStats();
        const feedbackStats = await this.getFeedbackStats();
        const verificationStats = await this.getVerificationStats();
        const activeUsers = await this.getActiveUserCount();
        const referralStats = await this.getReferralStats();

        return {
            users: userStats,
            transactions: transactionStats,
            feedbacks: feedbackStats,
            verification: verificationStats,
            active_users: activeUsers,
            referrals: referralStats,
            generated_at: new Date()
        };
    }
};

module.exports = Model;
