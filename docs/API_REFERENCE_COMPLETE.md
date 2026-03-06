# MOI Backend API Complete Reference
**Database:** moi_new_1 | **Framework:** Express.js + MariaDB | **Auth:** JWT Bearer Tokens

---

## 📋 Quick Start

**Base URL:** `http://localhost:5000/apis` (Development) | Production URL TBD

**Headers Required:**
```json
{
  "Content-Type": "application/json",
  "Authorization": "Bearer <JWT_TOKEN>"  // Exclude for login endpoint
}
```

**Standard Response Format:**
```json
{
  "responseType": "S",  // "S" = Success, "F" = Failure
  "responseValue": {
    // Endpoint-specific data
  }
}
```

**Standard Error Response:**
```json
{
  "responseType": "F",
  "responseValue": {
    "error": "Error message",
    "code": "ERROR_CODE",
    "timestamp": "2026-02-28T10:30:00Z"
  }
}
```

---

## 🔐 Authentication APIs

### 1. **Admin Login**
- **Endpoint:** `POST /admin/login`
- **Auth Required:** ❌ No
- **Request Body:**
  ```json
  {
    "email": "agprakash406@gmail.com",
    "password": "password123"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "admin": {
        "id": "861fec38-195a-482e-82c4-dbd86660f195",
        "email": "agprakash406@gmail.com",
        "first_name": "A G",
        "last_name": "Prakash",
        "status": "ACTIVE",
        "role": "super_admin",
        "password_changed_at": "2025-12-15T08:22:00.000Z",
        "created_at": "2025-11-28T10:30:00.000Z"
      },
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "expiresIn": "24h"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` - Invalid email/password
  - `423 Locked` - Account locked (5 failed attempts, 15-minute cooldown)
  - `400 Bad Request` - Missing email or password

---

## 👥 Admin Management APIs

### 2. **Create Admin** (Super Admin Only)
- **Endpoint:** `POST /admin/create`
- **Auth Required:** ✅ Yes (isAdmin + super_admin role)
- **Request Body:**
  ```json
  {
    "email": "newadmin@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "password": "SecurePassword123!",
    "status": "ACTIVE"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "admin": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "email": "newadmin@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "status": "ACTIVE",
        "created_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```
- **Error Responses:**
  - `409 Conflict` - Email already exists
  - `400 Bad Request` - Invalid input data

### 3. **Get Admin Details**
- **Endpoint:** `GET /admin/details`
- **Auth Required:** ✅ Yes
- **Query Params:** None
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "admin": {
        "id": "861fec38-195a-482e-82c4-dbd86660f195",
        "email": "agprakash406@gmail.com",
        "first_name": "A G",
        "last_name": "Prakash",
        "status": "ACTIVE",
        "role": "super_admin",
        "profile_image_url": "https://cdn.example.com/admin-861fec38.jpg",
        "created_at": "2025-11-28T10:30:00.000Z",
        "updated_at": "2026-02-20T15:45:00.000Z"
      }
    }
  }
  ```

### 4. **Update Admin Profile**
- **Endpoint:** `PUT /admin/update-profile`
- **Auth Required:** ✅ Yes
- **Request Body:**
  ```json
  {
    "first_name": "A G",
    "last_name": "Prakash",
    "phone": "+91-9876543210",
    "profile_image": "<binary_file>"  // multipart/form-data
  }
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "admin": {
        "id": "861fec38-195a-482e-82c4-dbd86660f195",
        "first_name": "A G",
        "last_name": "Prakash",
        "phone": "+91-9876543210",
        "profile_image_url": "https://storage.example.com/uploads/admin-861fec38.jpg",
        "updated_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```

### 5. **Update Admin Password**
- **Endpoint:** `POST /admin/update-password`
- **Auth Required:** ✅ Yes
- **Request Body:**
  ```json
  {
    "currentPassword": "oldPassword123",
    "newPassword": "NewPassword456!"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "message": "Password updated successfully",
      "password_changed_at": "2026-02-28T10:30:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `401 Unauthorized` - Current password incorrect
  - `400 Bad Request` - Password policy violation

### 6. **Get All Admins** (Paginated)
- **Endpoint:** `GET /admin/list`
- **Auth Required:** ✅ Yes (super_admin only)
- **Query Params:**
  ```
  ?limit=10&offset=0&status=ACTIVE
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "admins": [
        {
          "id": "861fec38-195a-482e-82c4-dbd86660f195",
          "email": "agprakash406@gmail.com",
          "first_name": "A G",
          "last_name": "Prakash",
          "status": "ACTIVE",
          "role": "super_admin",
          "created_at": "2025-11-28T10:30:00.000Z"
        }
      ],
      "total": 5,
      "limit": 10,
      "offset": 0
    }
  }
  ```

### 7. **Update Admin Status**
- **Endpoint:** `PUT /admin/:adminId/status`
- **Auth Required:** ✅ Yes (super_admin)
- **URL Params:** `adminId` - UUID of admin to update
- **Request Body:**
  ```json
  {
    "status": "INACTIVE"  // "ACTIVE", "INACTIVE", "BLOCKED"
  }
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "message": "Admin status updated",
      "admin": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "status": "INACTIVE",
        "updated_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```

### 8. **Delete Admin** (Soft Delete)
- **Endpoint:** `DELETE /admin/:adminId`
- **Auth Required:** ✅ Yes (super_admin)
- **URL Params:** `adminId` - UUID of admin to delete
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "message": "Admin deleted successfully",
      "deleted_at": "2026-02-28T10:30:00.000Z"
    }
  }
  ```

---

## 👤 User Management APIs

### 9. **Get User Profile**
- **Endpoint:** `GET /users/profile`
- **Auth Required:** ✅ Yes
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "user": {
        "id": "123e4567-e89b-12d3-a456-426614174000",
        "email": "user@example.com",
        "phone": "+91-9876543210",
        "first_name": "பெயர்",
        "last_name": "பெயர்2",
        "gender": "M",
        "date_of_birth": "1990-12-15",
        "address": "123 Street, Tamil Nadu",
        "referral_code": "USER123ABC",
        "referral_code_used": "ADMIN456XYZ",
        "profile_image_url": "https://cdn.example.com/user-123e4567.jpg",
        "created_at": "2025-11-28T10:30:00.000Z"
      }
    }
  }
  ```

### 10. **Update User Profile**
- **Endpoint:** `PUT /users/update-profile`
- **Auth Required:** ✅ Yes
- **Request Body:**
  ```json
  {
    "first_name": "பெயர்",
    "last_name": "பெயர்2",
    "gender": "M",
    "date_of_birth": "1990-12-15",
    "address": "123 Street, Tamil Nadu"
  }
  ```
- **Success Response (200):** Same as Get User Profile

### 11. **Update Profile Picture**
- **Endpoint:** `POST /users/update-profile-picture`
- **Auth Required:** ✅ Yes
- **Content-Type:** `multipart/form-data`
- **Form Fields:**
  - `profile_image` (file, binary) - .jpeg, .jpg, .png, .gif, .webp
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "profile_image_url": "https://storage.example.com/uploads/user-123e4567.jpg",
      "updated_at": "2026-02-28T10:30:00.000Z"
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request` - No file provided
  - `413 Payload Too Large` - File exceeds size limit (5MB)

### 12. **Get All Users** (Admin View)
- **Endpoint:** `GET /admin/moi-user-list`
- **Auth Required:** ✅ Yes (admin)
- **Query Params:**
  ```
  ?limit=10&offset=0&search=name&status=ACTIVE
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "users": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "email": "user@example.com",
          "first_name": "பெயர்",
          "phone": "+91-9876543210",
          "status": "ACTIVE",
          "created_at": "2025-11-28T10:30:00.000Z"
        }
      ],
      "total": 150,
      "limit": 10,
      "offset": 0
    }
  }
  ```

### 13. **Create User** (Admin Only)
- **Endpoint:** `POST /admin/moi-users`
- **Auth Required:** ✅ Yes (admin)
- **Request Body:**
  ```json
  {
    "name": "பெயர்",
    "email": "newuser@example.com",
    "mobile": "9876543210",
    "password": "SecurePass123",
    "status": "ACTIVE",
    "gender": "MALE",
    "date_of_birth": "1990-12-15",
    "address_line1": "123 Street",
    "address_line2": "Area Name",
    "city": "Chennai",
    "state": "Tamil Nadu",
    "country": "India",
    "postal_code": "600001",
    "fcm_token": "device_token_optional",
    "device_name": "Redmi 13C",
    "device_id": "device_id_optional",
    "brand": "Redmi",
    "manufacturer": "Xiaomi",
    "model": "23124RN87I",
    "ram_size": "4GB",
    "android_version": "15"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "message": "User created successfully.",
      "user": {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "full_name": "பெயர்",
        "email": "newuser@example.com",
        "mobile": "9876543210",
        "referral_code": "ABC123XYZ",
        "status": "ACTIVE",
        "gender": "MALE",
        "date_of_birth": "1990-12-15",
        "city": "Chennai",
        "state": "Tamil Nadu",
        "created_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```
- **Error Responses:**
  - `400 Bad Request` - Missing required fields or validation failed
  - `400 Bad Request` - Email/mobile already registered
- **Notes:**
  - Creates entries in `users`, `user_credentials`, `user_profiles`, and `user_devices` tables
  - Auto-generates unique referral code
  - Password is bcrypt hashed
  - Only required fields: name, email, mobile, password
- **Auth Required:** ✅ Yes (admin)
- **Query Params:**
  ```
  ?limit=10&offset=0&search=name&status=ACTIVE
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "users": [
        {
          "id": "123e4567-e89b-12d3-a456-426614174000",
          "email": "user@example.com",
          "first_name": "பெயர்",
          "phone": "+91-9876543210",
          "status": "ACTIVE",
          "created_at": "2025-11-28T10:30:00.000Z"
        }
      ],
      "total": 150,
      "limit": 10,
      "offset": 0
    }
  }
  ```

---

## 📅 Event/Function Management APIs

### 14. **Create Upcoming Function**
- **Endpoint:** `POST /upcoming-functions/create`
- **Auth Required:** ✅ Yes
- **Request Body:**
  ```json
  {
    "function_name": "திருமணம்",
    "function_type": "marriage",
    "function_date": "28-Feb-2026",  // DD-MMM-YYYY format supported
    "function_place": "Chennai",
    "host_name": "பெயர்",
    "host_phone": "+91-9876543210",
    "budget": 500000,
    "description": "விளக்கம்"
  }
  ```
- **Success Response (201):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "function": {
        "id": "f123e456-e89b-12d3-a456-426614174000",
        "function_name": "திருமணம்",
        "function_date": "2026-02-28",
        "function_place": "Chennai",
        "status": "CONFIRMED",
        "created_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```
- **Notes:** Dates automatically converted: DD-MMM-YYYY → YYYY-MM-DD

### 15. **Get All Upcoming Functions**
- **Endpoint:** `GET /upcoming-functions/list`
- **Auth Required:** ✅ Yes
- **Query Params:**
  ```
  ?limit=20&offset=0&status=CONFIRMED
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "functions": [
        {
          "id": "f123e456-...",
          "function_name": "திருமணம்",
          "function_date": "2026-02-28",
          "function_place": "Chennai",
          "host_name": "பெயர்",
          "status": "CONFIRMED"
        }
      ],
      "total": 45,
      "limit": 20,
      "offset": 0
    }
  }
  ```

### 16. **Update Upcoming Function**
- **Endpoint:** `PUT /upcoming-functions/:functionId`
- **Auth Required:** ✅ Yes
- **URL Params:** `functionId` - UUID of function
- **Request Body:** Same as Create (all fields optional)
- **Success Response (200):** Updated function object

### 17. **Get Function Details**
- **Endpoint:** `GET /upcoming-functions/:functionId`
- **Auth Required:** ✅ Yes
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "function": {
        "id": "f123e456-...",
        "function_name": "திருமணம்",
        "function_type": "marriage",
        "function_date": "2026-02-28",
        "function_place": "Chennai",
        "host_name": "பெயர்",
        "host_phone": "+91-9876543210",
        "budget": 500000,
        "description": "விளக்கம்",
        "status": "CONFIRMED",
        "created_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```

---

## 💬 Feedback Management APIs

### 18. **List All Feedbacks** (Admin)
- **Endpoint:** `GET /admin/feedbacks/list-all`
- **Auth Required:** ✅ Yes (admin)
- **Query Params:**
  ```
  ?limit=20&offset=0&status=PENDING
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "feedbacks": [
        {
          "id": "fb123e456-...",
          "user_id": "123e4567-...",
          "title": "App issue",
          "message": "பின்னூட்டம்",
          "rating": 4,
          "status": "PENDING",
          "created_at": "2026-02-28T10:30:00.000Z"
        }
      ],
      "total": 87,
      "limit": 20,
      "offset": 0
    }
  }
  ```

### 19. **Get Feedback Details**
- **Endpoint:** `GET /admin/feedbacks/detail/:feedbackId`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "feedback": {
        "id": "fb123e456-...",
        "user_id": "123e4567-...",
        "user": {
          "first_name": "பெயர்",
          "email": "user@example.com"
        },
        "title": "App issue",
        "message": "விரிவான பின்னூட்டம்",
        "rating": 4,
        "status": "PENDING",
        "admin_response": null,
        "responded_at": null,
        "created_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```

### 20. **Add Feedback Response**
- **Endpoint:** `POST /admin/feedbacks/detail/:feedbackId/response`
- **Auth Required:** ✅ Yes (admin)
- **Request Body:**
  ```json
  {
    "response": "நன்றி. உங்கள் கருத்து மிக முக்கியம்."
  }
  ```
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "feedback": {
        "id": "fb123e456-...",
        "status": "RESOLVED",
        "admin_response": "நன்றி. உங்கள் கருத்து மிக முக்கியம்.",
        "responded_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```

### 21. **Update Feedback Status**
- **Endpoint:** `PUT /admin/feedbacks/detail/:feedbackId/status`
- **Auth Required:** ✅ Yes (admin)
- **Request Body:**
  ```json
  {
    "status": "RESOLVED"  // "PENDING", "IN_PROGRESS", "RESOLVED", "CLOSED"
  }
  ```
- **Success Response (200):** Updated feedback object

### 22. **Delete Feedback** (Soft Delete)
- **Endpoint:** `DELETE /admin/feedbacks/detail/:feedbackId`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "message": "Feedback deleted successfully"
    }
  }
  ```

### 23. **Get Feedback Statistics**
- **Endpoint:** `GET /admin/feedbacks/statistics`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "stats": {
        "total_feedbacks": 87,
        "pending": 15,
        "in_progress": 8,
        "resolved": 60,
        "closed": 4,
        "average_rating": 4.2,
        "rating_distribution": {
          "5": 45,
          "4": 25,
          "3": 12,
          "2": 4,
          "1": 1
        }
      }
    }
  }
  ```

---

## 📊 Analytics APIs

### 24. **Get Platform Overview**
- **Endpoint:** `GET /admin/analytics/overview` ⚠️ **Note:** Full path is `/apis/admin/analytics/overview`
- **Auth Required:** ✅ Yes (admin)
- **Query Params:** `?period=month` (month, quarter, year)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "overview": {
        "total_users": 450,
        "active_users": 320,
        "total_functions": 45,
        "upcoming_functions": 12,
        "total_revenue": 2250000,
        "total_transactions": 156,
        "period": "month",
        "generated_at": "2026-02-28T10:30:00.000Z"
      }
    }
  }
  ```

### 25. **Get User Analytics**
- **Endpoint:** `GET /admin/analytics/users` ⚠️ **Note:** Full path is `/apis/admin/analytics/users`
- **Auth Required:** ✅ Yes (admin)
- **Query Params:** `?metric=signup_trends&period=week`
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "users": {
        "total": 450,
        "new_this_period": 45,
        "active": 320,
        "inactive": 130,
        "trend": [
          {
            "date": "2026-02-22",
            "signups": 8,
            "active": 75
          },
          {
            "date": "2026-02-23",
            "signups": 12,
            "active": 82
          }
        ]
      }
    }
  }
  ```

### 26. **Get Transaction Analytics**
- **Endpoint:** `GET /admin/analytics/transactions` ⚠️ **Note:** Full path is `/apis/admin/analytics/transactions`
- **Auth Required:** ✅ Yes (admin)
- **Query Params:** `?period=month&type=all`
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "transactions": {
        "total": 156,
        "total_amount": 2250000,
        "average": 14423,
        "success_rate": 98.7,
        "by_type": {
          "credit": {
            "count": 95,
            "amount": 1450000
          },
          "debit": {
            "count": 61,
            "amount": 800000
          }
        }
      }
    }
  }
  ```

### 27. **Get Feedback Analytics**
- **Endpoint:** `GET /admin/analytics/feedbacks` ⚠️ **Note:** Full path is `/apis/admin/analytics/feedbacks`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "feedback_stats": {
        "total": 87,
        "average_rating": 4.2,
        "response_time_hours": 12.5
      }
    }
  }
  ```

---

## 📝 Session & Activity Logging APIs

### 28. **Get Session Logs**
- **Endpoint:** `GET /admin/logs/sessions`
- **Auth Required:** ✅ Yes (admin)
- **Query Params:** `?limit=50&offset=0&status=active`
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "sessions": [
        {
          "id": "sess123e456-...",
          "user_id": "123e4567-...",
          "user_email": "user@example.com",
          "login_at": "2026-02-28T08:00:00.000Z",
          "logout_at": null,
          "duration_minutes": 45,
          "ip_address": "192.168.1.1",
          "user_agent": "Mozilla/5.0...",
          "status": "active"
        }
      ],
      "total": 1250,
      "limit": 50,
      "offset": 0
    }
  }
  ```

### 29. **Get User Session History**
- **Endpoint:** `GET /admin/logs/user/:userId`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "user_id": "123e4567-...",
      "user_email": "user@example.com",
      "sessions": [
        {
          "id": "sess123e456-...",
          "login_at": "2026-02-28T08:00:00.000Z",
          "logout_at": "2026-02-28T08:45:00.000Z",
          "duration_minutes": 45,
          "ip_address": "192.168.1.1"
        }
      ],
      "total_sessions": 125
    }
  }
  ```

### 30. **Get Active Sessions**
- **Endpoint:** `GET /admin/logs/active-sessions`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "active_sessions": [
        {
          "id": "sess123e456-...",
          "user_id": "123e4567-...",
          "user_email": "user@example.com",
          "login_at": "2026-02-28T08:00:00.000Z",
          "duration_minutes": 45,
          "ip_address": "192.168.1.1"
        }
      ],
      "total_active": 125
    }
  }
  ```

### 31. **Get Session Statistics**
- **Endpoint:** `GET /admin/logs/session-stats`
- **Auth Required:** ✅ Yes (admin)
- **Success Response (200):**
  ```json
  {
    "responseType": "S",
    "responseValue": {
      "stats": {
        "total_sessions": 5420,
        "active_sessions": 125,
        "inactive_sessions": 5295,
        "unique_users": 450,
        "average_session_duration": 32.5,
        "peak_hour": "14:00-15:00",
        "peak_date": "2026-02-28"
      }
    }
  }
  ```

---

## 🔄 Common Status Values

**User Status:** `ACTIVE`, `INACTIVE`, `BANNED`, `SUSPENDED`

**Admin Status:** `ACTIVE`, `INACTIVE`, `BLOCKED`

**Function Status:** `CONFIRMED`, `PENDING`, `COMPLETED`, `CANCELLED`

**Feedback Status:** `PENDING`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`

**Session Status:** `active`, `inactive`, `expired`

---

## ⏱️ Authentication Notes

- **JWT Token Expiry:** 24 hours from login
- **Failed Login Attempts:** 5 consecutive failures = 15-minute lockout
- **Session Policy:** Only 1 active token per user (new login invalidates previous token)
- **Password Requirements:** Minimum 8 characters (enforce complexity in frontend validation)

---

## 🛡️ Security Best Practices

1. **Store JWT token securely** (HttpOnly cookie or secure localStorage)
2. **Always include Bearer token** in Authorization header
3. **Handle 401/423 responses** for token expiry or account lock
4. **Validate file uploads** (check MIME types and size on frontend)
5. **Use HTTPS** in production (token in Authorization header, not URL)

---

## 📱 API Consumption Example (JavaScript)

```javascript
// Admin Login
const loginResponse = await fetch('http://localhost:5000/apis/admin/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@example.com',
    password: 'password123'
  })
});

const { responseValue } = await loginResponse.json();
const token = responseValue.token;

// Get Admin Details (with token)
const detailsResponse = await fetch('http://localhost:5000/apis/admin/details', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const { responseValue: adminData } = await detailsResponse.json();
console.log(adminData.admin);
```

---

## 📞 Support & Debugging

- **Check logs:** `/logs` directory for backend errors
- **Enable logs:** Set `LOG_LEVEL=debug` in `.env`
- **Test endpoints:** Use Postman collection (import from POSTMAN_API_DOCUMENTATION.md)
- **Report issues:** Include full request/response and error message

---

**Last Updated:** February 28, 2026 | **Version:** 2.0 | **Status:** Complete
