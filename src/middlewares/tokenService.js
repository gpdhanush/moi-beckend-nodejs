const jwt = require('jsonwebtoken');
const userTokens = {};
function generateToken(userId) {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '2 days' });
    userTokens[userId] = token;
    return token;
}
function invalidatePreviousToken(userId) {
    userTokens[userId] = null; 
}
function getTokenForUser(userId) {
    return userTokens[userId];
}

module.exports = {
    generateToken,
    invalidatePreviousToken,
    getTokenForUser
};
