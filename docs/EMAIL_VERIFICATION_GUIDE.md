# Email Verification System - Complete Guide

## Overview

The email verification system has been implemented to manage user email verification using OTP (One-Time Password). This guide covers the complete flow and API endpoints.

---

## Database Tables

### 1. **users** table
**New Fields Added:**
```sql
is_verified TINYINT(1) DEFAULT 0          -- 0=not verified, 1=verified
email_verified_at DATETIME NULL            -- Timestamp when verified
```

### 2. **user_otps** table (for OTP management)
```sql
id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY
user_id BINARY(16) NOT NULL
code VARCHAR(6) NOT NULL                   -- 6-digit OTP
type ENUM('LOGIN','RESET','VERIFY')        -- VERIFY for email verification
expires_at DATETIME NOT NULL               -- 10-minute expiry
is_used TINYINT(1) DEFAULT 0               -- Whether OTP was used
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
```

---

## Email Verification Flow

```
User Registration
    ↓
1. User creates account (is_verified = 0)
    ↓
2. User requests OTP via "Request Verification"
    ↓
3. OTP sent to email
    ↓
4. User enters OTP in app
    ↓
5. Verify with "Verify Email OTP" endpoint
    ↓
6. System marks is_verified = 1, sets email_verified_at
    ↓
User can now access all features
```

---

## API Endpoints

### 1. Request Verification OTP

Send OTP to user's email for verification.

**Endpoint:**
```
POST /api/user/request-verification-otp
Content-Type: application/json
```

**Request Body:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000"
}
```
OR
```json
{
    "email": "user@example.com"
}
```

**Response (Success):**
```json
{
    "responseType": "S",
    "responseValue": {
        "message": "OTP உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுவிட்டது!",
        "expires_in_minutes": 10
    }
}
```

**Response (Already Verified):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "இந்த மின்னஞ்சல் ஏற்கனவே சரிபார்க்கப்பட்டுவிட்டது!"
    }
}
```

**Response (User Not Found):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "குறிப்பிடப்பட்ட பயனர் இல்லை!"
    }
}
```

---

### 2. Verify Email OTP

Verify the OTP sent to email and mark user as verified.

**Endpoint:**
```
POST /api/user/verify-email-otp
Content-Type: application/json
```

**Request Body:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "123456"
}
```

**Response (Success):**
```json
{
    "responseType": "S",
    "responseValue": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "John Doe",
        "email": "john@example.com",
        "is_verified": 1,
        "email_verified_at": "2026-02-21T10:30:00.000Z",
        "message": "மின்னஞ்சல் வெற்றிகரமாக சரிபார்க்கப்பட்டது!"
    }
}
```

**Response (Invalid OTP):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "OTP ஐக் கண்டுபிடிக்க முடியவில்லை!"
    }
}
```

**Response (OTP Already Used):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "இந்த OTP ஏற்கனவே பயன்படுத்தப்பட்டுவிட்டது!"
    }
}
```

**Response (OTP Expired):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "OTP காலாவதியாகிவிட்டது! புதிய OTP கோருங்கள்."
    }
}
```

---

### 3. Resend Verification OTP

Resend OTP if user didn't receive it.

**Endpoint:**
```
POST /api/user/resend-verification-otp
Content-Type: application/json
```

**Request Body:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000"
}
```
OR
```json
{
    "email": "user@example.com"
}
```

**Response (Success):**
```json
{
    "responseType": "S",
    "responseValue": {
        "message": "OTP மீண்டும் உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுவிட்டது!",
        "expires_in_minutes": 10
    }
}
```

---

### 4. Check Verification Status

Check if user's email is verified and when.

**Endpoint:**
```
GET /api/user/verification-status/:id
Header: Authorization: Bearer <token> (optional)
```

**Response:**
```json
{
    "responseType": "S",
    "responseValue": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john@example.com",
        "is_verified": 1,
        "email_verified_at": "2026-02-21T10:30:00.000Z",
        "message": "மின்னஞ்சல் சரிபார்க்கப்பட்டுவிட்டது."
    }
}
```

**Response (Not Verified):**
```json
{
    "responseType": "S",
    "responseValue": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "john@example.com",
        "is_verified": 0,
        "email_verified_at": null,
        "message": "மின்னஞ்சல் இன்னும் சரிபார்க்கப்படவில்லை."
    }
}
```

---

## User Model Methods

### 1. generateOTP()
Generates a random 6-digit OTP.

```javascript
const otp = User.generateOTP();
// Output: "123456"
```

---

### 2. createVerificationOTP(userId)
Creates and stores OTP in database with 10-minute expiration.

```javascript
const otpData = await User.createVerificationOTP(userId);
// Returns: { otp: "123456", expiresAt: Date, id: 1 }
```

**Database State:**
```sql
INSERT INTO user_otps (user_id, code, type, expires_at, is_used)
VALUES (BINARY(16), "123456", "VERIFY", NOW() + 10 minutes, 0);
```

---

### 3. verifyEmailOTP(userId, otp)
Verifies OTP and marks user as verified.

```javascript
const result = await User.verifyEmailOTP(userId, "123456");
// Returns: { success: true, message: "..." } or { success: false, message: "..." }
```

**Checks Performed:**
- ✓ OTP exists for user
- ✓ OTP type is 'VERIFY'
- ✓ OTP has not been used before
- ✓ OTP has not expired (< NOW())

**On Success:**
- Marks OTP as used: `is_used = 1`
- Updates user: `is_verified = 1`, `email_verified_at = NOW()`

---

### 4. isEmailVerified(userId)
Checks if user's email is verified.

```javascript
const status = await User.isEmailVerified(userId);
// Returns: { is_verified: 1, email_verified_at: "2026-02-21..." }
```

---

### 5. getUnverifiedUsers(limit)
Gets list of unverified users (for notifications/reminders).

```javascript
const unverifiedUsers = await User.getUnverifiedUsers(50);
// Returns: Array of { id, full_name, email, created_at, fcm_token }
```

---

### 6. getPendingOTP(userId)
Gets the currently pending (non-expired, unused) OTP for user.

```javascript
const pending = await User.getPendingOTP(userId);
// Returns: { code: "123456", expires_at: Date, is_used: 0 } or null
```

---

### 7. deleteExpiredOTPs()
Deletes all expired OTPs from database (maintenance).

```javascript
await User.deleteExpiredOTPs();
// Deletes where expires_at < NOW()
```

---

### 8. markEmailVerified(userId)
Manually mark user's email as verified (admin/system use).

```javascript
await User.markEmailVerified(userId);
// Updates: is_verified = 1, email_verified_at = NOW()
```

---

## Workflow Examples

### Example 1: Complete Verification Flow

**Step 1: User Signs Up**
```javascript
// User creates account via /api/user/create
// Result: is_verified = 0
const newUser = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    full_name: "John Doe",
    email: "john@example.com",
    mobile: "9876543210",
    status: "ACTIVE",
    is_verified: 0
};
```

**Step 2: Request Verification OTP**
```bash
curl -X POST http://localhost:3000/api/user/request-verification-otp \
  -H "Content-Type: application/json" \
  -d '{"id": "550e8400-e29b-41d4-a716-446655440000"}'

# Actions:
# 1. Generates 6-digit OTP (e.g., "487291")
# 2. Stores in user_otps table with 10-minute expiry
# 3. Sends email to john@example.com with OTP
```

**Step 3: User Receives Email**
```
Subject: 🔐 Moi Kanakku Email Verification - தமிழ்

🔐 Moi Kanakku Email Verification

                487291

உங்கள் மின்னஞ்சல் சரிபார்க்க இந்த OTP ஐ பயன்படுத்தவும்
This OTP will expire in 10 minutes
```

**Step 4: User Enters OTP**
```bash
curl -X POST http://localhost:3000/api/user/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "487291"
  }'

# Response:
# {
#   "responseType": "S",
#   "responseValue": {
#     "is_verified": 1,
#     "email_verified_at": "2026-02-21T10:30:00Z",
#     "message": "மின்னஞ்சல் வெற்றிகரமாக சரிபார்க்கப்பட்டது!"
#   }
# }
```

**Database State After Verification:**
```sql
-- users table
UPDATE users SET 
  is_verified = 1, 
  email_verified_at = '2026-02-21 10:30:00' 
WHERE id = BINARY(...);

-- user_otps table
UPDATE user_otps SET is_used = 1 WHERE id = <otp_id>;
```

---

### Example 2: Resend OTP (Didn't Receive)

```bash
curl -X POST http://localhost:3000/api/user/resend-verification-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com"}'

# Creates new OTP, deletes expired ones, sends new email
```

---

### Example 3: Check Verification Status

```bash
curl -X GET http://localhost:3000/api/user/verification-status/550e8400-e29b-41d4-a716-446655440000

# Response:
# {
#   "is_verified": 1,
#   "email_verified_at": "2026-02-21T10:30:00Z",
#   "message": "மின்னஞ்சல் சரிபார்க்கப்பட்டுவிட்டது."
# }
```

---

## OTP Security Features

1. **6-Digit Random OTP**
   - Generated using crypto.random
   - Random enough to prevent brute force
   - Changes with each request

2. **10-Minute Expiration**
   - Stored as `expires_at` DATETIME
   - Checked against NOW() during verification
   - Expired OTPs cannot be verified

3. **Single Use Only**
   - `is_used` flag prevents reuse
   - Once verified, OTP cannot be used again
   - Prevents replay attacks

4. **Audit Trail**
   - Created timestamp in `created_at`
   - Can track verification history per user

5. **Auto-Cleanup**
   - `deleteExpiredOTPs()` cleans up old records
   - Can be called periodically via cron job

---

## Integration with Login

### Option 1: Enforce Email Verification (Strict)
```javascript
// In login controller
const user = await User.findByEmail(email);
if (!user.is_verified) {
    return res.status(403).json({ 
        responseType: "F", 
        responseValue: { 
            message: 'மின்னஞ்சல் சரிபார்க்கப்பட்டுவிட்டது வரை நீங்கள் பதிவுசெய்ய முடியாது!',
            id: user.id 
        } 
    });
}
```

### Option 2: Allow Login But Flag as Unverified (Lenient)
```javascript
// In login controller
const user = await User.findByEmail(email);
const response = {
    token: jwtToken,
    is_verified: user.is_verified,
    message: user.is_verified ? "வெற்றிகர..." : "உங்கள் மின்னஞ்சல் சரிபார்க்கவும்"
};
```

---

## Routes Configuration

Add these routes to `/src/routes/user.js`:

```javascript
router.post('/request-verification-otp', userController.requestVerificationOTP);
router.post('/verify-email-otp', userController.verifyEmailOTP);
router.post('/resend-verification-otp', userController.resendVerificationOTP);
router.get('/verification-status/:id', userController.checkVerificationStatus);
```

---

## Email Template Structure

**Email Subject:**
```
🔐 Moi Kanakku Email Verification - தமிழ்
```

**Email Content:**
1. Header with logo
2. OTP in large, readable format
3. Tamil + English instructions
4. Expiry time (10 minutes)
5. Action buttons (if needed)
6. Footer with company info

---

## Troubleshooting

### OTP Not Received
1. Check email configuration in `.env`
2. Verify email provider credentials
3. Check spam folder
4. Use resend endpoint to generate new OTP

### Invalid OTP Error
1. User entered wrong OTP
2. OTP was expired
3. OTP was already used
4. User ID doesn't match OTP

### Already Verified Error
1. Email was previously verified
2. Cannot verify same email twice
3. Create new account with different email

---

## Maintenance Tasks

### Daily
```javascript
// Delete expired OTPs
await User.deleteExpiredOTPs();
```

### Weekly
```javascript
// Get unverified users for reminder emails
const unverified = await User.getUnverifiedUsers(100);
// Send reminder emails
```

### Monthly
```javascript
// Audit verification rates
SELECT COUNT(*) as total_users,
       SUM(is_verified) as verified_count,
       (SUM(is_verified)/COUNT(*) * 100) as verification_rate
FROM users;
```

---

## Summary

| Feature | Implementation | Status |
|---------|----------------|--------|
| OTP Generation | `User.generateOTP()` | ✅ Complete |
| OTP Storage | `user_otps` table | ✅ Complete |
| OTP Verification | `User.verifyEmailOTP()` | ✅ Complete |
| Email Sending | Nodemailer SMTP | ✅ Complete |
| Verification Tracking | `is_verified`, `email_verified_at` | ✅ Complete |
| api/request-verification-otp | Controller method | ✅ Complete |
| api/verify-email-otp | Controller method | ✅ Complete |
| api/resend-verification-otp | Controller method | ✅ Complete |
| api/verification-status | Controller method | ✅ Complete |
| Resend OTP | Cleanup + new OTP | ✅ Complete |
| Error Handling | Tamil + English messages | ✅ Complete |

**All email verification features are implemented and ready for use!**
