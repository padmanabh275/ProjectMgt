# Create Your .env File

Since `.env` files are protected, you need to create it manually. Here's how:

## Quick Steps

### Option 1: Use Setup Script (Easiest)

Run this command:
```bash
npm run setup
```

The script will guide you through creating the `.env` file step by step.

---

### Option 2: Manual Creation

**Step 1:** Create a new file named `.env` in your project root folder:
```
Project_Mgt/
  └── .env  ← Create this file here
```

**Step 2:** Copy and paste one of these configurations:

#### For MongoDB Atlas (Cloud):
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `username` - Your MongoDB Atlas username
- `password` - Your MongoDB Atlas password
- `cluster0.xxxxx.mongodb.net` - Your cluster URL from Atlas

#### For Local MongoDB:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/taskmanagement
JWT_SECRET=your-super-secret-jwt-key-change-in-production-12345
FRONTEND_URL=http://localhost:3000
```

**Step 3:** Save the file

**Step 4:** Test it:
```bash
npm run dev:server
```

---

## Getting MongoDB Atlas Connection String

If you chose MongoDB Atlas, here's how to get your connection string:

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Login to your account
3. Click **"Database"** → Click **"Connect"** on your cluster
4. Choose **"Connect your application"**
5. Select driver: **Node.js**, version: **5.5 or later**
6. Copy the connection string
7. Replace `<password>` with your actual password
8. Add `/taskmanagement` before the `?` (database name)

Example transformation:
```
Before: mongodb+srv://user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
After:  mongodb+srv://user:yourpassword@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
```

---

## Important Notes

⚠️ **Never commit `.env` to git** - It contains sensitive information!

✅ The `.env` file is already in `.gitignore` for safety

✅ After creating the file, you can test with:
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

## Need Help?

- See `QUICK_MONGODB_SETUP.md` for detailed MongoDB setup
- See `MONGODB_SETUP.md` for comprehensive guide
- Check the error messages - they usually tell you what's wrong!

