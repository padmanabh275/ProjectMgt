# Fix: Team Members Filtering for Company Tasks

## Issue
When an admin assigns a task to someone in their company, only users from that specific company should be displayed in the dropdown - no master user, only company team members.

## Solution

### Backend Changes (`server/routes/users.js`)

1. **Exclude Master User for Admins and Regular Users**:
   - Added filter to exclude master user (`filter.role = { $ne: 'master' }`) when admin or regular user requests team members
   - Master user is only included when the requester is a master themselves

2. **Company-Specific Filtering**:
   - When `companyId` is provided, API returns only users from that company
   - Admin users can only see users from their assigned company

### Frontend Changes (`src/components/TaskForm.jsx`)

1. **Role-Based Filtering**:
   - **For Admins**: Only shows users from the specific company (excludes master)
   - **For Master Users**: Shows master user + all company users
   - **For Regular Users**: Only shows users from their company

2. **Display Logic**:
   - Team members are sorted by role (Admin first, then Users)
   - Role badges shown: (Admin) for admin users

## How It Works

### Admin User Flow:
1. Admin clicks "Add Task" in their company
2. System fetches users with `companyId` parameter
3. Backend filters: Only active users from that company, excluding master
4. Dropdown shows: Company admin + all company users (no master)

### Master User Flow:
1. Master clicks "Add Task" in any company
2. System fetches users with `companyId` parameter  
3. Backend filters: All active users from that company + master user
4. Dropdown shows: Master user + company admin + all company users

## API Endpoints

### Get Team Members:
```
GET /api/users?companyId={companyId}&teamMembers=true
```

**Response for Admin:**
```json
[
  {
    "_id": "...",
    "name": "Company Admin",
    "email": "admin@company.com",
    "role": "admin",
    "companyId": "{companyId}"
  },
  {
    "_id": "...",
    "name": "Team Member 1",
    "email": "member1@company.com",
    "role": "user",
    "companyId": "{companyId}"
  }
]
```

**Response for Master:**
```json
[
  {
    "_id": "...",
    "name": "Master Admin",
    "email": "master@admin.com",
    "role": "master",
    "companyId": null
  },
  {
    "_id": "...",
    "name": "Company Admin",
    "email": "admin@company.com",
    "role": "admin",
    "companyId": "{companyId}"
  },
  {
    "_id": "...",
    "name": "Team Member 1",
    "email": "member1@company.com",
    "role": "user",
    "companyId": "{companyId}"
  }
]
```

## Security

✅ **Admin users** can only see and assign tasks to users in their company
✅ **Master user** is excluded from admin's team member list
✅ **Company isolation** - users from different companies are not visible
✅ **Role-based filtering** ensures proper access control

## Summary

- ✅ Admins see only their company's team members (no master)
- ✅ Master users see master + company team members
- ✅ Regular users see only their company's team members
- ✅ Proper company isolation and filtering

All changes are implemented and ready to use! 🎉

