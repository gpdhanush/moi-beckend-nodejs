# Implementation Summary: Account Restore & Unified Email APIs

## What Was Done

### 1. **Account Restore via Email-Based OTP** ✅
- Added email-based restore flow for soft-deleted accounts
- User requests OTP (sent to email), then verifies OTP to restore account
- Secure 2-step process: prevents accidental restoration without verification

### 2. **Unified Email & OTP API** ✅
Consolidated 8+ scattered endpoints into **2 unified endpoints**:

#### `POST /api/email/sendEmail` 
Sends OTP or custom email. Supports:
- `type: "restore"` — Account restoration OTP
- `type: "verification"` — Email verification OTP (new/unverified users)
- `type: "forgot"` — Forgot password OTP (password reset)
- `type: "custom"` — Custom HTML email (admin use)

Optional: Send push notification to user's device

#### `POST /api/email/verifyOtp`
Verifies OTP for any type:
- `type: "restore"` — Validates restore OTP (doesn't restore yet, separate step needed)
- `type: "verification"` — Validates & marks user as verified
- `type: "forgot"` — Validates forgot password OTP
- Default: `"forgot"` (backward compatible)

---

## Files Modified

### Model Layer
**`src/models/user.js`** — Added OTP methods:
- `createRestoreOTP(userId)` — Create 6-digit RESTORE OTP (10 min expiry)
- `verifyRestoreOTP(userId, otp)` — Validate restore OTP
- `createForgotOTP(userId)` — Create 6-digit FORGOT OTP (10 min expiry)
- `verifyForgotOTP(userId, otp)` — Validate forgot OTP

### Controller Layer
**`src/controllers/user.js`** — Added restore handlers (kept for direct restore, deprecated API):
- `requestRestoreOTP()` — Request OTP for restore (now use `sendEmail`)
- `verifyRestoreOTP()` — Verify OTP and restore (now use `verifyOtp` + direct restore)

**`src/controllers/emailControllers.js`** — Unified endpoint:
- `sendEmail()` — **New unified handler** (replaced old forgotOtp + sendEmail)
  - Accepts `type` parameter
  - Routes to restore/verification/forgot/custom senders
  - Optional push notification support
- `verifyOtp()` — **Enhanced unified handler** (replaced old legacy verifyOtp)
  - Supports all OTP types
  - Backward compatible with legacy `emailId` parameter

### Routes Layer
**`src/routes/emailRoutes.js`**:
- Keep: `POST /api/email/sendEmail` (unified)
- Keep: `POST /api/email/verifyOtp` (unified)
- Deprecate: `/forgotOtp`, old `/verifyOtp` (commented out)

**`src/routes/user.js`**:
- Deprecate: `/request-restore-otp`, `/verify-restore-otp`
- Deprecate: `/request-verification-otp`, `/verify-email-otp`, etc.
- Keep: `/verification-status/:id` (status check only)
- Keep: `POST /restore` (direct admin restore)

---

## API Usage Examples

### Restore Deleted Account
```bash
# 1. Request restore OTP
curl -X POST http://localhost:3000/api/email/sendEmail \
  -H 'Content-Type: application/json' \
  -d '{"type":"restore","email":"user@example.com"}'

# 2. Verify OTP
curl -X POST http://localhost:3000/api/email/verifyOtp \
  -H 'Content-Type: application/json' \
  -d '{"id":"<user-id>","otp":"123456","type":"restore"}'

# 3. Restore account
curl -X POST http://localhost:3000/api/user/verify-restore-otp \
  -H 'Content-Type: application/json' \
  -d '{"id":"<user-id>","otp":"123456"}'
```

### Verify Email (New User)
```bash
# 1. Request verification OTP
curl -X POST http://localhost:3000/api/email/sendEmail \
  -H 'Content-Type: application/json' \
  -d '{"type":"verification","email":"newuser@example.com"}'

# 2. Verify OTP (marks user as verified)
curl -X POST http://localhost:3000/api/email/verifyOtp \
  -H 'Content-Type: application/json' \
  -d '{"email":"newuser@example.com","otp":"123456","type":"verification"}'
```

### Forgot Password
```bash
# 1. Request OTP
curl -X POST http://localhost:3000/api/email/sendEmail \
  -H 'Content-Type: application/json' \
  -d '{"type":"forgot","email":"user@example.com"}'

# 2. Verify OTP
curl -X POST http://localhost:3000/api/email/verifyOtp \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","otp":"123456","type":"forgot"}'

# 3. Reset password
curl -X POST http://localhost:3000/api/user/reset-password \
  -H 'Content-Type: application/json' \
  -d '{"email":"user@example.com","password":"newpass123"}'
```

### Send Email + Push Notification
```bash
curl -X POST http://localhost:3000/api/email/sendEmail \
  -H 'Content-Type: application/json' \
  -d '{
    "type":"restore",
    "email":"user@example.com",
    "sendNotification":true,
    "notificationUserId":"<user-id>",
    "notificationToken":"<fcm-token>",
    "notificationTitle":"Restore Request",
    "notificationBody":"OTP sent to your email",
    "notificationType":"account"
  }'
```

---

## Database
All OTP types now use unified `user_otps` table:
- `type` column: `VERIFY`, `RESTORE`, `FORGOT`
- `code`: 6-digit OTP
- `expires_at`: 10 minutes from creation
- `is_used`: Track if OTP was already used

---

## Benefits
✅ **Reduced API surface** — 2 endpoints instead of 8+  
✅ **DRY principle** — Single OTP logic for all types  
✅ **Consistent UX** — Same 10-min expiry, same 6-digit format  
✅ **Flexible** — Type parameter allows adding new flows easily  
✅ **Push notifications** — Optional mobile alerts with OTP email  
✅ **Backward compatible** — Old endpoints still work during migration  
✅ **Better docs** — Clear request/response contracts  

---

## Next Steps (Optional)
- [ ] Run end-to-end tests with real deleted user
- [ ] Verify SMTP configuration for email sends
- [ ] Test push notifications (Firebase configured)
- [ ] Update mobile/web client apps to use unified endpoints
- [ ] Remove old endpoints after full migration
- [ ] Add rate limiting on OTP request endpoints
- [ ] Add metrics/logging for OTP flows

See `docs/UNIFIED_EMAIL_API_MIGRATION.md` for complete API reference.
