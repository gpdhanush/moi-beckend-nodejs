const db = require('../config/database');
const logger = require('../config/logger');
const { toBinaryUUID, fromBinaryUUID } = require('../helpers/uuid');

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

        // New schema: check admins table (UUID)
        const isUuid = typeof userId === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(userId);
        if (isUuid) {
            const [adminRows] = await db.query(
                `SELECT id FROM admins WHERE id = ? AND status = 'ACTIVE' AND (is_deleted = 0 OR is_deleted IS NULL)`,
                [toBinaryUUID(userId)]
            );
            if (adminRows.length > 0) {
                req.isAdmin = true;
                req.adminId = fromBinaryUUID(adminRows[0].id);
                return next();
            }
        }

        // Legacy: check gp_moi_admin_master if it still exists (numeric id)
        const [adminRowsLegacy] = await db.query(
            `SELECT id FROM gp_moi_admin_master WHERE id = ? AND active = 'Y'`,
            [userId]
        ).catch(() => [[]]);
        if (adminRowsLegacy.length > 0) {
            req.isAdmin = true;
            req.adminId = adminRowsLegacy[0].id;
            return next();
        }

        // Legacy: check if it's a special admin user in users table (by email) - only when userId is UUID
        if (isUuid) {
            const [userRows] = await db.query(
                `SELECT id FROM users WHERE id = ? AND email = ? AND status = 'ACTIVE' AND (is_deleted = 0 OR is_deleted IS NULL)`,
                [toBinaryUUID(userId), 'agprakash406@gmail.com']
            ).catch(() => [[]]);
            if (userRows.length > 0) {
                req.isAdmin = true;
                req.adminId = fromBinaryUUID(userRows[0].id);
                return next();
            }
        }

        // User is not an admin
        return res.status(403).json({
            responseType: "F",
            responseValue: { message: "நீங்கள் நிர்வாகி அல்ல. இந்த செயலைச் செய்ய அனுமதி இல்லை." }
        });
    } catch (error) {
        logger.error('Error in isAdmin middleware', error);
        return res.status(500).json({
            responseType: "F",
            responseValue: { message: "சர்வர் பிழை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்." }
        });
    }
}

module.exports = { isAdmin };
