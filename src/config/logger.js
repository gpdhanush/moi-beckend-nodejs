const path = require('path');
const fs = require('fs');
const winston = require('winston');

const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const { combine, timestamp, printf, errors } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts, stack, ...meta }) => {
    let line = `${ts} [${level.toUpperCase()}] ${message}`;
    if (stack) line += `\n${stack}`;
    if (Object.keys(meta).length > 0) line += ` ${JSON.stringify(meta)}`;
    return line;
});

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: combine(
        errors({ stack: true }),
        timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        logFormat
    ),
    defaultMeta: {},
    transports: [
        new winston.transports.Console({
            format: combine(
                winston.format.colorize(),
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                logFormat
            )
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'error.log'),
            level: 'error',
            maxsize: 5 * 1024 * 1024,
            maxFiles: 5
        }),
        new winston.transports.File({
            filename: path.join(logsDir, 'combined.log'),
            maxsize: 5 * 1024 * 1024,
            maxFiles: 3
        })
    ]
});

/**
 * Log an error (message + optional Error object or metadata).
 * Use: logError('Password expiration check failed', err);
 * or:  logError('Failed', { userId: 123 });
 */
function logError(message, errOrMeta) {
    if (errOrMeta instanceof Error) {
        logger.error(message, { error: errOrMeta.message, stack: errOrMeta.stack });
    } else if (errOrMeta && typeof errOrMeta === 'object') {
        logger.error(message, errOrMeta);
    } else {
        logger.error(message);
    }
}

// Support logger.error('msg', err) so Error objects get stack logged
const originalError = logger.error.bind(logger);
logger.error = (msg, meta) => {
    if (meta instanceof Error) {
        logError(msg, meta);
    } else {
        originalError(msg, meta);
    }
};

module.exports = logger;
module.exports.logError = logError;
