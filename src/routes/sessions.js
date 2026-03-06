const express = require('express');
const { sessionController } = require('../controllers/sessionController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// User session endpoints
router.post('/list', authenticateToken, sessionController.getUserSessions);
router.post('/active', authenticateToken, sessionController.getActiveSessions);
router.post('/logout', authenticateToken, sessionController.logout);

module.exports = router;
