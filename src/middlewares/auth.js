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
            responseValue: { message: "அணுகல் மறுக்கப்பட்டது. தயவுசெய்து தொடர உள்நுழையவும்." } 
        });
    }

    // Verify JWT token signature and expiration
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    responseType: "F", 
                    responseValue: { message: 'டோக்கன் காலாவதியாகிவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்.' } 
                });
            }
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: 'தவறான டோக்கன். தயவுசெய்து தொடர உள்நுழையவும்.' } 
            });
        }

        // Extract user ID from decoded token and normalize to number
        const userId = Number(decoded.userId);
        
        // Validate userId exists
        if (!userId || isNaN(userId)) {
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: "Invalid token. Please login to continue." } 
            });
        }
        
        // Check if token matches the stored token (enforces single-session policy)
        // This ensures only the latest login token is valid
        const storedToken = tokenService.getTokenForUser(userId);
        
        // If no token stored, null, or doesn't match, reject the request
        if (!storedToken || storedToken !== token) {
            return res.status(401).json({ 
                responseType: "F", 
                responseValue: { message: "அமர்வு காலாவதியாகிவிட்டது. தயவுசெய்து தொடர உள்நுழையவும்." } 
            });
        }

        // Token is valid, attach user info to request and proceed
        // Ensure userId is normalized in the request object
        req.user = {
            ...decoded,
            userId: userId
        };
        next();
    });
}

module.exports = { authenticateToken };