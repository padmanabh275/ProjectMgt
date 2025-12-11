# Login Troubleshooting Guide

## Quick Steps to Diagnose

### Step 1: Check Backend is Running
1. Look at your backend terminal
2. You should see:
   ```
   ✅ Connected to MongoDB
   ✅ Master user created: master@admin.com / admin123
   🚀 Server running on port 5000
   ```

### Step 2: Open Browser Console
1. Press **F12** (or right-click → Inspect)
2. Go to **Console** tab
3. Try logging in
4. Look for any red error messages

### Step 3: Check What Happens

**What happens when you click "Sign In"?**

#### Option A: Nothing happens / Button stays "Signing in..."
- **Cause:** API call is hanging or failing
- **Fix:** Check if backend is running on port 5000

#### Option B: Error message appears on login page
- **Good!** This tells you what's wrong
- Check the error message:
  - "Invalid credentials" → Wrong email/password
  - "Network Error" → Backend not running
  - "Failed to fetch" → Connection issue

#### Option C: Redirects to login page immediately
- **Cause:** Authentication state not updating
- **Fix:** Check browser console for errors

#### Option D: Shows "Loading..." forever
- **Cause:** Auth check is stuck
- **Fix:** Clear localStorage and refresh

---

## Common Issues & Solutions

### Issue 1: "Network Error" or "Failed to fetch"

**Problem:** Frontend can't reach backend

**Solutions:**
1. ✅ Check backend is running: `npm run dev:server`
2. ✅ Verify backend is on port 5000
3. ✅ Check browser console for CORS errors
4. ✅ Try opening: http://localhost:5000/api/auth/me (should show error, not "can't connect")

### Issue 2: "Invalid credentials"

**Problem:** Wrong email/password

**Solutions:**
1. ✅ Email: `master@admin.com` (exact, no spaces)
2. ✅ Password: `admin123` (all lowercase, no spaces)
3. ✅ Check for typos
4. ✅ Try typing password in a text editor first, then copy/paste

### Issue 3: Login succeeds but redirects back

**Problem:** Auth state not persisting

**Solutions:**
1. ✅ Open DevTools → Application → Local Storage
2. ✅ Check if `token` and `user` are saved
3. ✅ If not saved → Check browser console for errors
4. ✅ Clear localStorage and try again:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### Issue 4: Nothing happens when clicking login

**Problem:** JavaScript error or API not accessible

**Solutions:**
1. ✅ Check browser console (F12) for errors
2. ✅ Check Network tab - is request being made?
3. ✅ Check backend terminal for errors
4. ✅ Restart both frontend and backend

---

## Quick Diagnostic Test

**Open browser console (F12) and paste this:**

```javascript
// Test 1: Check if backend is accessible
fetch('http://localhost:5000/api/auth/me')
  .then(r => console.log('Backend accessible:', r.status))
  .catch(e => console.error('Backend NOT accessible:', e.message));

// Test 2: Check localStorage
console.log('Token:', localStorage.getItem('token'));
console.log('User:', localStorage.getItem('user'));

// Test 3: Try login API directly
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'master@admin.com', password: 'admin123' })
})
  .then(r => r.json())
  .then(data => console.log('Login test:', data))
  .catch(e => console.error('Login test failed:', e));
```

**Run these and share the output!**

---

## Step-by-Step Debugging

### 1. Verify Backend
```bash
# Terminal 1: Start backend
npm run dev:server
```

Should see:
- ✅ Connected to MongoDB
- 🚀 Server running on port 5000

### 2. Verify Frontend
```bash
# Terminal 2: Start frontend
npm run dev:client
```

Should open: http://localhost:3000

### 3. Check Browser
1. Open http://localhost:3000
2. Press F12 (DevTools)
3. Go to Console tab
4. Try logging in
5. Check for errors

### 4. Check Network Request
1. In DevTools, go to **Network** tab
2. Try logging in
3. Look for request to `/api/auth/login`
4. Click on it to see:
   - Status code (200 = success, 401 = wrong password, etc.)
   - Response body (should have token and user)

---

## Still Stuck?

**Share this information:**

1. **Backend terminal output** (screenshot or copy)
2. **Browser console errors** (screenshot or copy)
3. **Network tab** showing the login request (screenshot)
4. **What happens** when you click login
5. **Error message** (if any)

---

## Quick Fixes to Try

### Fix 1: Clear Everything
```javascript
// In browser console (F12):
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Fix 2: Restart Everything
1. Stop both terminals (Ctrl+C)
2. Start backend: `npm run dev:server`
3. Start frontend: `npm run dev:client` (or new terminal)
4. Clear browser cache (Ctrl+Shift+Delete)
5. Try again

### Fix 3: Check Credentials
Make sure you're using:
- Email: `master@admin.com`
- Password: `admin123`

No quotes, no spaces, exact spelling.

---

## Success Indicators

When login works, you should see:
1. ✅ Login page disappears
2. ✅ Company list page appears
3. ✅ Header shows your name and "master" role
4. ✅ No errors in console
5. ✅ localStorage has `token` and `user` entries

