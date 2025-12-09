const User = require('../models/user');
const { sendPushNotification } = require('../controllers/notificationController');
const { NotificationType, Notification } = require('../models/notificationModels');

/**
 * Check for users with passwords older than 3 months and send push notifications
 * This function is called by the cron job
 */
async function checkAndNotifyPasswordExpiration() {
    try {
        console.log('Checking for users with passwords older than 3 months...');
        
        // Find users with passwords older than 3 months
        const usersWithOldPasswords = await User.findUsersWithOldPasswords(3);
        
        if (usersWithOldPasswords.length === 0) {
            console.log('No users found with passwords older than 3 months.');
            return;
        }

        console.log(`Found ${usersWithOldPasswords.length} user(s) with passwords older than 3 months.`);

        // Send notifications to each user
        const notificationTitle = 'கடவுச்சொல் புதுப்பிப்பு நினைவூட்டல்';
        const notificationBody = 'உங்கள் கடவுச்சொல் 3 மாதங்களுக்கு மேல் மாற்றப்படவில்லை. உங்கள் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த, தயவுசெய்து உங்கள் கடவுச்சொல்லை மாற்றவும்.';

        for (const user of usersWithOldPasswords) {
            if (user.um_notification_token) {
                try {
                    // Check if notification was already sent today to prevent duplicates
                    const alreadySent = await Notification.wasSentToday(
                        user.um_id,
                        notificationTitle,
                        NotificationType.ACCOUNT
                    );

                    if (alreadySent) {
                        console.log(`Password expiration notification already sent today to user ${user.um_id} (${user.um_email}), skipping.`);
                        continue;
                    }

                    // Save notification to database FIRST to prevent race conditions
                    // This ensures wasSentToday will catch duplicates even if cron runs twice
                    let notificationId = null;
                    try {
                        const notificationResult = await Notification.create({
                            userId: user.um_id,
                            title: notificationTitle,
                            body: notificationBody,
                            type: NotificationType.ACCOUNT
                        });
                        notificationId = notificationResult.insertId;
                        
                        // Double-check after saving - if another process saved at the same time,
                        // we might have duplicates. Check if there are multiple records now.
                        const checkAgain = await Notification.wasSentToday(
                            user.um_id,
                            notificationTitle,
                            NotificationType.ACCOUNT
                        );
                        
                        // If checkAgain is true but we just saved, we need to verify we're not creating a duplicate
                        // Get count of notifications sent today
                        const db = require('../config/database');
                        const [countRows] = await db.query(
                            `SELECT COUNT(*) as count FROM gp_moi_notifications 
                             WHERE n_um_id = ? 
                             AND n_title = ? 
                             AND n_type = ? 
                             AND DATE(n_create_dt) = CURDATE() 
                             AND n_active = 'Y'`,
                            [user.um_id, notificationTitle, NotificationType.ACCOUNT]
                        );
                        
                        // If there's more than one notification (meaning another process also saved),
                        // delete ours and skip (let the other process handle it)
                        if (countRows[0].count > 1) {
                            await Notification.delete(notificationId);
                            console.log(`Duplicate notification detected for user ${user.um_id} (${user.um_email}), deleted our record and skipping.`);
                            continue;
                        }
                    } catch (dbError) {
                        // If we can't save to DB, check again - maybe another process already saved it
                        const alreadySentRetry = await Notification.wasSentToday(
                            user.um_id,
                            notificationTitle,
                            NotificationType.ACCOUNT
                        );
                        if (alreadySentRetry) {
                            console.log(`Password expiration notification already sent today to user ${user.um_id} (${user.um_email}), skipping.`);
                            continue;
                        }
                        throw dbError; // Re-throw if it's a different error
                    }

                    // Now send the FCM notification
                    try {
                        await sendPushNotification({
                            userId: user.um_id,
                            title: notificationTitle,
                            body: notificationBody,
                            token: user.um_notification_token,
                            type: NotificationType.ACCOUNT,
                            skipDbSave: true // Skip saving to DB since we already saved it
                        });
                        console.log(`Password expiration notification sent to user ${user.um_id} (${user.um_email})`);
                    } catch (fcmError) {
                        // If FCM send fails, delete the notification record we just created
                        if (notificationId) {
                            try {
                                await Notification.delete(notificationId);
                                console.log(`Deleted notification record ${notificationId} for user ${user.um_id} due to FCM send failure`);
                            } catch (deleteError) {
                                console.error(`Error deleting notification record ${notificationId}:`, deleteError);
                            }
                        }
                        throw fcmError;
                    }
                } catch (notificationError) {
                    console.error(`Error sending password expiration notification to user ${user.um_id}:`, notificationError);
                    // Continue with other users even if one fails
                }
            } else {
                console.log(`User ${user.um_id} (${user.um_email}) does not have a notification token, skipping.`);
            }
        }

        console.log('Password expiration check completed.');
    } catch (error) {
        console.error('Error in password expiration check:', error);
    }
}

module.exports = {
    checkAndNotifyPasswordExpiration
};
