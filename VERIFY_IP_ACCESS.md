# Verify MongoDB Atlas IP Access

## Your IP Address
**`106.201.114.184/32`**

This is the IP address that needs to be allowed in MongoDB Atlas Network Access.

---

## ✅ How to Check if IP is Allowed

### Step 1: Go to Atlas Dashboard
1. Open: https://cloud.mongodb.com
2. Log in with your Atlas account

### Step 2: Navigate to Network Access
1. Click **"Network Access"** in the left sidebar
2. You'll see a list of allowed IP addresses

### Step 3: Check Your IP
Look for one of these in the list:
- ✅ **`106.201.114.184/32`** (your specific IP)
- ✅ **`0.0.0.0/0`** (allows all IPs - less secure)

---

## ➕ How to Add Your IP

### Option 1: Add Your Specific IP

1. Click **"Add IP Address"** button
2. Click **"Add Current IP Address"** button
   - This will automatically detect your IP
   - OR manually enter: `106.201.114.184`
3. Click **"Confirm"**
4. Wait 1-2 minutes for changes to apply

### Option 2: Allow Access from Anywhere (Development Only)

1. Click **"Add IP Address"** button
2. Click **"Allow Access from Anywhere"**
   - This adds `0.0.0.0/0` which allows all IPs
3. Click **"Confirm"**
4. Wait 1-2 minutes for changes to apply

⚠️ **Warning:** Using `0.0.0.0/0` is less secure. Only use for development!

---

## 🔍 Quick Check Script

Run this command to verify your IP and get instructions:

```powershell
npm run check-ip
```

This will:
- ✅ Verify your IP address
- ✅ Check your connection string
- ✅ Provide step-by-step instructions
- ✅ Show quick links to Atlas dashboard

---

## 🚨 Common Issues

### Issue 1: IP Not in List
**Solution:** Add your IP following the steps above

### Issue 2: IP Added but Still Can't Connect
**Solutions:**
- Wait 2-3 minutes (changes take time to propagate)
- Restart your server after adding IP
- Check if you're using a VPN (IP might have changed)
- Verify your connection string is correct

### Issue 3: IP Keeps Changing (Dynamic IP)
**Solutions:**
- Add multiple IPs to the list
- Use "Allow Access from Anywhere" (development only)
- Consider using a static IP

### Issue 4: Using Corporate/VPN Network
**Solution:** 
- Add the corporate/VPN IP address
- Or add `0.0.0.0/0` if allowed by your organization

---

## 📋 Checklist

- [ ] Opened MongoDB Atlas dashboard
- [ ] Navigated to Network Access
- [ ] Checked if `106.201.114.184/32` is in the list
- [ ] Added IP if not present
- [ ] Waited 1-2 minutes after adding
- [ ] Restarted server (`npm run dev`)
- [ ] Tested connection

---

## 🔗 Quick Links

- **Atlas Dashboard:** https://cloud.mongodb.com
- **Network Access:** https://cloud.mongodb.com/v2#/security/network/whitelist
- **Your IP:** `106.201.114.184/32`

---

## 💡 After Adding IP

1. **Wait 1-2 minutes** for changes to apply
2. **Restart your server:**
   ```powershell
   npm run dev
   ```
3. **Check connection:**
   Look for: `✅ Connected to MongoDB` in server console

---

**Run `npm run check-ip` for detailed verification!**

