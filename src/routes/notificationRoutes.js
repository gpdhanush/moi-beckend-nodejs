const express = require('express');
const { controller } = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Public route - send notification (admin/system can send to any user)
// router.post('/send', controller.sendNotification);

// Protected routes - require authentication
// Get all notifications for authenticated user (with pagination support)
router.post('/list', authenticateToken, controller.getAllNotifications);

// Get unread notification count
router.get('/unread-count', authenticateToken, controller.getUnreadCount);

// Mark single notification as read
// Body: { notificationId }
router.post('/mark-as-read', authenticateToken, controller.markAsRead);

// Mark single notification as unread
// Body: { notificationId }
router.post('/mark-as-unread', authenticateToken, controller.markAsUnread);

// Mark all notifications as read for authenticated user
router.post('/mark-all-as-read', authenticateToken, controller.markAllAsRead);

// Delete notification (soft delete)
// Body: { notificationId }
router.post('/delete', authenticateToken, controller.delete);

module.exports = router;
