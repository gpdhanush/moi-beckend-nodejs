const db = require('../config/database');
const { fromBinaryUUID } = require('../helpers/uuid');
const { sendPushNotification } = require('../controllers/notificationController');
const { Notification, NotificationType } = require('../models/notificationModels');
const logger = require('../config/logger');

function getTomorrowInIndia() {
    const parts = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    }).formatToParts(new Date());
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
    const tomorrow = new Date(Date.UTC(
        Number(values.year),
        Number(values.month) - 1,
        Number(values.day) + 1
    ));

    return tomorrow.toISOString().slice(0, 10);
}

async function sendUpcomingFunctionReminders() {
    const tomorrow = getTomorrowInIndia();
    const [rows] = await db.query(
        `SELECT f.user_id, f.title, f.function_date, f.location, ud.fcm_token
         FROM upcoming_functions f
         INNER JOIN user_devices ud ON ud.user_id = f.user_id
             AND ud.is_active = 1
             AND (ud.is_deleted = 0 OR ud.is_deleted IS NULL)
         WHERE f.function_date = ?
           AND f.status = 'ACTIVE'
           AND (f.is_deleted = 0 OR f.is_deleted IS NULL)
           AND ud.fcm_token IS NOT NULL
           AND ud.fcm_token <> ''
         ORDER BY f.user_id, f.function_date, f.title`,
        [tomorrow]
    );

    const functionsByUser = new Map();
    for (const row of rows) {
        const userId = fromBinaryUUID(row.user_id);
        if (!functionsByUser.has(userId)) functionsByUser.set(userId, new Map());

        const functionKey = `${row.title}|${row.location || ''}`;
        if (!functionsByUser.get(userId).has(functionKey)) {
            functionsByUser.get(userId).set(functionKey, {
                title: row.title,
                location: row.location,
                tokens: new Set()
            });
        }
        functionsByUser.get(userId).get(functionKey).tokens.add(row.fcm_token);
    }

    let sentCount = 0;
    for (const [userId, functions] of functionsByUser) {
        const title = 'நாளைய நிகழ்வு நினைவூட்டல்';
        const body = [...functions.values()]
            .map(upcomingFunction => {
                const location = upcomingFunction.location ? ` இடம்: ${upcomingFunction.location}` : '';
                return `${upcomingFunction.title}${location}`;
            })
            .join('\n');
        const tokens = [...new Set([...functions.values()].flatMap(upcomingFunction => [...upcomingFunction.tokens]))];

        if (await Notification.wasSentToday(userId, title, NotificationType.FUNCTION)) {
            logger.info('Upcoming function reminder already sent today', { userId });
            continue;
        }

        let savedNotification = false;
        for (const token of tokens) {
            try {
                await sendPushNotification({
                    userId,
                    title,
                    body,
                    token,
                    type: NotificationType.FUNCTION,
                    skipDbSave: savedNotification
                });
                savedNotification = true;
                sentCount += 1;
            } catch (error) {
                logger.error('Error sending upcoming function reminder', {
                    userId,
                    error: error.message
                });
            }
        }
    }

    logger.info('Upcoming function reminders completed', { tomorrow, sentCount });
    return { tomorrow, sentCount };
}

module.exports = { sendUpcomingFunctionReminders };