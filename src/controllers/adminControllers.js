const Model = require('../models/adminModels');
const User = require('../models/user');
const { sendPushNotification } = require('./notificationController');
const { NotificationType } = require('../models/notificationModels');
const { sendFeedbackReplyEmail } = require('../services/emailService');
const logger = require('../config/logger');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { toBinaryUUID } = require('../helpers/uuid');


exports.controller = {
    /**
     * Create a new admin account
     * Body: { full_name, email, mobile, password }
     */
    createAdmin: async (req, res) => {
        const { full_name, email, mobile, password } = req.body;
        try {
            // Validate required fields
            if (!full_name || !email || !mobile || !password) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Full name, email, mobile, and password are required.' }
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Invalid email format.' }
                });
            }

            // Validate mobile (10 digits)
            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Mobile number must be 10 digits.' }
                });
            }

            // Check if email/mobile already exists
            const existing = await Model.findByEmailOrMobile(email, mobile);
            if (existing) {
                return res.status(400).json({
                    responseType: "F",
                    responseValue: { message: 'Email or mobile already registered as admin.' }
                });
            }

            // Create admin
            const result = await Model.createAdmin({ full_name, email, mobile, password });

            return res.status(201).json({
                responseType: "S",
                responseValue: {
                    message: 'Admin account created successfully.',
                    admin_id: result.insertId
                }
            });
        } catch (error) {
            logger.error('Error creating admin:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    login: async (req, res) => {
        const { userName, passWord } = req.body; // userName can be email or mobile
        try {
            const user = await Model.login(userName, passWord);
            if (!user) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'Invalid email/mobile or password.' } });
            }
            const response = {
                id: user.id,
                username: user.username,
                full_name: user.full_name,
                mobile: user.mobile,
                email: user.email
            };
            return res.status(200).json({ responseType: "S", responseValue: response });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    // MOI USERS
    moiUsers: async (req, res) => {
        try {
            const moiUsers = await Model.moiUsers();
            if (!moiUsers) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: moiUsers });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiUserList: async (req, res) => {
        try {
            const list = await Model.moiUserList();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiUserListId: async (req, res) => {
        const userId = req.params.id;
        try {
            const list = await Model.moiUserListId(userId);
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Admin endpoint to create a new user
     * Creates entries in: users, user_credentials, user_profiles, and optionally user_devices
     * POST /apis/admin/moi-users
     */
    createMoiUser: async (req, res) => {
        const { 
            name, 
            email, 
            mobile, 
            password,
            status,
            gender,
            date_of_birth,
            address_line1,
            address_line2,
            city,
            state,
            country,
            postal_code,
            fcm_token,
            device_name,
            device_id,
            brand,
            manufacturer,
            model,
            ram_size,
            android_version
        } = req.body;
        
        try {
            // Validate required fields
            if (!name || !email || !mobile || !password) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Name, email, mobile, and password are required.' } 
                });
            }

            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Invalid email format.' } 
                });
            }

            // Validate mobile number (should be 10 digits)
            if (!/^\d{10}$/.test(mobile)) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Mobile number must be 10 digits.' } 
                });
            }

            // Check if email already exists
            const existingUserByEmail = await User.findByEmail(email);
            if (existingUserByEmail) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Email already registered.' } 
                });
            }

            // Check if mobile already exists
            const existingUserByMobile = await User.findByMobile(mobile);
            if (existingUserByMobile) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Mobile number already registered.' } 
                });
            }

            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);

            // Create user payload with all data
            const newUser = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                mobile: mobile.trim(),
                password: hashedPassword,
                fcm_token: fcm_token || null,
                device_name: device_name || null,
                device_id: device_id || null,
                brand: brand || null,
                manufacturer: manufacturer || null,
                model: model || null,
                ram_size: ram_size || null,
                android_version: android_version || null
            };

            // Create user (inserts into users, user_credentials, user_profiles, user_devices)
            const result = await User.create(newUser);
            
            if (!result || !result.insertId) {
                return res.status(500).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Failed to create user.' } 
                });
            }

            const userId = result.insertId;

            // Update additional profile fields and status if provided
            if (gender || date_of_birth || address_line1 || city || state || country || postal_code || status) {
                const profileUpdate = {
                    id: userId,
                    status: status || null,
                    gender: gender || null,
                    date_of_birth: date_of_birth || null,
                    address_line1: address_line1 || null,
                    address_line2: address_line2 || null,
                    city: city || null,
                    state: state || null,
                    country: country || null,
                    postal_code: postal_code || null
                };
                await User.updateUserData(profileUpdate);
            }
            
            // Get created user data with all joined tables
            const createdUser = await User.findById(userId);
            if (!createdUser) {
                return res.status(201).json({ 
                    responseType: "S", 
                    responseValue: { 
                        message: 'User created successfully.',
                        user: { id: userId } 
                    } 
                });
            }
            
            // Remove sensitive data from response
            delete createdUser.um_password;
            delete createdUser.password_hash;
            
            return res.status(201).json({ 
                responseType: "S", 
                responseValue: { 
                    message: 'User created successfully.',
                    user: {
                        id: createdUser.id,
                        full_name: createdUser.full_name,
                        email: createdUser.email,
                        mobile: createdUser.mobile,
                        referral_code: createdUser.referral_code,
                        status: createdUser.status,
                        gender: createdUser.gender,
                        date_of_birth: createdUser.date_of_birth,
                        city: createdUser.city,
                        state: createdUser.state,
                        created_at: createdUser.created_at
                    }
                } 
            });
        } catch (error) {
            logger.error('Error creating user', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    /**
     * Admin endpoint to update an existing user
     * Updates entries in: users, user_profiles, and optionally user_devices
     * PUT /apis/admin/moi-users/:id
     */
    updateMoiUser: async (req, res) => {
        const userId = req.params.id;
        const { 
            name,
            email, 
            mobile, 
            status,
            gender,
            date_of_birth,
            profile_image_url,
            address_line1,
            address_line2,
            city,
            state,
            country,
            postal_code,
            fcm_token,
            device_name,
            device_id,
            brand,
            manufacturer,
            model,
            ram_size,
            android_version
        } = req.body;
        
        try {
            // Check if user exists
            const existingUser = await User.findById(userId);
            if (!existingUser) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'User not found.' } });
            }
            
            // Validate email format if provided
            if (email) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(email)) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: 'Invalid email format.' } 
                    });
                }
                
                // Check if email already exists for another user
                const existingUserByEmail = await User.findByEmail(email);
                if (existingUserByEmail && existingUserByEmail.id !== userId) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: 'Email already registered to another user.' } 
                    });
                }
            }
            
            // Validate mobile format if provided
            if (mobile && !/^\d{10}$/.test(mobile)) {
                return res.status(400).json({ 
                    responseType: "F", 
                    responseValue: { message: 'Mobile number must be 10 digits.' } 
                });
            }
            
            // Check if mobile already exists for another user
            if (mobile) {
                const existingUserByMobile = await User.findByMobile(mobile);
                if (existingUserByMobile && existingUserByMobile.id !== userId) {
                    return res.status(400).json({ 
                        responseType: "F", 
                        responseValue: { message: 'Mobile number already registered to another user.' } 
                    });
                }
            }
            
            // Check if there's any data to update
            const hasDataToUpdate = name || email || mobile || status || gender || date_of_birth || 
                                   profile_image_url || address_line1 || address_line2 || city || 
                                   state || country || postal_code || fcm_token || device_name || 
                                   device_id || brand || manufacturer || model || ram_size || android_version;
            
            if (!hasDataToUpdate) {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'No fields provided to update.' } });
            }
            
            // Prepare update payload
            const updatePayload = {
                id: userId,
                // users table fields
                name: name || null,
                email: email ? email.trim().toLowerCase() : null,
                mobile: mobile ? mobile.trim() : null,
                status: status || null,
                // user_profiles table fields
                gender: gender || null,
                date_of_birth: date_of_birth || null,
                address_line1: address_line1 || null,
                address_line2: address_line2 || null,
                city: city || null,
                state: state || null,
                country: country || null,
                postal_code: postal_code || null,
                // user_devices table fields
                fcm_token: fcm_token || null,
                device_name: device_name || null,
                device_id: device_id || null,
                brand: brand || null,
                manufacturer: manufacturer || null,
                model: model || null,
                ram_size: ram_size || null,
                android_version: android_version || null
            };
            
            // Update user data in all relevant tables
            await User.updateUserData(updatePayload);
            
            // Update profile image separately if provided (it's in user_profiles)
            if (profile_image_url !== undefined) {
                await db.query(
                    `UPDATE user_profiles SET profile_image_url = ? WHERE user_id = ?`,
                    [profile_image_url, toBinaryUUID(userId)]
                );
            }
            
            // Get updated user data
            const updatedUser = await User.findById(userId);
            
            // Remove sensitive data from response
            delete updatedUser.um_password;
            delete updatedUser.password_hash;
            
            return res.status(200).json({ 
                responseType: "S", 
                responseValue: { 
                    message: 'User updated successfully.',
                    user: {
                        id: updatedUser.id,
                        full_name: updatedUser.full_name,
                        email: updatedUser.email,
                        mobile: updatedUser.mobile,
                        referral_code: updatedUser.referral_code,
                        status: updatedUser.status,
                        gender: updatedUser.gender,
                        date_of_birth: updatedUser.date_of_birth,
                        profile_image_url: updatedUser.profile_image_url,
                        address_line1: updatedUser.address_line1,
                        address_line2: updatedUser.address_line2,
                        city: updatedUser.city,
                        state: updatedUser.state,
                        country: updatedUser.country,
                        postal_code: updatedUser.postal_code,
                        updated_at: updatedUser.updated_at
                    }
                } 
            });
        } catch (error) {
            logger.error('Error updating user:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    deleteMoiUser: async (req, res) => {
        const userId = req.params.id;
        
        try {
            // Check if user exists
            const existingUser = await Model.getMoiUserById(userId);
            if (!existingUser) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'User not found.' } });
            }
            
            const result = await Model.deleteMoiUser(userId);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'User not found.' } });
            }
            
            return res.status(200).json({ 
                responseType: "S", 
                responseValue: { message: 'User deleted successfully.' } 
            });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    // FUNCTIONS
    moiUserFunction: async (req, res) => {
        try {
            const list = await Model.moiUserFunction();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiFunctionsUserId: async (req, res) => {
        const userId = req.params.userId;
        try {
            const list = await Model.moiFunctionsUserId(userId);
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    // FEEDBACKS
    feedbacks: async (req, res) => {
        try {
            const list = await Model.feedbacks();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    replyToFeedback: async (req, res) => {
        try {
            const { feedbackId, reply } = req.body;
            
            if (!feedbackId) {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'Feedback ID is required.' } });
            }
            
            if (!reply || reply.trim() === '') {
                return res.status(400).json({ responseType: "F", responseValue: { message: 'Reply text is required.' } });
            }
            
            // Get feedback to retrieve user_id before updating
            const feedback = await Model.getFeedbackById(feedbackId);
            if (!feedback) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            
            const result = await Model.updateFeedbackReply(feedbackId, reply);
            
            if (result.affectedRows === 0) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            
            if (feedback.user_id) {
                const user = await User.findById(feedback.user_id);
                if (user) {
                    if (user.um_notification_token) {
                        try {
                            await sendPushNotification({
                                userId: feedback.user_id,
                                title: 'உங்கள் கருத்துக்கு பதில்',
                                body: 'உங்கள் கருத்துக்கு பதில் வழங்கப்பட்டது. தயவுசெய்து பார்க்கவும்.',
                                token: user.um_notification_token,
                                type: NotificationType.GENERAL
                            });
                        } catch (notificationError) {
                            logger.error('Error sending push notification for feedback reply', notificationError);
                        }
                    }
                    if (user.um_email) {
                        sendFeedbackReplyEmail(user.um_email, user.um_full_name, reply).catch(() => {});
                    }
                }
            }

            return res.status(200).json({ responseType: "S", responseValue: { message: 'Reply has been successfully added.' } });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    // MOI OUT ALL ----
    moiOutAll: async (req, res) => {
        try {
            const list = await Model.moiOutAll();
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", count: list.length, responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
    moiOutAllUser: async (req, res) => {
        const userId = req.params.userId;
        try {
            const list = await Model.moiOutAllUser(userId);
            if (!list) {
                return res.status(404).json({ responseType: "F", responseValue: { message: 'No details found.' } });
            }
            return res.status(200).json({ responseType: "S", count: list.length, responseValue: list });
        } catch (error) {
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    // ==================== ANALYTICS & DASHBOARD ====================

    /**
     * Get platform overview dashboard
     */
    getPlatformOverview: async (req, res) => {
        try {
            const overview = await Model.getPlatformOverview();
            return res.status(200).json({ responseType: "S", responseValue: overview });
        } catch (error) {
            logger.error('Error fetching platform overview:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Get user statistics
     */
    getUserStats: async (req, res) => {
        try {
            const userStats = await Model.getTotalUserCount();
            const verificationStats = await Model.getVerificationStats();
            const activeUsers = await Model.getActiveUserCount();
            const registrationTrends = await Model.getRegistrationTrends();

            return res.status(200).json({
                responseType: "S",
                responseValue: {
                    total_counts: userStats,
                    verification: verificationStats,
                    active_users: activeUsers,
                    registration_trends_7d: registrationTrends
                }
            });
        } catch (error) {
            logger.error('Error fetching user stats:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Get transaction statistics
     */
    getTransactionStats: async (req, res) => {
        try {
            const stats = await Model.getTransactionStats();
            return res.status(200).json({ responseType: "S", responseValue: stats });
        } catch (error) {
            logger.error('Error fetching transaction stats:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Get feedback statistics
     */
    getFeedbackStats: async (req, res) => {
        try {
            const stats = await Model.getFeedbackStats();
            return res.status(200).json({ responseType: "S", responseValue: stats });
        } catch (error) {
            logger.error('Error fetching feedback stats:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },

    /**
     * Get referral statistics and top referrers
     */
    getReferralStats: async (req, res) => {
        try {
            const topReferrers = await Model.getTopReferrers(10);
            const referralStats = await Model.getReferralStats();
            return res.status(200).json({
                responseType: "S",
                responseValue: {
                    overall_stats: referralStats,
                    top_referrers: topReferrers
                }
            });
        } catch (error) {
            logger.error('Error fetching referral stats:', error);
            return res.status(500).json({ responseType: "F", responseValue: { message: error.toString() } });
        }
    },
}
