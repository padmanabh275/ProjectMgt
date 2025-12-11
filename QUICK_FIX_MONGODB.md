# ⚡ Quick Fix: MongoDB Connection Timeout

## 🚨 Your Error
```
MongooseError: Operation `users.findOne()` buffering timed out after 10000ms
```

**This means MongoDB is NOT running or NOT accessible.**

---

## ✅ Fastest Solution: Use MongoDB Atlas (Cloud)

**No installation needed! Takes 5 minutes:**

### Step 1: Create Account (2 min)
👉 Go to: https://www.mongodb.com/cloud/atlas/register

### Step 2: Create Free Cluster (1 min)
1. Click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Click **"Create Cluster"**

### Step 3: Create User (1 min)
1. Click **"Database Access"**
2. **"Add New Database User"**
3. Enter username/password (save it!)
4. Role: **Atlas Admin**

### Step 4: Allow Network Access (30 sec)
1. Click **"Network Access"**
2. **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**

### Step 5: Get Connection String (1 min)
1. Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select **Node.js**
4. **Copy the connection string**

### Step 6: Update .env File

**Create `.env` file in project root:**

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `username` → Your MongoDB username
- `YOUR_PASSWORD` → Your MongoDB password
- Add `/taskmanagement` before the `?`

**Restart your server:** `npm run dev`

---

## 🔧 If Using Local MongoDB

### Check if MongoDB is Running:

```powershell
# Open PowerShell as Administrator
Get-Service MongoDB
```

### Start MongoDB:

```powershell
# As Administrator
net start MongoDB
```

### Or use Services:
1. Press `Win + R`
2. Type `services.msc`
3. Find **"MongoDB Server (MongoDB)"**
4. Right-click → **Start**

### Then verify in `.env`:
```env
MONGODB_URI=mongodb://localhost:27017/taskmanagement
```

---

## 🎯 Which Should You Use?

**Use MongoDB Atlas if:**
- ✅ You want the fastest setup
- ✅ You don't want to install anything
- ✅ You want it to "just work"
- ✅ You don't mind cloud (free tier available)

**Use Local MongoDB if:**
- ✅ You already have it installed
- ✅ You want offline access
- ✅ You prefer local setup

---

## 📋 Quick Checklist

**For Atlas:**
- [ ] Account created
- [ ] Cluster created
- [ ] Database user created
- [ ] Network access allowed
- [ ] Connection string copied
- [ ] `.env` file updated with connection string
- [ ] Server restarted

**For Local:**
- [ ] MongoDB installed
- [ ] MongoDB service running
- [ ] `.env` file has `mongodb://localhost:27017/taskmanagement`
- [ ] Server restarted

---

## 🔍 Verify It's Working

After fixing, restart your server and look for:

```
✅ Connected to MongoDB
📍 Database: taskmanagement
🔗 URI: mongodb://...
```

**If you see this, you're good to go!** 🎉

---

**Need more help?** See `FIX_MONGODB_CONNECTION.md` for detailed troubleshooting.

