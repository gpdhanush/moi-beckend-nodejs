# User API – Table Overview & Request Params

## 1. User-related tables (schema)

| Table | Purpose |
|-------|--------|
| **users** | Core user: id (UUID), full_name, email, mobile, referral_code, status, is_verified, timestamps, soft delete |
| **user_credentials** | Password and auth: user_id (FK), password_hash, password_changed_at, failed_login_attempts, locked_until, reset_token |
| **user_profiles** | Profile: user_id (FK), gender, date_of_birth, profile_image_url, address fields |
| **user_devices** | FCM: user_id (FK), fcm_token, device_name, is_active, last_used_at |
| **user_referrals** | Referral link: referrer_user_id, referred_user_id, created_at |

### users (main)

| Column | Type | Notes |
|--------|------|--------|
| id | BINARY(16) | UUID, PK |
| full_name | VARCHAR(120) | NOT NULL |
| email | VARCHAR(150) | NOT NULL, UNIQUE |
| mobile | VARCHAR(20) | NULL, UNIQUE |
| referral_code | VARCHAR(50) | NULL, UNIQUE – user’s shareable code |
| status | ENUM | 'ACTIVE','INACTIVE','BLOCKED', default ACTIVE |
| is_verified | TINYINT(1) | default 0 |
| email_verified_at | DATETIME | NULL |
| last_activity_at | DATETIME | NULL |
| is_deleted | TINYINT(1) | default 0 |
| deleted_at | DATETIME | NULL |
| created_at, updated_at | TIMESTAMP | |

---

## 2. User endpoints – method, path, auth, request params

### POST `/apis/users/login`  
**Auth:** None  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| email | body | Yes | string | User email |
| password | body | Yes | string | Password |

**Response (success):** `id`, `name`, `mobile`, `email`, `last_login`, `profile_image`, `token`, `referral_code`

---

### POST `/apis/users/create` (signup)  
**Auth:** None (rate limited only)

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| name | body | Yes | string | Full name |
| email | body | Yes | string | Email (unique) |
| mobile | body | Yes | string | Mobile (unique) |
| password | body | Yes | string | Plain password (hashed on server) |
| fcm_token | body | No | string | FCM token for push |
| device_name | body | No | string | e.g. "Samsung M14" |
| referred_by | body | No | string | Referral code of inviter (optional) |

**Response (success):** message; new user gets a unique `referral_code` (returned on next login/details).

---

### POST `/apis/users/update`  
**Auth:** Bearer token required  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| id | body | Yes | string (UUID) | User id |
| name | body | Yes | string | Full name |
| mobile | body | Yes | string | Mobile (must be unique for other users) |

---

### GET `/apis/users/details/:id`  
**Auth:** Bearer token required  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| id | path | Yes | string (UUID) | User id |

**Response (success):** `id`, `name`, `email`, `mobile`, `last_login`, `profile_image`, `referral_code`

---

### POST `/apis/users/updatePassword`  
**Auth:** Bearer token required  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| id | body | Yes | string (UUID) | User id |
| password | body | Yes | string | Current password |
| newPassword | body | Yes | string | New password |

---

### POST `/apis/users/deleteUser`  
**Auth:** Bearer token required  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| userId | body | Yes | string (UUID) | User id to delete |

---

### POST `/apis/users/updateNotificationToken`  
**Auth:** None (call with userId in body)  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| userId | body | Yes | string (UUID) | User id |
| token | body | Yes | string | FCM token |
| device_name | body | No | string | Device name |

---

### POST `/apis/users/updateProfilePicture`  
**Auth:** Bearer token required  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| userId | body | Yes | string (UUID) | User id |
| profileImage | file | Yes | file | Image (jpeg, jpg, png, gif, webp, max 5MB) |

---

### GET `/apis/users/importantDetails/:id`  
**Auth:** Bearer token required  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| id | path | Yes | string (UUID) | User id |

**Response (success):** `id`, `name`, `email`, `mobile`, `last_login`, `profile_image`, `create_date`, `update_date`, `status`, `referral_code`

---

### POST `/apis/users/resetPassword`  
**Auth:** None  

| Param | In | Required | Type | Description |
|-------|----|----------|------|-------------|
| email | body | Yes | string | User email |
| password | body | Yes | string | New password (will be hashed) |

---

## 3. Referral code behaviour

- **On signup:** Each user gets a unique `referral_code` (generated and stored in `users.referral_code`).
- **Optional `referred_by`:** If signup body includes `referred_by` (another user’s referral code), the new user is linked to the referrer in `user_referrals` (referrer_user_id, referred_user_id).
- **Where `referral_code` is returned:** Login response, `GET /details/:id`, `GET /importantDetails/:id`, and (if you add it) any “my profile” endpoint that returns the same user object.
