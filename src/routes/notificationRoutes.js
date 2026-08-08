const express = require('express');
const { controller } = require('../controllers/notificationController');
const { authenticateToken } = require('../middlewares/auth');

const router = express.Router();

// Protected routes - require authentication
// Get all notifications for authenticated user (with pagination support)
router.post('/list', authenticateToken, controller.getAllNotifications);

// Get unread notification count
router.get('/unread-count', authenticateToken, controller.getUnreadCount);
router.post('/unread-count', authenticateToken, controller.getUnreadCount);

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

// Send notification to a single user based on userId
// Body: { userId, title, body, type? }
router.post("/admin/send", controller.sendNotificationToUser);

// Get all notifications across all users without userId (Admin GET & POST)
// Query/Body: ?limit=50&offset=0
router.get("/admin/all", controller.getAllNotificationsAdmin);
router.post("/admin/all", controller.getAllNotificationsAdmin);

// Get notification list for a single user based on userId (Admin GET & POST)
// Body / Query: { userId, limit?, offset? } or /admin/user-notifications/:userId
router.get("/admin/user-notifications", controller.getNotificationsByUserId);
router.get("/admin/user-notifications/:userId", controller.getNotificationsByUserId);
router.post("/admin/user-notifications", controller.getNotificationsByUserId);

// Delete single notification (soft delete)
// Body/Query/Params: { notificationId } or /delete/:notificationId
router.post('/delete', controller.delete);
router.delete('/delete', controller.delete);
router.delete('/delete/:notificationId', controller.delete);
router.post('/admin/delete', controller.delete);
router.delete('/admin/delete/:notificationId', controller.delete);

// Delete multiple notifications (soft delete)
// Body: { notificationIds: ["uuid1", "uuid2"] }
router.post('/delete-multiple', controller.deleteMultiple);
router.post('/delete-bulk', controller.deleteMultiple);
router.post('/admin/delete-bulk', controller.deleteMultiple);

module.exports = router;
