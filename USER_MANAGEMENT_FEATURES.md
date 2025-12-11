# User Management Features - Master Users & Password Change

## ✅ New Features Added

### 1. Create Master Admin Users

**What's New:**
- Master users can now create other master users
- Master role option appears in the role dropdown (only for master users)
- Backend validates that only master users can create other master users

**How to Use:**
1. Log in as a master user
2. Go to "Users" page
3. Click "Add User"
4. Select "Master" from the Role dropdown
5. Fill in user details and create

**Backend Protection:**
- Only master users can create master users
- Non-master users cannot create master users (will get 403 error)
- Role validation ensures security

---

### 2. Change Password Feature

**What's New:**
- Dedicated password change page
- Users can change their own password
- Master/Admin can change passwords without current password
- Regular users need to provide current password

**How to Use:**

#### For Regular Users:
1. Click "Change Password" in the header menu
2. Enter your current password
3. Enter new password (min 6 characters)
4. Confirm new password
5. Click "Change Password"

#### For Master/Admin Users:
1. Click "Change Password" in the header menu
2. Enter new password (current password not required)
3. Confirm new password
4. Click "Change Password"

**Security Features:**
- Password must be at least 6 characters
- Current password required for regular users
- Password confirmation validation
- Show/hide password toggle

---

### 3. Enhanced User Management

**Password Change When Editing Users:**
- When editing a user in User Management, you can change their password
- Leave password field blank to keep current password
- Enter new password to change it

---

## 📁 Files Modified

### Backend:
1. `server/routes/users.js`
   - Added master role validation in user creation
   - Added password change endpoint: `PUT /api/users/:id/password`
   - Enhanced role update permissions

### Frontend:
1. `src/components/UserManagement.jsx`
   - Added "Master" role option in dropdown (for master users)
   - Enhanced password field with better hints

2. `src/components/PasswordChange.jsx` (NEW)
   - Complete password change component
   - Form validation
   - Success/error handling

3. `src/components/PasswordChange.css` (NEW)
   - Styled password change form
   - Modern UI matching app design

4. `src/App.jsx`
   - Added PasswordChange route
   - Added "Change Password" link in header

5. `src/App.css`
   - Styled "Change Password" button in header

6. `src/services/api.js`
   - Added `changePassword` method to usersAPI

---

## 🎯 Features

### Role Management:
- ✅ Master users can create other master users
- ✅ Master users can create admin users
- ✅ Admin users can create regular users (for their company)
- ✅ Role-based permissions enforced

### Password Management:
- ✅ Users can change their own password
- ✅ Master/Admin can change any user's password (via User Management)
- ✅ Current password required for regular users
- ✅ Password validation (min 6 characters)
- ✅ Password confirmation
- ✅ Show/hide password toggle

---

## 🔒 Security

- Only master users can create master users
- Current password required when users change their own password
- Master/Admin can change passwords without current password (for admin purposes)
- Password validation on frontend and backend
- Secure password hashing using bcrypt

---

## 📝 API Endpoints

### Change Password
```
PUT /api/users/:id/password
Body:
{
  "currentPassword": "oldpassword",  // Required for regular users
  "newPassword": "newpassword"       // Required, min 6 chars
}
```

### Create User (with master role)
```
POST /api/users
Body:
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "master",  // Only master users can use this
  "companyId": "optional"
}
```

---

## ✅ Testing Checklist

- [ ] Master user can create other master users
- [ ] Master user can create admin users
- [ ] Master user can create regular users
- [ ] Admin user cannot create master users
- [ ] Regular user can change own password
- [ ] Master/Admin can change password without current password
- [ ] Password validation works (min 6 chars)
- [ ] Password confirmation validation works
- [ ] Show/hide password toggle works
- [ ] Password change via User Management works

---

**All features are now ready to use!** 🎉

