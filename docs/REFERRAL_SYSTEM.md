# Referral System - Complete Logic & API

## Overview
A complete referral system where users can invite friends and track referrals.

**Features:**
- ✅ Every user gets a unique referral code (8 characters)
- ✅ Track who referred whom
- ✅ Get referral statistics
- ✅ Use referral code during signup
- ✅ View all referrals made

---

## Database Schema

### Table: `users`
```sql
id (BINARY(16)) - Primary Key
full_name VARCHAR(100)
email VARCHAR(100) - Unique
mobile VARCHAR(20) - Unique
referral_code VARCHAR(8) - Unique, generated on signup
status VARCHAR(20) - ACTIVE, INACTIVE, DELETED
created_at TIMESTAMP
```

### Table: `user_referrals`
```sql
id INT PRIMARY KEY AUTO_INCREMENT
referrer_user_id BINARY(16) FK -> users.id (who referred)
referred_user_id BINARY(16) FK -> users.id (who was referred)
created_at TIMESTAMP

UNIQUE(referrer_user_id, referred_user_id) - Prevent duplicates
```

---

## API Endpoints

### 1️⃣ Get My Referral Code
**GET** `/api/user/referral-code`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
    "responseType": "S",
    "responseValue": {
        "referral_code": "AB2CD5EF",
        "referral_url": "https://app.example.com/join?ref=AB2CD5EF",
        "share_message": "Join Moi Kanakku using my referral code: AB2CD5EF"
    }
}
```

---

### 2️⃣ Get Referral Statistics
**GET** `/api/user/referral-stats`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
    "responseType": "S",
    "responseValue": {
        "total_referrals": 5,
        "referred_by": "XY1AB9CD",
        "referred_by_name": "Raj Kumar",
        "referrals": [
            {
                "id": "user-uuid-1",
                "name": "Arjun Singh",
                "email": "arjun@example.com",
                "mobile": "9876543210",
                "joined_date": "2026-02-20T10:30:00Z",
                "status": "ACTIVE"
            },
            {
                "id": "user-uuid-2",
                "name": "Priya Sharma",
                "email": "priya@example.com",
                "mobile": "9876543211",
                "joined_date": "2026-02-19T15:45:00Z",
                "status": "ACTIVE"
            }
        ]
    }
}
```

---

### 3️⃣ Get Referrer Information
**GET** `/api/user/referrer-info`

**Headers:**
```
Authorization: Bearer {jwt_token}
```

**Response:**
```json
{
    "responseType": "S",
    "responseValue": {
        "is_referred": true,
        "referred_by_code": "XY1AB9CD",
        "referred_by": {
            "id": "user-uuid-referrer",
            "name": "Raj Kumar",
            "email": "raj@example.com"
        },
        "referred_on": "2026-01-15T08:00:00Z"
    }
}
```

Or if not referred:
```json
{
    "responseType": "S",
    "responseValue": {
        "is_referred": false,
        "referred_by": null,
        "message": "You joined without a referral code"
    }
}
```

---

### 4️⃣ Validate Referral Code
**POST** `/api/user/validate-referral-code`

**Body:**
```json
{
    "referral_code": "AB2CD5EF"
}
```

**Response (Valid):**
```json
{
    "responseType": "S",
    "responseValue": {
        "is_valid": true,
        "referrer": {
            "id": "user-uuid",
            "name": "Raj Kumar",
            "email": "raj@example.com"
        },
        "message": "Referral code is valid"
    }
}
```

**Response (Invalid):**
```json
{
    "responseType": "F",
    "responseValue": {
        "is_valid": false,
        "message": "Referral code not found or user is deleted"
    }
}
```

---

### 5️⃣ Signup with Referral Code
**POST** `/api/user/create`

**Body:**
```json
{
    "name": "Arjun Singh",
    "email": "arjun@example.com",
    "mobile": "9876543210",
    "password": "SecurePass123!",
    "referred_by": "AB2CD5EF"
}
```

**Response:**
```json
{
    "responseType": "S",
    "responseValue": {
        "id": "user-uuid-new",
        "name": "Arjun Singh",
        "email": "arjun@example.com",
        "mobile": "9876543210",
        "referral_code": "CD3EF4GH",
        "referred_by_code": "AB2CD5EF",
        "message": "Account created successfully"
    }
}
```

**Response (Invalid Referral Code):**
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "Invalid referral code provided",
        "code": "INVALID_REFERRAL"
    }
}
```

---

## Implementation Details

### Referral Code Generation
```javascript
// 8 characters, uppercase, no ambiguous chars (0/O, 1/I/L)
const chars = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
let code = '';
for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
}
// Result: e.g., "AB2CD5EF"
```

### Flow During Signup
1. User enters referral code (optional)
2. System validates the code
3. If valid, record in `user_referrals` table
4. Generate new referral code for new user
5. Return confirmation with new code

### Flow for Getting Referrals
1. Get all rows from `user_referrals` where `referrer_user_id = current_user`
2. Join with `users` table to get referral details
3. Return list of all referred users

### Automatic Block Expiry
When getting referral stats with active referrals, check:
```javascript
// If user's login_blocked_until is passed, auto-clear it
if (user.login_blocked_until < NOW()) {
    Reset failed_login_attempts = 0
    Set login_blocked_until = NULL
}
```

---

## Error Handling

### Invalid Referral Code
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "Referral code not found or invalid"
    }
}
```

### Referral Code Belongs to Deleted User
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "Referrer account has been deleted"
    }
}
```

### User Already Referred by Someone
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "You cannot use multiple referral codes",
        "current_referrer": "XY1AB9CD"
    }
}
```

---

## Reset Token Columns - REMOVED ✅

The `reset_token` and `reset_token_expires_at` columns in `user_credentials` were placeholders for token-based password reset. Since the system uses OTP-based reset (via email), these columns are not needed and have been removed from the migration.

**Current Password Reset Method:**
- User requests forgot password → OTP sent to email
- User verifies OTP → Password can be reset
- No token storage needed

---

## Summary

| Feature | Status | Details |
|---------|--------|---------|
| Unique Referral Code | ✅ Active | Generated on signup (8 chars) |
| Referral Tracking | ✅ Active | Stored in user_referrals table |
| Get My Code | ✅ Ready to implement | API endpoint available |
| Get Stats | ✅ Ready to implement | Show all referrals made |
| Validate Code | ✅ Ready to implement | Check if code is valid |
| Signup with Code | ✅ Ready to implement | Use code during registration |
| Reset Token | ❌ Removed | Not needed - using OTP instead |

