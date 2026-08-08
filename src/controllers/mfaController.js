const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
const crypto = require('crypto');
const MFA = require('../models/mfaModel');
const User = require('../models/user');
const Admin = require('../models/admin');
const tokenService = require('../middlewares/tokenService');
const logger = require('../config/logger');

/**
 * Generate 8 random backup codes (format: XXXX-XXXX)
 */
function generateBackupCodes(count = 8) {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase();
    const formatted = `${code.slice(0, 4)}-${code.slice(4, 8)}`;
    codes.push(formatted);
  }
  return codes;
}

/**
 * Helper to resolve user/admin identity from request
 */
async function resolveIdentity(req) {
  const bodyAccountType = req.body?.accountType || req.body?.account_type;
  const userId =
    req.admin?.userId ||
    req.user?.userId ||
    req.body?.userId ||
    req.body?.user_id;

  if (!userId) return null;

  // Prefer explicit admin markers, then body accountType, then JWT accountType.
  let accountType = 'user';
  if (req.admin || req.user?.accountType === 'admin' || bodyAccountType === 'admin') {
    accountType = 'admin';
  } else if (bodyAccountType === 'user' || req.user?.accountType === 'user') {
    accountType = 'user';
  } else {
    // Disambiguate shared ids: if an admin row exists, treat as admin.
    const admin = await Admin.findById(userId);
    accountType = admin && !admin.is_deleted ? 'admin' : 'user';
  }

  let email = 'user@moikanakku.com';
  if (accountType === 'admin') {
    const admin = await Admin.findById(userId);
    if (admin) email = admin.email;
  } else {
    const user = await User.findById(userId);
    if (user) email = user.email;
  }

  return { userId: String(userId), accountType, email };
}

exports.mfaController = {
  /**
   * POST /mfa/setup
   * Initiate MFA setup: generate TOTP secret, QR code data URL, and backup codes
   */
  setup: async (req, res) => {
    try {
      const identity = await resolveIdentity(req);
      if (!identity) {
        return res.status(401).json({
          responseType: "F",
          responseValue: { message: "Authentication required for MFA setup." }
        });
      }

      const { userId, accountType, email } = identity;

      // Generate TOTP secret
      const secret = speakeasy.generateSecret({
        length: 20,
        name: `Moi Kanakku (${email})`,
        issuer: 'Moi Kanakku'
      });

      // Generate 8 backup codes
      const backupCodes = generateBackupCodes(8);

      // Generate QR Code Data URL
      const qrCode = await QRCode.toDataURL(secret.otpauth_url);

      // Save temporary setup state in DB
      await MFA.saveTempSetup(userId, accountType, secret.base32, backupCodes);

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          message: "MFA setup generated successfully",
          secret: secret.base32,
          otpauth_url: secret.otpauth_url,
          qr_code: qrCode,
          backup_codes: backupCodes
        }
      });
    } catch (error) {
      logger.error("Error in MFA setup:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * POST /mfa/verify-setup
   * Verify TOTP token to activate MFA
   * Body: { token, secret? }
   */
  verifySetup: async (req, res) => {
    try {
      const identity = await resolveIdentity(req);
      if (!identity) {
        return res.status(401).json({
          responseType: "F",
          responseValue: { message: "Authentication required." }
        });
      }

      const { userId, accountType } = identity;
      const { token, secret: inputSecret } = req.body;

      if (!token) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "6-digit TOTP code is required." }
        });
      }

      const record = await MFA.findByUserId(userId, accountType);
      const secretToVerify = inputSecret || (record ? record.temp_secret : null);

      if (!secretToVerify) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "No active MFA setup session found. Please start setup again." }
        });
      }

      const verified = speakeasy.totp.verify({
        secret: secretToVerify,
        encoding: 'base32',
        token: String(token).trim(),
        window: 2 // Allow +/- 60s clock drift
      });

      if (!verified) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Invalid verification code. Please check your authenticator app." }
        });
      }

      // Activate MFA in DB
      await MFA.enableMFA(userId, accountType);

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          message: "Multi-Factor Authentication enabled successfully!",
          is_mfa_enabled: true
        }
      });
    } catch (error) {
      logger.error("Error in MFA verify-setup:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * GET /mfa/status
   * Get current MFA status and backup codes count
   */
  getStatus: async (req, res) => {
    try {
      const identity = await resolveIdentity(req);
      if (!identity) {
        return res.status(401).json({
          responseType: "F",
          responseValue: { message: "Authentication required." }
        });
      }

      const { userId, accountType } = identity;
      const record = await MFA.findByUserId(userId, accountType);

      let backupCodesCount = 0;
      if (record && record.backup_codes) {
        try {
          const parsed = typeof record.backup_codes === 'string' ? JSON.parse(record.backup_codes) : record.backup_codes;
          backupCodesCount = Array.isArray(parsed) ? parsed.length : 0;
        } catch (e) {
          backupCodesCount = 0;
        }
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          is_mfa_enabled: record ? record.is_enabled === 1 : false,
          backup_codes_count: backupCodesCount
        }
      });
    } catch (error) {
      logger.error("Error in MFA getStatus:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * POST /mfa/disable
   * Disable MFA for user/admin
   * Body: { token? }
   */
  disable: async (req, res) => {
    try {
      const identity = await resolveIdentity(req);
      if (!identity) {
        return res.status(401).json({
          responseType: "F",
          responseValue: { message: "Authentication required." }
        });
      }

      const { userId, accountType } = identity;
      const { token } = req.body;
      const record = await MFA.findByUserId(userId, accountType);

      if (!record || record.is_enabled !== 1) {
        return res.status(200).json({
          responseType: "S",
          responseValue: {
            message: "MFA is already disabled.",
            is_mfa_enabled: false
          }
        });
      }

      // If token provided, verify it before disabling
      if (token && record.secret) {
        const verified = speakeasy.totp.verify({
          secret: record.secret,
          encoding: 'base32',
          token: String(token).trim(),
          window: 2
        });
        if (!verified) {
          return res.status(400).json({
            responseType: "F",
            responseValue: { message: "Invalid verification code." }
          });
        }
      }

      await MFA.disableMFA(userId, accountType);

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          message: "Multi-Factor Authentication disabled successfully.",
          is_mfa_enabled: false
        }
      });
    } catch (error) {
      logger.error("Error in MFA disable:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * POST /mfa/regenerate-backup-codes
   * Generate a fresh list of backup codes
   */
  regenerateBackupCodes: async (req, res) => {
    try {
      const identity = await resolveIdentity(req);
      if (!identity) {
        return res.status(401).json({
          responseType: "F",
          responseValue: { message: "Authentication required." }
        });
      }

      const { userId, accountType } = identity;
      const record = await MFA.findByUserId(userId, accountType);

      if (!record || record.is_enabled !== 1) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "MFA must be enabled to regenerate backup codes." }
        });
      }

      const newBackupCodes = generateBackupCodes(8);
      await MFA.saveBackupCodes(userId, accountType, newBackupCodes);

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          message: "Backup codes regenerated successfully.",
          backup_codes: newBackupCodes
        }
      });
    } catch (error) {
      logger.error("Error in MFA regenerateBackupCodes:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  },

  /**
   * POST /mfa/verify
   * Verify TOTP code or backup code during login verification
   * Body: { token, userId?, accountType? }
   */
  verify: async (req, res) => {
    try {
      const identity = await resolveIdentity(req);
      const userId = identity?.userId || req.body.userId;
      const accountType = identity?.accountType || req.body.accountType || 'user';
      const { token } = req.body;

      if (!userId || !token) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "User ID and verification code/backup code are required." }
        });
      }

      const record = await MFA.findByUserId(userId, accountType);
      if (!record || record.is_enabled !== 1 || !record.secret) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "MFA is not enabled for this account." }
        });
      }

      const cleanToken = String(token).trim();

      // 1. Try TOTP token verification
      let verified = speakeasy.totp.verify({
        secret: record.secret,
        encoding: 'base32',
        token: cleanToken,
        window: 2
      });

      let usedBackupCode = false;

      // 2. If TOTP fails, check if input is a valid backup code
      if (!verified) {
        const isBackupValid = await MFA.verifyAndConsumeBackupCode(userId, accountType, cleanToken);
        if (isBackupValid) {
          verified = true;
          usedBackupCode = true;
        }
      }

      if (!verified) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Invalid MFA code or backup code." }
        });
      }

      // Generate JWT session token upon successful MFA verification
      tokenService.invalidatePreviousToken(userId);
      const jwtToken = tokenService.generateToken(userId);

      // Fetch user or admin details to return full login response object
      let accountPayload = {
        id: userId,
        token: jwtToken,
        account_type: accountType
      };

      const now = new Date();
      if (accountType === 'admin') {
        const admin = await Admin.findById(userId);
        if (admin) {
          if (typeof Admin.updateLastLogin === 'function') {
            try { await Admin.updateLastLogin(userId); } catch (e) {}
          }
          accountPayload = {
            id: admin.id,
            full_name: admin.full_name,
            name: admin.full_name,
            email: admin.email,
            mobile: admin.mobile,
            status: admin.status,
            email_verified_at: admin.email_verified_at || null,
            last_login_at: now,
            last_activity_at: now,
            created_at: admin.created_at,
            token: jwtToken,
          };
        }
      } else {
        const user = await User.findById(userId);
        if (user) {
          if (typeof User.updateLastLogin === 'function') {
            try { await User.updateLastLogin(userId); } catch (e) {}
          }
          accountPayload = {
            status: user.status,
            id: user.id,
            name: user.full_name,
            mobile: user.mobile,
            email: user.email,
            referral_code: user.referral_code || null,
            last_login: user.last_activity_at || now,
            profile_image: user.profile_image_url || null,
            token: jwtToken,
          };
        }
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          message: "MFA verification successful",
          used_backup_code: usedBackupCode,
          ...accountPayload,
          token: jwtToken
        }
      });
    } catch (error) {
      logger.error("Error in MFA verify:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() }
      });
    }
  }
};
