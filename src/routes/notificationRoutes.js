const express = require('express');
const { controller } = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/auth'); // Middleware for token validation

const router = express.Router();

// Public route - send notification (admin/system can send)
router.post('/sendNotification', controller.sendNotification);

// Protected routes - require authentication
router.get('/list', authenticateToken, controller.getAllNotifications);
router.put('/:id/read', authenticateToken, controller.markAsRead);
router.put('/:id/unread', authenticateToken, controller.markAsUnread);
router.get('/delete/:id', authenticateToken, controller.delete);

module.exports = router;
