const UpcomingFunction = require('../models/upcomingFunction');

/**
 * Auto-update status for upcoming functions where date has passed
 * This function can be called manually or scheduled via cron job
 */
async function updateStatusForPastDates() {
    try {
        console.log('Updating status for upcoming functions with past dates...');
        
        const result = await UpcomingFunction.updateStatusByDate();
        
        console.log(`Updated status for ${result.affectedRows || 0} upcoming function(s) with past dates.`);
        
        return result;
    } catch (error) {
        console.error('Error updating status for past dates:', error);
        throw error;
    }
}

module.exports = {
    updateStatusForPastDates
};
