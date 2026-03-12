// User controllers: authentication, account management, and notifications
const User = require("../models/user");
const SessionModel = require("../models/sessions");
const bcrypt = require("bcryptjs");
const tokenService = require("../middlewares/tokenService");
const { sendPushNotification } = require("./notificationController");
const { NotificationType } = require("../models/notificationModels");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const logger = require("../config/logger");

const { sendEmail } = require("../services/emailService");

// Common response messages
const userError = "குறிப்பிடப்பட்ட பயனர் இல்லை!";
const mobileError =
  "இந்த மொபைல் எண் ஏற்கனவே மற்றொரு பயனருக்கு பதிவு செய்யப்பட்டுள்ளது.";

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
        return res
          .status(404)
          .json({
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
          return res
            .status(401)
            .json({
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
        last_login: user.last_activity_at,
        profile_image: user.profile_image_url || null,
        referral_code: user.referral_code || null,
        fcm_token: user.notification_token || null,
        token: jwtToken,
      };

      // Update last login timestamp
      await User.updateLastLogin(userID);

      // Create session record
      try {
        await SessionModel.createSession(userID);
      } catch (sessionErr) {
        logger.warn("Failed to create session record:", sessionErr);
        // Continue even if session creation fails - not critical
      }

      return res
        .status(200)
        .json({ responseType: "S", responseValue: response });
    } catch (error) {
      return res
        .status(500)
        .json({
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
    try {
      // Validate required fields
      if (!name || !email || !mobile || !password) {
        return res
          .status(400)
          .json({
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
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: {
              message: "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!",
            },
          });
      }
      // Check duplicates by mobile number
      const mbl = await User.findByMobile(mobile);
      if (mbl) {
        return res
          .status(404)
          .json({
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
        const userId = query.insertId;

        // If referred_by (referral code) provided, link referrer -> referred (ignore if invalid)
        if (referred_by && String(referred_by).trim()) {
          try {
            const referrer = await User.findByReferralCode(referred_by);
            if (referrer && referrer.id !== userId) {
              await User.recordReferral(referrer.id, userId);
            }
          } catch (refErr) {
            logger.error("Referral link failed", refErr);
          }
        }
        const registrationTime = new Date().toLocaleString("en-IN", {
          timeZone: "Asia/Kolkata",
        });
        // Welcome email content (HTML)
        const emailContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to Moi Kanakku</title></head><body style="margin:0;padding:0;background:#f4f6fb;font-family:Segoe UI,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 10px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border:1px solid #e5e7f2;border-radius:10px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.06);"><tr><td style="text-align:center;padding:25px;border-bottom:1px solid #eee;"><h2 style="margin:0;color:#2f3490;font-size:24px;">🎉 Welcome to <span style="color:#4346d2;">Moi Kanakku!</span></h2><p style="margin-top:8px;color:#666;font-size:14px;">Your personal event & relation manager</p></td></tr><tr><td style="padding:25px 28px;color:#333;line-height:1.6;"><p style="font-size:16px;margin:0 0 10px;">Hi <strong style="color:#2f3490;">${name}</strong>,</p><p style="margin:0 0 16px;">We're excited to have you join our community! Moi Kanakku helps you manage<strong>events, relations, and gifts easily.</strong></p><div style="background:#f4f6ff;border-left:4px solid #2f3490;border-radius:6px;padding:16px;margin:20px 0;"><p style="margin:0 0 10px;font-weight:700;color:#2f3490;">Here's how you can get started:</p><ul style="padding-left:18px;margin:0;color:#333;"><li style="margin-bottom:8px;">Create and maintain events, relations, and gift records.</li><li style="margin-bottom:8px;">Manage guests attending your events with gift tracking.</li><li style="margin-bottom:8px;">Filter records easily by function or relation.</li><li>Export your data anytime in Excel format.</li></ul></div><p style="margin-top:15px;">🙏 <strong>Thank you for choosing Moi Kanakku.</strong></p><div style="background:#eef4ff;border:1px solid #dbe7ff;border-radius:6px;padding:15px;margin-top:20px;"><p style="margin:0 0 6px;font-weight:600;color:#2f3490;">🚀 Share Moi Kanakku</p><p style="margin:0;font-size:14px;color:#555;">If you like Moi Kanakku, please share it with your friends and family.More features and promotions are coming soon!</p></div><p style="margin-top:20px;">Best regards,<br><strong style="color:#2f3490;">Moi Kanakku Team</strong></p></td></tr><tr><td style="border-top:1px solid #eee;text-align:center;padding:15px;font-size:12px;color:#888;">© 2026 Moi Kanakku. All rights reserved.<br>If you did not sign up for Moi Kanakku, please ignore this email.</td></tr></table></td></tr></table></body></html>`;

        // Send welcome email to new user
        try {
          const mailOptions = {
            from: `"Info - Moi Kanakku" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
            to: email,
            replyTo: process.env.EMAIL_FROM || process.env.EMAIL_USER,
            envelope: { from: process.env.EMAIL_USER, to: email },
            subject: "Welcome to Moi Kanakku!",
            html: emailContent,
          };
          await sendEmail({
            to: email,
            subject: mailOptions.subject,
            html: mailOptions.html,
          });
        } catch (emailError) {
          logger.error("Error sending welcome email:", emailError);
          // Continue even if welcome email fails
        }

        // Admin notification email with complete user details
        const adminEmailContent = `<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>New User Registered</title></head><body style="margin:0;padding:0;background-color:#f7f9fc;font-family:Segoe UI,Arial,sans-serif;"><table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 10px;"><tr><td align="center"><table width="100%" cellpadding="0" cellspacing="0" style="max-width:620px;background:#ffffff;border-radius:14px;overflow:hidden;box-shadow:0 4px 14px rgba(0,0,0,0.08);border:1px solid #e6e9ef"><tr><td style="background:linear-gradient(135deg,#007bff,#00c6ff);color:#ffffff;text-align:center;padding:28px 20px;"><h1 style="margin:0;font-size:24px;letter-spacing:0.5px;"> 🎉 New User Registered Successfully </h1></td></tr><tr><td style="padding:30px 35px;color:#333;font-size:16px;line-height:1.7;"><p style="margin-top:0;"> Hello <strong>Admin</strong>, </p><p style="margin-bottom:20px;"> A new user has successfully registered in <strong>Moi Kanakku</strong>. Here are the registration details: </p><table width="100%" cellpadding="10" cellspacing="0" style="border-collapse:collapse;font-size:15px;background:#f9fbfc;border-radius:8px;"><tr><td width="35%" style="font-weight:600;color:#555;">User ID</td><td style="color:#222;">${userId}</td></tr><tr style="border-top:1px solid #e5eaf0;"><td style="font-weight:600;color:#555;">Name</td><td style="color:#222;">${name}</td></tr><tr style="border-top:1px solid #e5eaf0;"><td style="font-weight:600;color:#555;">Email</td><td><a href="mailto:${email}" style="color:#007bff;text-decoration:none;"> ${email} </a></td></tr><tr style="border-top:1px solid #e5eaf0;"><td style="font-weight:600;color:#555;">Mobile</td><td style="color:#222;">${mobile}</td></tr><tr style="border-top:1px solid #e5eaf0;"><td style="font-weight:600;color:#555;">Registration Time</td><td style="color:#222;">${registrationTime}</td></tr></table><div style="margin-top:28px;background:#f1f5ff;border-left:4px solid #007bff;padding:14px 18px;border-radius:6px;"><p style="margin:0;color:#333;"><strong>Admin Note:</strong> Please verify the user details in the admin panel if needed. </p></div><div style="margin-top:20px;background:#eef8ff;border-left:4px solid #00a2ff;padding:14px 18px;border-radius:6px;"><p style="margin:0;color:#333;"> 🚀 <strong>Moi Kanakku is growing!</strong> New users are joining the platform to manage events, relations, and gifts more efficiently. </p></div></td></tr><tr><td style="background:#f1f4f7;text-align:center;color:#777;font-size:13px;padding:14px;"> © 2026 Moi Kanakku. All rights reserved. </td></tr></table></td></tr></table></body></html>`;

        // Send admin notification email to agprakash406@gmail.com
        try {
          const adminMailOptions = {
            from: `"Info - Moi Kanakku" <${process.env.EMAIL_USER}>`,
            to: "agprakash406@gmail.com",
            subject: "New user registered successfully",
            html: adminEmailContent,
          };
          await sendEmail({
            to: "agprakash406@gmail.com",
            subject: adminMailOptions.subject,
            html: adminMailOptions.html,
          });
        } catch (adminEmailError) {
          logger.error(
            "Error sending admin notification email:",
            adminEmailError,
          );
          // Log error but don't fail the registration
        }
        // EOF email content --------------

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
            // Log error but don't fail the registration
          }
        }

        return res.status(200).json({
          responseType: "S",
          responseValue: {
            message: "பயனர் வெற்றிகரமாக பதிவு செய்யப்பட்டார்.",
            userId: userId,
          },
        });
      } else {
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: { message: "பயனர் பதிவு தோல்வியடைந்தது." },
          });
      }
    } catch (error) {
      logger.error("Error in user creation:", error);
      return res
        .status(500)
        .json({
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
          return res
            .status(404)
            .json({
              responseType: "F",
              responseValue: { message: mobileError },
            });
        }
      }

      // Check that email is unique (excluding current user)
      if (email) {
        const chkEmail = await User.findByEmail(email);
        if (chkEmail && chkEmail.id !== id) {
          return res
            .status(404)
            .json({
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
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: {
              message:
                "புதுப்பித்தல் தோல்வியடைந்தது. மாற்றங்களை சேமிக்க முடியவில்லை.",
            },
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
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
      return res
        .status(500)
        .json({
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
      return res
        .status(404)
        .json({
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
        return res
          .status(200)
          .json({
            responseType: "S",
            responseValue: {
              message: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது.",
            },
          });
      } else {
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: {
              message:
                "கடவுச்சொல்லை மாற்ற முடியவில்லை. தயவுசெய்து மீண்டும் முயற்சிக்கவும்.",
            },
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
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
        return res
          .status(200)
          .json({
            responseType: "S",
            responseValue: { message: "பயனர் கணக்கு நீக்கப்பட்டது." },
          });
      } else {
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: { message: "பயனர் நீக்குதல் தோல்வியடைந்தது!" },
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
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
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: "மின்னஞ்சல் தேவையானது!" },
          });
      }

      // Check if user exists (including deleted)
      const user = await User.findByEmailIncludingDeleted(email);
      if (!user) {
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: { message: "தவறான மின்னஞ்சல் ஐடி!" },
          });
      }

      // Check if user is actually deleted
      if (!user.is_deleted) {
        return res
          .status(400)
          .json({
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
        return res
          .status(500)
          .json({
            responseType: "F",
            responseValue: { message: "கணக்கு மீட்டமைப்பு தோல்வியடைந்தது!" },
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
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
        return res
          .status(200)
          .json({
            responseType: "S",
            responseValue: {
              message: "உங்கள் கடவுச்சொல் வெற்றிகரமாக மீட்டமைக்கப்பட்டது.",
            },
          });
      } else {
        return res
          .status(404)
          .json({
            responseType: "F",
            responseValue: { message: "கடவுச்சொல்லை மீட்டமைக்க முடியவில்லை." },
          });
      }
    } catch (error) {
      return res
        .status(500)
        .json({
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

      // Shape response for API consumers (non-sensitive)
      const response = {
        id: details.id,
        name: details.full_name,
        email: details.email,
        mobile: details.mobile,
        last_login: details.last_activity_at,
        profile: details.profile,
        device: details.device, // last-used / currently active device (single)
        referrer_id: details.referrer_id,
        referred_count: details.referred_count,
        create_date: details.created_at,
        update_date: details.updated_at,
        status: details.status,
        referral_code: details.referral_code || null,
        is_verified: details.is_verified || 0,
        email_verified_at: details.email_verified_at || null,
      };
      return res
        .status(200)
        .json({ responseType: "S", responseValue: response });
    } catch (error) {
      return res
        .status(500)
        .json({
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
        return res
          .status(400)
          .json({
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

      return res
        .status(200)
        .json({
          responseType: "S",
          responseValue: { referral_code: user.referral_code || null },
        });
    } catch (error) {
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  /**
   * Request email verification OTP
   * Body: { id } or { email }
   */
  requestVerificationOTP: async (req, res) => {
    const { id, email } = req.body;

    try {
      // Get user by ID or email
      let user = null;
      if (id) {
        user = await User.findById(id);
      } else if (email) {
        user = await User.findByEmail(email);
      }

      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      // Check if already verified
      if (user.is_verified) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: {
              message: "இந்த மின்னஞ்சல் ஏற்கனவே சரிபார்க்கப்பட்டுவிட்டது!",
            },
          });
      }

      // Create OTP
      const otpData = await User.createVerificationOTP(user.id);

      // Send email with OTP
      try {
        const emailContent = `<div style="margin:0;padding:0;background-color:#f4f6fb;font-family:Segoe UI,Arial,sans-serif"><table cellpadding=0 cellspacing=0 role=presentation style="padding:30px 10px"width=100%><tr><td align=center><table cellpadding=0 cellspacing=0 role=presentation style="max-width:600px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;overflow:hidden;box-shadow:0 8px 20px rgba(0,0,0,.05)"width=100%><tr><td style="padding:25px 20px;text-align:center;background:linear-gradient(90deg,#4f46e5,#6366f1);color:#fff"><h2 style=margin:0;font-size:22px;font-weight:600>🔐 Moi Kanakku Email Verification</h2><tr><td style="padding:35px 30px;text-align:center"><p style=margin:0;color:#6b7280;font-size:15px>உங்கள் மின்னஞ்சலை சரிபார்க்க கீழே உள்ள OTP ஐ பயன்படுத்தவும்<div style="margin:30px auto;padding:18px 25px;background:#eef2ff;border-radius:10px;display:inline-block"><span style=font-size:42px;letter-spacing:10px;font-weight:700;color:#4338ca;font-family:monospace>${otpData.otp}</span></div><p style="margin:10px 0 0;color:#9ca3af;font-size:14px">This OTP will expire in <strong>10 minutes</strong><tr><td style="padding:0 30px 25px 30px"><div style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:8px;padding:18px"><p style=margin:0;color:#111827;font-size:14px><strong>நீங்கள் செய்ய வேண்டியது:</strong><ol style="margin:10px 0 0 18px;padding:0;color:#374151;font-size:14px;line-height:1.6"><li>OTP ஐ உள்ளிடவும்<li>மின்னஞ்சல் சரிபார்க்கப்பட்ட பிறகு முழு பயன்பாட்டையும் பயன்படுத்தலாம்</ol></div><tr><td style="padding:20px 30px;text-align:center;border-top:1px solid #f1f1f1;border-bottom:1px solid #f1f1f1;color:#374151;font-size:14px">This request is for<br><strong>${user.full_name}</strong><br>${user.email}<tr><td style=padding:25px;text-align:center><p style=margin:0;color:#374151;font-size:14px>Best regards,<br><strong style=color:#4f46e5>Moi Kanakku Team</strong></table><p style="max-width:600px;margin:20px auto 0;color:#9ca3af;font-size:12px;line-height:1.5;text-align:center">© 2025 Moi Kanakku. All rights reserved.<br>If you did not request this OTP, please ignore this email or contact support.</table></div>`;
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          replyTo: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          envelope: { from: process.env.EMAIL_USER, to: user.email },
          subject: "🔐 Moi Kanakku Email Verification - தமிழ்",
          html: emailContent,
        };
        await sendEmail({
          to: user.email,
          subject: mailOptions.subject,
          html: mailOptions.html,
        });
        logger.info(`Verification OTP sent to user ${user.id}`);
      } catch (emailError) {
        logger.error("Error sending verification email:", emailError);
        // Don't fail the request, OTP is created
      }

      return res
        .status(200)
        .json({
          responseType: "S",
          responseValue: {
            message: "OTP உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுவிட்டது!",
            expires_in_minutes: 10,
          },
        });
    } catch (error) {
      logger.error("Error in requestVerificationOTP:", error);
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  /**
   * Request Restore OTP for a soft-deleted account (sends OTP to email)
   * Body: { email }
   */
  requestRestoreOTP: async (req, res) => {
    const { email } = req.body;
    try {
      if (!email) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: "மின்னஞ்சல் தேவையானது!" },
          });
      }

      // Find user including deleted
      const user = await User.findByEmailIncludingDeleted(email);
      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      // Ensure user is deleted
      if (!user.is_deleted) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: "இந்த கணக்கு நீக்கப்படவில்லை." },
          });
      }

      // Create restore OTP
      const otpData = await User.createRestoreOTP(user.id);

      // Send email with OTP
      try {
        const emailContent = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:30px;background:#fff;border:1px solid #eaeaea;border-radius:8px"><h2 style="color:#2f3490">🔁 Account Restore OTP</h2><p>Hi <strong>${user.full_name}</strong>,</p><p style="font-size:28px;letter-spacing:6px;text-align:center;font-family:monospace">${otpData.otp}</p><p>This OTP will expire in 10 minutes. Enter this OTP to verify ownership and restore your account.</p><p>If you did not request this, please ignore.</p><p>Regards,<br/>Moi Kanakku Team</p></div>`;
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          subject: "🔁 Moi Kanakku - Account Restore OTP",
          html: emailContent,
        };
        await sendEmail({
          to: user.email,
          subject: mailOptions.subject,
          html: mailOptions.html,
        });
        logger.info(`Restore OTP sent to user ${user.id}`);
      } catch (emailError) {
        logger.error("Error sending restore OTP email:", emailError);
      }

      return res
        .status(200)
        .json({
          responseType: "S",
          responseValue: {
            message: "OTP உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டது!",
            expires_in_minutes: 10,
          },
        });
    } catch (error) {
      logger.error("Error in requestRestoreOTP:", error);
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  /**
   * Verify email OTP
   * Body: { id, otp }
   */
  verifyEmailOTP: async (req, res) => {
    const { id, otp } = req.body;

    try {
      if (!id || !otp) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: "ID மற்றும் OTP இரண்டும் தேவையானவை!" },
          });
      }

      // Verify user exists
      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      // Verify OTP
      const result = await User.verifyEmailOTP(id, otp);

      if (!result.success) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: result.message },
          });
      }

      // Fetch updated user
      const updatedUser = await User.findById(id);
      const response = {
        id: updatedUser.id,
        name: updatedUser.full_name,
        email: updatedUser.email,
        is_verified: updatedUser.is_verified,
        email_verified_at: updatedUser.email_verified_at,
        message: result.message,
      };

      return res
        .status(200)
        .json({ responseType: "S", responseValue: response });
    } catch (error) {
      logger.error("Error in verifyEmailOTP:", error);
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  /**
   * Verify restore OTP and actually restore the soft-deleted account
   * Body: { id, otp }
   */
  verifyRestoreOTP: async (req, res) => {
    const { id, otp } = req.body;

    try {
      if (!id || !otp) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: "ID மற்றும் OTP இரண்டும் தேவையானவை!" },
          });
      }

      // Ensure the user exists (including deleted)
      const user = await User.findByIdIncludingDeleted(id);
      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      // Verify restore OTP
      const result = await User.verifyRestoreOTP(id, otp);
      if (!result.success) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: { message: result.message },
          });
      }

      // Perform restore
      const restoreResult = await User.restoreUser(id);
      if (!restoreResult) {
        return res
          .status(500)
          .json({
            responseType: "F",
            responseValue: { message: "கணக்கு மீட்டமைப்பு தோல்வியடைந்தது!" },
          });
      }

      const restoredUser = await User.findById(id);
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
    } catch (error) {
      logger.error("Error in verifyRestoreOTP:", error);
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  /**
   * Resend verification OTP
   * Body: { id } or { email }
   */
  resendVerificationOTP: async (req, res) => {
    const { id, email } = req.body;

    try {
      // Get user by ID or email
      let user = null;
      if (id) {
        user = await User.findById(id);
      } else if (email) {
        user = await User.findByEmail(email);
      }

      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      // Check if already verified
      if (user.is_verified) {
        return res
          .status(400)
          .json({
            responseType: "F",
            responseValue: {
              message: "இந்த மின்னஞ்சல் ஏற்கனவே சரிபார்க்கப்பட்டுவிட்டது!",
            },
          });
      }

      // Delete expired OTPs
      await User.deleteExpiredOTPs();

      // Create new OTP
      const otpData = await User.createVerificationOTP(user.id);

      // Send email with OTP
      try {
        const emailContent = `<div style="font-family:'Segoe UI',Arial,sans-serif;max-width:620px;margin:0 auto;padding:30px;background:linear-gradient(180deg,#fff 0,#f9faff 100%);border:1px solid #e5e7f2;border-radius:12px;box-shadow:0 4px 16px rgba(0,0,0,.06)"><div style="text-align:center;padding-bottom:15px;border-bottom:1px solid #eee"><h2 style="color:#2f3490;margin:0;font-size:24px">🔐 Moi Kanakku Email Verification (Resent)</h2></div><div style="padding:30px 0;text-align:center"><h1 style="color:#4346d2;font-size:48px;letter-spacing:10px;margin:20px 0;font-weight:bold;font-family:monospace">${otpData.otp}</h1><p style="color:#666;font-size:16px;margin:20px 0">உங்கள் மின்னஞ்சல் சரிபார்க்க இந்த OTP ஐ பயன்படுத்தவும் (மறு-அனுப்பல்)</p></div><div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0"><p style="margin:0;color:#333"><strong>நீங்கள் பெற வேண்டியது:</strong><br><span style="color:#4346d2;font-weight:bold">1. OTP ஐ உள்ளிடவும்</span><br>2. மின்னஞ்சல் சரிபார்க்கப்பட்ட பிறகு முழு அ்ற்றக்தையை பயன்படுத்தவும்</p></div></div>`;
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: user.email,
          replyTo: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          envelope: { from: process.env.EMAIL_USER, to: user.email },
          subject: "🔐 Moi Kanakku Email Verification (Resent) - தமிழ்",
          html: emailContent,
        };
        await sendEmail({
          to: user.email,
          subject: mailOptions.subject,
          html: mailOptions.html,
        });
        logger.info(`Verification OTP resent to user ${user.id}`);
      } catch (emailError) {
        logger.error("Error sending verification email:", emailError);
      }

      return res
        .status(200)
        .json({
          responseType: "S",
          responseValue: {
            message: "OTP மீண்டும் உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுவிட்டது!",
            expires_in_minutes: 10,
          },
        });
    } catch (error) {
      logger.error("Error in resendVerificationOTP:", error);
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },

  /**
   * Check email verification status
   * Params: { id }
   */
  checkVerificationStatus: async (req, res) => {
    const userId = req.params.id;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res
          .status(404)
          .json({ responseType: "F", responseValue: { message: userError } });
      }

      const verificationStatus = await User.isEmailVerified(userId);

      return res.status(200).json({
        responseType: "S",
        responseValue: {
          id: user.id,
          email: user.email,
          is_verified: verificationStatus.is_verified,
          email_verified_at: verificationStatus.email_verified_at,
          message: verificationStatus.is_verified
            ? "மின்னஞ்சல் சரிபார்க்கப்பட்டுவிட்டது."
            : "மின்னஞ்சல் இன்னும் சரிபார்க்கப்படவில்லை.",
        },
      });
    } catch (error) {
      logger.error("Error in checkVerificationStatus:", error);
      return res
        .status(500)
        .json({
          responseType: "F",
          responseValue: { message: error.toString() },
        });
    }
  },
};
