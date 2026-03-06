# Login Security Feature - Setup Guide

## Current Status
**❌ DISABLED** - Waiting for database migrations

The login blocking feature (block after 3 wrong passwords for 15 minutes) has been implemented but is currently disabled because the required database columns don't exist yet.

---

## What's Already Done

### 1. Database Methods (Ready)
✅ `User.incrementFailedLoginAttempts(userId)` - Track failed attempts  
✅ `User.resetFailedLoginAttempts(userId)` - Clear attempts on success  
✅ `User.getLoginBlockStatus(userId)` - Check if account is blocked  

### 2. Migration Files Created
✅ `migrations/remove_login_security_from_users.sql` - Clean up wrong table  
✅ `migrations/add_login_security_to_credentials.sql` - Add columns to right table  

### 3. Login Controller
⚠️ Disabled - Comment blocks ready to uncomment

---

## How to Enable Login Security

### Step 1: Run Database Migrations
```bash
# Remove columns from users table (cleanup)
mysql -u root -h localhost moi_new < migrations/remove_login_security_from_users.sql

# Add columns to user_credentials table (correct location)
mysql -u root -h localhost moi_new < migrations/add_login_security_to_credentials.sql
```

### Step 2: Update User Model Queries
In [src/models/user.js](src/models/user.js), add these columns to the SELECT statements:

**For all find methods** (findByEmail, findByEmailIncludingDeleted, findById, findByIdIncludingDeleted):

Add to the uc (user_credentials) section:
```sql
uc.failed_login_attempts, uc.login_blocked_until,
```

### Step 3: Update mapUserRow Function
In [src/models/user.js](src/models/user.js), add to the base object in mapUserRow:

```javascript
failed_login_attempts: r.failed_login_attempts || 0,
login_blocked_until: r.login_blocked_until || null,
```

### Step 4: Enable Login Controller Logic
In [src/controllers/user.js](src/controllers/user.js), uncomment:

- Lines 103-125 (password validation with blocking logic)
- Line 139 (reset attempts on successful login)

---

## Feature Behavior After Enabling

### Scenario 1: Wrong Password (1st or 2nd Attempt)
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "கடவுச்சொல் தவறானது. 2 முயற்சிகள் மீதமுள்ளது.",
        "remaining_attempts": 2
    }
}
```

### Scenario 2: Wrong Password (3rd Attempt - Account Blocked)
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "மிக அதிக தோல்வி முயற்சிகள். கணக்கு 15 நிமிடங்களுக்கு தடுக்கப்பட்டுள்ளது.",
        "attempts": 3,
        "blocked_until": "2026-02-22T10:30:00Z",
        "account_status": "BLOCKED"
    }
}
```

### Scenario 3: Account Currently Blocked
```json
{
    "responseType": "F",
    "responseValue": {
        "message": "மிக அதிக தோல்வி முயற்சிகள். 14 நிமிடங்களில் மீண்டும் முயற்சி செய்க.",
        "retry_after_minutes": 14,
        "blocked_until": "2026-02-22T10:30:00Z"
    }
}
```

### Scenario 4: Block Expiry & Successful Login
- After 15 minutes, account auto-unlocks
- Successful login = all attempts reset to 0
- Account is completely accessible

---

## Database Schema Added

### Table: user_credentials
```sql
ALTER TABLE user_credentials ADD COLUMN failed_login_attempts INT DEFAULT 0;
ALTER TABLE user_credentials ADD COLUMN login_blocked_until DATETIME NULL;
ALTER TABLE user_credentials ADD COLUMN reset_token VARCHAR(255) NULL;
ALTER TABLE user_credentials ADD COLUMN reset_token_expires_at DATETIME NULL;
```

---

## Troubleshooting

### Error: "Unknown column 'login_blocked_until'"
**Cause**: Migration not run yet  
**Fix**: Run the migrations in Step 1

### Error: "Table 'user_credentials' doesn't exist"
**Cause**: Database structure issue  
**Fix**: Verify your database has the user_credentials table

### Feature not working after enabling
**Cause**: Code changes incomplete  
**Fix**: Make sure all 4 steps are completed properly

---

## Reset Token Support (Future)

The `reset_token` and `reset_token_expires_at` columns are also available for password reset feature:
- Generate token on "Forgot Password"
- Store token and expiry in database
- Verify token on password reset form
- Implementation ready in database methods

