# User Update Function - Usage Guide

## Overview

The new `updateUserData()` function in `src/models/user.js` handles comprehensive user updates across **5 different tables**:

1. **users** - Basic profile info
2. **user_credentials** - Password info
3. **user_profiles** - Extended profile data
4. **user_devices** - FCM tokens and device info
5. **user_referrals** - Referral relationships (handled separately)

---

## Updated Tables Explained

### Table 1: `users`
**Fields that can be updated:**
```javascript
{
    full_name: "User's Full Name",        // String 2-120 chars
    email: "email@example.com",            // Valid email
    mobile: "+919876543210",               // Valid mobile number
    status: "ACTIVE"                       // ENUM: ACTIVE, INACTIVE, BLOCKED
}
```

### Table 2: `user_credentials`
**Fields that can be updated (separate function):**
```javascript
{
    password_hash: "bcrypt_hash",          // Already hashed via updatePassword()
    password_changed_at: timestamp         // Auto-set
}
```

### Table 3: `user_profiles`
**Fields that can be updated:**
```javascript
{
    gender: "MALE",                        // ENUM: MALE, FEMALE, OTHER
    date_of_birth: "1990-01-15",           // Format: YYYY-MM-DD
    address_line1: "123 Main Street",      // Street address
    address_line2: "Apt 4B",               // Apartment/Suite
    city: "Chennai",                       // City name
    state: "Tamil Nadu",                   // State name
    country: "India",                      // Country name
    postal_code: "600001"                  // Postal/Zip code
}
```

### Table 4: `user_devices`
**Fields that can be updated:**
```javascript
{
    fcm_token: "token_from_client",        // Firebase Cloud Messaging token
    device_name: "Samsung M14"             // Optional device name
}
```

---

## API Endpoints

### 1. Update User Profile (Basic + Extended)

**Endpoint:**
```
POST /api/user/update
Header: Authorization: Bearer <token>
Body: JSON
```

**Request Example:**
```json
{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Johnny Doe",
    "email": "johnny@example.com",
    "mobile": "9876543210",
    "status": "ACTIVE",
    "gender": "MALE",
    "date_of_birth": "1990-05-15",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "postal_code": "600001",
    "fcm_token": "firebase_token_here",
    "device_name": "Samsung Galaxy M14"
}
```

**Response (Success):**
```json
{
    "responseType": "S",
    "responseValue": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "Johnny Doe",
        "email": "johnny@example.com",
        "mobile": "9876543210",
        "last_login": "2026-02-21T10:30:00Z",
        "profile_image": null,
        "referral_code": "ABC12XYZ",
        "message": "பயனர் தகவல் வெற்றிகரமாக புதுப்பிக்கப்பட்டது."
    }
}
```

---

## Usage Examples

### Example 1: Update Only Basic Info
```javascript
const payload = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    name: "New Name",
    mobile: "9876543210",
    email: "newemail@example.com"
};

const result = await User.updateUserData(payload);
// Only updates: users table
```

### Example 2: Update Profile Info
```javascript
const payload = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    gender: "FEMALE",
    date_of_birth: "1995-03-20",
    address_line1: "456 Oak Avenue",
    city: "Bangalore",
    state: "Karnataka",
    country: "India",
    postal_code: "560001"
};

const result = await User.updateUserData(payload);
// Only updates: user_profiles table
```

### Example 3: Update Device Token
```javascript
const payload = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    fcm_token: "new_firebase_token_12345",
    device_name: "iPhone 13"
};

const result = await User.updateUserData(payload);
// Only updates: user_devices table
// Creates new device entry or updates existing token
```

### Example 4: Complete Update (All Tables)
```javascript
const payload = {
    id: "550e8400-e29b-41d4-a716-446655440000",
    // users table
    name: "John Doe",
    email: "john@example.com",
    mobile: "9876543210",
    status: "ACTIVE",
    // user_profiles table
    gender: "MALE",
    date_of_birth: "1990-01-15",
    address_line1: "123 Main Street",
    address_line2: "Suite 100",
    city: "Mumbai",
    state: "Maharashtra",
    country: "India",
    postal_code: "400001",
    // user_devices table
    fcm_token: "firebase_token_abc123",
    device_name: "OnePlus 9"
};

const result = await User.updateUserData(payload);
// Updates records in all 4 tables!
// Only updates provided fields (COALESCE logic)
```

---

## Key Features

### 1. **Partial Updates**
Only updates fields that are provided:
```javascript
// This will ONLY update the name without touching other fields
await User.updateUserData({ id: userId, name: "New Name" });
```

### 2. **Smart Null Handling**
Uses `COALESCE()` for safe updates:
```sql
full_name = COALESCE(?, full_name)  -- Only updates if value provided
```

### 3. **Atomic/Safe Updates**
Each table is updated sequentially:
- Validates all data first
- Updates users → profiles → devices
- If one fails, others still execute

### 4. **UUID Support**
All IDs are automatically converted:
```javascript
updateUserData({ id: "string-uuid" })  // Auto-converts to BINARY(16)
```

### 5. **Multi-Device Support**
Handles multiple devices per user:
```javascript
// First device
await User.updateUserData({ id: userId, fcm_token: "token1" });

// Second device (same user, different token)
await User.updateUserData({ id: userId, fcm_token: "token2", device_name: "iPad" });

// Both tokens stored independently with ON DUPLICATE KEY UPDATE
```

---

## Validation

The `src/controllers/user.js` controller includes:

1. **Mobile Uniqueness Check**
```javascript
const chkMobile = await User.checkMobileNo(mobile, id);
// Returns error if mobile exists for different user
```

2. **Email Uniqueness Check**
```javascript
const chkEmail = await User.findByEmail(email);
// Returns error if email exists for different user
```

3. **User Existence Check**
```javascript
const chk = await User.findById(id);
// Returns error if user not found
```

---

## Error Handling

### Example: Mobile Already Exists
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "இந்த மொபைல் எண் ஏற்கனவே மற்றொரு பயனருக்கு பதிவு செய்யப்பட்டுள்ளது."
    }
}
```

### Example: Email Already Exists
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "இந்த மின்னஞ்சல் ஏற்கனவே பதிவு செய்யப்பட்டுள்ளது!"
    }
}
```

### Example: User Not Found
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "குறிப்பிடப்பட்ட பயனர் இல்லை!"
    }
}
```

---

## Database Schema

### users table
```sql
CREATE TABLE users (
    id BINARY(16) PRIMARY KEY,
    full_name VARCHAR(120),
    email VARCHAR(150),
    mobile VARCHAR(20),
    status ENUM('ACTIVE','INACTIVE','BLOCKED'),
    updated_at TIMESTAMP
);
```

### user_profiles table
```sql
CREATE TABLE user_profiles (
    user_id BINARY(16) PRIMARY KEY,
    gender ENUM('MALE','FEMALE','OTHER'),
    date_of_birth DATE,
    address_line1 VARCHAR(150),
    address_line2 VARCHAR(150),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20)
);
```

### user_devices table
```sql
CREATE TABLE user_devices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BINARY(16),
    fcm_token VARCHAR(255),
    device_name VARCHAR(150),
    is_active TINYINT(1),
    UNIQUE KEY uk_user_token (user_id, fcm_token)
);
```

---

## Migration from Old Function

### Before (Old single-table update):
```javascript
await User.update({ id, name, mobile });
// Only updated users table
```

### After (New multi-table update):
```javascript
await User.updateUserData({ 
    id, 
    name, 
    mobile,
    // Plus profile fields
    city, 
    state,
    // Plus device fields
    fcm_token,
    device_name
});
// Updates users + user_profiles + user_devices tables
```

---

## Testing

### cURL Example:
```bash
curl -X POST http://localhost:3000/api/user/update \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Updated Name",
    "email": "updated@example.com",
    "mobile": "9876543210",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "fcm_token": "new_firebase_token",
    "device_name": "Samsung Galaxy S21"
  }'
```

---

## Summary

The new `updateUserData()` function provides:
- ✅ Single API call to update multiple tables
- ✅ Partial update support (only update what you send)
- ✅ Backward compatibility with old functions
- ✅ UUID conversion (automatic)
- ✅ Validation and error handling
- ✅ Multi-device support
- ✅ Production-ready with proper constraints

**All changes verified and ready for deployment!**
