# MongoDB Atlas Connection Guide

When you see the connection options screen, here's what to choose:

## ✅ Choose: "Connect your application"

This gives you the connection string you need for your `.env` file.

### Step-by-Step:

1. **Click "Connect your application"**
   - This is the option that gives you a connection string

2. **Select Driver:**
   - **Driver:** Node.js
   - **Version:** 5.5 or later (or latest shown)

3. **Copy the connection string**
   - It will look like:
     ```
     mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

4. **Modify it for your project:**
   - Replace `<password>` with your actual MongoDB password
   - Add `/taskmanagement` before the `?` (this is your database name)
   
   **Final format:**
   ```
   mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
   ```

5. **Add to your `.env` file:**
   ```env
   MONGODB_URI=mongodb+srv://username:yourpassword@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority
   ```

---

## Other Options (Not Needed for Now)

The other options shown are useful but **not required** for your app:

- **MongoDB Compass** - GUI tool (optional, nice to have)
- **MongoDB Shell** - Command line tool (optional)
- **VS Code Extension** - Useful but not required
- **Atlas SQL** - For SQL tools (not needed)
- **MCP Server** - For AI tools (advanced, not needed)

**You can explore these later!** For now, just get the connection string. 🎯

---

## Quick Checklist

- [ ] Clicked "Connect your application"
- [ ] Selected Node.js driver
- [ ] Copied connection string
- [ ] Replaced `<password>` with your password
- [ ] Added `/taskmanagement` before the `?`
- [ ] Added to `.env` file as `MONGODB_URI`

**Done!** You're ready to connect! 🚀

