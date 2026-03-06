# Unified Email & OTP API Migration Guide

## Overview
The email and OTP handling has been consolidated into **two unified endpoints** under `/api/email/`:
- `POST /api/email/sendEmail` — Send OTP or custom email
- `POST /api/email/verifyOtp` — Verify OTP (all types)

This reduces API surface, improves code reuse, and simplifies client integration.

---

## Key Changes

### 1. **Unified sendEmail Endpoint**
**Endpoint:** `POST /api/email/sendEmail`

Replaces:
- `POST /api/user/request-restore-otp`
- `POST /api/user/request-verification-otp`
- `POST /api/user/resend-verification-otp`
- `POST /api/email/forgotOtp`

**Body Parameters:**
```json
{
  "type": "restore|verification|forgot|custom",
  "email": "user@example.com",
  "id": "<user-id>",
  "subject": "Optional custom subject",
  "content": "Optional custom HTML content",
  "sendNotification": true,
  "notificationUserId": "<user-id>",
  "notificationToken": "<fcm-token>",
  "notificationTitle": "Custom title",
  "notificationBody": "Custom body",
  "notificationType": "account|moi|moiOut|..."
}
```

### Type-Specific Behavior

#### a) `type: "restore"` — Account Restore OTP
- **Use case:** Allow deleted users to restore their account
- **Required:** `email`
- **Flow:** 
  1. Finds user (including deleted)
  2. Creates 6-digit OTP with 10-min expiry in `user_otps` table (type='RESTORE')
  3. Sends email with OTP
  4. Returns: `{ message: 'OTP sent for restore', expires_in_minutes: 10 }`

**Example Request:**
```bash
curl -X POST 'http://localhost:3000/api/email/sendEmail' \
  -H 'Content-Type: application/json' \
  -d '{"type":"restore","email":"deleted@example.com"}'
```

#### b) `type: "verification"` or `"verify"` — Email Verification OTP
- **Use case:** New user or unverified email verification
- **Required:** `email` OR `id`
- **Flow:**
  1. Finds active user
  2. Creates 6-digit OTP with 10-min expiry in `user_otps` table (type='VERIFY')
  3. Sends email with OTP
  4. Returns: `{ message: 'Verification OTP sent', expires_in_minutes: 10 }`

**Example Request:**
```bash
curl -X POST 'http://localhost:3000/api/email/sendEmail' \
  -H 'Content-Type: application/json' \
  -d '{"type":"verification","email":"user@example.com"}'
```

#### c) `type: "forgot"` — Forgot Password OTP
- **Use case:** User forgot password and needs reset
- **Required:** `email`
- **Flow:**
  1. Finds user
  2. Creates 6-digit OTP with 10-min expiry in `user_otps` table (type='FORGOT')
  3. Sends email with OTP
  4. Returns: `{ message: 'Forgot OTP sent' }`

**Example Request:**
```bash
curl -X POST 'http://localhost:3000/api/email/sendEmail' \
  -H 'Content-Type: application/json' \
  -d '{"type":"forgot","email":"user@example.com"}'
```

#### d) `type: "custom"` or `"raw"` — Custom Email
- **Use case:** Admin/system sends arbitrary email content
- **Required:** `email`, `content`
- **Optional:** `subject`
- **Flow:**
  1. Sends email with provided HTML content
  2. Returns: `{ message: 'มิน้นஞ்சல் வெற்றிகரமாக அனுப்பப்பட்டது.' }`

**Example Request:**
```bash
curl -X POST 'http://localhost:3000/api/email/sendEmail' \
  -H 'Content-Type: application/json' \
  -d '{
    "type":"custom",
    "email":"admin@example.com",
    "subject":"Custom Report",
    "content":"<p>Your report is ready</p>"
  }'
```

### Optional Push Notification
Any `sendEmail` request can optionally send a push notification by including:
```json
{
  "sendNotification": true,
  "notificationUserId": "<user-id>",
  "notificationToken": "<fcm-token>",
  "notificationTitle": "Title",
  "notificationBody": "Body text",
  "notificationType": "account"
}
```

---

## 2. **Unified verifyOtp Endpoint**
**Endpoint:** `POST /api/email/verifyOtp`

Replaces:
- `POST /api/user/verify-restore-otp`
- `POST /api/user/verify-email-otp`
- `POST /api/email/verifyOtp` (old legacy version)

**Body Parameters:**
```json
{
  "email": "user@example.com",
  "emailId": "user@example.com",
  "id": "<user-id>",
  "otp": "123456",
  "type": "forgot|verification|restore"
}
```

**Type-Specific Behavior:**

| Type | Model Method | DB Type | Notes |
|------|--------------|---------|-------|
| `forgot` | `User.verifyForgotOTP()` | `FORGOT` | Validates OTP, marks used |
| `verification` | `User.verifyEmailOTP()` | `VERIFY` | Validates OTP, marks user as verified, marks OTP used |
| `restore` | `User.verifyRestoreOTP()` | `RESTORE` | Validates OTP, marks used (does NOT restore yet) |

**Response Examples:**

*Success:*
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "OTP சரியாக உள்ளது."
  }
}
```

*Failure:*
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "OTP காலாவதியாகிவிட்டது! புதிய OTP கோருங்கள்."
  }
}
```

### Backward Compatibility
- `emailId` parameter (legacy) still works → maps to `email`
- Default type is `"forgot"` if not specified
- Returns legacy error messages in Tamil

---

## Complete Workflow Examples

### Restore Deleted Account
1. **Request OTP:**
   ```bash
   curl -X POST 'http://localhost:3000/api/email/sendEmail' \
     -H 'Content-Type: application/json' \
     -d '{"type":"restore","email":"deleted@example.com"}'
   ```

2. **User receives OTP in email**

3. **Verify OTP and prepare restore:**
   ```bash
   curl -X POST 'http://localhost:3000/api/email/verifyOtp' \
     -H 'Content-Type: application/json' \
     -d '{"id":"<user-id>","otp":"123456","type":"restore"}'
   ```

4. **Restore account:**
   ```bash
   curl -X POST 'http://localhost:3000/api/user/verify-restore-otp' \
     -H 'Content-Type: application/json' \
     -d '{"id":"<user-id>","otp":"123456"}'
   ```

### Verify Email (New User)
1. **Request OTP:**
   ```bash
   curl -X POST 'http://localhost:3000/api/email/sendEmail' \
     -H 'Content-Type: application/json' \
     -d '{"type":"verification","email":"newuser@example.com"}'
   ```

2. **Verify OTP:**
   ```bash
   curl -X POST 'http://localhost:3000/api/email/verifyOtp' \
     -H 'Content-Type: application/json' \
     -d '{"id":"<user-id>","otp":"123456","type":"verification"}'
   ```
   → User is marked as verified (`is_verified = 1`, `email_verified_at` updated)

### Forgot Password
1. **Request OTP:**
   ```bash
   curl -X POST 'http://localhost:3000/api/email/sendEmail' \
     -H 'Content-Type: application/json' \
     -d '{"type":"forgot","email":"user@example.com"}'
   ```

2. **Verify OTP:**
   ```bash
   curl -X POST 'http://localhost:3000/api/email/verifyOtp' \
     -H 'Content-Type: application/json' \
     -d '{"email":"user@example.com","otp":"123456","type":"forgot"}'
   ```

3. **Reset password:**
   ```bash
   curl -X POST 'http://localhost:3000/api/user/reset-password' \
     -H 'Content-Type: application/json' \
     -d '{"email":"user@example.com","password":"newpass123"}'
   ```

---

## Database Schema Changes

### user_otps Table
All OTP types now use a single table with a `type` column:

```sql
CREATE TABLE user_otps (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id BINARY(16) NOT NULL,
  code VARCHAR(6) NOT NULL,
  type ENUM('VERIFY', 'RESTORE', 'FORGOT') DEFAULT 'VERIFY',
  expires_at DATETIME NOT NULL,
  is_used BOOLEAN DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (user_id, type, created_at),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Legacy emailModels Table
The old `gp_moi_user_master.um_otp` and `um_otp_exp` columns are deprecated but still supported for backward compatibility.

---

## Migration Checklist

- [ ] Update client apps to use `/api/email/sendEmail` and `/api/email/verifyOtp`
- [ ] Test all three OTP types (restore, verification, forgot)
- [ ] Verify push notifications (optional) work when `sendNotification: true`
- [ ] Update API documentation/Postman
- [ ] Monitor logs for deprecated endpoint usage
- [ ] Eventually remove old endpoints after full client migration

---

## Deprecated Endpoints (Still Available for Backward Compatibility)

| Old Endpoint | Replacement |
|--------------|-------------|
| `POST /api/email/forgotOtp` | `POST /api/email/sendEmail` with `type: "forgot"` |
| `POST /api/email/verifyOtp` (old) | `POST /api/email/verifyOtp` (new, unified) |
| `POST /api/user/request-restore-otp` | `POST /api/email/sendEmail` with `type: "restore"` |
| `POST /api/user/verify-restore-otp` | `POST /api/email/verifyOtp` with `type: "restore"` |
| `POST /api/user/request-verification-otp` | `POST /api/email/sendEmail` with `type: "verification"` |
| `POST /api/user/verify-email-otp` | `POST /api/email/verifyOtp` with `type: "verification"` |
| `POST /api/user/resend-verification-otp` | `POST /api/email/sendEmail` with `type: "verification"` |

**Note:** Old endpoints are **not exposed in routes** but controller methods remain. They can be re-enabled if needed during transition.

---

## Environment Variables
Ensure these are set for email functionality:
```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM=noreply@moikanakku.com
EMAIL_SECURE=false
EMAIL_REQUIRE_TLS=true
```

For FCM notifications:
```env
FIREBASE_PROJECT_ID=...
FIREBASE_PRIVATE_KEY=...
FIREBASE_CLIENT_EMAIL=...
```

---

## Summary
✅ **2 unified endpoints** instead of 8+ scattered ones  
✅ **Unified OTP storage** in `user_otps` table  
✅ **Consistent 10-min expiry** across all types  
✅ **Optional push notifications** with every email  
✅ **Backward compatible** during migration period  
✅ **Type-based routing** for clean separation of concerns  
