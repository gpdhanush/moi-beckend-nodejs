const express = require('express');
const { mfaController } = require('../controllers/mfaController');
const {
  authenticateToken,
  authenticateAdminToken,
  tryResolveAccountType,
} = require('../middlewares/auth');

const router = express.Router();

/**
 * Authenticate either admin or user.
 * Prefer admin when the same numeric id exists in both tables.
 */
async function authenticateUserOrAdmin(req, res, next) {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    // Pre-login MFA verify step passes userId (+ accountType) in body
    if (req.body && (req.body.userId || req.body.user_id)) {
      return next();
    }
    return res.status(401).json({
      responseType: "F",
      responseValue: { message: "Authentication required." }
    });
  }

  const token = authHeader.split(' ')[1];
  const resolved = await tryResolveAccountType(token);
  if (!resolved) {
    return res.status(401).json({
      responseType: "F",
      responseValue: { message: "Authentication required." }
    });
  }

  if (resolved.accountType === 'admin') {
    return authenticateAdminToken(req, res, next);
  }
  return authenticateToken(req, res, next);
}

// Setup MFA: Generates secret, QR Code, and backup codes
router.post('/setup', authenticateUserOrAdmin, mfaController.setup);

// Verify setup TOTP code to activate MFA
router.post('/verify-setup', authenticateUserOrAdmin, mfaController.verifySetup);

// Get current MFA status & backup codes count
router.get('/status', authenticateUserOrAdmin, mfaController.getStatus);

// Disable MFA
router.post('/disable', authenticateUserOrAdmin, mfaController.disable);

// Regenerate backup codes
router.post('/regenerate-backup-codes', authenticateUserOrAdmin, mfaController.regenerateBackupCodes);

// Verify TOTP or backup code (login step)
router.post('/verify', authenticateUserOrAdmin, mfaController.verify);

module.exports = router;
