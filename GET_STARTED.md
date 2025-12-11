# 🚀 Get Started Guide

## Step-by-Step Setup

### 1️⃣ Install Dependencies
```bash
npm install
```

### 2️⃣ Set Up MongoDB

**Choose ONE option:**

#### Option A: MongoDB Atlas (Cloud) - ⭐ Recommended
1. Follow: `QUICK_MONGODB_SETUP.md` (5 minutes)
2. Get your connection string from Atlas
3. Create `.env` file (see `CREATE_ENV_FILE.md`)

#### Option B: Local MongoDB
1. Download from: https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start service: `net start MongoDB`
4. Create `.env` file (see `CREATE_ENV_FILE.md`)

### 3️⃣ Create .env File

**Easiest way:**
```bash
npm run setup
```

**Or manually:**
1. Create `.env` file in project root
2. Copy template from `CREATE_ENV_FILE.md`
3. Add your MongoDB connection string

### 4️⃣ Start the Application

**Start both frontend and backend:**
```bash
npm run dev
```

**Or start separately:**

Terminal 1 (Backend):
```bash
npm run dev:server
```

Terminal 2 (Frontend):
```bash
npm run dev:client
```

### 5️⃣ Access the Application

1. Open browser: http://localhost:3000
2. You'll see the login page
3. Login with:
   - **Email:** `master@admin.com`
   - **Password:** `admin123`

### 6️⃣ Start Using!

✅ Create companies  
✅ Add departments  
✅ Create tasks  
✅ Manage users (if admin/master)

---

## 📚 Documentation Files

- `QUICK_MONGODB_SETUP.md` - Fast MongoDB setup (start here!)
- `CREATE_ENV_FILE.md` - How to create .env file
- `MONGODB_SETUP.md` - Detailed MongoDB guide
- `SETUP.md` - Complete setup documentation
- `README.md` - Full project documentation

---

## ⚠️ Troubleshooting

### "MongoDB connection error"
- Check your `.env` file has correct `MONGODB_URI`
- For Atlas: Verify network access allows your IP
- For Local: Verify MongoDB service is running

### "Port already in use"
- Change `PORT` in `.env` file
- Or stop the process using port 5000

### "Module not found"
- Run: `npm install`

---

## ✅ Success Indicators

When everything is working, you'll see:

**In backend console:**
```
✅ Connected to MongoDB
✅ Master user created: master@admin.com / admin123
🚀 Server running on port 5000
```

**In frontend:**
- Login page appears
- You can login successfully
- Dashboard loads

---

## 🎯 Quick Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] MongoDB set up (Atlas or Local)
- [ ] `.env` file created with MongoDB URI
- [ ] Backend server starts without errors
- [ ] Frontend loads at http://localhost:3000
- [ ] Can login with master account

**All checked? You're ready to go! 🎉**

