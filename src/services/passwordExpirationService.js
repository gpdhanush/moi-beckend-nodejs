const User = require('../models/user');
const { sendPushNotification } = require('../controllers/notificationController');
const { NotificationType } = require('../models/notificationModels');

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
        for (const user of usersWithOldPasswords) {
            if (user.um_notification_token) {
                try {
                    await sendPushNotification({
                        userId: user.um_id,
                        title: 'கடவுச்சொல் புதுப்பிப்பு நினைவூட்டல்',
                        body: 'உங்கள் கடவுச்சொல் 3 மாதங்களுக்கு மேல் மாற்றப்படவில்லை. உங்கள் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த, தயவுசெய்து உங்கள் கடவுச்சொல்லை மாற்றவும்.',
                        token: user.um_notification_token,
                        type: NotificationType.ACCOUNT
                    });
                    console.log(`Password expiration notification sent to user ${user.um_id} (${user.um_email})`);
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
