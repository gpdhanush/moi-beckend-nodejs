const express = require('express');
const router = express.Router();
const { generalRateLimiter } = require('../middlewares/apiSecurity');

// Apply general rate limit to all API routes
router.use(generalRateLimiter);

const user = require('./user');
const upcomingFunction = require('./upcomingFunction');
const defaults = require('./default');
const feedbacks = require('./feedbacks');
const email = require('./emailRoutes');
const uploadRoutes = require('./uploadRoutes');
const notificationRoutes = require('./notificationRoutes');
const dashboardRoutes = require('./dashboard');
const moiDefaultFunctions = require('./moiDefaultFunctions');
const moiPersons = require('./moiPersons');
const transactionRoutes = require('./transactions');
const transactionFunctionRoutes = require('./transactionFunctions');
const adminRoutes = require('./adminRoutes');

router.use('/users', user);
router.use("/default", defaults);
router.use("/feedbacks", feedbacks);
router.use("/email", email);
router.use("/upcoming-functions", upcomingFunction);
router.use("/notification", notificationRoutes);
router.use("/dashboard", dashboardRoutes);
router.use('/uploads', uploadRoutes);
router.use('/transactions', transactionRoutes);
router.use('/transaction-functions', transactionFunctionRoutes);
router.use('/moi-default-functions', moiDefaultFunctions);
router.use('/persons', moiPersons);
router.use('/admin', adminRoutes);

module.exports = router;
