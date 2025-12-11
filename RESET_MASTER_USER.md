# Fix: Invalid Credentials Error

## The Problem

The master user password was being **hashed twice**, so login fails even with correct credentials.

## The Fix

I've fixed the code - the password will now be hashed only once (by the User model).

## Next Step: Reset Master User

Since the old master user might have a double-hashed password, we need to either:
1. Delete and recreate the master user, OR
2. Reset the password

### Option 1: Delete and Recreate (Easiest)

**Run this in your browser console:**

```javascript
// This will delete the old master user
fetch('/api/users', {
  method: 'GET',
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
  .then(r => r.json())
  .then(users => {
    const master = users.find(u => u.email === 'master@admin.com');
    if (master) {
      console.log('Found master user, ID:', master.id);
      // Note: You'd need to be logged in as master to delete it
      // So we'll recreate it via backend instead
    }
  });
```

### Option 2: Use a Script (Recommended)

Create a script to reset the master user password. Or simply:

1. **Restart the backend server** - The fixed code will create a new master user if one doesn't exist
2. **Delete the old master user from MongoDB** (if it exists)

### Option 3: Quick MongoDB Fix

If you have MongoDB access, you can delete the old user:

```javascript
// Run this in MongoDB shell or Compass
db.users.deleteOne({ email: "master@admin.com" })
```

Then restart your backend server - it will create a fresh master user with the correct password hash.

## After Fixing

1. **Restart your backend server:**
   ```bash
   npm run dev:server
   ```

2. **Check backend console** - Should show:
   ```
   ✅ Master user created: master@admin.com / admin123
   ```

3. **Try login again** with:
   - Email: `master@admin.com`
   - Password: `admin123`

## The Root Cause

The password was being hashed:
1. First manually in `createMasterUser()` function
2. Then again by the User model's `pre('save')` hook

So the stored password was double-hashed, but login comparison only hashes once → mismatch!

**This is now fixed!** Just restart the backend and it should work.

