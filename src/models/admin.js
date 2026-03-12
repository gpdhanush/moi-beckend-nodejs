const db = require('../config/database');
const crypto = require('crypto');
const { toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

const Admin = {
  async findByEmail(email) {
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              is_deleted,
              deleted_at
       FROM admins
       WHERE email = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [email],
    );
    const r = rows[0];
    if (!r) return null;
    return {
      id: fromBinaryUUID(r.id),
      full_name: r.full_name,
      email: r.email,
      mobile: r.mobile,
      password_hash: r.password_hash,
      status: r.status,
      failed_login_attempts: r.failed_login_attempts,
      locked_until: r.locked_until,
      email_verified_at: r.email_verified_at,
      reset_token: r.reset_token,
      reset_token_expires_at: r.reset_token_expires_at,
      last_login_at: r.last_login_at,
      is_deleted: r.is_deleted,
      deleted_at: r.deleted_at,
    };
  },

  async findByEmailIncludingDeleted(email) {
    const [rows] = await db.query(
      `SELECT id,
              full_name,
              email,
              mobile,
              password_hash,
              status,
              failed_login_attempts,
              locked_until,
              email_verified_at,
              reset_token,
              reset_token_expires_at,
              last_login_at,
              is_deleted,
              deleted_at
       FROM admins
       WHERE email = ?`,
      [email],
    );
    const r = rows[0];
    if (!r) return null;
    return {
      id: fromBinaryUUID(r.id),
      full_name: r.full_name,
      email: r.email,
      mobile: r.mobile,
      password_hash: r.password_hash,
      status: r.status,
      failed_login_attempts: r.failed_login_attempts,
      locked_until: r.locked_until,
      email_verified_at: r.email_verified_at,
      reset_token: r.reset_token,
      reset_token_expires_at: r.reset_token_expires_at,
      last_login_at: r.last_login_at,
      is_deleted: r.is_deleted,
      deleted_at: r.deleted_at,
    };
  },

  async updatePassword({ id, password }) {
    const [result] = await db.query(
      `UPDATE admins SET password_hash = ?, password_changed_at = ? WHERE id = ?`,
      [password, new Date(), toBinaryUUID(id)],
    );
    return result;
  },

  async setResetToken(adminId, token, expiresAt) {
    const [result] = await db.query(
      `UPDATE admins SET reset_token = ?, reset_token_expires_at = ? WHERE id = ?`,
      [token, expiresAt, toBinaryUUID(adminId)],
    );
    return result;
  },

  async findByResetToken(token) {
    const [rows] = await db.query(
      `SELECT id, reset_token_expires_at FROM admins WHERE reset_token = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
      [token],
    );
    const r = rows[0];
    if (!r) return null;
    return {
      id: fromBinaryUUID(r.id),
      reset_token_expires_at: r.reset_token_expires_at,
    };
  },

  async clearResetToken(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET reset_token = NULL, reset_token_expires_at = NULL WHERE id = ?`,
      [toBinaryUUID(adminId)],
    );
    return result;
  },

  /**
   * Login security helpers - similar to User model
   */
  async incrementFailedLoginAttempts(adminId) {
    const MAX_ATTEMPTS = 3;
    const BLOCK_DURATION_MINUTES = 15;
    const idBin = toBinaryUUID(adminId);
    const blockedUntil = new Date(Date.now() + BLOCK_DURATION_MINUTES * 60 * 1000);

    await db.query(
      `UPDATE admins
       SET failed_login_attempts = failed_login_attempts + 1,
           locked_until = CASE WHEN failed_login_attempts + 1 >= ? THEN ? ELSE locked_until END
       WHERE id = ?`,
      [MAX_ATTEMPTS, blockedUntil, idBin],
    );

    const [rows] = await db.query(
      `SELECT failed_login_attempts, locked_until FROM admins WHERE id = ?`,
      [idBin],
    );
    const creds = rows[0];
    const blocked = creds.failed_login_attempts >= MAX_ATTEMPTS;
    const remainingAttempts = Math.max(0, MAX_ATTEMPTS - creds.failed_login_attempts);
    return {
      blocked,
      remaining_attempts: remainingAttempts,
      blocked_until: creds.locked_until,
      attempts: creds.failed_login_attempts,
    };
  },

  async resetFailedLoginAttempts(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET failed_login_attempts = 0, locked_until = NULL WHERE id = ?`,
      [toBinaryUUID(adminId)],
    );
    return result;
  },

  async getLoginBlockStatus(adminId) {
    const [rows] = await db.query(
      `SELECT locked_until FROM admins WHERE id = ?`,
      [toBinaryUUID(adminId)],
    );
    if (!rows[0]) return { is_blocked: false, blocked_until: null };
    const blockedUntil = rows[0].locked_until;
    const now = new Date();
    if (blockedUntil && blockedUntil > now) {
      return { is_blocked: true, blocked_until: blockedUntil };
    }
    if (blockedUntil && blockedUntil <= now) {
      await db.query(
        `UPDATE admins SET locked_until = NULL, failed_login_attempts = 0 WHERE id = ?`,
        [toBinaryUUID(adminId)],
      );
    }
    return { is_blocked: false, blocked_until: null };
  },

  async updateLastLogin(adminId) {
    const [result] = await db.query(
      `UPDATE admins SET last_login_at = ? WHERE id = ?`,
      [new Date(), toBinaryUUID(adminId)],
    );
    return result;
  },
};

module.exports = Admin;
