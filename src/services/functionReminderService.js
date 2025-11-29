const MoiFunctions = require('../models/moiFunctions');
const { sendPushNotification } = require('../controllers/notificationController');
const { NotificationType } = require('../models/notificationModels');

/**
 * Check for functions that are 1 day away (tomorrow) and send push notifications
 * This function is called by the cron job
 */
async function checkAndNotifyUpcomingFunctions() {
    try {
        console.log('Checking for functions that are 1 day away...');
        
        // Find functions that are 1 day away (tomorrow)
        const upcomingFunctions = await MoiFunctions.findFunctionsOneDayAway();
        
        if (upcomingFunctions.length === 0) {
            console.log('No functions found that are 1 day away.');
            return;
        }

        console.log(`Found ${upcomingFunctions.length} function(s) that are 1 day away.`);

        // Send notifications to each user
        for (const functionData of upcomingFunctions) {
            if (functionData.um_notification_token) {
                try {
                    await sendPushNotification({
                        userId: functionData.f_um_id,
                        title: 'விழா நினைவூட்டல்',
                        body: 'நாளை உங்களுக்கு ஒரு முக்கிய விழா உள்ளது. தயவுசெய்து தயாராக இருங்கள்.',
                        token: functionData.um_notification_token,
                        type: NotificationType.FUNCTION
                    });
                    console.log(`Function reminder notification sent to user ${functionData.f_um_id} (${functionData.um_email}) for function: ${functionData.function_name}`);
                } catch (notificationError) {
                    console.error(`Error sending function reminder notification to user ${functionData.f_um_id}:`, notificationError);
                    // Continue with other functions even if one fails
                }
            } else {
                console.log(`User ${functionData.f_um_id} (${functionData.um_email}) does not have a notification token, skipping.`);
            }
        }

        console.log('Function reminder check completed.');
    } catch (error) {
        console.error('Error in function reminder check:', error);
    }
}

module.exports = {
    checkAndNotifyUpcomingFunctions
};
