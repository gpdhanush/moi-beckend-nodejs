const jwt = require('jsonwebtoken');
const tokenService = require('./tokenService');

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token) {
        return res.status(401).json({ responseType: "F", responseValue: { message: "Access denied. Please login to continue." } });
    }
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ responseType: "F", responseValue: { message: 'Token expired. Please login to continue.' }}); 
              }
              return res.status(401).json({ responseType: "F", responseValue: { message: 'Invalid token. Please login to continue.' }});
            // return res.status(401).json({ responseType: "F", responseValue: { message: "Session expired. Please login to continue." } });
        }
        const userId1 = user.userId;
        const latestToken = tokenService.getTokenForUser(userId1);
        if (latestToken !== token) {
            return res.status(401).json({ responseType: "F", responseValue: { message: "Session expired. Please login to continue." } });
        }
        req.user = user;
        next();
    });
}
module.exports = { authenticateToken };