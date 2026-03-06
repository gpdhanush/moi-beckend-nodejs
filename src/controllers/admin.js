const AdminModel = require('../models/admin');
const bcrypt = require('bcryptjs');
const tokenService = require('../middlewares/tokenService');
const logger = require('../config/logger');

const adminError = "குறிப்பிடப்பட்ட நிர்வாகி இல்லை!";

exports.adminController = {
    /**
     * Admin login - Issue JWT token
     * Body: { email, password }
     */
    login: async (req, res) => {
        const { email, password } = req.body;

        try {
            // Validate required fields
            if (!email || !password) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவையானவை!' }
                });
            }

            // Find active admin
            const admin = await AdminModel.findByEmail(email);
            if (!admin) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: 'தவறான மின்னஞ்சல் ஐடி!' }
                });
            }

            // Check if account is blocked
            try {
                const blockStatus = await AdminModel.getLoginBlockStatus(admin.id);
                if (blockStatus.is_blocked) {
                    const minutesRemaining = Math.ceil((new Date(blockStatus.blocked_until) - new Date()) / (1000 * 60));
                    return res.status(429).json({
                        responseType: "F",
                        responseValue: {
                            message: `மிக அதிக தோல்வி முயற்சிகள். ${minutesRemaining} நிமிடங்களில் மீண்டும் முயற்சி செய்க.`,
                            retry_after_minutes: minutesRemaining,
                            blocked_until: blockStatus.blocked_until,
                            account_status: 'BLOCKED'
                        }
                    });
                }
            } catch (blockCheckErr) {
                logger.warn('Error checking admin login block status:', blockCheckErr);
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
            if (!isPasswordValid) {
                try {
                    const failureStatus = await AdminModel.incrementFailedLoginAttempts(admin.id);
                    if (failureStatus.blocked) {
                        return res.status(429).json({
                            responseType: "F",
                            responseValue: {
                                message: 'மிக அதிக தோல்வி முயற்சிகள். கணக்கு 15 நிமிடங்களுக்கு பூட்டப்பட்டுள்ளது.',
                                attempts: failureStatus.attempts,
                                blocked_until: failureStatus.blocked_until,
                                account_status: 'BLOCKED'
                            }
                        });
                    } else {
                        return res.status(401).json({
                            responseType: "F",
                            responseValue: {
                                message: `கடவுச்சொல் தவறானது. ${failureStatus.remaining_attempts} முயற்சிகள் மீதமுள்ளது.`,
                                remaining_attempts: failureStatus.remaining_attempts
                            }
                        });
                    }
                } catch (err) {
                    logger.warn('Admin login blocking feature error:', err);
                    return res.status(401).json({
                        responseType: "F",
                        responseValue: { message: 'கடவுச்சொல் தவறானது.' }
                    });
                }
            }

            // Reset failed attempts on successful login
            try {
                await AdminModel.resetFailedLoginAttempts(admin.id);
            } catch (err) {
                logger.warn('Failed to reset admin login attempts:', err);
            }

            // Check if account is active
            if (admin.status !== 'ACTIVE') {
                return res.status(403).json({
                    responseType: "F",
                    responseValue: {
                        message: `கணக்கு ${admin.status.toLowerCase()} நிலையில் உள்ளது.`,
                        account_status: admin.status
                    }
                });
            }

            const adminID = admin.id; // Already a string UUID from findByEmail conversion
            
            // Invalidate old token (single-session policy)
            tokenService.invalidatePreviousToken(adminID);
            
            // Generate new JWT token
            const jwtToken = tokenService.generateToken(adminID);
            
            // Update last login
            await AdminModel.updateLastLogin(adminID);

            const response = {
                id: String(admin.id), // Ensure it's a string
                name: admin.full_name,
                email: admin.email,
                mobile: admin.mobile || null,
                status: admin.status,
                last_login: admin.last_login_at,
                token: jwtToken
            };

            return res.status(200).json({
                responseType: "S",
                responseValue: response
            });
        } catch (error) {
            logger.error('Error in admin login:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Create new admin (Super-admin only)
     * Body: { full_name, email, mobile, password }
     */
    create: async (req, res) => {
        const { full_name, email, mobile, password } = req.body;

        try {
            // Validate required fields
            if (!full_name || !email || !password) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'பெயர், மின்னஞ்சல் மற்றும் கடவுச்சொல் தேவையானவை!' }
                });
            }

            // Check if email already exists
            const existingAdmin = await AdminModel.findByEmail(email);
            if (existingAdmin) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'இந்த மின்னஞ்சல் ஏற்கனவே பயன்பாட்டில் உள்ளது!' }
                });
            }

            // Hash password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create admin
            const payload = {
                full_name,
                email,
                mobile: mobile || null,
                password_hash: hashedPassword
            };

            const result = await AdminModel.create(payload);

            if (result && result.insertId) {
                return res.status(201).json({
                    responseType: "S",
                    responseValue: {
                        message: "நிர்வாகி வெற்றிகரமாக உருவாக்கப்பட்டார்.",
                        id: result.insertId
                    }
                });
            } else {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "நிர்வாகி நிர்மாணம் தோல்வியடைந்தது." }
                });
            }
        } catch (error) {
            logger.error('Error creating admin:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get admin details by ID
     * Params: { id }
     */
    getAdminDetails: async (req, res) => {
        const adminId = req.params.id;

        try {
            const admin = await AdminModel.findById(adminId);
            if (!admin) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: adminError }
                });
            }

            const response = {
                id: String(admin.id),
                name: admin.full_name,
                email: admin.email,
                mobile: admin.mobile || null,
                status: admin.status,
                email_verified_at: admin.email_verified_at || null,
                last_login_at: admin.last_login_at || null,
                last_activity_at: admin.last_activity_at || null,
                created_at: admin.created_at
            };

            return res.status(200).json({
                responseType: "S",
                responseValue: response
            });
        } catch (error) {
            logger.error('Error fetching admin details:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update admin profile
     * Body: { id, full_name, email, mobile, status }
     */
    updateProfile: async (req, res) => {
        const { id, full_name, email, mobile, status } = req.body;

        try {
            // Verify admin exists
            const admin = await AdminModel.findById(id);
            if (!admin) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: adminError }
                });
            }

            // Validate status if provided
            if (status && !['ACTIVE', 'INACTIVE', 'BLOCKED'].includes(status)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'தவறான நிலை மதிப்பு!' }
                });
            }

            const payload = {
                id,
                full_name: full_name || admin.full_name,
                email: email || admin.email,
                mobile: mobile || admin.mobile,
                status: status || admin.status
            };

            const result = await AdminModel.update(payload);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "நிர்வாகி விவரங்கள் வெற்றிகரமாக புதுப்பிக்கப்பட்டது." }
                });
            } else {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "புதுப்பிப்பு தோல்வியடைந்தது." }
                });
            }
        } catch (error) {
            logger.error('Error updating admin profile:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update admin password
     * Body: { id, currentPassword, newPassword }
     */
    updatePassword: async (req, res) => {
        const { id, currentPassword, newPassword } = req.body;

        try {
            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'বর্তমান এবং নতুন পাসওয়ার্ড উভয়ই প্রয়োজন!' }
                });
            }

            // Verify admin exists
            const admin = await AdminModel.findById(id);
            if (!admin) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: adminError }
                });
            }

            // Verify current password
            const isPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
            if (!isPasswordValid) {
                return res.status(401).json({
                    responseType: "F",
                    responseValue: { message: "বর্তমান পাসওয়ার্ড অসঙ্গত!" }
                });
            }

            // Hash new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update password
            const result = await AdminModel.updatePassword(id, hashedPassword);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "পাসওয়ার্ড বেস সফলভাবে পরিবর্তিত হয়েছে." }
                });
            } else {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "পাসওয়ার্ড পরিবর্তন ব্যর্থ হয়েছে." }
                });
            }
        } catch (error) {
            logger.error('Error updating admin password:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Get all admins (paginated)
     * Query: { limit, offset }
     */
    getAllAdmins: async (req, res) => {
        try {
            const limit = Math.min(parseInt(req.query.limit) || 50, 200);
            const offset = parseInt(req.query.offset) || 0;

            const admins = await AdminModel.getAllAdmins(limit, offset);
            const total = await AdminModel.getAdminCount();

            const formattedAdmins = admins.map(a => ({
                id: String(a.id),
                name: a.full_name,
                email: a.email,
                mobile: a.mobile || null,
                status: a.status,
                last_login_at: a.last_login_at || null,
                created_at: a.created_at
            }));

            return res.status(200).json({
                responseType: "S",
                count: formattedAdmins.length,
                total,
                responseValue: formattedAdmins
            });
        } catch (error) {
            logger.error('Error fetching admins:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Soft delete admin
     * Body: { id }
     */
    deleteAdmin: async (req, res) => {
        const { id } = req.body;

        try {
            // Verify admin exists
            const admin = await AdminModel.findById(id);
            if (!admin) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: adminError }
                });
            }

            const result = await AdminModel.softDelete(id);

            if (result && result.affectedRows > 0) {
                // Invalidate token on deletion
                tokenService.removeToken(id);

                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "நிர்வாগী সফলভাবে মুছে ফেলা হয়েছে." }
                });
            } else {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "মুছে ফেলা ব্যর্থ হয়েছে." }
                });
            }
        } catch (error) {
            logger.error('Error deleting admin:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    },

    /**
     * Update admin status
     * Body: { id, status }
     */
    updateAdminStatus: async (req, res) => {
        const { id, status } = req.body;

        try {
            if (!status) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'অবস্থা প্রয়োজন!' }
                });
            }

            // Verify admin exists
            const admin = await AdminModel.findById(id);
            if (!admin) {
                return res.status(404).json({
                    responseType: "F",
                    responseValue: { message: adminError }
                });
            }

            const result = await AdminModel.updateStatus(id, status);

            if (result && result.affectedRows > 0) {
                return res.status(200).json({
                    responseType: "S",
                    responseValue: { message: "নিবহ অবস্থা সফলভাবে আপডেট হয়েছে." }
                });
            } else {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: "স্ট্যাটাস আপডেট ব্যর্থ হয়েছে." }
                });
            }
        } catch (error) {
            logger.error('Error updating admin status:', error);
            return res.status(500).json({
                responseType: "F",
                responseValue: { message: error.toString() }
            });
        }
    }
};
