const UpcomingFunction = require('../models/upcomingFunction');
const logger = require('../config/logger');

/**
 * Auto-update status for upcoming functions where date has passed
 * This function can be called manually or scheduled via cron job
 */
async function updateStatusForPastDates() {
    try {
        logger.info('Updating status for upcoming functions with past dates...');
        
        const result = await UpcomingFunction.updateStatusByDate();
        
        logger.info(`Updated status for ${result.affectedRows || 0} upcoming function(s) with past dates.`);
        
        return result;
    } catch (error) {
        logger.error('Error updating status for past dates', error);
        throw error;
    }
}

module.exports = {
    updateStatusForPastDates
};
