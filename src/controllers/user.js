// User controllers: authentication, account management, and notifications
const User = require("../models/user");
const Admin = require("../models/admin");
const SessionModel = require("../models/sessions");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const tokenService = require("../middlewares/tokenService");
const { sendPushNotification } = require("./notificationController");
const { NotificationType } = require("../models/notificationModels");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logger = require("../config/logger");

const { 
  sendEmail, 
  getWelcomeEmailContent, 
  getAdminRegistrationEmailContent 
} = require("../services/emailService");

// Common response messages
const userError = "குறிப்பிடப்பட்ட பயனர் இல்லை!";
const mobileError =
  "இந்த மொபைல் எண் ஏற்கனவே மற்றொரு பயனருக்கு பதிவு செய்யப்பட்டுள்ளது.";

const formatPublicUserDetails = (details) => ({
  id: details.id,
  name: details.full_name,
  email: details.email,
  mobile: details.mobile,
  last_login: details.last_activity_at,
  profile: details.profile,
  device: details.device,
  referrer_id: details.referrer_id,
  referred_count: details.referred_count,
  create_date: details.created_at,
  update_date: details.updated_at,
  status: details.status,
  referral_code: details.referral_code || null,
  is_verified: details.is_verified || 0,
  email_verified_at: details.email_verified_at || null,
});

const formatAdminUserListItem = (details) => ({
  id: details.id,
  mobile: details.mobile,
  name: details.full_name,
  last_login: details.last_activity_at,
  city: details.profile?.city || null,
  profile_image_url: details.profile?.profile_image_url || null,
  device_name: details.device?.device_name || null,
});

exports.userController = {
  /**
   * Authenticate user and issue JWT.
   * Body: { email, password }
   */
  login: async (req, res) => {
    const { email, password } = req.body;

    try {
      // Try to find active user first
      const user = await User.findByEmail(email);
      if (!user) {
        // Check if user exists but is deleted
        const deletedUser = await User.findByEmailIncludingDeleted(email);
        if (deletedUser && deletedUser.is_deleted) {
          return res.status(403).json({
            responseType: "F",
            responseValue: {
              message:
                "உங்கள் கணக்கு நீக்கப்பட்டுவிட்டது. மீட்டமைக்க கடைய்சு எங்களை தொடர்பு கொள்ளவும்.",
              deleted_at: deletedUser.deleted_at,
              account_status: "DELETED",
            },
          });
        }
        // User doesn't exist at all
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "தவறான மின்னஞ்சல் ஐடி!" },
        });
      }

      // CHECK IF ACCOUNT IS BLOCKED (BEFORE PASSWORD VERIFICATION)
      try {
        const blockStatus = await User.getLoginBlockStatus(user.id);
        if (blockStatus.is_blocked) {
          const minutesRemaining = Math.ceil(
            (new Date(blockStatus.blocked_until) - new Date()) / (1000 * 60),
          );
          return res.status(429).json({
            responseType: "F",
            responseValue: {
              message: `மிக அதிக தோல்வி முயற்சிகள். ${minutesRemaining} நிமிடங்களில் மீண்டும் முயற்சி செய்க.`,
              retry_after_minutes: minutesRemaining,
              blocked_until: blockStatus.blocked_until,
              account_status: "BLOCKED",
            },
          });
        }
      } catch (blockCheckErr) {
        logger.warn("Error checking login block status:", blockCheckErr);
        // Continue with password check - feature graceful degrades if column doesn't exist
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        try {
          const failureStatus = await User.incrementFailedLoginAttempts(
            user.id,
          );
          if (failureStatus.blocked) {
            return res.status(429).json({
              responseType: "F",
              responseValue: {
                message:
                  "மிக அதிக தோல்வி முயற்சிகள். கணக்கு 15 நிமிடங்களுக்கு தடுக்கப்பட்டுள்ளது.",
                attempts: failureStatus.attempts,
                blocked_until: failureStatus.blocked_until,
                account_status: "BLOCKED",
              },
            });
          } else {
            return res.status(401).json({
              responseType: "F",
              responseValue: {
                message: `கடவுச்சொல் தவறானது. ${failureStatus.remaining_attempts} முயற்சிகள் மீதமுள்ளது.`,
                remaining_attempts: failureStatus.remaining_attempts,
              },
            });
          }
        } catch (err) {
          logger.warn("Login blocking feature error:", err);
          return res.status(401).json({
            responseType: "F",
            responseValue: { message: "கடவுச்சொல் தவறானது." },
          });
        }
      }

      try {
        await User.resetFailedLoginAttempts(user.id);
      } catch (err) {
        logger.warn("Failed to reset login attempts:", err);
      }

      const userID = user.id;
      
      // End any previous active session (single-session policy)
      // This sets logout_at for the previous session and terminates it
      try {
        await SessionModel.endSession(userID);
        logger.debug(`Previous session ended for user ${userID}`);
      } catch (sessionErr) {
        logger.warn("Failed to end previous session:", sessionErr);
        // Continue even if previous session end fails - not critical
      }
      
      // Invalidate old token (single-session policy) and generate a new one
      tokenService.invalidatePreviousToken(userID);
      const jwtToken = tokenService.generateToken(userID);
      // debug logging of token state
      logger.debug(`login for user ${userID}, new token generated`);
      logger.debug("current token store snapshot:", tokenService.userTokens);
      const response = {
        status: user.status,
        id: user.id,
        name: user.full_name,
        mobile: user.mobile,
        email: user.email,
        referral_code: user.referral_code || null,
        last_login: user.last_activity_at,
        profile_image: user.profile_image_url || null,
        fcm_token: user.notification_token || null,
        token: jwtToken,
      };

      // Update last login timestamp
      await User.updateLastLogin(userID);

      // Create new session record
      try {
        await SessionModel.createSession(userID);
        logger.debug(`New session created for user ${userID}`);
      } catch (sessionErr) {
        logger.warn("Failed to create new session record:", sessionErr);
        // Continue even if session creation fails - not critical
      }

      return res
        .status(200)
        .json({ responseType: "S", responseValue: response });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Logout user and end session
   * Header: Authorization: Bearer <token>
   */
  logout: async (req, res) => {
    try {
      // Get user ID from authenticated token (via middleware)
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(401).json({
          responseType: "F",
          responseValue: { message: "JWT டோக்கன் தேவையானது." },
        });
      }

      // End the user session (set logout_at timestamp)
      try {
        const sessionEnded = await SessionModel.endSession(userId);
        if (!sessionEnded) {
          logger.warn(`No active session found for user ${userId}`);
        }
      } catch (sessionErr) {
        logger.error("Error ending session:", sessionErr);
        // Continue even if session end fails - not critical
      }

      // Invalidate the token (remove from memory)
      try {
        tokenService.removeToken(userId);
        logger.debug(`Token invalidated for user ${userId}`);
      } catch (tokenErr) {
        logger.error("Error invalidating token:", tokenErr);
        // Continue even if token invalidation fails
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          message: "வெற்றிகரமாக வெளியேறினர்.",
          user_id: userId,
          logout_at: new Date(),
        },
      });
    } catch (error) {
      logger.error("Logout Error:", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
  /**
   * Register a new user, send welcome email and admin notification.
   * Body: {
   *   name,
   *   email,
   *   mobile,
   *   password,
   *   referred_by?,
   *   fcm_token?,
   *   device_id?,
   *   brand?,
   *   manufacturer?,
   *   model?,
   *   device_name?,
   *   ram_size?,
   *   android_version? / androidVersion?
   * }
   */
  create: async (req, res) => {
    const {
      name,
      email,
      mobile,
      password,
      fcm_token,
      device_id,
      brand,
      manufacturer,
      model,
      device_name,
      ram_size,
      android_version,
      androidVersion,
      referred_by,
    } = req.body;
    let userId = null; // Track user ID for rollback
    
    try {
      // Validate required fields
      if (!name || !email || !mobile || !password) {
        return res.status(400).json({
          responseType: "F",
          responseValue: {
            message:
              "அனைத்து புலங்களும் (பெயர், மின்னஞ்சல், மொபைல், கடவுச்சொல்) தேவையானவை!",
          },
        });
      }

      // Check duplicates by email
      const mail = await User.findByEmail(email);
      if (mail) {
        return res.status(404).json({
          responseType: "F",
          responseValue: {
            message: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!",
          },
        });
      }
      // Check duplicates by mobile number
      const mbl = await User.findByMobile(mobile);
      if (mbl) {
        return res.status(404).json({
          responseType: "F",
          responseValue: {
            message: "இந்த மொபைல் எண் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!",
          },
        });
      }
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Normalise Android version and SDK values from different client keys
      const normalizedAndroidVersion =
        android_version || androidVersion || null;

      const newUser = {
        name,
        email,
        mobile,
        password: hashedPassword,
        fcm_token: fcm_token || null,
        device_name: device_name || null,
        device_id: device_id || null,
        brand: brand || null,
        model: model || null,
        manufacturer: manufacturer || null,
        ram_size: ram_size ?? null,
        android_version: normalizedAndroidVersion,
      };

      // Save user details (generates unique referral_code)
      const query = await User.create(newUser);
      if (query && query.insertId) {
        userId = query.insertId;
        logger.info(`User created with ID: ${userId}`);

        try {
          // If referred_by (referral code) provided, link referrer -> referred (ignore if invalid)
          if (referred_by && String(referred_by).trim()) {
            try {
              const referrer = await User.findByReferralCode(referred_by);
              if (referrer && referrer.id !== userId) {
                await User.recordReferral(referrer.id, userId);
              }
            } catch (refErr) {
              logger.error("Referral link failed", refErr);
              // Don't rollback for referral errors - non-critical
            }
          }
          
          const registrationTime = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
          });
          
          // Welcome email content (HTML) - generated from emailService
          const emailContent = getWelcomeEmailContent(name);

          // Send welcome email to new user
          try {
            await sendEmail({
              to: email,
              subject: "Welcome to Moi Kanakku!",
              html: emailContent,
              from: `"Info - Moi Kanakku" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            });
          } catch (emailError) {
            logger.error("Error sending welcome email:", emailError);
            // Don't rollback for email errors - non-critical
          }

          // Admin notification email with complete user details - generated from emailService
          const adminEmailContent = getAdminRegistrationEmailContent({
            userId,
            name,
            email,
            mobile,
            referred_by,
            brand,
            model,
            device_name,
            normalizedAndroidVersion,
            registrationTime,
          });

          // Send admin notification email to agprakash406@gmail.com
          try {
            await sendEmail({
              to: "agprakash406@gmail.com",
              subject: "New user registered successfully",
              html: adminEmailContent,
              from: `"Info - Moi Kanakku" <${process.env.EMAIL_USER}>`,
            });
          } catch (adminEmailError) {
            logger.error(
              "Error sending admin notification email:",
              adminEmailError,
            );
            // Don't rollback for email errors - non-critical
          }

          // Send FCM notification if fcm_token is provided
          if (fcm_token) {
            try {
              await sendPushNotification({
                userId: userId,
                title: "பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்",
                body: "இப்போது நீங்கள் இந்த பயன்பாட்டைப் பயன்படுத்தலாம்",
                token: fcm_token,
                type: NotificationType.ACCOUNT,
              });
              logger.info(
                `FCM notification sent to user ${userId} after successful registration`,
              );
            } catch (fcmError) {
              logger.error(
                "Error sending FCM notification after registration:",
                fcmError,
              );
              // Don't rollback for FCM errors - non-critical
            }
          }

          return res.status(200).json({
            responseType: "S",
            responseValue: {
              message: "பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்.",
              userId: userId,
            },
          });
        } catch (postCreationError) {
          // Rollback: Delete the user if any critical operation fails
          logger.error("Critical error after user creation, rolling back:", postCreationError);
          try {
            await User.deleteUser(userId);
            logger.info(`User ${userId} rolled back due to: ${postCreationError.message}`);
          } catch (rollbackError) {
            logger.error(`Failed to rollback user ${userId}:`, rollbackError);
          }
          
          return res.status(500).json({
            responseType: "F",
            responseValue: { 
              message: "பயனர் பதிவு தோல்வியடைந்தது. மீண்டும் முயற்சி செய்க.",
              error: postCreationError.toString(),
            },
          });
        }
      } else {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "பயனர் பதிவு தோல்வியடைந்தது." },
        });
      }
    } catch (error) {
      logger.error("Error in user creation:", error);
      // Rollback if user was created
      if (userId) {
        try {
          await User.deleteUser(userId);
          logger.info(`User ${userId} rolled back due to outer error: ${error.message}`);
        } catch (rollbackError) {
          logger.error(`Failed to rollback user ${userId}:`, rollbackError);
        }
      }
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
  /**
   * Update user profile (basic info in users table and user_profiles table).
   * Body: { id, name, mobile, email, status, gender, date_of_birth, address_line1, address_line2, city, state, country, postal_code, fcm_token, device_name }
   */
  update: async (req, res) => {
    const { id, name, mobile, email } = req.body;
    try {
      // Check that mobile number is unique (excluding current user)
      if (mobile) {
        const chkMobile = await User.checkMobileNo(mobile, id);
        if (chkMobile) {
          return res.status(404).json({
            responseType: "F",
            responseValue: { message: mobileError },
          });
        }
      }

      // Check that email is unique (excluding current user)
      if (email) {
        const chkEmail = await User.findByEmail(email);
        if (chkEmail && chkEmail.id !== id) {
          return res.status(404).json({
            responseType: "F",
            responseValue: {
              message: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!",
            },
          });
        }
      }

      const chk = await User.findById(id);
      if (!chk) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      // Call comprehensive update function to handle all tables
      const query = await User.updateUserData(req.body);
      if (query && query.success) {
        // Fetch updated user to return
        const updatedUser = await User.findById(id);
        const response = {
          // id: updatedUser.id,
          // name: updatedUser.full_name,
          // email: updatedUser.email,
          // mobile: updatedUser.mobile,
          // last_login: updatedUser.last_activity_at,
          // profile_image: updatedUser.profile_image_url || null,
          // referral_code: updatedUser.referral_code || null,
          message: "பயனர் தகவல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
        };
        return res
          .status(200)
          .json({ responseType: "S", responseValue: response });
      } else {
        return res.status(404).json({
          responseType: "F",
          responseValue: {
            message:
              "புதுப்பித்தல் தோல்வியடைந்தது. மாற்றங்களை சேமிக்க முடியவில்லை.",
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
  /**
   * Get a user's profile by ID.
   * Params: { id }
   */
  getUser: async (req, res) => {
    const userId = req.params.id;
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }
      const response = {
        id: user.id,
        name: user.full_name,
        email: user.email,
        mobile: user.mobile,
        last_login: user.last_activity_at,
        profile_image: user.profile_image_url || null,
        referral_code: user.referral_code || null,
      };
      return res
        .status(200)
        .json({ responseType: "S", responseValue: response });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Update password after verifying current password.
   * Body: { id, password, newPassword }
   */
  updatePassword: async (req, res) => {
    const { id, password, newPassword } = req.body;

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ responseType: "F", responseValue: { message: userError } });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(404).json({
        responseType: "F",
        responseValue: {
          message: "கடவுச்சொல் எங்கள் பதிவுகளுடன் பொருந்தவில்லை.",
        },
      });
    }

    // Password and user verified; hash new password
    var hashedPassword = await bcrypt.hash(newPassword, 10);

    var para = {
      password: hashedPassword,
      id: id,
    };

    try {
      var query = await User.updatePassword(para);
      if (query) {
        // Send push notification when password is changed
        if (user.notification_token) {
          try {
            await sendPushNotification({
              userId: id,
              title: "கடவுச்சொல் மாற்றப்பட்டது",
              body: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது. உங்கள் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த, வழக்கமாக கடவுச்சொல்லை மாற்றவும்.",
              token: user.notification_token,
              type: NotificationType.ACCOUNT,
            });
          } catch (notificationError) {
            // Log error but don't fail the request since password was changed successfully
            logger.error(
              "Error sending push notification for password change:",
              notificationError,
            );
          }
        }
        return res.status(200).json({
          responseType: "S",
          responseValue: {
            message: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.",
          },
        });
      } else {
        return res.status(404).json({
          responseType: "F",
          responseValue: {
            message:
              "கடவுச்சொல்லை மாற்ற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
  /**
   * Soft delete a user (marks as deleted, doesn't remove from database).
   * Body: { email }
   */
  deleteUser: async (req, res) => {
    const { email } = req.body;
    try {
      const chk = await User.findByEmail(email);
      if (!chk) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }
      const query = await User.deleteUser(chk.id);
      if (query) {
        // Remove token from memory when user is deleted (security best practice)
        tokenService.removeToken(chk.id);
        return res.status(200).json({
          responseType: "S",
          responseValue: { message: "பயனர் கணக்கு நீக்கப்பட்டது." },
        });
      } else {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "பயனர் நீக்குதல் தோல்வியடைந்தது!" },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Restore a deleted user account by email.
   * Body: { email }
   */
  restoreAccount: async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "மின்னஞ்சல் தேவையானது!" },
        });
      }

      // Check if user exists (including deleted)
      const user = await User.findByEmailIncludingDeleted(email);
      if (!user) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "தவறான மின்னஞ்சல் ஐடி!" },
        });
      }

      // Check if user is actually deleted
      if (!user.is_deleted) {
        return res.status(400).json({
          responseType: "F",
          responseValue: {
            message: "இந்த கணக்கு ஏற்கனவே செயல்படுத்தப்பட்டுவிட்டது.",
          },
        });
      }

      // Restore the user
      const query = await User.restoreUser(user.id);
      if (query) {
        // Fetch restored user
        const restoredUser = await User.findById(user.id);
        const response = {
          id: restoredUser.id,
          name: restoredUser.full_name,
          email: restoredUser.email,
          status: restoredUser.status,
          message:
            "உங்கள் கணக்கு வெற்றிகரமாக மீட்டமைக்கப்பட்டது. இப்போது நீங்கள் உள்நுழைய முடியும்.",
        };
        return res
          .status(200)
          .json({ responseType: "S", responseValue: response });
      } else {
        return res.status(500).json({
          responseType: "F",
          responseValue: { message: "கணக்கு மீட்டமைப்பு தோல்வியடைந்தது!" },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },
  /**
   * Reset password by email (admin/forgot password flow).
   * Body: { email, password }
   */
  resetPassword: async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res
        .status(404)
        .json({ responseType: "F", responseValue: { message: userError } });
    }

    // Hash the provided password
    var hashedPassword = await bcrypt.hash(password, 10);

    var para = {
      password: hashedPassword,
      id: user.id,
    };

    try {
      var query = await User.updatePassword(para);
      if (query) {
        // Send push notification when password is reset
        if (user.notification_token) {
          try {
            await sendPushNotification({
              userId: user.id,
              title: "கடவுச்சொல் மீட்டமைக்கப்பட்டது",
              body: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது. உங்கள் கணக்கின் பாதுகாப்பை உறுதிப்படுத்த, வழக்கமாக கடவுச்சொல்லை மாற்றவும்.",
              token: user.notification_token,
              type: NotificationType.ACCOUNT,
            });
          } catch (notificationError) {
            // Log error but don't fail the request since password was reset successfully
            logger.error(
              "Error sending push notification for password reset:",
              notificationError,
            );
          }
        }
        return res.status(200).json({
          responseType: "S",
          responseValue: {
            message: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது.",
          },
        });
      } else {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "கடவுச்சொல்லை மீட்டமைக்க முடியவில்லை." },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Update push notification token for a user.
   * Body: { userId, token }
   */
  updateNotificationToken: async (req, res) => {
    const {
      userId,
      token,
      device_id,
      device_name,
      brand,
      manufacturer,
      model,
      android_version,
      ram_size,
    } = req.body;

    if (!userId || !token || !device_id) {
      return res.status(400).json({
        responseType: "F",
        responseValue: { message: "userId, device_id and token are required!" },
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ responseType: "F", responseValue: { message: userError } });
    }

    try {
      const query = await User.updateToken(
        userId,
        device_id,
        token,
        device_name ?? null,
        brand ?? null,
        manufacturer ?? null,
        model ?? null,
        android_version ?? null,
        ram_size ?? null,
      );

      if (query) {
        return res.status(200).json({
          responseType: "S",
          responseValue: {
            message: "பயனர் டோக்கன் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
          },
        });
      } else {
        return res.status(404).json({
          responseType: "F",
          responseValue: {
            message: "பயனர் டோக்கன் புதுப்பித்தல் தோல்வியடைந்தது!",
          },
        });
      }
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Update user profile picture in user_profile table.
   * Body: { userId }
   * File: profile image file (multipart/form-data with field name 'profile_image')
   * Schema: user_profile table with profile_image_url column
   * Note: Multer is already configured in the route, so req.file is ready here.
   */
  updateProfilePicture: async (req, res) => {
    const uploadDir = process.env.UPLOAD_DIR || "./uploads";

    try {
      // Debug logging
      logger.info(
        `Profile picture update request received. File exists: ${!!req.file}, Body: ${JSON.stringify(req.body)}`,
      );

      // Check for file from multer (already processed by route middleware)
      if (!req.file) {
        logger.warn("No file received in profile picture upload request");
        return res.status(400).json({
          responseType: "F",
          responseValue: {
            message:
              "கோப்பு பதிவேற்றப்படவில்லை! தயவுசெய்து ஒரு சுயவிவர படத்தை பதிவேற்றவும்.",
          },
        });
      }

      const { userId } = req.body;

      if (!userId) {
        // Clean up uploaded file if userId is missing
        try {
          if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          logger.error(
            "Error cleaning up file after userId validation:",
            cleanupError,
          );
        }

        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "பயனர் ஐடி தேவையானது!" },
        });
      }

      // Verify user exists
      const user = await User.findById(userId);
      if (!user) {
        // Clean up uploaded file if user doesn't exist
        try {
          if (req.file.path && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
        } catch (cleanupError) {
          logger.error(
            "Error cleaning up file after user validation:",
            cleanupError,
          );
        }

        return res.status(404).json({
          responseType: "F",
          responseValue: { message: userError },
        });
      }

      logger.info(
        `Processing profile picture for user ${userId}. Filename: ${req.file.filename}`,
      );

      // Create profile directory for user
      const userProfileDir = path.join(uploadDir, userId, "profile");
      if (!fs.existsSync(userProfileDir)) {
        fs.mkdirSync(userProfileDir, { recursive: true });
      }

      // Delete old profile image if it exists (from user_profile table)
      if (user.profile_image_url) {
        try {
          const oldImagePath = path.join(
            uploadDir,
            user.profile_image_url.replace("uploads/", ""),
          );
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            logger.info(
              `Deleted old profile image for user ${userId}: ${oldImagePath}`,
            );
          }
        } catch (deleteError) {
          logger.error("Error deleting old profile image:", deleteError);
          // Continue even if old image deletion fails
        }
      }

      // Move uploaded file from temp to final location
      const tempFilePath = req.file.path;
      const finalFilePath = path.join(userProfileDir, req.file.filename);

      try {
        // Move the file
        fs.renameSync(tempFilePath, finalFilePath);

        // Verify file was moved successfully
        if (!fs.existsSync(finalFilePath)) {
          logger.error(`File move verification failed for ${finalFilePath}`);
          return res.status(500).json({
            responseType: "F",
            responseValue: { message: "கோப்பு வெற்றிகரமாக சேமிக்கப்படவில்லை!" },
          });
        }

        logger.info(`File successfully moved to ${finalFilePath}`);

        // Save path to database (use forward slashes for URL-friendly path)
        // Format: uploads/userId/profile/filename.jpg
        const imagePath = `uploads/${userId}/profile/${req.file.filename}`;

        // Update profile_image_url in user_profile table
        const updateResult = await User.updateProfileImage(userId, imagePath);

        if (updateResult) {
          logger.info(
            `Profile image updated in database for user ${userId}: ${imagePath}`,
          );

          // Fetch updated user data to return complete profile
          const updatedUser = await User.findById(userId);

          const userProfile = {
            id: updatedUser.id,
            name: updatedUser.full_name,
            email: updatedUser.email,
            mobile: updatedUser.mobile,
            profile_image_url: updatedUser.profile_image_url || imagePath,
            gender: updatedUser.gender || null,
            date_of_birth: updatedUser.date_of_birth || null,
            address_line1: updatedUser.address_line1 || null,
            address_line2: updatedUser.address_line2 || null,
            city: updatedUser.city || null,
            state: updatedUser.state || null,
            country: updatedUser.country || null,
            postal_code: updatedUser.postal_code || null,
          };

          return res.status(200).json({
            responseType: "S",
            responseValue: {
              message: "சுயவிவர படம் வெற்றிகரமாக புதுப்பிக்கப்பட்டது.",
              profile: userProfile,
            },
          });
        } else {
          logger.error(`Database update failed for user ${userId}`);

          // If database update fails, try to clean up the uploaded file
          try {
            if (fs.existsSync(finalFilePath)) {
              fs.unlinkSync(finalFilePath);
            }
          } catch (cleanupError) {
            logger.error(
              "Error cleaning up file after DB update failure:",
              cleanupError,
            );
          }
          return res.status(500).json({
            responseType: "F",
            responseValue: {
              message: "தரவுத்தளத்தில் சுயவிவர படத்தை புதுப்பிக்க முடியவில்லை.",
            },
          });
        }
      } catch (moveError) {
        logger.error("Error moving file:", moveError);
        // Clean up temp file
        try {
          if (fs.existsSync(tempFilePath)) {
            fs.unlinkSync(tempFilePath);
          }
        } catch (cleanupError) {
          logger.error("Error cleaning up temp file:", cleanupError);
        }

        return res.status(500).json({
          responseType: "F",
          responseValue: {
            message: `கோப்பை சேமிக்க முடியவில்லை: ${moveError.message}`,
          },
        });
      }
    } catch (error) {
      logger.error("Error in updateProfilePicture:", error);

      // Clean up temp file if it exists
      try {
        if (req.file && req.file.path && fs.existsSync(req.file.path)) {
          fs.unlinkSync(req.file.path);
        }
      } catch (cleanupError) {
        logger.error("Error cleaning up temp file on error:", cleanupError);
      }

      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Get important user details from users table.
   * Params: { id }
   */
  getImportantUserDetails: async (req, res) => {
    const userId = req.params.id;
    try {
      const details = await User.getPublicDetails(userId);
      if (!details) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      return res
        .status(200)
        .json({ responseType: "S", responseValue: formatPublicUserDetails(details) });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * Get referral code for a user.
   * Query: ?id=<userId> or ?email=<email>
   */
  getReferralCode: async (req, res) => {
    const { id, email } = req.query;
    try {
      let user = null;
      if (id) {
        user = await User.findById(id);
      } else if (email) {
        user = await User.findByEmail(email);
      } else {
        return res.status(400).json({
          responseType: "F",
          responseValue: {
            message: "பயனர் ஐடி அல்லது மின்னஞ்சல் சேர்க்கவும்.",
          },
        });
      }

      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: { referral_code: user.referral_code || null },
      });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * ADMIN: retrieve a list of all users with public details.
   * returns minimal fields for the admin user list.
   */
  adminAllUserLists: async (req, res) => {
    try {
      const users = await User.getAllPublicDetails();
      const formatted = users.map(formatAdminUserListItem);
      return res.status(200).json({ responseType: "S", responseValue: formatted });
    } catch (error) {
      logger.error('adminAllUserLists failure', error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * ADMIN: retrieve a single user with the same shape used in adminAllUserLists.
   */
  adminUserDetails: async (req, res) => {
    const userId = req.params.id;
    try {
      const details = await User.getPublicDetails(userId);
      if (!details) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: formatPublicUserDetails(details),
      });
    } catch (error) {
      logger.error("adminUserDetails failure", error);
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * ADMIN LOGIN - Authenticate administrator and issue JWT.
   * Body: { email, password }
   */
  adminLogin: async (req, res) => {
    const { email, password } = req.body;

    try {
      const user = await Admin.findByEmail(email);
      if (!user) {
        const deletedUser = await Admin.findByEmailIncludingDeleted(email);
        if (deletedUser && deletedUser.is_deleted) {
          return res.status(403).json({
            responseType: "F",
            responseValue: {
              message:
                "உங்கள் கணக்கு நீக்கப்பட்டுவிட்டது. மீட்டமைக்க கடைய்சு எங்களை தொடர்பு கொள்ளவும்.",
              deleted_at: deletedUser.deleted_at,
              account_status: "DELETED",
            },
          });
        }
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "தவறான மின்னஞ்சல் ஐடி!" },
        });
      }

      // check login block
      try {
        const blockStatus = await Admin.getLoginBlockStatus(user.id);
        if (blockStatus.is_blocked) {
          const minutesRemaining = Math.ceil(
            (new Date(blockStatus.blocked_until) - new Date()) / (1000 * 60),
          );
          return res.status(429).json({
            responseType: "F",
            responseValue: {
              message: `மிக அதிக தோல்வி முயற்சிகள். ${minutesRemaining} நிமிடங்களில் மீண்டும் முயற்சி செய்க.`,
              retry_after_minutes: minutesRemaining,
              blocked_until: blockStatus.blocked_until,
              account_status: "BLOCKED",
            },
          });
        }
      } catch (blockErr) {
        logger.warn("adminLogin block check error", blockErr);
      }

      const isPasswordValid = await bcrypt.compare(
        password,
        user.password_hash,
      );
      if (!isPasswordValid) {
        try {
          const failureStatus = await Admin.incrementFailedLoginAttempts(user.id);
          if (failureStatus.blocked) {
            return res.status(429).json({
              responseType: "F",
              responseValue: {
                message:
                  "மிக அதிக தோல்வி முயற்சிகள் (3 முறை). கணக்கு 15 நிமிடங்களுக்கு தடுக்கப்பட்டுள்ளது.",
                error_type: "ACCOUNT_LOCKED",
                attempts_made: 3,
                blocked_until: failureStatus.blocked_until,
                account_status: "BLOCKED",
              },
            });
          } else {
            const attempt = 3 - failureStatus.remaining_attempts;
            return res.status(401).json({
              responseType: "F",
              responseValue: {
                message: `கடவுச்சொல் தவறானது. முயற்சி ${attempt}/3. ${failureStatus.remaining_attempts} முயற்சிகள் மீதமுள்ளது.`,
                error_type: "INVALID_PASSWORD",
                attempt: attempt,
                attempts_remaining: failureStatus.remaining_attempts,
                max_attempts: 3,
              },
            });
          }
        } catch (err) {
          logger.warn("adminLogin failureStatus error", err);
          return res.status(401).json({
            responseType: "F",
            responseValue: { message: "கடவுச்சொல் தவறானது." },
          });
        }
      }

      try {
        await Admin.resetFailedLoginAttempts(user.id);
      } catch (err) {
        logger.warn("Failed to reset admin login attempts:", err);
      }

      const userID = user.id;
      tokenService.invalidatePreviousToken(userID);
      const jwtToken = tokenService.generateToken(userID);
      logger.debug(`admin login for ${userID}, token generated`);
      const response = {
        status: user.status,
        id: user.id,
        name: user.full_name,
        mobile: user.mobile,
        email: user.email,
        last_login: user.last_login_at || null,
        profile_image: user.profile_image_url || null,
        token: jwtToken,
      };

      if (typeof Admin.updateLastLogin === 'function') {
        try {
          await Admin.updateLastLogin(userID);
          // overwrite response timestamp to reflect the successful login update
          response.last_login = new Date();
        } catch (e) {
          logger.warn('admin updateLastLogin failed', e);
        }
      }

      // skip creating a user session for admin accounts – table is tied to users and would
      // cause a foreign key violation.  Logging only for historical purposes.
      logger.debug('admin login - session creation skipped');

      return res
        .status(200)
        .json({ responseType: "S", responseValue: response });
    } catch (error) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: error.toString() },
      });
    }
  },

  /**
   * ADMIN FORGOT PASSWORD - send reset token via email
   * Body: { email }
   */
  adminForgotPassword: async (req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({
        responseType: "F",
        responseValue: { message: "மின்னஞ்சல் தேவை!" },
      });
    }

    try {
      const admin = await Admin.findByEmail(email);
      if (!admin) {
        return res.status(404).json({
          responseType: "F",
          responseValue: { message: "தவறான மின்னஞ்சல் ஐடி!" },
        });
      }

      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 60 * 60 * 1000);
      await Admin.setResetToken(admin.id, token, expires);

      const resetLink = `${process.env.ADMIN_RESET_URL || ''}?token=${token}`;
      const html = `<p>Hello ${admin.full_name || ''},</p>
        <p>You requested a password reset for your administrator account. Please use the link below to choose a new password. The link will expire in one hour.</p>
        <p><a href="${resetLink}">Reset password</a></p>
        <p>If you did not request this, please ignore this email.</p>`;

      try {
        await sendEmail({
          to: admin.email,
          subject: 'Admin password reset',
          html,
        });
      } catch (emailErr) {
        logger.error('Failed to send admin forgot password email:', emailErr);
      }

      return res.status(200).json({
        responseType: "S",
        responseValue: { message: "Reset instructions sent if email exists." },
      });
    } catch (err) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: err.toString() },
      });
    }
  },

  /**
   * ADMIN RESET PASSWORD - verify token and update password
   * Body: { token, password }
   */
  adminResetPassword: async (req, res) => {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({
        responseType: "F",
        responseValue: { message: "token and password required" },
      });
    }

    try {
      const record = await Admin.findByResetToken(token);
      if (!record) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Invalid or expired token" },
        });
      }
      if (record.reset_token_expires_at && new Date(record.reset_token_expires_at) < new Date()) {
        return res.status(400).json({
          responseType: "F",
          responseValue: { message: "Token has expired" },
        });
      }
      const hashed = await bcrypt.hash(password, 10);
      await Admin.updatePassword({ id: record.id, password: hashed });
      await Admin.clearResetToken(record.id);
      return res.status(200).json({
        responseType: "S",
        responseValue: { message: "Password has been reset" },
      });
    } catch (err) {
      return res.status(500).json({
        responseType: "F",
        responseValue: { message: err.toString() },
      });
    }
  },
};
