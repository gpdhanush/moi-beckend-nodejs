const MoiFunctions = require('../models/moiFunctions');
const { sendPushNotification } = require('../controllers/notificationController');
const { NotificationType } = require('../models/notificationModels');
const { fromBinaryUUID } = require('../helpers/uuid');
const logger = require('../config/logger');

/**
 * Check for functions that are 1 day away (tomorrow) and send push notifications
 * This function is called by the cron job
 */
async function checkAndNotifyUpcomingFunctions() {
    try {
        logger.info('Checking for functions that are 1 day away...');
        
        // Find functions that are 1 day away (tomorrow)
        const upcomingFunctions = await MoiFunctions.findFunctionsOneDayAway();
        
        if (upcomingFunctions.length === 0) {
            logger.info('No functions found that are 1 day away.');
            return;
        }

        logger.info(`Found ${upcomingFunctions.length} function(s) that are 1 day away.`);

        // Send notifications to each user
        for (const functionData of upcomingFunctions) {
            if (functionData.um_notification_token) {
                try {
                    const userId = fromBinaryUUID(functionData.um_id);
                    await sendPushNotification({
                        userId: userId,
                        title: 'விழா நினைவூட்டல்',
                        body: `நாளை உங்களுக்கு ${functionData.title} விழா உள்ளது. இடம்: ${functionData.location || 'இடம் குறிப்பிடப்படவில்லை'}. தயவுசெய்து தயாராக இருங்கள்.`,
                        token: functionData.um_notification_token,
                        type: NotificationType.FUNCTION
                    });
                    logger.info(`Function reminder notification sent to user ${userId} (${functionData.um_email}) for function: ${functionData.title}`);
                } catch (notificationError) {
                    logger.error(`Error sending function reminder notification to user ${fromBinaryUUID(functionData.um_id)}:`, notificationError);
                    // Continue with other functions even if one fails
                }
            } else {
                logger.info(`User ${fromBinaryUUID(functionData.um_id)} (${functionData.um_email}) does not have a notification token, skipping.`);
            }
        }

        logger.info('Function reminder check completed.');
    } catch (error) {
        logger.error('Error in function reminder check:', error);
    }
}

module.exports = {
    checkAndNotifyUpcomingFunctions
};
