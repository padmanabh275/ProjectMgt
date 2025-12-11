# Quick Login Test - Run This Now!

## Open Browser Console

Press **F12** → Go to **Console** tab

## Copy and Paste This:

```javascript
fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'master@admin.com', password: 'admin123' })
})
  .then(r => r.json())
  .then(data => {
    console.log('Result:', data);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      console.log('✅ SUCCESS! Refreshing page...');
      window.location.href = '/';
    }
  })
  .catch(e => console.error('Error:', e));
```

## What to Look For:

1. **If it works:** You'll see the response and be redirected
   - Means backend is fine, React component has an issue

2. **If it fails:** Check the error message
   - Tells us what's wrong

## This Will:
- ✅ Test login directly
- ✅ Save token
- ✅ Log you in
- ✅ Redirect you to the app

**Run this and tell me what happens!**

