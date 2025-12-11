# Fix: Cannot GET /api/auth/login%60

## The Problem

You're seeing: `Cannot GET /api/auth/login%60`

This means:
- ❌ Request is GET (should be POST)
- ❌ URL has `%60` (backtick character) at the end
- ❌ Backend is receiving the request but rejecting it

## Root Cause

The issue is likely that:
1. The form is submitting as a normal GET request instead of using axios
2. Or there's a typo/character issue in the URL

## Solution

### Step 1: Check Browser Console

Open browser console (F12) and check for JavaScript errors. The login should use axios, not form submission.

### Step 2: Verify API Base URL

The API should use `/api` (which proxies to backend) or full URL.

### Step 3: Check if Backend is Running

Make sure backend is on port 5000:
```bash
npm run dev:server
```

### Step 4: Test Login Directly

Open browser console (F12) and run:

```javascript
// Test the login API directly
fetch('/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    email: 'master@admin.com',
    password: 'admin123'
  })
})
  .then(response => {
    console.log('Status:', response.status);
    return response.json();
  })
  .then(data => {
    console.log('Response:', data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ Login successful! Token saved.');
      window.location.href = '/';
    }
  })
  .catch(error => {
    console.error('Error:', error);
  });
```

If this works, the issue is in the React component. If not, it's a backend/network issue.

## Quick Fix

The `%60` suggests there might be a character encoding issue. Try:

1. **Clear browser cache and localStorage:**
   ```javascript
   localStorage.clear();
   location.reload();
   ```

2. **Restart both servers:**
   - Stop both (Ctrl+C)
   - Start backend: `npm run dev:server`
   - Start frontend: `npm run dev:client` (or `npm run dev`)

3. **Check Network tab** when clicking login to see the actual request being made

