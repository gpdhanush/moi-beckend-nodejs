# Quick Setup - Failed Login Attempts Tracking

## Status: ENABLED IN CODE ✅
The login blocking logic is now **active** in the controller.

---

## What You Need to Do

### Step 1: Add Columns to Database

Run this migration to add the required columns to `user_credentials` table:

```bash
mysql -u root -h localhost moi_new < migrations/add_login_security_to_credentials.sql
```

**If you get column exists error**: That's OK! It means the columns are already there. You can proceed to test.

---

### Step 2: Test Failed Login Attempts

**Test 1: Wrong Password (1st Time)**
```
POST /api/user/login
Body: { "email": "test@example.com", "password": "wrong_password" }

Response:
{
    "responseType": "F",
    "responseValue": {
        "message": "கடவுச்சொல் தவறானது. 2 முயற்சிகள் மீதமுள்ளது.",
        "remaining_attempts": 2
    }
}
```

**Test 2: Wrong Password (2nd Time)**
```
Same request again

Response:
{
    "responseType": "F",
    "responseValue": {
        "message": "கடவுச்சொல் தவறானது. 1 முயற்சிகள் மீதமுள்ளது.",
        "remaining_attempts": 1
    }
}
```

**Test 3: Wrong Password (3rd Time - BLOCKED)**
```
Same request again

Response:
{
    "responseType": "F",
    "responseValue": {
        "message": "மிக அதிக தோல்வி முயற்சிகள். கணக்கு 15 நிமிடங்களுக்கு தடுக்கப்பட்டுள்ளது.",
        "attempts": 3,
        "blocked_until": "2026-02-22T10:45:30.000Z",
        "account_status": "BLOCKED"
    }
}
```

**Test 4: Account is Blocked**
```
After 3rd attempt, any login attempt will give:

Response:
{
    "responseType": "F",
    "responseValue": {
        "message": "மிக அதிக தோல்வி முயற்சிகள். கணக்கு 15 நிமிடங்களுக்கு தடுக்கப்பட்டுள்ளது.",
        "attempts": 3,
        "blocked_until": "2026-02-22T10:45:30.000Z",
        "account_status": "BLOCKED"
    }
}
```

**Test 5: Successful Login (Resets Attempts)**
```
POST /api/user/login
Body: { "email": "test@example.com", "password": "correct_password" }

Response: Login successful, all attempts reset to 0
```

---

## How It Works

### Failed Login Tracking Flow:
1. ❌ User enters wrong password
2. ✅ `User.incrementFailedLoginAttempts()` is called
3. ✅ `user_credentials.failed_login_attempts` incremented
4. ✅ If attempts >= 3, `login_blocked_until` is set to NOW + 15 minutes
5. ✅ Returns remaining attempts to user

### Block Expiry Flow:
1. User tries to login while blocked (before 15 mins)
2. Methods detect `login_blocked_until` is in future
3. Returns block status with time remaining

### Successful Login Flow:
1. ✅ User enters correct password
2. ✅ `User.resetFailedLoginAttempts()` is called
3. ✅ All columns reset: attempts = 0, blocked_until = NULL
4. ✅ User gets JWT token and can access app

---

## Database Columns Added

### Table: `user_credentials`

```sql
failed_login_attempts INT DEFAULT 0
  -- Tracks number of failed attempts (resets to 0 after successful login)
  
login_blocked_until DATETIME NULL
  -- When the user can attempt login again (NULL = not blocked)
  -- Auto-calculated when attempts reach 3
  -- Duration: 15 minutes
```

---

## Troubleshooting

### "Unknown column 'failed_login_attempts'"
✅ **Fix**: Run the migration
```bash
mysql -u root -h localhost moi_new < migrations/add_login_security_to_credentials.sql
```

### "Error: PROTOCOL_SEQUENCE_TIMEOUT"
✅ **Fix**: Make sure MySQL is running
```bash
brew services start mysql  # On macOS
```

### Feature not triggering on wrong password
✅ **Check**: 
- [ ] Migration was run successfully
- [ ] Columns exist in user_credentials table
- [ ] Try hard refresh (CMD+Shift+R)
- [ ] Check browser DevTools console for errors

### Want to test blocking without waiting 15 mins?
🔧 **Modify in [src/models/user.js](src/models/user.js) line 185:**
```javascript
const BLOCK_DURATION_MINUTES = 15;  // Change to 1 for 1 minute testing
```

---

## That's It! 🎉
Your failed login tracking is now active with automatic 15-minute account blocking after 3 wrong passwords.
