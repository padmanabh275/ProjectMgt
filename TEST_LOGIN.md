# Test Login - Quick Fix

## The Error

`Cannot GET /api/auth/login%60`

- ❌ GET request (should be POST)
- ❌ `%60` = backtick character in URL

## Quick Test

**Open browser console (F12) and paste this:**

```javascript
// Test login API directly
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
    console.log('✅ Response:', data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ Token saved! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
    }
  })
  .catch(error => {
    console.error('❌ Error:', error);
  });
```

## What This Will Do

1. ✅ Test if backend is accessible
2. ✅ Test login API directly
3. ✅ Save token if successful
4. ✅ Redirect to home page

## If This Works

If the test works, the issue is in the React component. The API itself is fine.

## If This Fails

If it fails, check:
1. Backend is running on port 5000
2. MongoDB is connected
3. No CORS errors in console

