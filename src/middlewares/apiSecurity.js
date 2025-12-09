const rateLimit = require('express-rate-limit');

/**
 * Middleware to validate API secret key
 * Requires X-API-Key header with valid secret
 */
function validateApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'] || req.headers['X-API-Key'];
    const validApiKey = process.env.API_SECRET_KEY;

    if (!validApiKey) {
        console.error('API_SECRET_KEY is not set in environment variables');
        return res.status(500).json({
            responseType: "F",
            responseValue: { message: "Server configuration error." }
        });
    }

    if (!apiKey) {
        return res.status(401).json({
            responseType: "F",
            responseValue: { message: "API key is required. Please include X-API-Key header." }
        });
    }

    if (apiKey !== validApiKey) {
        return res.status(403).json({
            responseType: "F",
            responseValue: { message: "Invalid API key. Access denied." }
        });
    }

    next();
}

/**
 * Rate limiter for registration endpoint
 * Limits to 5 registration attempts per IP per 15 minutes
 */
const registrationRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 requests per windowMs
    message: {
        responseType: "F",
        responseValue: { message: "Too many registration attempts. Please try again later." }
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    handler: (req, res) => {
        res.status(429).json({
            responseType: "F",
            responseValue: { message: "Too many registration attempts from this IP. Please try again after 15 minutes." }
        });
    }
});

/**
 * Optional: Validate request origin (if you want to restrict to specific domains)
 * Set ALLOWED_ORIGINS in .env as comma-separated list: "https://yourapp.com,https://www.yourapp.com"
 */
function validateOrigin(req, res, next) {
    const allowedOrigins = process.env.ALLOWED_ORIGINS;
    
    // If no allowed origins configured, skip validation
    if (!allowedOrigins) {
        return next();
    }

    const origin = req.headers.origin || req.headers.referer;
    const originList = allowedOrigins.split(',').map(o => o.trim());

    // Allow requests without origin (like Postman, direct API calls with API key)
    if (!origin) {
        return next();
    }

    const isAllowed = originList.some(allowedOrigin => {
        return origin.startsWith(allowedOrigin);
    });

    if (!isAllowed) {
        return res.status(403).json({
            responseType: "F",
            responseValue: { message: "Request origin not allowed." }
        });
    }

    next();
}

module.exports = {
    validateApiKey,
    registrationRateLimiter,
    validateOrigin
};
