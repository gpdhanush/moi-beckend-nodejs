# FCM Notification Troubleshooting Guide

## Common Issues & Solutions

### 1. **Notifications Not Received**

#### Check Firebase Credentials
```bash
# Verify all Firebase env variables are set:
echo $FIREBASE_PROJECT_ID
echo $FIREBASE_TYPE
echo $FIREBASE_PRIVATE_KEY_ID
echo $FIREBASE_CLIENT_EMAIL
```

**Fix:** Ensure `.env` file has correct Firebase credentials from your Firebase project settings.

---

### 2. **No FCM Token Found**

**Problem:** Response shows `noDeviceToken > 0`

**Causes:**
- User hasn't registered a device with FCM token
- Device registration failed in the app
- Token is inactive in database

**Debug:**
```sql
-- Check if user has any active devices
SELECT * FROM user_devices 
WHERE user_id = UNHEX('USER_ID_HEX') 
AND is_active = 1;

-- Check all devices for user
SELECT * FROM user_devices 
WHERE user_id = UNHEX('USER_ID_HEX');
```

**Fix:** 
- Verify app is registering FCM token properly
- Check `user_devices` table population

---

### 3. **Invalid Registration Token Error**

**Error:** `messaging/invalid-registration-token`

**Causes:**
- Token has expired
- Token was revoked
- Wrong Firebase project ID in app config

**Fix:**
- Tokens are automatically deactivated in DB when invalid
- User must re-register device
- Verify Firebase credentials match in both backend and app

---

### 4. **Firebase Authentication Failed**

**Error:** Firebase credential initialization failing

**Debug Check:**
```javascript
// Check if Firebase initialized successfully
const admin = require('firebase-admin');
console.log(admin.apps); // Should have at least one app
```

**Fix:**
- Verify `FIREBASE_PRIVATE_KEY` is properly escaped
- Ensure newlines are converted: `replace(/\\n/g, '\n')`
- Check all required Firebase env variables

---

### 5. **Silent Notifications (Sent but Not Displayed)**

**Problem:** API returns success but user doesn't see notification

**Causes:**
- App not handling notification properly
- Data payload not configured
- App is in background/killed

**Solution:**
- Ensure app has notification handlers for both foreground and background
- Check app's `FirebaseMessagingService` or equivalent
- Verify notification permissions in app manifests

---

## Testing FCM Notifications

### Test with `/admin/send-bulk` Endpoint

```bash
curl -X POST http://localhost:PORT/api/notifications/admin/send-bulk \
  -H "Content-Type: application/json" \
  -d '{
    "userIds": ["user-uuid-1", "user-uuid-2"],
    "title": "Test Notification",
    "body": "This is a test message",
    "type": "general"
  }'
```

### Response Analysis
```json
{
  "responseType": "S",
  "responseValue": {
    "totalRequested": 2,
    "usersFound": 2,
    "successful": 2,
    "failed": 0,
    "noDeviceToken": 0,
    "successfulUsers": [...],
    "failedUsers": []
  }
}
```

**What Each Field Means:**
- `noDeviceToken`: Users without registered FCM tokens
- `failed`: Users where FCM send raised an error
- `successful`: Users who successfully received push notification
- `failedUsers`: Detailed failure reasons

---

## Database Checks

### View Active FCM Tokens
```sql
SELECT 
  u.id, u.email, 
  ud.fcm_token, 
  ud.is_active,
  ud.last_used_at
FROM users u
LEFT JOIN user_devices ud ON ud.user_id = u.id
WHERE ud.is_active = 1
ORDER BY ud.last_used_at DESC;
```

### View Notification History
```sql
SELECT 
  n.id, 
  u.email,
  n.title, 
  n.is_read,
  n.created_at
FROM notifications n
JOIN users u ON n.user_id = u.id
ORDER BY n.created_at DESC LIMIT 50;
```

### Mark Inactive Tokens as Active (for testing)
```sql
UPDATE user_devices 
SET is_active = 1 
WHERE user_id = UNHEX('USER_ID_HEX') 
LIMIT 1;
```

---

## Debug Logging

Look for these log entries to trace FCM flow:

1. **User/Token Resolution:**
   ```
   Sending FCM to user [USER_ID] with token [TOKEN_PREVIEW]...
   ```

2. **Success:**
   ```
   FCM sent successfully to user [USER_ID]
   ```

3. **Errors:**
   ```
   FCM send error: [ERROR_CODE]
   FCM error code: messaging/invalid-registration-token
   FCM error message: [DETAILED_MESSAGE]
   ```

4. **Token Deactivation:**
   ```
   Deactivated invalid FCM token for user [USER_ID]
   ```

---

## Important Implementation Details

### Current Fixes Applied:

1. **Database Query** - Uses subquery to get most recent active device per user
2. **FCM Message Structure** - Includes:
   - `notification` payload (for display)
   - `data` payload (for app to process)
   - Android priority set to `high`
   - APNS headers for iOS high priority
   - TTL set to 3600 seconds

3. **Error Handling** - Invalid tokens automatically deactivated

---

## Frontend Requirements

Your mobile app must:

1. **Request Permission:**
   ```javascript
   // iOS/Android
   const permission = await messaging().requestPermission();
   ```

2. **Register for FCM Token:**
   ```javascript
   const token = await messaging().getToken();
   // Send token to backend with user_devices endpoint
   ```

3. **Handle Messages:**
   ```javascript
   // Foreground
   messaging().onMessage((message) => {
     console.log('Message received:', message);
   });

   // Background (handled by OS)
   // App must be configured to handle notifications
   ```

---

## Next Steps

1. Check app logs for FCM token registration errors
2. Verify user has active devices with valid tokens
3. Enable Firebase Console notifications history
4. Check network connectivity on device
5. Verify app has notification permissions enabled on device

