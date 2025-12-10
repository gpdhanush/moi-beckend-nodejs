const db = require('../config/database');

/**
 * Middleware to check if the authenticated user is an admin
 * This should be used after authenticateToken middleware
 * Checks both admin_master table and specific admin email in user_master
 */
async function isAdmin(req, res, next) {
    try {
        // Get userId from the authenticated token (set by authenticateToken middleware)
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({
                responseType: "F",
                responseValue: { message: "அணுகல் மறுக்கப்பட்டது. தயவுசெய்து தொடர உள்நுழையவும்." }
            });
        }

        // First, check if user exists in admin_master table
        const [adminRows] = await db.query(
            `SELECT * FROM gp_moi_admin_master WHERE id = ? AND active = 'Y'`,
            [userId]
        );

        if (adminRows.length > 0) {
            // User is admin from admin_master table
            req.isAdmin = true;
            req.adminId = adminRows[0].id;
            return next();
        }

        // If not found in admin_master, check if it's a special admin user in user_master
        // Check by admin email (agprakash406@gmail.com is the admin email from the system)
        const [userRows] = await db.query(
            `SELECT * FROM gp_moi_user_master WHERE um_id = ? AND um_email = ? AND um_status = 'Y'`,
            [userId, 'agprakash406@gmail.com']
        );

        if (userRows.length > 0) {
            // User is admin from user_master table
            req.isAdmin = true;
            req.adminId = userRows[0].um_id;
            return next();
        }

        // User is not an admin
        return res.status(403).json({
            responseType: "F",
            responseValue: { message: "நீங்கள் நிர்வாகி அல்ல. இந்த செயலைச் செய்ய அனுமதி இல்லை." }
        });
    } catch (error) {
        console.error('Error in isAdmin middleware:', error);
        return res.status(500).json({
            responseType: "F",
            responseValue: { message: "சர்வர் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்." }
        });
    }
}

module.exports = { isAdmin };
