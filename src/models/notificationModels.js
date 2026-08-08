const db = require('../config/database');
const { generateUUID, toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');
const { getDbIdMode } = require('../helpers/dbIdMode');

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
        const type = notificationData.type || NotificationType.GENERAL;
        const idMode = await getDbIdMode(db);
        const rowValues = [
            toBinaryUUID(notificationData.userId),
            notificationData.title,
            notificationData.body,
            type
        ];

        if (idMode === 'uuid') {
            const id = generateUUID();
            await db.query(
                `INSERT INTO notifications (id, user_id, title, body, type, is_read, created_at)
                 VALUES (?, ?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
                [toBinaryUUID(id), ...rowValues]
            );
            return { insertId: String(id) };
        }

        const [result] = await db.query(
            `INSERT INTO notifications (user_id, title, body, type, is_read, created_at)
             VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)`,
            rowValues
        );
        return { insertId: String(result.insertId) };
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
        return Number(rows[0]?.count) || 0;
    },

    /**
     * Get total notifications count for a specific user
     * @param {string} userId - The user ID (UUID)
     * @returns {Promise<number>} Total count of notifications for user
     */
    async getTotalCountByUserId(userId) {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM notifications 
             WHERE user_id = ? AND (is_deleted = 0 OR is_deleted IS NULL)`,
            [toBinaryUUID(userId)]
        );
        return Number(rows[0]?.count) || 0;
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
     * Delete multiple notifications (soft delete)
     * @param {Array<string>} notificationIds - Array of notification UUIDs
     * @returns {Promise} Database result
     */
    async deleteMultiple(notificationIds) {
        if (!Array.isArray(notificationIds) || notificationIds.length === 0) {
            return { affectedRows: 0 };
        }
        const binaryIds = notificationIds.map(id => toBinaryUUID(id));
        const placeholders = binaryIds.map(() => '?').join(',');
        
        const [result] = await db.query(
            `UPDATE notifications SET is_deleted = 1, deleted_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
             WHERE id IN (${placeholders})`,
            binaryIds
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

    /**
     * Get all notifications across all users (with pagination) for Admin
     * @param {number} limit - Number of notifications to return
     * @param {number} offset - Offset for pagination
     * @returns {Promise} Array of notifications with user details
     */
    async findAll(limit = 50, offset = 0) {
        const [rows] = await db.query(
            `SELECT n.id, n.user_id, n.title, n.body, n.type, n.is_read, n.read_at, n.created_at, n.updated_at,
                    u.full_name, u.email, u.mobile
             FROM notifications n
             LEFT JOIN users u ON n.user_id = u.id
             WHERE (n.is_deleted = 0 OR n.is_deleted IS NULL)
             ORDER BY n.created_at DESC
             LIMIT ? OFFSET ?`,
            [limit, offset]
        );
        
        return rows.map(r => ({
            id: fromBinaryUUID(r.id),
            userId: fromBinaryUUID(r.user_id),
            userName: r.full_name || null,
            userEmail: r.email || null,
            userMobile: r.mobile || null,
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
     * Get total count of notifications
     * @returns {Promise<number>} Count of total notifications
     */
    async getTotalCount() {
        const [rows] = await db.query(
            `SELECT COUNT(*) as count FROM notifications 
             WHERE (is_deleted = 0 OR is_deleted IS NULL)`
        );
        return Number(rows[0]?.count) || 0;
    },
}

module.exports = {
    Notification,
    NotificationType,
    isValidNotificationType
};
