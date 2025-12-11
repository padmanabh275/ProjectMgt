# Task Comments & Delete Restrictions

## Features Implemented

### 1. Delete Task Restriction
- ✅ **Regular users** cannot delete tasks
- ✅ **Admin users** can delete tasks in their company
- ✅ **Master users** can delete any task
- ✅ Delete button is hidden from regular users in the UI

### 2. Comments Section
- ✅ Added `comments` field to Task model
- ✅ Users can add/edit comments on tasks assigned to them
- ✅ Admin/Master can see all comments on all tasks
- ✅ Comments are visible to Admin/Master for review
- ✅ Clean UI with edit/save/cancel functionality

## Implementation Details

### Backend Changes

#### Task Model (`server/models/Task.js`)
- Added `comments` field (String, optional, defaults to empty string)

#### Task Routes (`server/routes/tasks.js`)
- **DELETE Route**: Restricted to Admin/Master only
  - Regular users get 403 error: "You do not have permission to delete tasks"
- **PUT Route**: 
  - Regular users can only update: `status` and `comments`
  - Admin/Master can update: `taskName`, `assignedTo`, `deadline`, `status`, `comments`
  - Added validation for comments field

### Frontend Changes

#### TaskCard Component (`src/components/TaskCard.jsx`)
- **Delete Button**: Only shown for Admin/Master users
- **Comments Section**:
  - Visible to all users (Master, Admin, Regular)
  - Regular users can only edit comments on tasks assigned to them
  - Admin/Master can edit comments on any task
  - Shows "Add Comment" button if no comments exist
  - Shows "Edit" button if comments exist
  - Textarea for editing with Save/Cancel buttons
  - Displays existing comments in a styled box

## User Experience

### Regular User:
1. Views tasks assigned to them
2. Can update task status
3. Can add/edit comments on their assigned tasks
4. **Cannot delete tasks** (delete button hidden)
5. Comments are visible with label "(For Admin)"

### Admin User:
1. Views all tasks in their company
2. Can update all task fields
3. Can add/edit comments on any task in their company
4. Can delete tasks in their company
5. Can see all user comments
6. Comments are visible with label "(Visible to Admin)"

### Master User:
1. Views all tasks across all companies
2. Can update all task fields
3. Can add/edit comments on any task
4. Can delete any task
5. Can see all user comments
6. Comments are visible with label "(Visible to Admin)"

## API Endpoints

### Update Task (with comments)
```javascript
PUT /api/tasks/:id
{
  "status": "In Progress",
  "comments": "Working on this task. Need clarification on requirements."
}
```

**Response:**
- Regular users: Can only update `status` and `comments`
- Admin/Master: Can update all fields including `comments`

### Delete Task
```javascript
DELETE /api/tasks/:id
```

**Response:**
- Regular users: 403 Forbidden - "You do not have permission to delete tasks"
- Admin/Master: Success - Task deleted

## UI Features

### Comments Section:
- 📝 **Icon**: MessageSquare icon
- ✏️ **Edit Button**: Appears when not editing
- 💾 **Save Button**: Saves comments to database
- ❌ **Cancel Button**: Discards changes
- 📄 **Display**: Shows comments in a styled box with placeholder if empty

### Delete Button:
- 🗑️ **Hidden**: For regular users
- ✅ **Visible**: For Admin/Master users
- ⚠️ **Confirmation**: Asks for confirmation before deleting

## Security

✅ **Delete Protection**: Regular users cannot delete tasks at API level
✅ **Comments Access**: Users can only edit comments on their assigned tasks
✅ **Admin Visibility**: All comments are visible to Admin/Master
✅ **Role-Based UI**: UI adapts based on user role

## Database Schema

```javascript
Task {
  taskName: String,
  assignedTo: String,
  deadline: Date,
  status: String,
  companyId: ObjectId,
  departmentId: ObjectId,
  createdBy: ObjectId,
  comments: String,  // ✅ NEW FIELD
  createdAt: Date,
  updatedAt: Date
}
```

## Summary

- ✅ Regular users cannot delete tasks
- ✅ Comments section added to tasks
- ✅ Users can add/edit comments on their assigned tasks
- ✅ Admin/Master can see all comments
- ✅ Clean, intuitive UI
- ✅ Secure backend validation

All features are implemented and ready to use! 🎉

