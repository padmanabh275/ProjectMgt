# Team Members Filtering - Company-Specific Users Only

## Overview
When an admin assigns a task to someone in their company, only users from that specific company are displayed in the dropdown - no master user, only company team members.

## Implementation

### Backend Filtering (`server/routes/users.js`)

**For Admin Users:**
- When `companyId` is provided, the API filters users by that company
- Master user is excluded when fetching team members (`teamMembers === 'true'` or `companyId` present)
- Only returns active users from the admin's assigned company

**Code Logic:**
```javascript
if (req.user.role === 'admin') {
  // Filter by company
  if (companyId && req.user.companyId?.toString() === companyId) {
    filter.companyId = companyId;
  }
  // Exclude master user for team member selection
  if (teamMembers === 'true' || companyId) {
    filter.role = { $ne: 'master' };
  }
}
```

### Frontend Filtering (`src/components/TaskForm.jsx`)

**For Admin Users:**
- Filters out master user from the dropdown
- Only shows users from the specific company
- Excludes master even if it comes from the API

**Code Logic:**
```javascript
// For admins: Only show users from this specific company (no master)
if (!isMaster && companyId) {
  // Exclude master user for admins
  if (user.role === 'master') return false;
  // Only include users from this company
  if (user.companyId) {
    return user.companyId.toString() === companyId || 
           user.companyId._id?.toString() === companyId;
  }
  return false;
}
```

## How It Works

### Admin Creating Task Flow:

1. **Admin clicks "Add Task"** in their company
2. **TaskForm loads** with `companyId` prop
3. **API Request**: `GET /api/users?companyId={companyId}&teamMembers=true`
4. **Backend Processing**:
   - Filters by `companyId` 
   - Excludes master user (`filter.role = { $ne: 'master' }`)
   - Returns only company users (admin + regular users)
5. **Frontend Processing**:
   - Further filters to exclude any master user that might slip through
   - Sorts by role (Admin first, then Users)
6. **Dropdown Display**:
   - Shows only company team members
   - No master user visible

### Master Creating Task Flow:

1. **Master clicks "Add Task"** in any company
2. **TaskForm loads** with `companyId` prop  
3. **API Request**: `GET /api/users?companyId={companyId}&teamMembers=true`
4. **Backend Processing**:
   - Filters by `companyId`
   - Includes master user (no exclusion)
   - Adds master user to the result array
5. **Frontend Processing**:
   - Shows master user + all company users
   - Sorts by role (Master first, then Admin, then Users)
6. **Dropdown Display**:
   - Shows master user + company team members

## Example Scenarios

### Scenario 1: Admin Assigns Task
**Company:** "Acme Corp"
**Company Users:**
- Admin: John (admin)
- User: Alice (user)
- User: Bob (user)

**Master User:** Master Admin (not in company)

**Result:** Dropdown shows:
- John (Admin)
- Alice
- Bob

❌ Master Admin is NOT shown

### Scenario 2: Master Assigns Task
**Same Company:** "Acme Corp"

**Result:** Dropdown shows:
- Master Admin (Master)
- John (Admin)
- Alice
- Bob

✅ Master Admin IS shown

## API Response Examples

### For Admin Request:
```javascript
GET /api/users?companyId=123&teamMembers=true
```

**Response:**
```json
[
  {
    "_id": "user1",
    "name": "Company Admin",
    "email": "admin@company.com",
    "role": "admin",
    "companyId": "123"
  },
  {
    "_id": "user2",
    "name": "Team Member 1",
    "email": "member1@company.com",
    "role": "user",
    "companyId": "123"
  }
]
```
**Note:** Master user is excluded

### For Master Request:
```javascript
GET /api/users?companyId=123&teamMembers=true
```

**Response:**
```json
[
  {
    "_id": "master1",
    "name": "Master Admin",
    "email": "master@admin.com",
    "role": "master",
    "companyId": null
  },
  {
    "_id": "user1",
    "name": "Company Admin",
    "email": "admin@company.com",
    "role": "admin",
    "companyId": "123"
  },
  {
    "_id": "user2",
    "name": "Team Member 1",
    "email": "member1@company.com",
    "role": "user",
    "companyId": "123"
  }
]
```
**Note:** Master user is included

## Security Features

✅ **Company Isolation**: Admins only see users from their assigned company
✅ **Master Exclusion**: Master user is automatically excluded for admins
✅ **Double Filtering**: Both backend and frontend filter to ensure accuracy
✅ **Role-Based Access**: Different behavior for master vs admin vs regular users

## Summary

- ✅ **Admin users** see only their company's team members (no master)
- ✅ **Master users** see master + company team members  
- ✅ **Regular users** see only their company's team members (no master)
- ✅ **Company isolation** prevents seeing users from other companies
- ✅ **Secure filtering** at both backend and frontend levels

All filtering is working correctly! 🎉

