# Check Your .env File

Since you already have a `.env` file, let's verify it's configured correctly.

## 🔍 Step 1: Run the Diagnostic Script

I've created a diagnostic tool to check your MongoDB connection. Run this:

```powershell
npm run check-mongodb
```

This will:
- ✅ Check if `.env` file is being read
- ✅ Verify `MONGODB_URI` is set
- ✅ Show connection details (password hidden)
- ✅ Test the connection
- ✅ Give specific troubleshooting steps

---

## 📋 Step 2: Verify Your .env File Contents

**Open your `.env` file** and make sure it has these lines:

### For Local MongoDB:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

### For MongoDB Atlas (Cloud):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

---

## ⚠️ Common Issues

### Issue 1: Wrong Connection String Format

**For Local MongoDB, it should be:**
```
mongodb://localhost:27017/taskmanagement
```

**For Atlas, it should be:**
```
mongodb+srv://username:password@cluster.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
```

### Issue 2: Missing Database Name

Make sure `/taskmanagement` is included:
- ❌ `mongodb://localhost:27017`
- ✅ `mongodb://localhost:27017/taskmanagement`

### Issue 3: Special Characters in Password

If your MongoDB password has special characters, you need to URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |

**Example:**
- Password: `P@ssw0rd#123`
- Encoded: `P%40ssw0rd%23123`

### Issue 4: Spaces or Quotes

**Don't use quotes around values:**
- ❌ `MONGODB_URI="mongodb://..."` 
- ✅ `MONGODB_URI=mongodb://...`

**No spaces around `=` sign:**
- ❌ `MONGODB_URI = mongodb://...`
- ✅ `MONGODB_URI=mongodb://...`

---

## 🔧 Quick Fixes

### If Using Local MongoDB:

1. **Check if MongoDB is running:**
   ```powershell
   # Open PowerShell as Administrator
   Get-Service MongoDB
   ```

2. **Start MongoDB if it's stopped:**
   ```powershell
   net start MongoDB
   ```

3. **Verify your .env has:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   ```

### If Using MongoDB Atlas:

1. **Check your connection string:**
   - Go to Atlas dashboard
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string

2. **Update your .env:**
   - Replace `<password>` with your actual password
   - Add `/taskmanagement` before the `?`
   - Make sure password is URL-encoded if needed

3. **Check Network Access:**
   - Go to "Network Access" in Atlas
   - Make sure your IP is allowed (or "Allow from anywhere")

---

## ✅ Next Steps

1. **Run the diagnostic:**
   ```powershell
   npm run check-mongodb
   ```

2. **Check the output:**
   - If it says "✅ SUCCESS!" → You're good to go!
   - If it says "❌ FAILED" → Follow the troubleshooting steps shown

3. **If still having issues:**
   - Check which type of MongoDB you're using (local or Atlas)
   - See `QUICK_FIX_MONGODB.md` for step-by-step setup
   - See `FIX_MONGODB_CONNECTION.md` for detailed troubleshooting

---

## 📝 What to Check

- [ ] `.env` file exists in project root
- [ ] `MONGODB_URI` is set correctly
- [ ] No spaces around `=` sign
- [ ] No quotes around values
- [ ] Database name (`taskmanagement`) is included
- [ ] Password is correct (and URL-encoded if needed)
- [ ] MongoDB service is running (if local)
- [ ] Network access is allowed (if Atlas)

---

**Run `npm run check-mongodb` now to see what's wrong!** 🔍

