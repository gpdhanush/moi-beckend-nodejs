const express = require('express');
const router = express.Router();
const { getHealth, getLive, getReady } = require('../controllers/healthController');

// No auth, no rate limit - for load balancers and monitoring
router.get('/', getHealth);       // Full details: host, port, db, memory, etc.
router.get('/live', getLive);     // Liveness (process up)
router.get('/ready', getReady);   // Readiness (DB connected)

module.exports = router;
