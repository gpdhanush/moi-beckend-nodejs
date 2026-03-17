const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

// Notification Type Enum
const NotificationType = {
    MOI: 'moi',
    MOI_OUT: 'moiOut',
    FUNCTION: 'function',
    ACCOUNT: 'account',
    SETTINGS: 'settings',
    FEEDBACK: 'feedback',
    GENERAL: 'general'
};

// Helper function to validate notification type
function isValidNotificationType(type) {
    return Object.values(NotificationType).includes(type);
}

const Notification = {
    /**
     * Create a new notification record
     * @param {Object} notificationData - { userId, title, body, type }
     * @returns {Promise} Database result
     */
    async create(notificationData) {
        const id = generateUUID();
        const type = notificationData.type || NotificationType.GENERAL;
        
        const [result] = await db.query(
            `INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
             VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
            [toBinaryUUID(id), toBinaryUUID(notificationData.userId), notificationData.title, notificationData.body, type]
        );
        return { insertId: id };
    },

    /**
     * Get all notifications for a specific user (with pagination)
     * @param {string} userId - The user ID (UUID)
     * @param {number} limit - Number of notifications to return
     * @param {number} offset - Offset for pagination
     * @returns {Promise} Array of notifications
     */
    async findByUserId(userId, limit = 50, offset = 0) {
        const [rows] = await db.query(
            `SELECT id, user_id, title, body, type, is_read, read_at, created_at, updated_at
             FROM notifications 
             WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)
             ORDER BY created_at DESC
             LIMIT ? OFFSET ?`,
            [toBinaryUUID(userId), limit, offset]
        );
        
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            title: r.title,
            body: r.body,
            type: r.type,
            isRead: r.is_read === 1,
            readAt: r.read_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        }));
    },

    /**
     * Get unread notifications count for a user
     * @param {string} userId - The user ID (UUID)
     * @returns {Promise<number>} Count of unread notifications
     */
    async getUnreadCount(userId) {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM notifications 
             WHERE user_id = ? AND is_read = 0 AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(userId)]
        );
        return rows[0].count;
    },

    /**
     * Get a notification by ID
     * @param {string} notificationId - The notification ID (UUID)
     * @returns {Promise} Notification object
     */
    async findById(notificationId) {
        const [rows] = await db.query(
            `SELECT * FROM notifications WHERE id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(notificationId)]
        );
        
        if (!rows[0]) return null;
        
        const r = rows[0];
        return {
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            title: r.title,
            body: r.body,
            type: r.type,
            isRead: r.is_read === 1,
            readAt: r.read_at,
            createdAt: r.created_at,
            updatedAt: r.updated_at
        };
    },

    /**
     * Mark notification as read
     * @param {string} notificationId - The notification ID (UUID)
     * @returns {Promise} Database result
     */
    async markAsRead(notificationId) {
        const [result] = await db.query(
            `UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP 
             WHERE id = ?`,
            [toBinaryUUID(notificationId)]
        );
        return result;
    },

    /**
     * Mark notification as unread
     * @param {string} notificationId - The notification ID (UUID)
     * @returns {Promise} Database result
     */
    async markAsUnread(notificationId) {
        const [result] = await db.query(
            `UPDATE notifications SET is_read = 0, read_at = NULL, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(notificationId)]
        );
        return result;
    },

    /**
     * Delete notification (soft delete)
     * @param {string} notificationId - The notification ID (UUID)
     * @returns {Promise} Database result
     */
    async delete(notificationId) {
        const [result] = await db.query(
            `UPDATE notifications SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id = ?`,
            [toBinaryUUID(notificationId)]
        );
        return result;
    },

    /**
     * Check if a notification with the same title and type was sent to a user today
     * @param {string} userId - The user ID (UUID)
     * @param {string} title - The notification title
     * @param {string} type - The notification type
     * @returns {Promise<boolean>} True if notification was sent today, false otherwise
     */
    async wasSentToday(userId, title, type) {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM notifications
             WHERE user_id = ? 
             AND title = ? 
             AND type = ? 
             AND DATE(created_at) = CURDATE()
             AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(userId), title, type]
        );
        return rows[0].count > 0;
    },

    /**
     * Mark all notifications as read for a user
     * @param {string} userId - The user ID (UUID)
     * @returns {Promise} Database result
     */
    async markAllAsRead(userId) {
        const [result] = await db.query(
            `UPDATE notifications SET is_read = 1, read_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ? AND is_read = 0 AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(userId)]
        );
        return result;
    },

    /**
     * Delete all notifications for a user (soft delete)
     * @param {string} userId - The user ID (UUID)
     * @returns {Promise} Database result
     */
    async deleteAllByUser(userId) {
        const [result] = await db.query(
            `UPDATE notifications SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(userId)]
        );
        return result;
    },
}

module.exports = {
    Notification,
    NotificationType,
    isValidNotificationType
};
