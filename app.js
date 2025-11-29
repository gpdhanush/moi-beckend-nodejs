const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();
const routes = require('./src/routes');
const { checkAndNotifyPasswordExpiration } = require('./src/services/passwordExpirationService');
const { checkAndNotifyUpcomingFunctions } = require('./src/services/functionReminderService');
const app = express();
const https = require('https');
https.globalAgent.options.rejectUnauthorized = false;

// Middleware
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Routes
app.use('/apis', routes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // Schedule password expiration check to run daily at 9:00 AM
    // Cron format: minute hour day month day-of-week
    // '0 9 * * *' means: at 9:00 AM every day
    cron.schedule('0 9 * * *', () => {
        console.log('Running scheduled password expiration check...');
        checkAndNotifyPasswordExpiration();
    });
    
    console.log('Password expiration check scheduled to run daily at 9:00 AM');
    
    // Schedule function reminder check to run daily at 9:00 AM
    // This checks for functions that are 1 day away (tomorrow)
    cron.schedule('0 9 * * *', () => {
        console.log('Running scheduled function reminder check...');
        checkAndNotifyUpcomingFunctions();
    });
    
    console.log('Function reminder check scheduled to run daily at 9:00 AM');
});

// Start server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
