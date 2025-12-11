# Troubleshooting Login Issues

## Problem: Can't Move Beyond Login Page

If you're stuck on the login page, try these steps:

### 1. Check Backend Server is Running

**Open your terminal and verify:**
```bash
# Backend should show:
✅ Connected to MongoDB
✅ Master user created: master@admin.com / admin123
🚀 Server running on port 5000
```

**If not running, start it:**
```bash
npm run dev:server
```

### 2. Check Browser Console

**Open browser DevTools (F12) and check Console tab for errors:**

Common errors:
- `Network Error` or `CORS Error` → Backend not running or CORS issue
- `401 Unauthorized` → Wrong credentials
- `Failed to fetch` → Backend not accessible
- `404 Not Found` → Wrong API URL

### 3. Verify Login Credentials

**Default Master Account:**
- Email: `master@admin.com`
- Password: `admin123`

**Check:**
- No extra spaces in email/password
- Exact spelling (case-sensitive)
- Password is: `admin123` (all lowercase, no spaces)

### 4. Check API Connection

**Test if backend is accessible:**

Open browser and go to:
```
http://localhost:5000/api/auth/me
```

If you see an error page → Backend is not running or wrong port

### 5. Check Network Tab

1. Open browser DevTools (F12)
2. Go to **Network** tab
3. Try logging in
4. Look for a request to `/api/auth/login`
5. Check:
   - Status: Should be `200` (success) or `401` (wrong credentials)
   - Response: Should show `{token: "...", user: {...}}`

### 6. Clear Browser Storage

**Sometimes old tokens cause issues:**

1. Open DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. Delete `token` and `user` entries
5. Refresh page and try logging in again

### 7. Check CORS Configuration

If you see CORS errors, check `server/index.js` has:
```javascript
app.use(cors());
```

### 8. Verify Environment Variables

**Check your `.env` file exists and has:**
```env
PORT=5000
MONGODB_URI=your-mongodb-uri
JWT_SECRET=your-secret-key
```

### 9. Check MongoDB Connection

**Backend console should show:**
```
✅ Connected to MongoDB
```

If you see MongoDB errors, check:
- MongoDB is running (for local) or connection string is correct (for Atlas)
- Network access is configured (for Atlas)

### 10. Check Frontend API URL

**Open browser console and check:**
```javascript
// Should show the API URL being used
console.log('API URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
```

---

## Quick Diagnostic Checklist

- [ ] Backend server is running on port 5000
- [ ] MongoDB is connected (see backend console)
- [ ] Using correct credentials: `master@admin.com` / `admin123`
- [ ] No errors in browser console
- [ ] Network request to `/api/auth/login` shows in Network tab
- [ ] LocalStorage is cleared (old tokens removed)
- [ ] Both frontend and backend terminals are running

---

## Common Error Messages

### "Invalid credentials"
- ✅ Check email: `master@admin.com`
- ✅ Check password: `admin123`
- ✅ No extra spaces

### "Network Error" or "Failed to fetch"
- ✅ Backend not running → Start with `npm run dev:server`
- ✅ Wrong port → Check backend is on port 5000
- ✅ CORS issue → Check `cors()` middleware in server

### "Server error during login"
- ✅ Check MongoDB is connected
- ✅ Check backend console for detailed error

### Login succeeds but redirects back to login
- ✅ Check browser console for errors
- ✅ Clear localStorage and try again
- ✅ Check ProtectedRoute is working correctly

---

## Still Not Working?

1. **Check both terminals:**
   - Backend terminal (should show server running)
   - Frontend terminal (should show Vite dev server)

2. **Restart both:**
   ```bash
   # Stop both (Ctrl+C)
   # Then restart:
   npm run dev
   ```

3. **Check logs:**
   - Backend console for server errors
   - Browser console (F12) for frontend errors
   - Network tab for API request/response

4. **Try incognito/private window:**
   - Rules out browser extension issues
   - Clears all cached data

---

## Getting Help

If still stuck, provide:
1. Browser console errors (screenshot or copy)
2. Backend console output (screenshot or copy)
3. Network tab showing the login request (screenshot)
4. What happens when you click login (any errors?)

