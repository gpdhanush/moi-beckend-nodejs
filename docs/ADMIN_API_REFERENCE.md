# Admin API Reference

## Base URL
```
/api/admin
```

---

## Admin Management

### Create Admin Account
```
POST /api/admin/create
```
**Description:** Create a new admin user account

**Request Body:**
```json
{
  "full_name": "John Doe",
  "email": "john@example.com",
  "mobile": "9876543210",
  "password": "SecurePassword123"
}
```

**Response (Success):**
```json
{
  "responseType": "S",
  "responseValue": {
    "message": "Admin account created successfully.",
    "admin_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

**Response (Error):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "Email or mobile already registered as admin."
  }
}
```

**Validation:**
- Full name: required, non-empty string
- Email: required, valid email format
- Mobile: required, exactly 10 digits
- Password: required, min 6 characters (recommended 8+)

---

## Analytics & Dashboard APIs

### 1. Platform Overview Dashboard
```
GET /api/admin/analytics/overview
```
**Description:** Get unified platform statistics (all metrics at once)

**Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "users": {
      "total": 150,
      "active": 140,
      "deleted": 10
    },
    "transactions": {
      "total_transactions": 850,
      "users_with_transactions": 120,
      "total_persons": 450,
      "invest_count": 500,
      "return_count": 350,
      "total_money": 50000,
      "total_items": 150
    },
    "feedbacks": {
      "total_feedbacks": 45,
      "open_count": 5,
      "in_progress_count": 8,
      "resolved_count": 30,
      "rejected_count": 2,
      "avg_rating": 4.3,
      "users_who_gave_feedback": 35
    },
    "verification": {
      "total_users": 140,
      "verified_users": 120,
      "unverified_users": 20,
      "verification_percentage": 85.71
    },
    "active_users": {
      "active_users_24h": 85,
      "active_users_7d": 110,
      "active_users_30d": 130
    },
    "referrals": {
      "total_referrers": 45,
      "total_referred": 120,
      "avg_referrals_per_user": 2.67
    },
    "generated_at": "2026-02-22T10:30:45.123Z"
  }
}
```

---

### 2. User Statistics
```
GET /api/admin/analytics/users
```
**Description:** Get detailed user metrics including verification & activity trends

**Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "total_counts": {
      "total": 150,
      "active": 140,
      "deleted": 10
    },
    "verification": {
      "total_users": 140,
      "verified_users": 120,
      "unverified_users": 20,
      "verification_percentage": 85.71
    },
    "active_users": {
      "active_users_24h": 85,
      "active_users_7d": 110,
      "active_users_30d": 130
    },
    "registration_trends_7d": [
      {
        "date": "2026-02-16",
        "new_users": 5
      },
      {
        "date": "2026-02-17",
        "new_users": 8
      },
      {
        "date": "2026-02-18",
        "new_users": 12
      }
    ]
  }
}
```

---

### 3. Transaction Statistics
```
GET /api/admin/analytics/transactions
```
**Description:** Get transaction volume, amounts, and type breakdown

**Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "total_transactions": 850,
    "users_with_transactions": 120,
    "total_persons": 450,
    "invest_count": 500,
    "return_count": 350,
    "total_money": 50000,
    "total_items": 150
  }
}
```

**Field Explanation:**
- `total_transactions`: Total investment & return records
- `users_with_transactions`: Unique users with at least one transaction
- `total_persons`: Unique persons/relations tracked
- `invest_count`: Total gifts/investments given
- `return_count`: Total returns/reciprocals
- `total_money`: Sum of all monetary transactions
- `total_items`: Count of non-monetary items

---

### 4. Feedback Statistics
```
GET /api/admin/analytics/feedbacks
```
**Description:** Get feedback metrics, status breakdown, and user ratings

**Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "total_feedbacks": 45,
    "open_count": 5,
    "in_progress_count": 8,
    "resolved_count": 30,
    "rejected_count": 2,
    "avg_rating": 4.3,
    "users_who_gave_feedback": 35
  }
}
```

**Status Breakdown:**
- `OPEN`: Not yet reviewed
- `IN_PROGRESS`: Being addressed
- `RESOLVED`: Fixed & closed
- `REJECTED`: Rejected by admin

---

### 5. Referral Statistics
```
GET /api/admin/analytics/referrals
```
**Description:** Get referral program metrics and top referrers

**Response:**
```json
{
  "responseType": "S",
  "responseValue": {
    "overall_stats": {
      "total_referrers": 45,
      "total_referred": 120,
      "avg_referrals_per_user": 2.67
    },
    "top_referrers": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "full_name": "Alice Johnson",
        "email": "alice@example.com",
        "referral_count": 12
      },
      {
        "id": "660e8400-e29b-41d4-a716-446655440111",
        "full_name": "Bob Smith",
        "email": "bob@example.com",
        "referral_count": 8
      }
    ]
  }
}
```

---

## Login

### Admin Login
```
POST /api/admin/login
```
**Description:** Authenticate admin and retrieve session token

**Request Body:**
```json
{
  "userName": "john@example.com",
  "passWord": "SecurePassword123"
}
```
*Note: `userName` can be email or mobile number*

**Response (Success):**
```json
{
  "responseType": "S",
  "responseValue": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "username": "John Doe",
    "full_name": "John Doe",
    "mobile": "9876543210",
    "email": "john@example.com"
  }
}
```

**Response (Failed - Wrong Credentials):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "Invalid email/mobile or password."
  }
}
```

**Response (Failed - Account Blocked):**
```json
{
  "responseType": "F",
  "responseValue": {
    "message": "Account locked. Too many failed attempts. Try again after 15 minutes."
  }
}
```

**Security Features:**
- Failed login attempt tracking
- Account blocks after 3 failed attempts (15 min lockout)
- Auto-reset on successful login

---

## User Management

### List All Users
```
GET /api/admin/moi-users
```

### Create User (Admin)
```
POST /api/admin/moi-users
Body: { name, email, mobile, password }
```

### Get User by ID
```
GET /api/admin/moi-user-list/:id
```

### Update User
```
PUT /api/admin/moi-users/:id
Body: { um_full_name, um_mobile, um_email, um_status }
```

### Delete User
```
DELETE /api/admin/moi-users/:id
```

---

## Feedback Management

### List All Feedbacks
```
GET /api/admin/feedbacks
```

### Reply to Feedback
```
POST /api/admin/feedbacks/reply
Body: { feedbackId, reply }
```

---

## Transactions

### Get All Transactions
```
GET /api/admin/moi-out-all
```

### Get User Transactions
```
GET /api/admin/moi-out-all/:userId
```

---

## Error Response Format

All endpoints follow this error format:

```json
{
  "responseType": "F",
  "responseValue": {
    "message": "Error description here"
  }
}
```

**HTTP Status Codes:**
- `200` – Success
- `201` – Created
- `400` – Bad Request (validation error)
- `404` – Not Found
- `429` – Too Many Requests (rate limit)
- `500` – Server Error

---

## Example Usage with cURL

### Create Admin
```bash
curl -X POST http://localhost:3000/api/admin/create \
  -H "Content-Type: application/json" \
  -d '{
    "full_name": "Admin User",
    "email": "admin@example.com",
    "mobile": "9876543210",
    "password": "SecurePass123"
  }'
```

### Get Platform Overview
```bash
curl http://localhost:3000/api/admin/analytics/overview
```

### Get User Stats
```bash
curl http://localhost:3000/api/admin/analytics/users
```

### Get Top Referrers
```bash
curl http://localhost:3000/api/admin/analytics/referrals
```

---

## Notes

- All timestamps are in ISO 8601 format (UTC)
- User IDs are binary UUIDs (converted to string in responses)
- Analytics endpoints return aggregated, real-time data
- Deleted users are excluded from active counts but included in total counts
- Percentages are rounded to 2 decimal places
