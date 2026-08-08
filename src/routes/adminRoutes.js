const express = require('express');
const router = express.Router();
const { adminControllers } = require('../controllers/adminControllers');
const { authenticateAdminToken } = require('../middlewares/auth');

// All admin routes require admin authentication

/**
 * GET /apis/admin/otps
 * List all OTPs with user details
 * Query params: ?page=1&limit=25&type=LOGIN&is_used=0
 */
router.get('/otps', authenticateAdminToken, adminControllers.listOTPs);

/**
 * DELETE /apis/admin/otps/cleanup
 * Delete expired OTPs (admin maintenance)
 */
router.delete('/otps/cleanup', authenticateAdminToken, adminControllers.deleteExpiredOTPs);

module.exports = router;
