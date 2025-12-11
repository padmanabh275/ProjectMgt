# Build & Repackaging Commands

## Quick Reference

### Rebuild Frontend (Production Build)
```bash
npm run build
```
This builds the React frontend for production and creates optimized files in the `dist/` folder.

### Reinstall All Dependencies
```bash
npm install
```
This reinstalls all dependencies (useful if `node_modules` is corrupted or you want to update packages).

### Clean Install (Recommended if having issues)
```bash
# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Windows PowerShell:
Remove-Item -Recurse -Force node_modules, package-lock.json

# Then reinstall
npm install
```

## Complete Build Process

### 1. Clean Build (Recommended)
```bash
# Remove old build files
rm -rf dist node_modules package-lock.json

# Windows PowerShell:
Remove-Item -Recurse -Force dist, node_modules, package-lock.json

# Reinstall dependencies
npm install

# Build frontend
npm run build
```

### 2. Production Build Steps

1. **Build the frontend:**
   ```bash
   npm run build
   ```
   This creates optimized production files in `dist/` directory.

2. **Start production server:**
   ```bash
   npm start
   ```
   This starts the Node.js server which will serve the built frontend files.

## Common Commands

### Development
```bash
# Start both frontend and backend in development mode
npm run dev

# Start only frontend dev server
npm run dev:client

# Start only backend dev server
npm run dev:server
```

### Production
```bash
# Build frontend for production
npm run build

# Start production server
npm start

# Preview production build locally
npm run preview
```

### Other Useful Commands
```bash
# Setup environment file interactively
npm run setup

# Reset master user password
npm run reset-master
```

## Build Output

After running `npm run build`, you'll get:
- `dist/` folder with optimized production files
- Minified JavaScript bundles
- Optimized CSS files
- Static assets ready for deployment

## Troubleshooting

### If build fails:
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Try `npm run build` again

### If dependencies are outdated:
```bash
# Update all packages (be careful!)
npm update

# Or check for outdated packages
npm outdated
```

## Deployment Checklist

Before building for production:

- [ ] Update `.env` file with production values
- [ ] Set `NODE_ENV=production`
- [ ] Change `JWT_SECRET` to a strong random string
- [ ] Configure MongoDB Atlas connection string
- [ ] Update `FRONTEND_URL` to production URL
- [ ] Run `npm run build`
- [ ] Test with `npm start` locally
- [ ] Deploy to your hosting platform

