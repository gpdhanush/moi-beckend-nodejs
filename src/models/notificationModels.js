const db = require('../config/database');
const table = "gp_moi_notifications";

const Notification = {
    /**
     * Create a new notification record
     * @param {Object} notificationData - { userId, title, body }
     * @returns {Promise} Database result
     */
    async create(notificationData) {
        const [result] = await db.query(
            `INSERT INTO ${table} (n_um_id, n_title, n_body) VALUES (?, ?, ?)`,
            [notificationData.userId, notificationData.title, notificationData.body]
        );
        return result;
    },

    /**
     * Get all notifications for a specific user
     * @param {number} userId - The user ID
     * @returns {Promise} Array of notifications
     */
    async findByUserId(userId) {
        const [rows] = await db.query(
            `SELECT * FROM ${table} WHERE n_um_id = ? AND n_active = 'Y' ORDER BY n_create_dt DESC`,
            [userId]
        );
        return rows;
    },

    /**
     * Get a notification by ID
     * @param {number} notificationId - The notification ID
     * @returns {Promise} Notification object
     */
    async findById(notificationId) {
        const [rows] = await db.query(
            `SELECT * FROM ${table} WHERE n_id = ?`,
            [notificationId]
        );
        return rows[0];
    },

    /**
     * Mark notification as read
     * @param {number} notificationId - The notification ID
     * @returns {Promise} Database result
     */
    async markAsRead(notificationId) {
        const [result] = await db.query(
            `UPDATE ${table} SET n_is_read = 'Y', n_read_time = ? WHERE n_id = ?`,
            [new Date(), notificationId]
        );
        return result;
    },

    /**
     * Mark notification as unread
     * @param {number} notificationId - The notification ID
     * @returns {Promise} Database result
     */
    async markAsUnread(notificationId) {
        const [result] = await db.query(
            `UPDATE ${table} SET n_is_read = 'N', n_read_time = NULL WHERE n_id = ?`,
            [notificationId]
        );
        return result;
    },

    /**
     * Delete/Deactivate a notification
     * @param {number} notificationId - The notification ID
     * @returns {Promise} Database result
     */
    async delete(notificationId) {
        const [result] = await db.query(
            `UPDATE ${table} SET n_active = 'N' WHERE n_id = ?`,
            [notificationId]
        );
        return result;
    },
}

module.exports = Notification;
