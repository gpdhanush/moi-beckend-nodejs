const express = require('express');
const { controller } = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Protected routes - require authentication
// Get all notifications for authenticated user (with pagination support)
router.post('/list', authenticateToken, controller.getAllNotifications);

// Get unread notification count
// router.get('/unread-count', authenticateToken, controller.getUnreadCount);

// Mark single notification as read
// Body: { notificationId }
router.post('/mark-as-read', authenticateToken, controller.markAsRead);

// Mark single notification as unread
// Body: { notificationId }
router.post('/mark-as-unread', authenticateToken, controller.markAsUnread);

// Mark all notifications as read for authenticated user
router.post('/mark-all-as-read', authenticateToken, controller.markAllAsRead);

// Diagnostic endpoint - check Firebase and system status
// GET /notifications/health
router.get('/health', controller.checkStatus);

// Send bulk notifications to multiple users
// Body: { userIds: [], title, body, type? }
router.post("/admin/send-bulk", controller.sendBulkNotifications);

// Delete notification (soft delete)
// Body: { notificationId }
router.post('/delete', controller.delete);

module.exports = router;
