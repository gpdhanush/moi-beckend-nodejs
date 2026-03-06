# 🔴 FRONTEND FIX REQUIRED - 404 Errors

## Problem
Your API calls are returning **404 Not Found** because you're missing `/admin` in the URL path.

---

## 🛠️ Quick Fix

### Find & Replace in Your Frontend Code

**Search for:**
```javascript
'/apis/moi-user-list'
'/apis/analytics/overview'
'/apis/analytics/users'
'/apis/analytics/feedbacks'
'/apis/analytics/transactions'
```

**Replace with:**
```javascript
'/apis/admin/moi-user-list'          // Add /admin
'/apis/admin/analytics/overview'     // Add /admin
'/apis/admin/analytics/users'        // Add /admin
'/apis/admin/analytics/feedbacks'    // Add /admin
'/apis/admin/analytics/transactions' // Add /admin
```

---

## 📝 Example Code Changes

### Before (❌ Returns 404):
```javascript
// React/JavaScript
fetch('http://localhost:5000/apis/moi-user-list')

// Axios
axios.get('/apis/analytics/overview')
```

### After (✅ Works):
```javascript
// React/JavaScript
fetch('http://localhost:5000/apis/admin/moi-user-list', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})

// Axios
axios.get('/apis/admin/analytics/overview', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
```

---

## 🎯 Rule of Thumb

**All admin dashboard API calls need `/admin` in the path:**
- ✅ `/apis/admin/...` → Works
- ❌ `/apis/...` → 404 Error

**Plus you MUST include the JWT token in Authorization header!**

---

## 🧪 Test Your Fix

After updating your code, you should see:
- ✅ `200 OK` status codes
- ✅ Data returned in response
- ✅ No more 404 errors in console

Before:
```
GET /apis/moi-user-list 404 0.552 ms - 157  ❌
```

After:
```
GET /apis/admin/moi-user-list 200 4.212 ms - 1245  ✅
```

---

## 📋 Common Endpoints List

Copy-paste these correct URLs into your API service file:

```javascript
// User Management
const USER_LIST = '/apis/admin/moi-user-list';
const USER_DETAILS = '/apis/admin/moi-user-list/:id';
const CREATE_USER = '/apis/admin/moi-users';

// Analytics
const OVERVIEW = '/apis/admin/analytics/overview';
const USER_STATS = '/apis/admin/analytics/users';
const TRANSACTION_STATS = '/apis/admin/analytics/transactions';
const FEEDBACK_STATS = '/apis/admin/analytics/feedbacks';

// Feedbacks
const FEEDBACK_LIST = '/apis/admin/feedbacks/list-all';
const FEEDBACK_STATS = '/apis/admin/feedbacks/statistics';

// Logs
const SESSION_LOGS = '/apis/admin/logs/sessions';
const ACTIVE_SESSIONS = '/apis/admin/logs/active-sessions';
```

---

**Last Updated:** February 28, 2026  
**Status:** 🔴 URGENT - Frontend team needs to update ALL API URLs
