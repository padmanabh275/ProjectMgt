# Quick MongoDB Setup

## 🎯 Choose Your Option

### ⭐ Option A: MongoDB Atlas (Cloud) - Easiest!
**Recommended if you want to get started quickly**

✅ No installation needed  
✅ Free tier available  
✅ Works immediately  
✅ No local setup required

### Option B: Local MongoDB
**Good if you want to run everything locally**

⚠️ Requires installation  
⚠️ Needs to run as a service  
✅ Works offline  
✅ Full control

---

## 🚀 Quick Start: MongoDB Atlas (5 minutes)

### Step 1: Create Account (2 min)
1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up with your email
3. Verify email if needed

### Step 2: Create Free Cluster (1 min)
1. Click **"Build a Database"**
2. Choose **FREE** tier (M0)
3. Select region closest to you
4. Click **"Create Cluster"**

### Step 3: Create User (1 min)
1. Click **"Database Access"** in left menu
2. Click **"Add New Database User"**
3. Enter:
   - Username: `admin` (or anything)
   - Password: Create a strong password ⚠️ **SAVE THIS!**
4. Role: **Atlas Admin**
5. Click **"Add User"**

### Step 4: Allow Network Access (30 sec)
1. Click **"Network Access"** in left menu
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"**
4. Click **"Confirm"**

### Step 5: Get Connection String (30 sec)
1. Go back to **"Database"** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Select **Node.js** driver
4. **Copy the connection string**

It looks like:
```
mongodb+srv://admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### Step 6: Create .env File (1 min)

**Create a file named `.env` in your project root** with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `YOUR_PASSWORD` with your actual password
- `cluster0.xxxxx.mongodb.net` with your actual cluster URL
- Add `/taskmanagement` before the `?` (this is your database name)

### ✅ Done! Test It:
```bash
npm run dev:server
```

You should see:
```
✅ Connected to MongoDB
✅ Master user created: master@admin.com / admin123
🚀 Server running on port 5000
```

---

## 🖥️ Local MongoDB Setup (10 minutes)

### Step 1: Download (2 min)
1. Go to: https://www.mongodb.com/try/download/community
2. Select:
   - Version: Latest
   - Platform: Windows
   - Package: MSI
3. Click **Download**

### Step 2: Install (5 min)
1. Run the downloaded `.msi` file
2. Choose **Complete** installation
3. ✅ Check **Install MongoDB as a Service**
4. ✅ Check **Install MongoDB Compass** (optional GUI)
5. Click **Install**
6. Wait for completion

### Step 3: Verify (1 min)
Open PowerShell/Command Prompt (as Admin) and run:
```powershell
net start MongoDB
```

You should see: "The MongoDB Server service was started successfully."

### Step 4: Create .env File (1 min)

**Create a file named `.env` in your project root** with:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

### Step 5: Start MongoDB Service (1 min)
If not already running:
```powershell
# Run as Administrator
net start MongoDB
```

### ✅ Done! Test It:
```bash
npm run dev:server
```

You should see:
```
✅ Connected to MongoDB
✅ Master user created: master@admin.com / admin123
🚀 Server running on port 5000
```

---

## 🐛 Troubleshooting

### Connection Error?
- **Atlas:** Check Network Access allows your IP
- **Local:** Check MongoDB service is running (`net start MongoDB`)
- **Both:** Verify `.env` file has correct `MONGODB_URI`

### "Cannot find module" Error?
Run:
```bash
npm install
```

### Port Already in Use?
Change port in `.env`:
```env
PORT=5001
```

---

## 🎉 You're Ready!

Once you see:
```
✅ Connected to MongoDB
🚀 Server running on port 5000
```

1. Open another terminal
2. Run: `npm run dev:client`
3. Open: http://localhost:3000
4. Login: `master@admin.com` / `admin123`

**Start creating companies and tasks!** 🚀

