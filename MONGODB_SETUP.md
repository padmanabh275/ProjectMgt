# MongoDB Setup Guide

## Quick Setup Options

You have two options for MongoDB:

1. **MongoDB Atlas (Cloud)** - ⭐ Recommended for beginners
   - Free tier available
   - No installation needed
   - Works immediately
   - Best for development

2. **Local MongoDB Installation**
   - Runs on your computer
   - Requires installation
   - Good for offline development

---

## Option 1: MongoDB Atlas (Cloud) - Recommended ⭐

### Step 1: Create Account
1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with email (free account)

### Step 2: Create Free Cluster
1. Click **"Build a Database"** or **"Create"**
2. Choose **"FREE"** tier (M0 Sandbox)
3. Select cloud provider and region (choose closest to you)
4. Name your cluster (or use default)
5. Click **"Create Cluster"**

### Step 3: Create Database User
1. Under **"Database Access"** in left sidebar
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter username and password (save these!)
   - Username: `taskadmin` (or your choice)
   - Password: Create a strong password (save it!)
5. Under **"Built-in Role"** select **"Atlas Admin"**
6. Click **"Add User"**

### Step 4: Configure Network Access
1. Under **"Network Access"** in left sidebar
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP for production
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Select driver: **"Node.js"**, version: **"5.5 or later"**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password
6. Add database name at the end:
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
   ```

### Step 6: Add to .env File
1. In your project root, create a file named `.env`
2. Add your connection string:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Done!** Your MongoDB is ready. Skip to "Testing Connection" below.

---

## Option 2: Local MongoDB Installation

### For Windows:

#### Step 1: Download MongoDB
1. Go to [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
2. Select:
   - Version: **Latest** (7.0 or 6.0)
   - Platform: **Windows**
   - Package: **MSI**
3. Click **"Download"**

#### Step 2: Install MongoDB
1. Run the downloaded `.msi` file
2. Choose **"Complete"** installation
3. Check **"Install MongoDB as a Service"**
4. Choose **"Run service as Network Service user"**
5. Check **"Install MongoDB Compass"** (optional GUI tool)
6. Click **"Install"**
7. Wait for installation to complete

#### Step 3: Verify Installation
1. Open Command Prompt or PowerShell as Administrator
2. Run:
   ```powershell
   mongod --version
   ```
   You should see MongoDB version info

#### Step 4: Start MongoDB Service
MongoDB should start automatically, but to verify:
1. Open **Services** (Windows key + R, type `services.msc`)
2. Find **"MongoDB Server"**
3. Right-click → **"Start"** (if not running)

Or use command prompt (as Administrator):
```powershell
net start MongoDB
```

#### Step 5: Create .env File
1. In your project root, create a file named `.env`
2. Add:

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Done!** Your local MongoDB is ready.

---

## Testing Your Connection

### Step 1: Create .env File
Make sure you have a `.env` file in your project root with the correct MongoDB URI.

### Step 2: Start the Server
```bash
npm run dev:server
```

### Step 3: Check Console Output
You should see:
```
✅ Connected to MongoDB
✅ Master user created: master@admin.com / admin123
🚀 Server running on port 5000
```

If you see an error:
- Check your `.env` file exists and has correct MongoDB URI
- For Atlas: Verify network access allows your IP
- For Local: Verify MongoDB service is running

### Step 4: Test Frontend
1. Open another terminal
2. Run: `npm run dev:client`
3. Open browser to `http://localhost:3000`
4. Login with: `master@admin.com` / `admin123`

---

## Troubleshooting

### MongoDB Atlas Connection Issues

**Error: "MongoServerError: Authentication failed"**
- Check username and password in connection string
- Verify user exists in Database Access

**Error: "MongoServerSelectionError: connection timed out"**
- Check Network Access allows your IP
- Try "Allow Access from Anywhere" for testing

**Error: "Invalid connection string"**
- Make sure password has no special characters (or URL-encode them)
- Check database name is in the connection string

### Local MongoDB Issues

**Error: "Cannot connect to MongoDB"**
- Check MongoDB service is running: `net start MongoDB`
- Verify port 27017 is not blocked by firewall
- Check MongoDB logs in: `C:\Program Files\MongoDB\Server\[version]\log\mongod.log`

**Error: "Access denied"**
- Run command prompt as Administrator
- Check MongoDB service permissions

---

## Next Steps

Once MongoDB is connected:
1. ✅ Server starts successfully
2. ✅ Master user is auto-created
3. ✅ You can login and start using the app!

Need help? Check the error messages in the console - they usually tell you exactly what's wrong!

