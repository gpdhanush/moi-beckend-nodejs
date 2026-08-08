const db = require('../config/database');

const Admin = {
  /**
   * Create a new admin
   */
  async create({ full_name, email, mobile, password_hash, status = 'ACTIVE' }) {
    const [result] = await db.query(
      `INSERT INTO admins (full_name, email, mobile, password_hash, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`,
      [full_name, email, mobile || null, password_hash, status]
    );
    return { id: result.insertId };
  },

  /**
   * Find admin by numeric ID
   */
  async findById(id) {
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              password_changed_at,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              last_activity_at,
              is_deleted,
              deleted_at,
              created_at,
              updated_at
       FROM admins
       WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [id],
    );
    return rows[0] || null;
  },

  /**
   * Find admin by email
   */
  async findByEmail(email) {
    if (!email) return null;
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              password_changed_at,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              last_activity_at,
              is_deleted,
              deleted_at,
              created_at,
              updated_at
       FROM admins
       WHERE LOWER(email) = LOWER(?) AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [email],
    );
    return rows[0] || null;
  },

  /**
   * Find admin by identifier (email or mobile)
   */
  async findByIdentifier(identifier) {
    if (!identifier) return null;
    const trimmed = String(identifier).trim();
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              password_changed_at,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              last_activity_at,
              is_deleted,
              deleted_at,
              created_at,
              updated_at
       FROM admins
       WHERE (LOWER(email) = LOWER(?) OR mobile = ?) AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [trimmed, trimmed],
    );
    return rows[0] || null;
  },

  /**
   * Find admin by email including deleted
   */
  async findByEmailIncludingDeleted(email) {
    if (!email) return null;
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              password_changed_at,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              last_activity_at,
              is_deleted,
              deleted_at,
              created_at,
              updated_at
       FROM admins
       WHERE LOWER(email) = LOWER(?)`,
      [email],
    );
    return rows[0] || null;
  },

  /**
   * Find admin by identifier including deleted
   */
  async findByIdentifierIncludingDeleted(identifier) {
    if (!identifier) return null;
    const trimmed = String(identifier).trim();
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              password_changed_at,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              last_activity_at,
              is_deleted,
              deleted_at,
              created_at,
              updated_at
       FROM admins
       WHERE LOWER(email) = LOWER(?) OR mobile = ?`,
      [trimmed, trimmed],
    );
    return rows[0] || null;
  },

  /**
   * Update admin password
   */
  async updatePassword({ id, password }) {
    const [result] = await db.query(
      `UPDATE admins SET password_hash = ?, password_changed_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [password, id],
    );
    return result;
  },

  /**
   * Check if email or mobile is already used by another admin
   */
  async checkEmailOrMobileExists(id, email, mobile) {
    if (!email && !mobile) return false;
    const [rows] = await db.query(
      `SELECT id FROM admins
       WHERE id != ? AND (is_deleted = 0 OR is_deleted IS NULL)
         AND ((? IS NOT NULL AND LOWER(email) = LOWER(?)) OR (? IS NOT NULL AND mobile = ?))`,
      [id, email || null, email || '', mobile || null, mobile || '']
    );
    return rows.length > 0;
  },

  /**
   * Update admin profile details
   */
  async updateProfile({ id, full_name, email, mobile }) {
    const [result] = await db.query(
      `UPDATE admins
       SET full_name = COALESCE(?, full_name),
           email = COALESCE(?, email),
           mobile = COALESCE(?, mobile),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [full_name || null, email || null, mobile || null, id]
    );
    return result;
  },

  /**
   * Set password reset token
   */
  async setResetToken(adminId, token, expiresAt) {
    const [result] = await db.query(
      `UPDATE admins SET reset_token = ?, reset_token_expires_at = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [token, expiresAt, adminId],
    );
    return result;
  },

  /**
   * Find admin by password reset token
   */
  async findByResetToken(token) {
    const [rows] = await db.query(
      `SELECT id, reset_token_expires_at FROM admins WHERE reset_token = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [token],
    );
    return rows[0] || null;
  },

  /**
   * Clear reset token
   */
  async clearResetToken(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET reset_token = NULL, reset_token_expires_at = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [adminId],
    );
    return result;
  },

  /**
   * Increment failed login attempts (lock account for 15 mins after 3 attempts, set status to BLOCKED)
   */
  async incrementFailedLoginAttempts(adminId) {
    const MAX_ATTEMPTS = 3;
    const BLOCK_DURATION_MINUTES = 15;
    const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);

    await db.query(
      `UPDATE admins
       SET failed_login_attempts = failed_login_attempts + 1,
           locked_until = CASE WHEN failed_login_attempts + 1 >= ? THEN ? ELSE locked_until END,
           status = CASE WHEN failed_login_attempts + 1 >= ? THEN 'BLOCKED' ELSE status END,
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [MAX_ATTEMPTS, blockedUntil, MAX_ATTEMPTS, adminId],
    );

    const [rows] = await db.query(
      `SELECT failed_login_attempts, locked_until, status FROM admins WHERE id = ?`,
      [adminId],
    );
    const creds = rows[0];
    const blocked = creds.failed_login_attempts >= MAX_ATTEMPTS || creds.status === 'BLOCKED';
    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - creds.failed_login_attempts);
    return {
      blocked,
      remaining_attempts: remainingAttempts,
      blocked_until: creds.locked_until,
      attempts: creds.failed_login_attempts,
      status: creds.status,
    };
  },

  /**
   * Reset failed login attempts and unlock (restore ACTIVE status)
   */
  async resetFailedLoginAttempts(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET failed_login_attempts = 0, locked_until = NULL, status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [adminId],
    );
    return result;
  },

  /**
   * Get login block status
   */
  async getLoginBlockStatus(adminId) {
    const [rows] = await db.query(
      `SELECT locked_until, status FROM admins WHERE id = ?`,
      [adminId],
    );
    if (!rows[0]) return { is_blocked: false, blocked_until: null, status: 'ACTIVE' };
    const { locked_until, status } = rows[0];
    const now = new Date();

    if (status === 'BLOCKED' && locked_until && new Date(locked_until) > now) {
      return { is_blocked: true, blocked_until: locked_until, status: 'BLOCKED' };
    }

    if (locked_until && new Date(locked_until) > now) {
      return { is_blocked: true, blocked_until: locked_until, status: status || 'BLOCKED' };
    }

    // Lock duration expired: reset block state
    if (locked_until && new Date(locked_until) <= now) {
      await db.query(
        `UPDATE admins SET locked_until = NULL, failed_login_attempts = 0, status = 'ACTIVE', updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [adminId],
      );
      return { is_blocked: false, blocked_until: null, status: 'ACTIVE' };
    }

    if (status === 'BLOCKED') {
      return { is_blocked: true, blocked_until: null, status: 'BLOCKED' };
    }

    return { is_blocked: false, blocked_until: null, status: status || 'ACTIVE' };
  },

  /**
   * Update last login timestamp
   */
  async updateLastLogin(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET last_login_at = CURRENT_TIMESTAMP, last_activity_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [adminId],
    );
    return result;
  },

  /**
   * Update last activity timestamp
   */
  async updateLastActivity(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET last_activity_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
      [adminId],
    );
    return result;
  },

  /**
   * Find all admins (paginated)
   */
  async findAll(limit = 50, offset = 0) {
    const [rows] = await db.query(
      `SELECT id, full_name, email, mobile, status, email_verified_at, last_login_at, last_activity_at, created_at, updated_at
       FROM admins
       WHERE (is_deleted = 0 OR is_deleted IS NULL)
       ORDER BY created_at DESC
       LIMIT ? OFFSET ?`,
      [limit, offset],
    );
    return rows;
  },

  /**
   * Get total count of admins
   */
  async getTotalCount() {
    const [rows] = await db.query(
      `SELECT COUNT(*) as count FROM admins WHERE (is_deleted = 0 OR is_deleted IS NULL)`
    );
    return Number(rows[0]?.count) || 0;
  }
};

module.exports = Admin;
