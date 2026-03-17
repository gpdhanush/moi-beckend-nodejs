const db = require('../config/database');
const crypto = require('crypto');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

/**
 * LOGIN SECURITY FEATURE STATUS
 * ============================
 * CURRENT: Enabled (database columns exist and logic is active)
 * 
 * FEATURE: Block account after 3 failed login attempts for 15 minutes
 * COLUMNS IN user_credentials: failed_login_attempts, login_blocked_until
 * 
 * PASSWORD RESET: Uses OTP-based approach (user_otps table)
 * - NOT using token-based reset (more secure with OTP)
 */

const REFERRAL_CODE_LENGTH = 8;
const REFERRAL_CODE_MAX_ATTEMPTS = 10;

/**
 * Generate a short alphanumeric referral code (uppercase, no ambiguous chars 0/O, 1/I/L).
 */
function generateReferralCode() {
    const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    let code = '';
    const bytes = crypto.randomBytes(REFERRAL_CODE_LENGTH);
    for (let i = 0; i < REFERRAL_CODE_LENGTH; i++) {
        code += chars[bytes[i] % chars.length];
    }
    return code;
}

const User = {
    async findByReferralCode(code) {
        if (!code || typeof code !== 'string') return null;
        const trimmed = String(code).trim().toUpperCase();
        if (!trimmed) return null;
        const [rows] = await db.query(
            `SELECT id FROM users WHERE referral_code = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [trimmed]
        );
        const r = rows[0];
        if (!r) return null;
        return { id: fromBinaryUUID(r.id) };
    },

    async recordReferral(referrerUserId, referredUserId) {
        try {
            const [result] = await db.query(
                `INSERT INTO user_referrals (referrer_user_id, referred_user_id) VALUES (?, ?)
                 ON DUPLICATE KEY UPDATE referrer_user_id = referrer_user_id`,
                [toBinaryUUID(referrerUserId), toBinaryUUID(referredUserId)]
            );
            return result;
        } catch (e) {
            if (e.code === 'ER_NO_SUCH_TABLE') return null;
            throw e;
        }
    },
    async findByEmail(email) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, u.mobile, u.referral_code, u.status,
                    u.is_verified, u.email_verified_at, u.last_activity_at, u.is_deleted, u.deleted_at,
                    u.created_at, u.updated_at,
                    uc.password_hash, uc.password_changed_at,
                    COALESCE(up.profile_image_url, NULL) AS profile_image_url,
                    (SELECT ud.fcm_token FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1 ORDER BY ud.last_used_at DESC LIMIT 1) AS fcm_token
             FROM users u
             INNER JOIN user_credentials uc ON uc.user_id = u.id
             LEFT JOIN user_profiles up ON up.user_id = u.id
             WHERE u.email = ? AND (u.is_deleted = 0 OR u.is_deleted IS NULL)`,
            [email]
        );
        const row = rows[0];
        if (!row) return null;
        // Return full user row (including sensitive fields) so callers like login can validate password
        return mapUserRow(row);
    },

    /**
     * Find user by email including deleted users (for checking account status)
     */
    async findByEmailIncludingDeleted(email) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, u.mobile, u.referral_code, u.status,
                    u.is_verified, u.email_verified_at, u.last_activity_at, u.is_deleted, u.deleted_at,
                    u.created_at, u.updated_at,
                    uc.password_hash, uc.password_changed_at,
                    COALESCE(up.profile_image_url, NULL) AS profile_image_url
             FROM users u
             INNER JOIN user_credentials uc ON uc.user_id = u.id
             LEFT JOIN user_profiles up ON up.user_id = u.id
             WHERE u.email = ?`,
            [email]
        );
        const row = rows[0];
        if (!row) return null;
        return mapUserRow(row);
    },

    async findById(userId) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, u.mobile, u.referral_code, u.status,
                    u.is_verified, u.email_verified_at, u.last_activity_at, u.is_deleted, u.deleted_at,
                    u.created_at, u.updated_at,
                    uc.password_hash, uc.password_changed_at,
                    up.profile_image_url,
                    up.gender,
                    up.date_of_birth,
                    up.address_line1,
                    up.address_line2,
                    up.city,
                    up.state,
                    up.country,
                    up.postal_code,
                    (SELECT ud.fcm_token FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1 ORDER BY ud.last_used_at DESC LIMIT 1) AS fcm_token
             FROM users u
             LEFT JOIN user_credentials uc ON uc.user_id = u.id
             LEFT JOIN user_profiles up ON up.user_id = u.id
             WHERE u.id = ? AND (u.is_deleted = 0 OR u.is_deleted IS NULL)`,
            [toBinaryUUID(userId)]
        );
        const row = rows[0];
        if (!row) return null;
        return mapUserRow(row);
    },

    /**
     * Find user by ID including deleted users (for checking account status)
     */
    async findByIdIncludingDeleted(userId) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, u.mobile, u.referral_code, u.status,
                    u.is_verified, u.email_verified_at, u.last_activity_at, u.is_deleted, u.deleted_at,
                    u.created_at, u.updated_at,
                    uc.password_hash, uc.password_changed_at,
                    COALESCE(up.profile_image_url, NULL) AS profile_image_url
             FROM users u
             LEFT JOIN user_credentials uc ON uc.user_id = u.id
             LEFT JOIN user_profiles up ON up.user_id = u.id
             WHERE u.id = ?`,
            [toBinaryUUID(userId)]
        );
        const row = rows[0];
        if (!row) return null;
        return mapUserRow(row);
    },

    async checkMobileNo(mobile, excludeUserId) {
        const [rows] = await db.query(
            `SELECT id FROM users WHERE mobile = ? AND id != ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [mobile, toBinaryUUID(excludeUserId)]
        );
        const r = rows[0];
        if (!r) return null;
        return { id: fromBinaryUUID(r.id) };
    },

    async findByMobile(mobile) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, u.mobile, u.referral_code, uc.password_hash,
                    (SELECT ud.fcm_token FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1 ORDER BY ud.last_used_at DESC LIMIT 1) AS fcm_token
             FROM users u
             INNER JOIN user_credentials uc ON uc.user_id = u.id
             WHERE u.mobile = ? AND (u.is_deleted = 0 OR u.is_deleted IS NULL)`,
            [mobile]
        );
        const row = rows[0];
        if (!row) return null;
        return mapUserRow(row);
    },

    async updateLastLogin(userId) {
        const [result] = await db.query(
            `UPDATE users SET last_activity_at = ? WHERE id = ?`,
            [new Date(), toBinaryUUID(userId)]
        );
        return result;
    },

    /**
     * Increment failed login attempts and block if >= 3
     * Returns: { blocked: boolean, remaining_attempts: number, blocked_until: Date }
     */
    async incrementFailedLoginAttempts(userId) {
        const MAX_ATTEMPTS = 3;
        const BLOCK_DURATION_MINUTES = 15;
        
        const idBin = toBinaryUUID(userId);
        const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);
        
        const [result] = await db.query(
            `UPDATE user_credentials 
             SET failed_login_attempts = failed_login_attempts + 1,
                 login_blocked_until = CASE 
                    WHEN failed_login_attempts + 1 >= ? THEN ?
                    ELSE login_blocked_until
                 END
             WHERE user_id = ?`,
            [MAX_ATTEMPTS, blockedUntil, idBin]
        );
        
        // Fetch updated credentials to return current status
        const [rows] = await db.query(
            `SELECT failed_login_attempts, login_blocked_until FROM user_credentials WHERE user_id = ?`,
            [idBin]
        );
        
        const creds = rows[0];
        const blocked = creds.failed_login_attempts >= MAX_ATTEMPTS;
        const remainingAttempts = Math.max(0, MAX_ATTEMPTS - creds.failed_login_attempts);
        
        return {
            blocked,
            remaining_attempts: remainingAttempts,
            blocked_until: creds.login_blocked_until,
            attempts: creds.failed_login_attempts
        };
    },

    /**
     * Reset failed login attempts after successful login
     */
    async resetFailedLoginAttempts(userId) {
        const [result] = await db.query(
            `UPDATE user_credentials 
             SET failed_login_attempts = 0, login_blocked_until = NULL
             WHERE user_id = ?`,
            [toBinaryUUID(userId)]
        );
        return result;
    },

    /**
     * Check if user is currently blocked and if block has expired
     * Returns: { is_blocked: boolean, blocked_until: Date }
     */
    async getLoginBlockStatus(userId) {
        const [rows] = await db.query(
            `SELECT login_blocked_until FROM user_credentials WHERE user_id = ?`,
            [toBinaryUUID(userId)]
        );
        
        if (!rows[0]) return { is_blocked: false, blocked_until: null };
        
        const blockedUntil = rows[0].login_blocked_until;
        const now = new Date();
        
        // If blocked_until is in the past, the block has expired
        if (blockedUntil && blockedUntil > now) {
            return { is_blocked: true, blocked_until: blockedUntil };
        }
        
        // Block has expired, clear it
        if (blockedUntil && blockedUntil <= now) {
            await db.query(
                `UPDATE user_credentials SET login_blocked_until = NULL, failed_login_attempts = 0 WHERE user_id = ?`,
                [toBinaryUUID(userId)]
            );
        }
        
        return { is_blocked: false, blocked_until: null };
    },

    async create(payload) {
        const id = payload.id || generateUUID();
        const {
            name,
            email,
            mobile,
            password,
            fcm_token,
            device_name,
            device_id,
            brand,
            manufacturer,
            model,
            ram_size,
            android_version
        } = payload;
        const now = new Date();
        const idBin = toBinaryUUID(id);

        let referralCode = null;
        for (let attempt = 0; attempt < REFERRAL_CODE_MAX_ATTEMPTS; attempt++) {
            const candidate = generateReferralCode();
            const [existing] = await db.query(`SELECT 1 FROM users WHERE referral_code = ?`, [candidate]);
            if (!existing || existing.length === 0) {
                referralCode = candidate;
                break;
            }
        }
        if (!referralCode) referralCode = generateReferralCode() + Date.now().toString(36).slice(-4);

        await db.query(
            `INSERT INTO users (id, full_name, email, mobile, referral_code, status, created_at, updated_at)
             VALUES (?, ?, ?, ?, ?, 'ACTIVE', ?, ?)`,
            [idBin, name, email, mobile || null, referralCode, now, now]
        );
        await db.query(
            `INSERT INTO user_credentials (user_id, password_hash, password_changed_at)
             VALUES (?, ?, ?)`,
            [idBin, password, now]
        );
        await db.query(
            `INSERT INTO user_profiles (user_id) VALUES (?)`,
            [idBin]
        );
        if (fcm_token) {
            await db.query(
                `
                    INSERT INTO user_devices (
                    user_id,
                    device_name,
                    device_id,
                    brand,
                    manufacturer,
                    model,
                    ram_size,
                    fcm_token,
                    android_version,
                    is_active,
                    last_used_at,
                    is_deleted,
                    deleted_at
                    )
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 0, NULL)
                    ON DUPLICATE KEY UPDATE
                    last_used_at = VALUES(last_used_at),
                    is_active = 1,
                    is_deleted = 0,
                    deleted_at = NULL,
                    updated_at = CURRENT_TIMESTAMP,

                    device_name = COALESCE(VALUES(device_name), device_name),
                    brand = COALESCE(VALUES(brand), brand),
                    manufacturer = COALESCE(VALUES(manufacturer), manufacturer),
                    model = COALESCE(VALUES(model), model),
                    ram_size = COALESCE(VALUES(ram_size), ram_size),
                    android_version = COALESCE(VALUES(android_version), android_version),
                    fcm_token = COALESCE(VALUES(fcm_token), fcm_token)
    `,
                [
                    idBin,
                    device_name ?? null,
                    device_id ?? null,
                    brand ?? null,
                    manufacturer ?? null,
                    model ?? null,
                    ram_size ?? null,
                    fcm_token,
                    android_version ?? null,
                    now
                ]
            );
        }
        return { insertId: id };
    },

    async update(payload) {
        const { id, name, mobile, email, status } = payload;
        const idBin = toBinaryUUID(id);
        
        // Update users table
        const [result] = await db.query(
            `UPDATE users SET full_name = ?, mobile = ?, email = ?, status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [name || null, mobile || null, email || null, status || 'ACTIVE', idBin]
        );
        return result;
    },

    async updateProfile(payload) {
        const { id, gender, date_of_birth, address_line1, address_line2, city, state, country, postal_code } = payload;
        const idBin = toBinaryUUID(id);
        
        // Update user_profiles table
        const [result] = await db.query(
            `UPDATE user_profiles SET 
                gender = ?, 
                date_of_birth = ?, 
                address_line1 = ?, 
                address_line2 = ?, 
                city = ?, 
                state = ?, 
                country = ?, 
                postal_code = ? 
            WHERE user_id = ?`,
            [gender || null, date_of_birth || null, address_line1 || null, address_line2 || null, 
             city || null, state || null, country || null, postal_code || null, idBin]
        );
        return result;
    },

    async updateUserData(payload) {
        const {
            id,
            // users table
            name, mobile, email, status,
            // user_profiles table
            gender, date_of_birth, address_line1, address_line2, city, state, country, postal_code,
            // user_devices table
            fcm_token, device_name, device_id, brand, manufacturer, model, ram_size, android_version
        } = payload;
        
        const idBin = toBinaryUUID(id);
        const now = new Date();
        
        // Convert ISO datetime to date-only format (YYYY-MM-DD)
        let dobFormatted = date_of_birth;
        if (date_of_birth && typeof date_of_birth === 'string') {
            // Extract only the date part from ISO format: '2026-02-01T18:30:00.000Z' -> '2026-02-01'
            dobFormatted = date_of_birth.split('T')[0];
        }

        try {
            // Update users table
            if (name || mobile || email || status) {
                await db.query(
                    `UPDATE users SET 
                        full_name = COALESCE(?, full_name),
                        mobile = COALESCE(?, mobile),
                        email = COALESCE(?, email),
                        status = COALESCE(?, status),
                        updated_at = CURRENT_TIMESTAMP 
                    WHERE id = ?`,
                    [name || null, mobile || null, email || null, status || null, idBin]
                );
            }

            // Update user_profiles table
            if (gender || date_of_birth || address_line1 || address_line2 || city || state || country || postal_code) {
                await db.query(
                    `UPDATE user_profiles SET 
                        gender = COALESCE(?, gender),
                        date_of_birth = COALESCE(?, date_of_birth),
                        address_line1 = COALESCE(?, address_line1),
                        address_line2 = COALESCE(?, address_line2),
                        city = COALESCE(?, city),
                        state = COALESCE(?, state),
                        country = COALESCE(?, country),
                        postal_code = COALESCE(?, postal_code)
                    WHERE user_id = ?`,
                    [gender || null, dobFormatted || null, address_line1 || null, address_line2 || null,
                     city || null, state || null, country || null, postal_code || null, idBin]
                );
            }

            // Update user_devices table if fcm_token provided
            if (fcm_token) {
                await db.query(
                    `
    INSERT INTO user_devices (
      user_id,
      device_name,
      device_id,
      brand,
      manufacturer,
      model,
      ram_size,
      fcm_token,
      android_version,
      is_active,
      last_used_at,
      is_deleted,
      deleted_at
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, 0, NULL)
    ON DUPLICATE KEY UPDATE
      last_used_at = CURRENT_TIMESTAMP,
      is_active = 1,
      is_deleted = 0,
      deleted_at = NULL,
      updated_at = CURRENT_TIMESTAMP,

      device_name = COALESCE(VALUES(device_name), device_name),
      brand = COALESCE(VALUES(brand), brand),
      model = COALESCE(VALUES(model), model),
      manufacturer = COALESCE(VALUES(manufacturer), manufacturer),
      ram_size = COALESCE(VALUES(ram_size), ram_size),
      android_version = COALESCE(VALUES(android_version), android_version),
      fcm_token = COALESCE(VALUES(fcm_token), fcm_token)
    `,
                    [
                        idBin,
                        device_name ?? null,
                        device_id ?? null,
                        brand ?? null,
                        manufacturer ?? null,
                        model ?? null,
                        ram_size ?? null,
                        fcm_token,
                        android_version ?? null
                    ]
                );
            }

            return { success: true };
        } catch (error) {
            throw error;
        }
    },

    async updatePassword(payload) {
        const { id, password } = payload;
        const [result] = await db.query(
            `UPDATE user_credentials SET password_hash = ?, password_changed_at = ? WHERE user_id = ?`,
            [password, new Date(), toBinaryUUID(id)]
        );
        return result;
    },

    async findUsersWithOldPasswords(months = 3) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, uc.password_changed_at,
                    (SELECT ud.fcm_token FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1 ORDER BY ud.last_used_at DESC LIMIT 1) AS fcm_token
             FROM users u
             INNER JOIN user_credentials uc ON uc.user_id = u.id
             WHERE u.status = 'ACTIVE'
               AND (u.is_deleted = 0 OR u.is_deleted IS NULL)
               AND (uc.password_changed_at IS NULL OR uc.password_changed_at < DATE_SUB(NOW(), INTERVAL ? MONTH))
               AND EXISTS (SELECT 1 FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1)`,
            [months]
        );
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            full_name: r.full_name,
            email: r.email,
            notification_token: r.fcm_token,
            password_changed_at: r.password_changed_at,
            um_id: fromBinaryUUID(r.id),
            um_full_name: r.full_name,
            um_email: r.email,
            um_notification_token: r.fcm_token
        }));
    },

    /**
     * Soft delete a user account
     * Sets is_deleted=1, deleted_at=CURRENT_TIMESTAMP, status='DELETED'
     * User data remains in database and can be restored later
     */
    async deleteUser(userId) {
        // Soft delete: mark user as deleted with timestamp and set status to an allowed enum value
        const [result] = await db.query(
          `UPDATE users SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, status = 'DELETED', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
          [toBinaryUUID(userId)],
        );
        return result;
    },

    /**
     * Restore a soft-deleted user account
     */
    async restoreUser(userId) {
        const [result] = await db.query(
            `UPDATE users SET is_deleted = 0, deleted_at = NULL, status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
            [toBinaryUUID(userId)]
        );
        return result;
    },

    async updateToken(userId, device_id, token, device_name = null, brand = null, manufacturer = null, model = null, android_version = null, ram_size = null) {
        // Keep only one active device per user: delete all existing, then insert new
        const idBin = toBinaryUUID(userId);
        await db.query(`DELETE FROM user_devices WHERE user_id = ?`, [idBin]);
        const [result] = await db.query(
            `INSERT INTO user_devices (
        user_id,
        device_name,
        device_id,
        brand,
        manufacturer,
        model,
        ram_size,
        fcm_token,
        android_version,
        is_active,
        last_used_at,
        is_deleted,
        deleted_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, 0, NULL)
      `,
            [
                idBin,
                device_name ?? null,
                device_id,
                brand ?? null,
                manufacturer ?? null,
                model ?? null,
                ram_size ?? null,
                token,
                android_version ?? null
            ]
        );
        return result;
    },

    /**
     * Get old profile image path before updating (for cleanup)
     */
    async getProfileImagePath(userId) {
        const [rows] = await db.query(
            `SELECT profile_image_url FROM user_profiles WHERE user_id = ?`,
            [toBinaryUUID(userId)]
        );
        return rows && rows[0] ? rows[0].profile_image_url : null;
    },

    async updateProfileImage(userId, imagePath) {
        const [result] = await db.query(
            `UPDATE user_profiles SET profile_image_url = ? WHERE user_id = ?`,
            [imagePath, toBinaryUUID(userId)]
        );
        return result;
    },

    /**
     * Generate a 6-digit OTP
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    },

    /**
     * Create/store OTP for email verification
     */
    async createVerificationOTP(userId) {
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry
        
        const [result] = await db.query(
            `INSERT INTO user_otps (user_id, code, type, expires_at, is_used)
             VALUES (?, ?, 'VERIFY', ?, 0)`,
            [toBinaryUUID(userId), otp, expiresAt]
        );
        
        return { otp, expiresAt, id: result.insertId };
    },

    /**
     * Create/store OTP for account restore flow (soft-deleted accounts)
     */
    async createRestoreOTP(userId) {
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        const [result] = await db.query(
            `INSERT INTO user_otps (user_id, code, type, expires_at, is_used)
             VALUES (?, ?, 'RESTORE', ?, 0)`,
            [toBinaryUUID(userId), otp, expiresAt]
        );

        return { otp, expiresAt, id: result.insertId };
    },

    /**
     * Create/store OTP for forgot password flow
     */
    async createForgotOTP(userId) {
        const otp = this.generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry (consistent with other flows)

        const [result] = await db.query(
            `INSERT INTO user_otps (user_id, code, type, expires_at, is_used)
             VALUES (?, ?, 'FORGOT', ?, 0)`,
            [toBinaryUUID(userId), otp, expiresAt]
        );

        return { otp, expiresAt, id: result.insertId };
    },

    /**
     * Verify OTP and mark user as verified
     */
    async verifyEmailOTP(userId, otp) {
        const idBin = toBinaryUUID(userId);
        const now = new Date();
        
        // Check if OTP exists, is correct, is not used, and not expired
        const [otpRows] = await db.query(
            `SELECT id, is_used, expires_at FROM user_otps 
             WHERE user_id = ? AND code = ? AND type = 'VERIFY'
             ORDER BY created_at DESC LIMIT 1`,
            [idBin, otp]
        );
        
        if (!otpRows || otpRows.length === 0) {
            return { success: false, message: 'OTP ஐக் கண்டுபிடிக்க முடியவில்லை!' };
        }
        
        const otpRecord = otpRows[0];
        
        // Check if already used
        if (otpRecord.is_used) {
            return { success: false, message: 'இந்த OTP ஏற்கனவே பயன்படுத்தப்பட்டுவிட்டது!' };
        }
        
        // Check if expired
        if (new Date() > otpRecord.expires_at) {
            return { success: false, message: 'OTP காலாவதியாகிவிட்டது! புதிய OTP கோருங்கள்.' };
        }
        
        try {
            // Mark OTP as used
            await db.query(
                `UPDATE user_otps SET is_used = 1 WHERE id = ?`,
                [otpRecord.id]
            );
            
            // Update user as verified
            await db.query(
                `UPDATE users SET is_verified = 1, email_verified_at = ? WHERE id = ?`,
                [now, idBin]
            );
            
            return { success: true, message: 'மின்னஞ்சல் வெற்றிகரமாக சரிபார்க்கப்பட்டது!' };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verify OTP for restore flow and mark OTP as used (does NOT change verified flag)
     */
    async verifyRestoreOTP(userId, otp) {
        const idBin = toBinaryUUID(userId);
        const now = new Date();

        const [otpRows] = await db.query(
            `SELECT id, is_used, expires_at FROM user_otps 
             WHERE user_id = ? AND code = ? AND type = 'RESTORE'
             ORDER BY created_at DESC LIMIT 1`,
            [idBin, otp]
        );

        if (!otpRows || otpRows.length === 0) {
            return { success: false, message: 'OTP ஐக் கண்டுபிடிக்க முடியவில்லை!' };
        }

        const otpRecord = otpRows[0];

        if (otpRecord.is_used) {
            return { success: false, message: 'இந்த OTP ஏற்கனவே பயன்படுத்தப்பட்டுவிட்டது!' };
        }

        if (new Date() > otpRecord.expires_at) {
            return { success: false, message: 'OTP காலாவதியாகிவிட்டது! புதிய OTP கோருங்கள்.' };
        }

        try {
            await db.query(
                `UPDATE user_otps SET is_used = 1 WHERE id = ?`,
                [otpRecord.id]
            );

            return { success: true, message: 'OTP சரியாக உள்ளது.' };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Verify OTP for forgot password flow and mark OTP as used
     */
    async verifyForgotOTP(userId, otp) {
        const idBin = toBinaryUUID(userId);

        const [otpRows] = await db.query(
            `SELECT id, is_used, expires_at FROM user_otps 
             WHERE user_id = ? AND code = ? AND type = 'FORGOT'
             ORDER BY created_at DESC LIMIT 1`,
            [idBin, otp]
        );

        if (!otpRows || otpRows.length === 0) {
            return { success: false, message: 'OTP ஐக் கண்டுபிடிக்க முடியவில்லை!' };
        }

        const otpRecord = otpRows[0];

        if (otpRecord.is_used) {
            return { success: false, message: 'இந்த OTP ஏற்கனவே பயன்படுத்தப்பட்டுவிட்டது!' };
        }

        if (new Date() > otpRecord.expires_at) {
            return { success: false, message: 'OTP காலாவதியாகிவிட்டது! புதிய OTP கோருங்கள்.' };
        }

        try {
            await db.query(
                `UPDATE user_otps SET is_used = 1 WHERE id = ?`,
                [otpRecord.id]
            );

            return { success: true, message: 'OTP சரியாக உள்ளது.' };
        } catch (error) {
            throw error;
        }
    },

    /**
     * Check if user is verified
     */
    async isEmailVerified(userId) {
        const [rows] = await db.query(
            `SELECT is_verified, email_verified_at FROM users WHERE id = ?`,
            [toBinaryUUID(userId)]
        );
        
        if (!rows || rows.length === 0) {
            return null;
        }
        
        return {
            is_verified: rows[0].is_verified,
            email_verified_at: rows[0].email_verified_at
        };
    },

    /**
     * Get unverified users (for notification/reminder purposes)
     */
    async getUnverifiedUsers(limit = 50) {
        const [rows] = await db.query(
            `SELECT u.id, u.full_name, u.email, u.created_at,
                    (SELECT ud.fcm_token FROM user_devices ud WHERE ud.user_id = u.id AND ud.is_active = 1 ORDER BY ud.last_used_at DESC LIMIT 1) AS fcm_token
             FROM users u
             WHERE u.is_verified = 0 
               AND u.status = 'ACTIVE'
               AND (u.is_deleted = 0 OR u.is_deleted IS NULL)
             ORDER BY u.created_at DESC
             LIMIT ?`,
            [limit]
        );
        
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            full_name: r.full_name,
            email: r.email,
            created_at: r.created_at,
            fcm_token: r.fcm_token
        }));
    },

    /**
     * Get consolidated public (non-sensitive) details for a user across related tables
     */
    async getPublicDetails(userId) {
        const idBin = toBinaryUUID(userId);
        const [uRows] = await db.query(
            `SELECT id, full_name, email, mobile, referral_code, status, is_verified, email_verified_at, last_activity_at, created_at, updated_at
             FROM users WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [idBin]
        );
        const u = uRows[0];
        if (!u) return null;

        const [pRows] = await db.query(
            `SELECT gender, date_of_birth, address_line1, address_line2, city, state, country, postal_code, profile_image_url
             FROM user_profiles WHERE user_id = ? LIMIT 1`,
            [idBin]
        );
        const profile = pRows[0] || {};

        // Fetch only the most recently used active device (if any)
        const [dRows] = await db.query(
            `SELECT id,
                    fcm_token,
                    device_name,
                    device_id,
                    is_active,
                    last_used_at,
                    created_at,
                    brand,
                    model,
                    manufacturer,
                    android_version,
                    ram_size
             FROM user_devices
             WHERE user_id = ? AND is_active = 1
             ORDER BY last_used_at DESC
             LIMIT 1`,
            [idBin]
        );

        const [referrerRows] = await db.query(
            `SELECT referrer_user_id FROM user_referrals WHERE referred_user_id = ? LIMIT 1`,
            [idBin]
        );

        const [referredCountRows] = await db.query(
            `SELECT COUNT(*) AS cnt FROM user_referrals WHERE referrer_user_id = ?`,
            [idBin]
        );

        return {
            id: fromBinaryUUID(u.id),
            full_name: u.full_name,
            email: u.email,
            mobile: u.mobile,
            referral_code: u.referral_code || null,
            status: u.status,
            is_verified: u.is_verified || 0,
            email_verified_at: u.email_verified_at || null,
            last_activity_at: u.last_activity_at,
            created_at: u.created_at,
            updated_at: u.updated_at,
            profile: {
                gender: profile.gender || null,
                date_of_birth: profile.date_of_birth || null,
                address_line1: profile.address_line1 || null,
                address_line2: profile.address_line2 || null,
                city: profile.city || null,
                state: profile.state || null,
                country: profile.country || null,
                postal_code: profile.postal_code || null,
                profile_image_url: profile.profile_image_url || null
            },
            device: dRows && dRows[0] ? {
                id: dRows[0].id ? (typeof dRows[0].id === 'object' ? fromBinaryUUID(dRows[0].id) : dRows[0].id) : null,
                fcm_token: dRows[0].fcm_token || null,
                device_name: dRows[0].device_name || null,
                device_id: dRows[0].device_id || null,
                is_active: dRows[0].is_active,
                last_used_at: dRows[0].last_used_at,
                brand: dRows[0].brand || null,
                model: dRows[0].model || null,
                manufacturer: dRows[0].manufacturer || null,
                androidVersion: dRows[0].android_version || null,
                ram_size: dRows[0].ram_size || null,
            } : null,
            referrer_id: referrerRows && referrerRows[0] ? (referrerRows[0].referrer_user_id ? (typeof referrerRows[0].referrer_user_id === 'object' ? fromBinaryUUID(referrerRows[0].referrer_user_id) : referrerRows[0].referrer_user_id) : null) : null,
            referred_count: referredCountRows && referredCountRows[0] ? referredCountRows[0].cnt : 0
        };
    },

    // retrieve public details for all active users (admin use)
    async getAllPublicDetails() {
        const [rows] = await db.query(
            `SELECT id
             FROM users
             WHERE (is_deleted = 0 OR is_deleted IS NULL)
             ORDER BY created_at DESC`
        );
        const results = [];
        for (const r of rows) {
            try {
                const details = await this.getPublicDetails(fromBinaryUUID(r.id));
                if (details) results.push(details);
            } catch (e) {
                // ignore individual failures but log
                console.warn('getAllPublicDetails: failed for', r.id, e.message);
            }
        }
        return results;
    },

    /**
     * Get pending OTP for user (if any active/non-expired)
     */
    async getPendingOTP(userId) {
        const [rows] = await db.query(
            `SELECT code, expires_at, is_used FROM user_otps
             WHERE user_id = ? AND type = 'VERIFY' AND is_used = 0
             AND expires_at > NOW()
             ORDER BY created_at DESC LIMIT 1`,
            [toBinaryUUID(userId)]
        );
        
        return rows.length > 0 ? rows[0] : null;
    },

    /**
     * Delete expired OTPs
     */
    async deleteExpiredOTPs() {
        const [result] = await db.query(
            `DELETE FROM user_otps WHERE expires_at < NOW()`
        );
        return result;
    },

    /**
     * Mark user email as verified manually (admin/system use)
     */
    async markEmailVerified(userId) {
        const now = new Date();
        const [result] = await db.query(
            `UPDATE users SET is_verified = 1, email_verified_at = ? WHERE id = ?`,
            [now, toBinaryUUID(userId)]
        );
        return result;
    }
};

function mapUserRow(r, includeSensitive = true) {
    const id = fromBinaryUUID(r.id);
    const fcmToken = r.fcm_token || r.notification_token || null;
    const base = {
        id,
        um_id: id,
        full_name: r.full_name,
        um_full_name: r.full_name,
        email: r.email,
        um_email: r.email,
        mobile: r.mobile,
        um_mobile: r.mobile,
        referral_code: r.referral_code || null,
        um_referral_code: r.referral_code || null,
        status: r.status,
        is_verified: r.is_verified || 0,
        email_verified_at: r.email_verified_at || null,
        last_activity_at: r.last_activity_at,
        um_last_login: r.last_activity_at,
        is_deleted: r.is_deleted || 0,
        deleted_at: r.deleted_at || null,
        profile_image_url: r.profile_image_url,
        um_profile_image: r.profile_image_url,
        notification_token: fcmToken,
        um_notification_token: fcmToken,
        created_at: r.created_at,
        um_create_dt: r.created_at,
        updated_at: r.updated_at,
        um_update_dt: r.updated_at,
        um_status: r.status
    };

    if (includeSensitive) {
        base.password_hash = r.password_hash;
        base.um_password = r.password_hash;
    }

    return base;
}

module.exports = User;
