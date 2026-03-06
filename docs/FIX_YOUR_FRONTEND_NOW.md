# 🚨 URGENT: Your Frontend Code is Using Wrong URLs

## The Error You're Seeing

```html
Cannot GET /apis/moi-user-list
```

## Why This is Happening

Your frontend is calling: `/apis/moi-user-list`  
But the route is actually: `/apis/admin/moi-user-list`

**You're missing `/admin` in the path!**

---

## ✅ Proof Backend is Working

**Postman working with:** `{{admin}}/admin/moi-users`  
This proves the backend is correct. Your frontend just needs to update the URLs.

---

## 🛠️ How to Fix Your Frontend

### Step 1: Find Your API Configuration File

Look for files like:
- `src/services/api.js`
- `src/config/apiEndpoints.js`
- `src/utils/api.ts`
- `src/constants/endpoints.js`
- Any file that defines your API base URL or endpoints

### Step 2: Search & Replace

**Open your code editor and do a global search for:**

```
/apis/moi-user-list
/apis/analytics/
/apis/feedbacks/
```

**Replace with:**

```
/apis/admin/moi-user-list
/apis/admin/analytics/
/apis/admin/feedbacks/
```

### Step 3: Update Your API Base URLs

#### Option A: If you have a centralized API service

```javascript
// ❌ WRONG (Your current code probably looks like this)
const BASE_URL = 'http://localhost:5000/apis';

// API calls
fetch(`${BASE_URL}/moi-user-list`)
fetch(`${BASE_URL}/analytics/overview`)
```

```javascript
// ✅ CORRECT (Change to this)
const BASE_URL = 'http://localhost:5000/apis';
const ADMIN_URL = `${BASE_URL}/admin`;  // Add this line

// API calls
fetch(`${ADMIN_URL}/moi-user-list`)      // Use ADMIN_URL
fetch(`${ADMIN_URL}/analytics/overview`)  // Use ADMIN_URL
```

#### Option B: If you have hardcoded URLs

```javascript
// ❌ WRONG
const getUserList = () => {
  return fetch('/apis/moi-user-list');
};

const getOverview = () => {
  return fetch('/apis/analytics/overview');
};
```

```javascript
// ✅ CORRECT
const getUserList = () => {
  return fetch('/apis/admin/moi-user-list');  // Added /admin
};

const getOverview = () => {
  return fetch('/apis/admin/analytics/overview');  // Added /admin
};
```

---

## 📋 Complete URL Mapping Reference

**Copy this into your code:**

```javascript
// API Endpoints - USE THESE EXACT URLS
const API_ENDPOINTS = {
  // Admin Auth
  LOGIN: '/apis/admin/login',
  
  // User Management
  GET_USERS: '/apis/admin/moi-user-list',
  GET_USER_BY_ID: '/apis/admin/moi-user-list/:id',
  CREATE_USER: '/apis/admin/moi-users',
  UPDATE_USER: '/apis/admin/moi-users/:id',
  DELETE_USER: '/apis/admin/moi-users/:id',
  
  // Analytics
  OVERVIEW: '/apis/admin/analytics/overview',
  USER_STATS: '/apis/admin/analytics/users',
  TRANSACTION_STATS: '/apis/admin/analytics/transactions',
  FEEDBACK_STATS: '/apis/admin/analytics/feedbacks',
  REFERRAL_STATS: '/apis/admin/analytics/referrals',
  
  // Feedbacks
  FEEDBACK_LIST: '/apis/admin/feedbacks/list-all',
  FEEDBACK_STATISTICS: '/apis/admin/feedbacks/statistics',
  FEEDBACK_DETAIL: '/apis/admin/feedbacks/detail',
  FEEDBACK_UPDATE_STATUS: '/apis/admin/feedbacks/update-status',
  FEEDBACK_ADD_RESPONSE: '/apis/admin/feedbacks/add-response',
  FEEDBACK_DELETE: '/apis/admin/feedbacks/delete',
  
  // Logs & Sessions
  SESSION_LOGS: '/apis/admin/logs/sessions',
  USER_SESSION_LOGS: '/apis/admin/logs/user/:userId',
  ACTIVE_SESSIONS: '/apis/admin/logs/active-sessions',
  SESSION_STATS: '/apis/admin/logs/session-stats',
};

export default API_ENDPOINTS;
```

---

## 🧪 How to Test Your Fix

### Before Fix:
```
Browser Console:
GET /apis/moi-user-list 404 (Not Found) ❌
```

### After Fix:
```
Browser Console:
GET /apis/admin/moi-user-list 200 (OK) ✅
```

---

## 💡 Quick React Example

If you're using React with Axios:

```javascript
// services/api.js or apiService.js

import axios from 'axios';

const API_BASE = 'http://localhost:5000/apis';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to all requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API Methods - NOTICE THE /admin PREFIX
export const adminApi = {
  // User Management
  getUserList: () => api.get('/admin/moi-user-list'),
  getUserById: (id) => api.get(`/admin/moi-user-list/${id}`),
  
  // Analytics
  getOverview: () => api.get('/admin/analytics/overview'),
  getUserStats: () => api.get('/admin/analytics/users'),
  getFeedbackStats: () => api.get('/admin/analytics/feedbacks'),
  
  // Feedbacks
  getFeedbackList: (data) => api.post('/admin/feedbacks/list-all', data),
  getFeedbackStats: () => api.get('/admin/feedbacks/statistics'),
};

export default api;
```

---

## 🎯 Action Required

1. **Open your frontend project**
2. **Find where you define API URLs**
3. **Add `/admin` after `/apis` for all admin endpoints**
4. **Save and refresh your app**
5. **Check browser console - should see 200 OK instead of 404**

---

## ❓ Still Not Working?

If you still see 404 errors after updating URLs:

1. **Clear browser cache** (Ctrl+Shift+R or Cmd+Shift+R)
2. **Check browser Network tab** - verify the URL being sent
3. **Make sure token is included** in Authorization header
4. **Verify you're running the right build** (restart your React/Vue/Next.js dev server)

---

**The backend is correct. Your frontend just needs to update the URLs. That's it!** 🚀
