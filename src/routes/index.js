const express = require('express');
const router = express.Router();

const user = require('./user');
const moi = require('./moi');
const moiOut = require('./moi-out');
const moiFunctions = require('./moiFunctions');
const upcomingFunction = require('./upcomingFunction');
const defaults = require('./default');
const feedbacks = require('./feedbacks');
const email = require('./emailRoutes');
const uploadRoutes = require('./uploadRoutes');
const adminRoutes = require('./adminRoutes');
const notificationRoutes = require('./notificationRoutes');
const moiCreditDebit = require('./moiCreditDebit');
const moiDefaultFunctions = require('./moiDefaultFunctions');
const moiPersons = require('./moiPersons');
const employeeRoutes = require('./employee');


router.use('/users', user);
router.use('/moi', moi);
router.use('/moi-out', moiOut);
router.use('/moi-function', moiFunctions);
router.use('/upcoming-function', upcomingFunction);
router.use('/default', defaults);
router.use('/feedbacks', feedbacks);
router.use('/email', email);
router.use('/uploads', uploadRoutes);
router.use('/notification', notificationRoutes);
// NEW MOI CREDIT/DEBIT ROUTES
router.use('/moi-credit-debit', moiCreditDebit);
router.use('/moi-default-functions', moiDefaultFunctions);
router.use('/moi-persons', moiPersons);
// ADMIN ROUTES
router.use('/admin', adminRoutes);
// EMPLOYEE ROUTES
router.use('/employee', employeeRoutes);




module.exports = router;
