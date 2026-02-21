const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();
const routes = require('./src/routes');
const healthRoutes = require('./src/routes/health');
const logger = require('./src/config/logger');
const { checkAndNotifyPasswordExpiration } = require('./src/services/passwordExpirationService');
const { checkAndNotifyUpcomingFunctions } = require('./src/services/functionReminderService');
const app = express();

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Health routes (no rate limit, no auth) – host, port, db, memory, etc.
app.use('/health', healthRoutes);
// API routes
app.use('/apis', routes);

const PORT = process.env.PORT || 3000;

// Cron lock: ensure only one execution at a time (no overlapping or loop)
let isDailyCronRunning = false;

app.listen(PORT, () => {
    logger.info(`Server is running on http://localhost:${PORT}`);

    cron.schedule('0 9 * * *', async () => {
        if (isDailyCronRunning) {
            logger.warn('Daily cron already running, skipping this trigger.');
            return;
        }
        isDailyCronRunning = true;
        try {
            logger.info('Running scheduled daily jobs...');
            await checkAndNotifyPasswordExpiration();
            await checkAndNotifyUpcomingFunctions();
            logger.info('Daily cron jobs completed.');
        } catch (err) {
            logger.error('Error in daily cron', err);
        } finally {
            isDailyCronRunning = false;
        }
    });
    logger.info('Daily cron scheduled at 9:00 AM (password expiration + function reminder).');
});

// Global error handler – log every error with request context
app.use((err, req, res, next) => {
    logger.error('Unhandled error', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        query: req.query,
        body: req.body && Object.keys(req.body).length ? '[present]' : undefined
    });
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
