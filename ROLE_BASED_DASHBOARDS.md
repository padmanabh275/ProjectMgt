# Role-Based Dashboards & User Experience

## Overview

The application now provides separate, role-specific dashboards that automatically redirect users based on their role when they log in.

## User Roles & Their Dashboards

### 1. Master User
- **Dashboard**: Master Dashboard (shows all companies)
- **Route**: `/dashboard`
- **Access**: 
  - View all companies and their statistics
  - See all tasks across all companies
  - Manage users, companies, departments, and tasks
  - Access any company dashboard

**On Login**: Redirects to `/dashboard` (Master Dashboard)

### 2. Admin User (Assigned to a Company)
- **Dashboard**: Company Dashboard (their assigned company)
- **Route**: `/company/:companyId/dashboard`
- **Access**:
  - View their company's dashboard only
  - See all tasks in their company
  - Manage departments and tasks in their company
  - Manage users for their company
  - Cannot see other companies

**On Login**: Automatically redirects to `/company/{theirCompanyId}/dashboard`

### 3. Regular User
- **Dashboard**: Personal Tasks Dashboard (only their assigned tasks)
- **Route**: `/my-tasks`
- **Access**:
  - View only tasks assigned to them
  - See their company name
  - Cannot manage departments or see all company tasks
  - Cannot access other users' tasks

**On Login**: Automatically redirects to `/my-tasks` (Personal Dashboard)

## Features by Dashboard

### Master Dashboard (`/dashboard`)
- ✅ Overview of all companies
- ✅ Statistics for all companies combined
- ✅ Filter tasks by: Overdue, Due Today, Upcoming, Completed
- ✅ Company statistics cards with progress indicators
- ✅ Click any company card to view its detailed dashboard

### Company Dashboard (`/company/:companyId/dashboard`)
- ✅ Company-specific statistics
- ✅ Department overview with statistics
- ✅ Filter tasks by: Overdue, Due Today, Upcoming, Completed
- ✅ Progress tracking per department
- ✅ Quick links to manage departments and tasks

### User Dashboard (`/my-tasks`)
- ✅ Personal task statistics
- ✅ Only shows tasks assigned to the logged-in user
- ✅ Filter tasks by: Overdue, Due Today, Upcoming, Completed
- ✅ Company badge showing which company they belong to
- ✅ Link to view all company tasks (if needed)

## Automatic Redirects

### Login Redirects
When a user logs in, they are automatically redirected based on their role:

```javascript
Master → /dashboard
Admin → /company/{companyId}/dashboard
User → /my-tasks
```

### Route Protection
- **Master Dashboard (`/dashboard`)**: 
  - Only accessible by master users
  - Admins/Users automatically redirected to their appropriate dashboard
  
- **Company Dashboard (`/company/:companyId/dashboard`)**: 
  - Accessible by master (all companies)
  - Accessible by admin (their company only)
  - Regular users redirected to `/my-tasks`
  
- **User Dashboard (`/my-tasks`)**: 
  - Accessible by all authenticated users
  - Shows only tasks assigned to the logged-in user

### Company List (`/`)
- **Master**: Sees all companies (can manage)
- **Admin**: Automatically redirected to their company dashboard
- **User**: Automatically redirected to their personal dashboard

## Navigation Links

### Master User Header:
- Companies
- Dashboard
- Users

### Admin User Header:
- Dashboard (their company)
- Users

### Regular User Header:
- My Tasks

## File Structure

### New Components Created:
1. **UserDashboard.jsx** - Personal tasks dashboard for regular users
2. **UserDashboard.css** - Styling for user dashboard

### Updated Components:
1. **Dashboard.jsx** - Now redirects non-master users
2. **CompanyDashboard.jsx** - Added access control checks
3. **CompanyList.jsx** - Added role-based redirects
4. **Login.jsx** - Added role-based redirect after login
5. **App.jsx** - Added `/my-tasks` route and updated navigation

## API Endpoints Used

### User Dashboard:
- `GET /api/tasks?companyId=xxx` - Get all tasks for company
- `GET /api/companies/:id` - Get company info

### Company Dashboard:
- `GET /api/companies/:id` - Get company details
- `GET /api/departments?companyId=xxx` - Get departments
- `GET /api/tasks?companyId=xxx` - Get all company tasks

### Master Dashboard:
- `GET /api/tasks` - Get all tasks (all companies)
- `GET /api/companies` - Get all companies

## User Experience Flow

### Example 1: Regular User Login
1. User logs in with credentials
2. System detects role = "user"
3. Automatically redirects to `/my-tasks`
4. User sees only their assigned tasks
5. Navigation shows "My Tasks" link

### Example 2: Admin User Login
1. Admin logs in with credentials
2. System detects role = "admin" + companyId
3. Automatically redirects to `/company/{companyId}/dashboard`
4. Admin sees their company's dashboard
5. Can manage departments and tasks in their company

### Example 3: Master User Login
1. Master logs in with credentials
2. System detects role = "master"
3. Redirects to `/dashboard`
4. Master sees overview of all companies
5. Can access any company dashboard

## Security & Access Control

### Task Filtering:
- **Regular Users**: Only see tasks where `assignedTo` matches their name
- **Admin**: See all tasks in their company
- **Master**: See all tasks across all companies

### Company Access:
- **Regular Users**: Cannot access company details directly
- **Admin**: Can only access their assigned company
- **Master**: Can access all companies

### Dashboard Access:
- Each dashboard component checks user role and company assignment
- Unauthorized access attempts result in automatic redirect
- Users cannot bypass redirects by manually entering URLs

## Summary

✅ **Three separate dashboards** for different user roles
✅ **Automatic redirects** based on role after login
✅ **Role-based navigation** showing only relevant links
✅ **Secure access control** preventing unauthorized access
✅ **Filtered task views** showing only relevant tasks
✅ **Clean user experience** tailored to each role

All features are implemented and ready to use! 🎉

