const db = require('../config/database');
const logger = require('../config/logger');

const MFA = {
  /**
   * Automatically initialize user_mfa table if it doesn't exist
   */
  async initTable() {
    try {
      await db.query(`
        CREATE TABLE IF NOT EXISTS user_mfa (
          id INT AUTO_INCREMENT PRIMARY KEY,
          user_id VARCHAR(255) NOT NULL,
          account_type ENUM('user', 'admin') DEFAULT 'user',
          secret VARCHAR(255) NULL,
          temp_secret VARCHAR(255) NULL,
          is_enabled TINYINT(1) DEFAULT 0,
          backup_codes TEXT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          UNIQUE KEY uq_user_type (user_id, account_type)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
      `);
      logger.info('user_mfa table initialized');
    } catch (err) {
      logger.error('Failed to initialize user_mfa table:', err);
    }
  },

  /**
   * Find MFA record by user_id and account_type
   */
  async findByUserId(userId, accountType = 'user') {
    const key = String(userId).trim();
    const [rows] = await db.query(
      `SELECT * FROM user_mfa WHERE user_id = ? AND account_type = ?`,
      [key, accountType]
    );
    return rows[0] || null;
  },

  /**
   * Save temporary secret and backup codes during setup flow
   */
  async saveTempSetup(userId, accountType = 'user', tempSecret, backupCodesArray = []) {
    const key = String(userId).trim();
    const backupJson = JSON.stringify(backupCodesArray);

    await db.query(
      `INSERT INTO user_mfa (user_id, account_type, temp_secret, backup_codes, is_enabled, updated_at)
       VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         temp_secret = VALUES(temp_secret),
         backup_codes = VALUES(backup_codes),
         updated_at = CURRENT_TIMESTAMP`,
      [key, accountType, tempSecret, backupJson]
    );
  },

  /**
   * Finalize and enable MFA after setup verification
   */
  async enableMFA(userId, accountType = 'user') {
    const key = String(userId).trim();
    const record = await this.findByUserId(key, accountType);
    if (!record || !record.temp_secret) {
      throw new Error('No pending MFA setup found.');
    }

    await db.query(
      `UPDATE user_mfa
       SET secret = temp_secret,
           temp_secret = NULL,
           is_enabled = 1,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND account_type = ?`,
      [key, accountType]
    );
    return true;
  },

  /**
   * Disable MFA and clear credentials
   */
  async disableMFA(userId, accountType = 'user') {
    const key = String(userId).trim();
    await db.query(
      `UPDATE user_mfa
       SET is_enabled = 0,
           secret = NULL,
           temp_secret = NULL,
           backup_codes = NULL,
           updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND account_type = ?`,
      [key, accountType]
    );
    return true;
  },

  /**
   * Save new backup codes array
   */
  async saveBackupCodes(userId, accountType = 'user', backupCodesArray = []) {
    const key = String(userId).trim();
    const backupJson = JSON.stringify(backupCodesArray);
    await db.query(
      `UPDATE user_mfa
       SET backup_codes = ?, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = ? AND account_type = ?`,
      [backupJson, key, accountType]
    );
  },

  /**
   * Check and consume a backup code
   */
  async verifyAndConsumeBackupCode(userId, accountType = 'user', code) {
    const key = String(userId).trim();
    const record = await this.findByUserId(key, accountType);
    if (!record || !record.is_enabled || !record.backup_codes) return false;

    let codes = [];
    try {
      codes = typeof record.backup_codes === 'string' ? JSON.parse(record.backup_codes) : record.backup_codes;
    } catch (e) {
      codes = [];
    }

    const cleanInputCode = String(code).trim().toUpperCase().replace('-', '');
    const index = codes.findIndex(c => String(c).trim().toUpperCase().replace('-', '') === cleanInputCode);

    if (index === -1) return false;

    // Remove used backup code
    codes.splice(index, 1);
    await this.saveBackupCodes(key, accountType, codes);
    return true;
  }
};

// Initialize table on module load
MFA.initTable();

module.exports = MFA;
