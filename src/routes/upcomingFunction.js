const express = require('express');
const { controller } = require('../controllers/upcomingFunction');
const { authenticateToken } = require('../middlewares/auth');
const router = express.Router();

/// ==================== [ USER ENDPOINTS ] ====================
router.post('/list', authenticateToken, controller.list);
router.post('/create', authenticateToken, controller.create);
router.post('/update', authenticateToken, controller.update);
router.post('/update-status', authenticateToken, controller.updateStatus);
router.get('/delete/:id', authenticateToken, controller.delete);
module.exports = router;
