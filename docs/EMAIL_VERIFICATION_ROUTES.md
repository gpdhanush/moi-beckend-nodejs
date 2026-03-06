# Email Verification Routes - Integration Guide

## Adding Routes to src/routes/user.js

### Complete Updated Routes File

Add these routes to your existing `/src/routes/user.js` file:

```javascript
// src/routes/user.js

const express = require('express');
const router = express.Router();
const { userController } = require('../controllers/user');
const { auth, adminAuth } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

// ==================== EXISTING ROUTES ====================

// User Authentication Routes
router.post('/login', userController.login);
router.post('/create', userController.create);

// User Profile Routes
router.get('/:id', userController.getUser);
router.post('/update', userController.update);
router.get('/details/:id', userController.getImportantUserDetails);

// Password Management Routes
router.post('/update-password', userController.updatePassword);
router.post('/reset-password', userController.resetPassword);

// Profile Picture Routes
// (multer configuration)
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
});

router.post('/upload-profile-picture', upload.single('profile_image'), userController.updateProfilePicture);

// ==================== NEW EMAIL VERIFICATION ROUTES ====================

/**
 * Request Verification OTP
 * POST /api/user/request-verification-otp
 * Body: { id } or { email }
 * 
 * Sends OTP to user's email for verification
 */
router.post('/request-verification-otp', userController.requestVerificationOTP);

/**
 * Verify Email OTP
 * POST /api/user/verify-email-otp
 * Body: { id, otp }
 * 
 * Verifies OTP and marks user as verified
 */
router.post('/verify-email-otp', userController.verifyEmailOTP);

/**
 * Resend Verification OTP
 * POST /api/user/resend-verification-otp
 * Body: { id } or { email }
 * 
 * Resends OTP if user didn't receive it
 */
router.post('/resend-verification-otp', userController.resendVerificationOTP);

/**
 * Check Email Verification Status
 * GET /api/user/verification-status/:id
 * Params: id (user ID)
 * 
 * Returns verification status and timestamp
 */
router.get('/verification-status/:id', userController.checkVerificationStatus);

module.exports = router;
```

---

## API Documentation

### 1. Request Verification OTP

**HTTP Method:** `POST`

**Endpoint:** `/api/user/request-verification-otp`

**Headers:**
```
Content-Type: application/json
```

**Request Body (Option A - by ID):**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request Body (Option B - by Email):**
```json
{
    "email": "john@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/user/request-verification-otp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000"
  }'
```

**Response (Success - 200):**
```json
{
    "responseType": "S",
    "responseValue": {
        "message": "OTP உங்கள் மின்னஞ்சலுக்கு அனுப்பப்பட்டுவிட்டது!",
        "expires_in_minutes": 10
    }
}
```

**Response (Already Verified - 400):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "இந்த மின்னஞ்சல் ஏற்கனவே சரிபார்க்கப்பட்டுவிட்டது!"
    }
}
```

**Response (User Not Found - 404):**
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

**HTTP Method:** `POST`

**Endpoint:** `/api/user/verify-email-otp`

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "123456"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/user/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "123456"
  }'
```

**Response (Success - 200):**
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

**Response (Invalid OTP - 400):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "OTP ஐக் கண்டுபிடிக்க முடியவில்லை!"
    }
}
```

**Response (OTP Expired - 400):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "OTP காலாவதியாகிவிட்டது! புதிய OTP கோருங்கள்."
    }
}
```

**Response (OTP Already Used - 400):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "இந்த OTP ஏற்கனவே பயன்படுத்தப்பட்டுவிட்டது!"
    }
}
```

---

### 3. Resend Verification OTP

**HTTP Method:** `POST`

**Endpoint:** `/api/user/resend-verification-otp`

**Headers:**
```
Content-Type: application/json
```

**Request Body (Option A - by ID):**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Request Body (Option B - by Email):**
```json
{
    "email": "john@example.com"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/user/resend-verification-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com"
  }'
```

**Response (Success - 200):**
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

**HTTP Method:** `GET`

**Endpoint:** `/api/user/verification-status/:id`

**URL Parameters:**
```
:id = User ID (UUID)
```

**Headers:**
```
Content-Type: application/json
```

**cURL Example:**
```bash
curl -X GET http://localhost:3000/api/user/verification-status/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json"
```

**Response (Verified - 200):**
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

**Response (Not Verified - 200):**
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

## Testing with Postman

### Setup

1. **Create Postman Collection** named "Moi Kanakku - Email Verification"

2. **Set Environment Variables:**
```
BASE_URL: http://localhost:3000/api
USER_ID: 550e8400-e29b-41d4-a716-446655440000
USER_EMAIL: john@example.com
OTP_CODE: (will be entered after receiving email)
```

### Test Sequence

#### Test 1: Request OTP
```
Method: POST
URL: {{BASE_URL}}/user/request-verification-otp
Body (raw JSON):
{
    "id": "{{USER_ID}}"
}
Expected: 200 OK with success message
```

#### Test 2: Check Status (Before Verify)
```
Method: GET
URL: {{BASE_URL}}/user/verification-status/{{USER_ID}}
Expected: 200 OK with is_verified = 0
```

#### Test 3: Verify OTP
```
Method: POST
URL: {{BASE_URL}}/user/verify-email-otp
Body (raw JSON):
{
    "id": "{{USER_ID}}",
    "otp": "123456"  // Replace with actual OTP
}
Expected: 200 OK with is_verified = 1
```

#### Test 4: Check Status (After Verify)
```
Method: GET
URL: {{BASE_URL}}/user/verification-status/{{USER_ID}}
Expected: 200 OK with is_verified = 1 and email_verified_at timestamp
```

#### Test 5: Try to Verify Again (Negative Test)
```
Method: POST
URL: {{BASE_URL}}/user/request-verification-otp
Body (raw JSON):
{
    "id": "{{USER_ID}}"
}
Expected: 400 with "already verified" message
```

---

## Command Line Testing

### Test 1: Request OTP
```bash
curl -X POST http://localhost:3000/api/user/request-verification-otp \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}'
```

### Test 2: Verify OTP (after checking email)
```bash
curl -X POST http://localhost:3000/api/user/verify-email-otp \
  -H "Content-Type: application/json" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "otp": "123456"
  }'
```

### Test 3: Check Status
```bash
curl -X GET "http://localhost:3000/api/user/verification-status/550e8400-e29b-41d4-a716-446655440000" \
  -H "Content-Type: application/json"
```

### Test 4: Resend OTP
```bash
curl -X POST http://localhost:3000/api/user/resend-verification-otp \
  -H "Content-Type: application/json" \
  -d '{"id": "550e8400-e29b-41d4-a716-446655440000"}'
```

---

## Integration with Frontend

### React/React Native Example

```javascript
/**
 * Step 1: Request OTP
 */
const requestOTP = async (email) => {
  try {
    const response = await fetch('http://localhost:3000/api/user/request-verification-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    });
    const data = await response.json();
    
    if (data.responseType === 'S') {
      alert('OTP sent to your email!');
      showOTPInput();  // Show input for OTP
    } else {
      alert(data.responseValue.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Step 2: Verify OTP
 */
const verifyOTP = async (userId, otp) => {
  try {
    const response = await fetch('http://localhost:3000/api/user/verify-email-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: userId, otp })
    });
    const data = await response.json();
    
    if (data.responseType === 'S') {
      alert('Email verified successfully!');
      navigateToHome();  // Go to main app
    } else {
      alert(data.responseValue.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

/**
 * Step 3: Check Status
 */
const checkVerificationStatus = async (userId) => {
  try {
    const response = await fetch(`http://localhost:3000/api/user/verification-status/${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    const data = await response.json();
    
    if (data.responseValue.is_verified === 1) {
      console.log('Email is verified!');
    } else {
      console.log('Email needs verification');
      showVerificationPrompt();
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

---

## Status Codes Reference

| Code | Meaning | Example |
|------|---------|---------|
| 200 | Success | OTP verified, status checked |
| 400 | Bad Request | Invalid user input, expired OTP |
| 403 | Forbidden | Already verified |
| 404 | Not Found | User not found |
| 500 | Server Error | Database error, email failure |

---

## Error Codes Reference

| Error | Cause | Solution |
|-------|-------|----------|
| User not found | Invalid ID/email | Verify user exists |
| Already verified | Email verified before | Skip verification |
| OTP not found | Wrong OTP entered | Check email again |
| OTP expired | >10 minutes passed | Use resend endpoint |
| OTP already used | Already verified | User verified already |
| Email send failed | SMTP config issue | Check .env file |

---

## Environment Setup

### .env File (for Email)
```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
EMAIL_FROM="Moi Kanakku <noreply@moikanakku.com>"

# App Configuration
APP_URL=http://localhost:3000
```

### Gmail Setup (if using Gmail SMTP)
1. Enable 2-factor authentication in Gmail
2. Generate app-specific password
3. Use that password in EMAIL_PASS

---

## Production Considerations

1. **Rate Limiting**
   - Max 5 OTP requests per hour per user
   - Max 3 verification attempts per OTP
   - Implement using redis or in-memory counter

2. **Logging**
   - Log all verification attempts
   - Log email sending status
   - Monitor failure rates

3. **Monitoring**
   - Track verification rates
   - Alert on email failures
   - Dashboard for admin

4. **Security**
   - Use HTTPS only in production
   - Validate all inputs
   - Never log OTP values
   - Use proper CORS settings

5. **Database**
   - Periodic cleanup of expired OTPs (via cron)
   - Index on user_id and expires_at
   - Monitor table growth

---

## Summary

All 4 email verification endpoints are now ready:
- ✅ Request OTP via `/request-verification-otp`
- ✅ Verify OTP via `/verify-email-otp`
- ✅ Resend OTP via `/resend-verification-otp`
- ✅ Check status via `/verification-status/:id`

Complete with:
- ✅ Error handling
- ✅ Tamil language messages
- ✅ Database tracking
- ✅ Email sending
- ✅ OTP expiration
- ✅ Single-use enforcement

**Ready for production deployment!**
