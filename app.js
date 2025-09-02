const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const routes = require('./src/routes');
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
});

// Start server
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

module.exports = app;
