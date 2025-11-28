const jwt = require('jsonwebtoken');
const tokenService = require('./tokenService');

/**
 * Middleware to authenticate JWT tokens
 * Validates token signature, expiration, and checks against stored token (single-session policy)
 */
function authenticateToken(req, res, next) {
    // Extract token from Authorization header (format: "Bearer <token>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            responseType: "F", 
            responseValue: { message: "Access denied. Please login to continue." } 
        });
    }

    // Verify JWT token signature and expiration
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Token expired. Please login to continue.' } 
                });
            }
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: 'Invalid token. Please login to continue.' } 
            });
        }

        // Extract user ID from decoded token
        const userId = decoded.userId;
        
        // Check if token matches the stored token (enforces single-session policy)
        // This ensures only the latest login token is valid
        const storedToken = tokenService.getTokenForUser(userId);
        
        // If no token stored, null, or doesn't match, reject the request
        if (!storedToken || storedToken !== token) {
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: "Session expired. Please login to continue." } 
            });
        }

        // Token is valid, attach user info to request and proceed
        req.user = decoded;
        next();
    });
}

module.exports = { authenticateToken };