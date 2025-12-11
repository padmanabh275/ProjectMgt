# Fix MongoDB Atlas Connection Error

## 🚨 Your Error

```
MongoNetworkError: getaddrinfo ENOTFOUND ac-wderxge-shard-00-00.j6pytnx.mongodb.net
```

This means your computer **cannot find** the MongoDB Atlas server. This is a DNS/network issue.

---

## ✅ Quick Fixes (Try These First)

### Fix 1: Check Internet Connection
- Make sure you're connected to the internet
- Try accessing a website in your browser
- If offline, MongoDB Atlas won't work (use local MongoDB instead)

### Fix 2: Verify Connection String
- Your connection string might be wrong or incomplete
- Check your `.env` file for the `MONGODB_URI`

### Fix 3: Check Atlas Cluster Status
1. Go to your MongoDB Atlas dashboard
2. Check if your cluster is **running** (not paused)
3. If paused, click "Resume" or "Resume Cluster"

### Fix 4: Verify Network Access
1. Go to Atlas dashboard → **Network Access**
2. Make sure your IP address is allowed
3. Or click **"Allow Access from Anywhere"** (for development)

---

## 🔍 Step-by-Step Diagnosis

### Step 1: Check Your .env File

**Open your `.env` file and verify the connection string:**

It should look like:
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
```

**Check:**
- ✅ Connection string starts with `mongodb+srv://`
- ✅ Username and password are correct
- ✅ Cluster name matches your Atlas cluster
- ✅ Database name (`taskmanagement`) is included
- ✅ No extra spaces or quotes

**Common Issues:**
- ❌ Missing `mongodb+srv://` prefix
- ❌ Wrong username or password
- ❌ Cluster name doesn't match Atlas
- ❌ Special characters in password not URL-encoded

### Step 2: Test DNS Resolution

**Run this command to test if you can reach Atlas:**

```powershell
nslookup ac-wderxge-shard-00-00.j6pytnx.mongodb.net
```

**If this fails:**
- Internet connection issue
- DNS server problem
- Firewall blocking DNS

**If this works:**
- DNS is fine, check Atlas configuration

### Step 3: Verify Atlas Configuration

1. **Log into Atlas Dashboard:**
   - Go to: https://cloud.mongodb.com
   - Log in with your account

2. **Check Cluster Status:**
   - Find your cluster
   - Make sure it says "Active" (not "Paused")

3. **Check Network Access:**
   - Go to **"Network Access"** in left menu
   - Verify your IP is in the allowed list
   - Or add `0.0.0.0/0` (Allow from anywhere) for development

4. **Get Fresh Connection String:**
   - Go to **"Database"** → Click **"Connect"** on your cluster
   - Choose **"Connect your application"**
   - Select **Node.js** driver
   - **Copy the connection string**
   - Replace `<password>` with your actual password
   - Add `/taskmanagement` before the `?`

### Step 4: Update Your .env File

1. **Open `.env` file in your project root**
2. **Update `MONGODB_URI` with the fresh connection string**
3. **Save the file**
4. **Restart your server**

---

## 🛠️ Common Solutions

### Solution 1: Connection String Format

**Wrong:**
```env
MONGODB_URI=mongodb://username:password@cluster0.xxxxx.mongodb.net/taskmanagement
```

**Correct:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
```

**Note:** Use `mongodb+srv://` (not `mongodb://`) for Atlas clusters.

### Solution 2: Password Encoding

If your password has special characters, URL-encode them:

| Character | Encoded |
|-----------|---------|
| `@` | `%40` |
| `#` | `%23` |
| `$` | `%24` |
| `%` | `%25` |
| `&` | `%26` |
| `+` | `%2B` |
| `=` | `%3D` |
| `/` | `%2F` |
| `?` | `%3F` |
| `:` | `%3A` |

**Example:**
- Password: `P@ssw0rd#123`
- Encoded: `P%40ssw0rd%23123`
- Connection string: `mongodb+srv://username:P%40ssw0rd%23123@cluster...`

### Solution 3: Network Access

**In Atlas Dashboard:**

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This adds `0.0.0.0/0` which allows all IPs
4. Click **"Confirm"**
5. Wait 1-2 minutes for changes to take effect

### Solution 4: Check Firewall/Antivirus

**Firewall or antivirus might be blocking the connection:**

- Temporarily disable firewall to test
- Add MongoDB/Node.js to firewall exceptions
- Check if corporate network is blocking MongoDB ports

---

## 🔧 Alternative: Use Local MongoDB

If Atlas keeps failing, you can use local MongoDB:

### Step 1: Install MongoDB Locally
- Download from: https://www.mongodb.com/try/download/community
- Install on Windows
- Start MongoDB service

### Step 2: Update .env File
```env
MONGODB_URI=mongodb://localhost:27017/taskmanagement
```

### Step 3: Restart Server

---

## 🧪 Test Your Connection

**Run the diagnostic tool I created:**

```powershell
npm run check-mongodb
```

This will:
- Check your `.env` file
- Verify connection string format
- Test the connection
- Show specific error messages

---

## 📋 Checklist

- [ ] Internet connection is working
- [ ] Atlas cluster is running (not paused)
- [ ] Connection string uses `mongodb+srv://`
- [ ] Username and password are correct
- [ ] Password special characters are URL-encoded
- [ ] Network Access allows your IP (or "Allow from anywhere")
- [ ] `.env` file is in project root
- [ ] No extra spaces/quotes in connection string
- [ ] Database name (`taskmanagement`) is included
- [ ] Firewall/antivirus not blocking connection

---

## 🎯 Most Likely Issues

Based on your error, check these first:

1. **Atlas cluster is paused** → Resume it in Atlas dashboard
2. **Network Access not configured** → Add your IP or "Allow from anywhere"
3. **Wrong connection string** → Get fresh one from Atlas dashboard
4. **Password encoding issue** → URL-encode special characters
5. **Internet connectivity** → Check your internet connection

---

## 💡 Quick Test

**Try this in PowerShell:**

```powershell
# Test if you can reach MongoDB Atlas
Test-NetConnection -ComputerName ac-wderxge-shard-00-00.j6pytnx.mongodb.net -Port 27017

# Or ping test
ping ac-wderxge-shard-00-00.j6pytnx.mongodb.net
```

If these fail, it's a network/DNS issue, not a code issue.

---

**Need more help?** 
- Check your Atlas dashboard first
- Verify network access is configured
- Run `npm run check-mongodb` for diagnostics

