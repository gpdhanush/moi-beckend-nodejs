const os = require('os');
const db = require('../config/database');

/**
 * Health check with advanced server and config details (no secrets).
 * GET /health - full details; GET /health/live - minimal (for k8s/load balancer).
 */
async function getHealth(req, res) {
    const start = process.hrtime.bigint();
    let dbStatus = 'unknown';
    let dbLatencyMs = null;

    try {
        const [rows] = await db.query('SELECT 1');
        dbStatus = rows && rows.length ? 'connected' : 'unexpected';
        const end = process.hrtime.bigint();
        dbLatencyMs = Number(end - start) / 1e6;
    } catch (err) {
        dbStatus = 'error';
    }

    const mem = process.memoryUsage();
    const uptimeSeconds = process.uptime();

    const payload = {
        status: dbStatus === 'connected' ? 'healthy' : 'degraded',
        timestamp: new Date().toISOString(),
        server: {
            host: os.hostname(),
            port: parseInt(process.env.PORT, 10) || 3000,
            nodeVersion: process.version,
            platform: process.platform,
            arch: process.arch,
            pid: process.pid,
            env: process.env.NODE_ENV || 'development',
        },
        database: {
            status: dbStatus,
            host: process.env.DB_HOST || '(not set)',
            port: process.env.DB_PORT || '3306',
            database: process.env.DB_NAME || '(not set)',
            user: process.env.DB_USER || '(not set)',
            latencyMs: dbLatencyMs != null ? Math.round(dbLatencyMs * 100) / 100 : null,
        },
        process: {
            uptimeSeconds: Math.round(uptimeSeconds * 100) / 100,
            uptimeFormatted: formatUptime(uptimeSeconds),
            memory: {
                rssMb: Math.round(mem.rss / 1024 / 1024 * 100) / 100,
                heapUsedMb: Math.round(mem.heapUsed / 1024 / 1024 * 100) / 100,
                heapTotalMb: Math.round(mem.heapTotal / 1024 / 1024 * 100) / 100,
                externalMb: Math.round((mem.external || 0) / 1024 / 1024 * 100) / 100,
            },
        },
        system: {
            cpus: os.cpus().length,
            totalMemoryMb: Math.round(os.totalmem() / 1024 / 1024),
            freeMemoryMb: Math.round(os.freemem() / 1024 / 1024),
            loadAvg: os.loadavg(),
        },
    };

    const statusCode = payload.status === 'healthy' ? 200 : 503;
    res.status(statusCode).json(payload);
}

function formatUptime(seconds) {
    const d = Math.floor(seconds / 86400);
    const h = Math.floor((seconds % 86400) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    const parts = [];
    if (d) parts.push(`${d}d`);
    if (h) parts.push(`${h}h`);
    if (m) parts.push(`${m}m`);
    parts.push(`${s}s`);
    return parts.join(' ');
}

/** Minimal liveness probe (no DB check). */
function getLive(req, res) {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptimeSeconds: Math.round(process.uptime() * 100) / 100,
    });
}

/** Readiness: includes DB check. */
async function getReady(req, res) {
    try {
        await db.query('SELECT 1');
        res.status(200).json({
            status: 'ready',
            timestamp: new Date().toISOString(),
            database: 'connected',
        });
    } catch (err) {
        res.status(503).json({
            status: 'not_ready',
            timestamp: new Date().toISOString(),
            database: 'disconnected',
        });
    }
}

module.exports = {
    getHealth,
    getLive,
    getReady,
};
