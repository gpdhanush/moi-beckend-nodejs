# AI Prompt for React Frontend Implementation

**Copy and paste this entire prompt into ChatGPT, Claude, or your preferred AI to generate React code.**

---

## 🎯 Context

I have a complete Node.js/Express backend API for a Tamil language event management application (MOI - நன்றி). I need you to generate a complete React admin dashboard that consumes this API.

**Backend Base URL:** `http://localhost:5000/apis`

**Database:** moi_new_1 (MariaDB)

**Tech Stack:** React 18+, TypeScript (optional), React Router v6, Axios/Fetch, Material-UI or Tailwind CSS

**Auth:** JWT Bearer tokens stored in localStorage/sessionStorage

---

## 📋 API Specification

### Authentication Endpoints

**Login Endpoint:** `POST /admin/login`
- Request: `{ email: string, password: string }`
- Response: `{ admin: {...}, token: string, expiresIn: "24h" }`
- Store token in localStorage as `auth_token`

**Get Admin Details:** `GET /admin/details`
- Headers: `Authorization: Bearer <token>`
- Response: Admin profile data including name, email, role, profile image

### Admin Management Endpoints

- `POST /admin/create` - Create new admin (super_admin only)
- `PUT /admin/update-profile` - Update profile info & picture
- `POST /admin/update-password` - Change password
- `GET /admin/list` - Paginated list of all admins
- `PUT /admin/:adminId/status` - Update admin status (ACTIVE/INACTIVE/BLOCKED)
- `DELETE /admin/:adminId` - Soft delete admin

### User Management

- `GET /admin/moi-users` - Get all users with full details
- `POST /admin/moi-users` - Create new user (admin only)
- `GET /admin/moi-user-list` - List all users with pagination
- `GET /admin/moi-user-list/:id` - Get single user details with all devices
- `PUT /admin/moi-users/:id` - Update user
- `DELETE /admin/moi-users/:id` - Soft delete user
- `GET /users/profile` - Current user profile
- `PUT /users/update-profile` - Update user info
- `POST /users/update-profile-picture` - Upload profile image (multipart/form-data)

### Event/Function Management

- `POST /upcoming-functions/create` - Create event (supports DD-MMM-YYYY date format)
- `GET /upcoming-functions/list` - List events with pagination
- `PUT /upcoming-functions/:functionId` - Update event
- `GET /upcoming-functions/:functionId` - Get event details

### Feedback Management

- `GET /admin/feedbacks/list-all` - List all feedbacks with filters
- `GET /admin/feedbacks/detail/:feedbackId` - Get feedback & user info
- `POST /admin/feedbacks/detail/:feedbackId/response` - Reply to feedback
- `PUT /admin/feedbacks/detail/:feedbackId/status` - Update feedback status
- `DELETE /admin/feedbacks/detail/:feedbackId` - Delete feedback
- `GET /admin/feedbacks/statistics` - Feedback stats & ratings

### Analytics Endpoints

- `GET /admin/analytics/overview` - Platform overview stats
- `GET /admin/analytics/users` - User analytics with trends
- `GET /admin/analytics/transactions` - Transaction stats
- `GET /admin/analytics/feedbacks` - Feedback analytics

### Session Logging

- `GET /admin/logs/sessions` - All session logs with pagination
- `GET /admin/logs/user/:userId` - User's session history
- `GET /admin/logs/active-sessions` - Currently active sessions
- `GET /admin/logs/session-stats` - Overall session statistics

---

## 🎨 UI Layout Requirements

### Pages/Routes

1. **Login Page** (`/login`)
   - Email & password inputs
   - Error messages (invalid credentials, account locked for 15 min after 5 failed attempts)
   - "Forgot Password" link placeholder
   - Logo & branding

2. **Dashboard** (`/dashboard`)
   - Overview cards: Total Users, Active Users, Total Functions, Revenue, Transactions
   - Charts: User signup trends, transaction trends, feedback ratings
   - Quick actions: Create Event, View Feedback, Manage Admins
   - Period filter: Month/Quarter/Year

3. **Admin Profile** (`/profile`)
   - Display admin name, email, role, profile picture
   - Edit form: Update name, email, phone, upload profile image
   - Change Password section: Current password + new password fields
   - Last password change date display

4. **Manage Admins** (`/admins`)
   - Table listing all admins with columns: Name, Email, Status, Role, Created Date
   - Create Admin button → Modal with form
   - Actions per row: Edit Status, Delete, View Details
   - Pagination & search/filter by status
   - Status badge colors: ACTIVE=green, INACTIVE=gray, BLOCKED=red

5. **Manage Users** (`/users`)
   - Table: User email, name, phone, status, created date
   - Search & pagination
   - User detail view: Full profile, profile picture, referral code
   - View user's transaction history (if transaction endpoints exist)

6. **Events/Functions** (`/events`)
   - Table: Event name, type, date, location, status
   - Pagination & filtering by status
   - Create Event button → Form accepting DD-MMM-YYYY date format
   - Edit & Delete actions
   - Event detail page showing all info including budget

7. **Feedback** (`/feedbacks`)
   - Table: User name, title, rating (as stars), status, created date
   - Pagination & filter by status
   - Click row → Detail view with:
     - Full message, user info, rating
     - Admin response field (if not responded)
     - Status dropdown (PENDING/IN_PROGRESS/RESOLVED/CLOSED)
     - Delete button
   - Statistics card: Total, Pending, In Progress, Resolved, Closed, Average Rating

8. **Analytics** (`/analytics`)
   - Overview section: 4 cards showing key metrics
   - Charts: User trends, transaction volume, feedback distribution
   - Session activity: Active users, peak times
   - Period selector: Month/Quarter/Year

9. **Session Logs** (`/logs`)
   - Table: User, login time, duration, logout time, IP address
   - Filter by user or date range
   - Statistics card: Total sessions, active sessions, avg duration
   - Active sessions section highlighting current online users

---

## ⚙️ Technical Requirements

### Authentication Flow
1. User logs in at `/login` with email/password
2. API returns JWT token
3. Store token in localStorage (key: `auth_token`)
4. Include in all requests: `Authorization: Bearer <token>`
5. Redirect to `/dashboard` on success
6. Show error if 401 (token expired) → redirect to login
7. Show error if 423 (account locked) with message about 15-minute cooldown

### State Management
- Use Context API, Redux, or Zustand for:
  - Auth state (token, admin details, isLoggedIn)
  - User notifications (success/error toasts)
  - API loading states
  - Pagination (current page, limit)

### API Service Layer
Create a serviceAdapter or API client that:
- Automatically adds Authorization header to all requests
- Handles 401 responses (redirect to login)
- Handles 423 responses (show account locked message)
- Implements request/response interceptors
- Retries failed requests (optional)
- Converts camelCase ↔ snake_case if needed

### Form Validation
- Email format validation
- Phone number validation (Indian format: +91-XXXXXXXXXX or 10 digits)
- Password strength (min 8 chars, encourage special chars)
- Date format: Accept DD-MMM-YYYY and display as formatted date
- File upload: Only accept jpeg, jpg, png, gif, webp; max 5MB

### UI/UX Standards
- Consistent navbar with: Logo, Admin name, Logout button, Theme toggle (optional)
- Sidebar navigation with: Dashboard, Users, Events, Feedbacks, Analytics, Admins, Logs
- Loading spinners on all async operations
- Success/Error toast notifications
- Confirmation dialogs before delete operations
- Empty states for tables with no data
- Responsive design (mobile, tablet, desktop)
- Tamil language support if possible (UTF-8 strings from API)

### Error Handling
- Display API error messages to user
- Handle network timeouts gracefully
- Show validation errors inline on forms
- Log errors to console in dev mode
- Implement error boundary (optional)

---

## 📊 Data Structure Examples

### Admin Object
```json
{
  "id": "861fec38-195a-482e-82c4-dbd86660f195",
  "email": "admin@example.com",
  "first_name": "Admin",
  "last_name": "User",
  "status": "ACTIVE",
  "role": "super_admin",
  "profile_image_url": "https://...",
  "password_changed_at": "2026-02-28T10:30:00.000Z",
  "created_at": "2025-11-28T10:30:00.000Z"
}
```

### User Object
```json
{
  "id": "123e4567-...",
  "email": "user@example.com",
  "first_name": "பெயர்",
  "last_name": "பெயர்2",
  "phone": "+91-9876543210",
  "gender": "M",
  "date_of_birth": "1990-12-15",
  "profile_image_url": "https://...",
  "referral_code": "USER123ABC",
  "status": "ACTIVE"
}
```

### Event Object
```json
{
  "id": "f123e456-...",
  "function_name": "திருமணம்",
  "function_type": "marriage",
  "function_date": "2026-02-28",
  "function_place": "Chennai",
  "host_name": "பெயர்",
  "host_phone": "+91-9876543210",
  "budget": 500000,
  "status": "CONFIRMED",
  "created_at": "2026-02-28T10:30:00.000Z"
}
```

### Feedback Object
```json
{
  "id": "fb123e456-...",
  "user_id": "123e4567-...",
  "title": "App issue",
  "message": "விரிவான பின்னூட்டம்",
  "rating": 4,
  "status": "PENDING",
  "admin_response": null,
  "created_at": "2026-02-28T10:30:00.000Z"
}
```

---

## 🚀 Deliverables

Please generate:

1. **Project Structure** - Recommended folder organization
2. **API Service** - axios instance with interceptors and all endpoint methods
3. **Auth Context/Store** - Global state for authentication
4. **Custom Hooks** - useAuth(), useFetch(), usePagination(), useNotification()
5. **Reusable Components** - Navbar, Sidebar, Card, Table, Modal, Toast, Loading Spinner
6. **Pages/Routes** - All 9 pages listed above with full implementations
7. **Utility Functions** - Date formatter, currency formatter, request helpers
8. **package.json** - All required dependencies

**Preferences:**
- Use TypeScript for type safety
- Prefer functional components with hooks
- Use Material-UI (MUI) or Tailwind for styling
- Implement proper error boundaries
- Add loading states to all async operations
- Include commented explanations

---

## 🎓 Backend API Notes

- **Date Handling:** API automatically converts DD-MMM-YYYY → YYYY-MM-DD
- **File Upload:** Use multipart/form-data with field name `profile_image`
- **Pagination:** Query params are `limit` and `offset`
- **Soft Deletes:** Deleted items have `is_deleted=1` and `deleted_at` timestamp
- **Tamil Support:** All user inputs/outputs are UTF-8 encoded
- **Status Codes:** 200/201 = success, 400/401/403 = client error, 500 = server error
- **Response Format:** Always wrapped in `{ responseType: "S"/"F", responseValue: {...} }`

---

## ✅ Testing Checklist for Generated Code

- [ ] Login works with correct email/password
- [ ] Logout clears token and redirects to login
- [ ] All table pages load with pagination
- [ ] Create/Edit/Delete operations work with success messages
- [ ] File uploads work with proper error handling
- [ ] Forms validate before submission
- [ ] Date inputs accept DD-MMM-YYYY format
- [ ] Charts display data correctly
- [ ] Session timeout (token expiry) redirects to login
- [ ] Error messages display when API fails
- [ ] Mobile responsive layout works
- [ ] Tamil characters display correctly

---

**Start coding now. Generate a fully functional React admin dashboard that can immediately consume the MOI backend API.**
