# ⚠️ Important: Endpoint URL Corrections

## ❌ Common Frontend Mistakes

**Your frontend is calling:**
```
GET /apis/moi-user-list
GET /apis/analytics/overview
GET /apis/analytics/users
GET /apis/analytics/feedbacks
```

**These all return 404 errors because they're missing `/admin` in the path!**

---

## ✅ Correct URLs (Add `/admin` after `/apis`)

| ❌ **What Frontend is Calling** | ✅ **What You Should Call** |
|--------------------------------|---------------------------|
| `GET /apis/moi-user-list` | `GET /apis/admin/moi-user-list` |
| `GET /apis/analytics/overview` | `GET /apis/admin/analytics/overview` |
| `GET /apis/analytics/users` | `GET /apis/admin/analytics/users` |
| `GET /apis/analytics/feedbacks` | `GET /apis/admin/analytics/feedbacks` |

**Pattern:** All admin endpoints are under `/apis/admin/*`, not `/apis/*` directly.

---

## 🔐 Authentication Required

**All admin endpoints now require:**
```javascript
headers: {
  'Authorization': 'Bearer <JWT_TOKEN>'
}
```

**Protected endpoints:**
- ✅ All `/admin/analytics/*` routes
- ✅ All `/admin/feedbacks/*` routes
- ✅ All `/admin/logs/*` routes
- ✅ All user management routes under `/admin/*`

---

## 📝 Quick Fix for Frontend

**JavaScript/TypeScript:**
```javascript
// ❌ Wrong
const response = await fetch('/apis/analytics/overview');

// ✅ Correct
const response = await fetch('/apis/admin/analytics/overview', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

**Axios:**
```javascript
// ❌ Wrong
axios.get('/apis/analytics/overview');

// ✅ Correct
axios.get('/apis/admin/analytics/overview', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🧪 Test These Endpoints

After login with valid admin credentials, test:

1. **Platform Overview:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/apis/admin/analytics/overview
   ```

2. **User List:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/apis/admin/moi-user-list
   ```

3. **User Analytics:**
   ```bash
   curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:5000/apis/admin/analytics/users
   ```

---

## 📋 Complete Endpoint Structure

```
/apis
  /admin ← All admin routes mounted here
    /login (POST) - Public, no auth required
    /create (POST) - Protected
    /details/:id (GET) - Protected
    /update-profile (POST) - Protected
    /update-password (POST) - Protected
    /list (GET) - Protected
    /update-status (POST) - Protected
    /delete (POST) - Protected
    
    /moi-users (GET, POST) - Protected
    /moi-user-list (GET) - Protected
    /moi-user-list/:id (GET) - Protected
    
    /analytics
      /overview (GET) - Protected
      /users (GET) - Protected
      /transactions (GET) - Protected
      /feedbacks (GET) - Protected
      /referrals (GET) - Protected
    
    /feedbacks
      /list-all (POST) - Protected
      /statistics (GET) - Protected
      /detail (POST) - Protected
      /update-status (POST) - Protected
      /add-response (POST) - Protected
      /delete (POST) - Protected
    
    /logs
      /sessions (GET) - Protected
      /user/:userId (GET) - Protected
      /active-sessions (GET) - Protected
      /session-stats (POST) - Protected
```

---

## 🚀 Changes Made (Backend)

1. ✅ Added `authenticateToken` and `isAdmin` middleware to all analytics routes
2. ✅ All analytics endpoints now verify JWT token before responding
3. ✅ Updated API documentation with correct URL paths

**No database changes needed - only route protection added.**

---

**Last Updated:** February 28, 2026
**Status:** Fixed and Deployed
