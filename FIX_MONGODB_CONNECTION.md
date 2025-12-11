# Fix MongoDB Connection Timeout

## 🚨 Error You're Seeing

```
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```

This means MongoDB is **not running** or **not accessible**.

---

## ✅ Quick Fix Options

### Option 1: Check if MongoDB is Running (Local)

**On Windows:**

1. **Check MongoDB Service:**
   ```powershell
   # Open PowerShell as Administrator
   Get-Service MongoDB
   ```

2. **Start MongoDB Service:**
   ```powershell
   # As Administrator
   net start MongoDB
   ```

3. **Or use Services Manager:**
   - Press `Win + R`
   - Type `services.msc`
   - Find "MongoDB Server (MongoDB)"
   - Right-click → Start

### Option 2: Use MongoDB Atlas (Cloud) - Recommended

This is the easiest solution - no local installation needed!

#### Step 1: Create Account
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)

#### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose **FREE** tier (M0)
3. Select region closest to you
4. Click "Create Cluster"

#### Step 3: Create Database User
1. Click "Database Access" in left menu
2. Click "Add New Database User"
3. Enter username and password (save it!)
4. Role: **Atlas Admin**
5. Click "Add User"

#### Step 4: Allow Network Access
1. Click "Network Access" in left menu
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere"
4. Click "Confirm"

#### Step 5: Get Connection String
1. Go to "Database" → Click "Connect" on your cluster
2. Choose "Connect your application"
3. Select: Node.js, version 5.5+
4. Copy the connection string

It looks like:
```
mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

#### Step 6: Update .env File

**Create or update `.env` file in your project root:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Important:**
- Replace `username` with your MongoDB username
- Replace `YOUR_PASSWORD` with your MongoDB password
- Add `/taskmanagement` before the `?` (database name)
- Make sure there are no spaces in the connection string

---

## 🔍 Check Your Current Setup

### 1. Check if .env file exists

**In your project root, check:**
```powershell
# From project root directory
dir .env
```

If it doesn't exist, create it (see Step 6 above).

### 2. Check what MongoDB URI is being used

Look at your `.env` file and verify:
- `MONGODB_URI` is set correctly
- No extra spaces or quotes
- Password is correct (if using Atlas)

### 3. Test MongoDB Connection

**For Local MongoDB:**
```powershell
# Test if MongoDB is running
mongosh
# or
mongo
```

If this works, MongoDB is running locally.

**For MongoDB Atlas:**
- Check your Atlas dashboard
- Make sure cluster is running (not paused)
- Verify IP is allowed in Network Access

---

## 🛠️ Common Issues & Solutions

### Issue 1: Local MongoDB Not Installed

**Solution:** Use MongoDB Atlas (cloud) instead - no installation needed!

### Issue 2: MongoDB Service Not Running

**Solution:**
```powershell
# Start the service (as Administrator)
net start MongoDB
```

### Issue 3: Wrong Connection String

**Solution:** 
- Check your `.env` file
- Make sure password doesn't have special characters (or URL-encode them)
- Verify database name is correct

### Issue 4: Firewall Blocking Connection

**Solution:**
- For local: Check Windows Firewall
- For Atlas: Make sure IP is allowed in Network Access

---

## ⚡ Quick Commands

### Start MongoDB (Local):
```powershell
# As Administrator
net start MongoDB
```

### Stop MongoDB (Local):
```powershell
# As Administrator
net stop MongoDB
```

### Check MongoDB Status:
```powershell
Get-Service MongoDB
```

### Restart Your App:
```powershell
# Stop your current server (Ctrl+C)
# Then restart
npm run dev
```

---

## 📝 What I've Done

I've improved the server code to:
1. Better handle MongoDB connection errors
2. Prevent operations when MongoDB isn't connected
3. Show clearer error messages

The server will now show helpful messages instead of timing out.

---

## 🎯 Recommended Action

**For easiest setup, use MongoDB Atlas (cloud):**
1. Takes 5 minutes to set up
2. No local installation needed
3. Works immediately
4. Free tier available

**See detailed steps above in "Option 2: Use MongoDB Atlas"**

---

**Need help? Check which option applies:**
- ✅ Using Atlas → Check Network Access and connection string
- ✅ Using Local → Check if MongoDB service is running
- ❓ Not sure → Use Atlas (easier!)

