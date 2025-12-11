# Database & Authentication Setup Guide

## Overview

This application now includes:
- ✅ MongoDB database for data storage
- ✅ JWT-based authentication system
- ✅ User roles: Master, Admin, and User
- ✅ Role-based access control
- ✅ RESTful API backend

## Prerequisites

1. **Node.js** (v16 or higher)
2. **MongoDB** (local installation or MongoDB Atlas account)

## MongoDB Setup Options

### Option 1: Local MongoDB Installation

1. Download and install MongoDB from [mongodb.com](https://www.mongodb.com/try/download/community)
2. Start MongoDB service:
   ```bash
   # Windows
   net start MongoDB
   
   # macOS/Linux
   sudo systemctl start mongod
   ```

### Option 2: MongoDB Atlas (Cloud - Recommended)

1. Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string (e.g., `mongodb+srv://username:password@cluster.mongodb.net/taskmanagement`)

## Installation Steps

### 1. Install Dependencies

```bash
npm install
```

This will install both frontend and backend dependencies.

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
# For local MongoDB:
MONGODB_URI=mongodb://localhost:27017/taskmanagement

# OR for MongoDB Atlas (cloud):
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement

# JWT Secret (Change this in production!)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
```

### 3. Start the Application

The application runs both frontend and backend concurrently:

```bash
npm run dev
```

This will:
- Start the backend server on `http://localhost:5000`
- Start the frontend development server on `http://localhost:3000`

You can also run them separately:

```bash
# Terminal 1 - Backend
npm run dev:server

# Terminal 2 - Frontend
npm run dev:client
```

## Default Master Account

When you first start the server, a master account is automatically created:

- **Email:** `master@admin.com`
- **Password:** `admin123`

⚠️ **Important:** Change this password immediately in production!

## User Roles

### Master
- Full access to all companies
- Can create/manage companies
- Can create/manage users (all roles)
- Can delete companies and all data

### Admin
- Access to their assigned company
- Can create/manage departments and tasks
- Can create/manage users for their company
- Cannot delete companies

### User
- Access only to their assigned company
- Can view and manage tasks in their company
- Cannot create companies or departments
- Cannot manage other users

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Companies
- `GET /api/companies` - Get all companies (filtered by role)
- `GET /api/companies/:id` - Get company by ID
- `POST /api/companies` - Create company (Master/Admin only)
- `PUT /api/companies/:id` - Update company (Master/Admin only)
- `DELETE /api/companies/:id` - Delete company (Master/Admin only)

### Departments
- `GET /api/departments?companyId=xxx` - Get departments for a company
- `POST /api/departments` - Create department
- `PUT /api/departments/:id` - Update department
- `DELETE /api/departments/:id` - Delete department

### Tasks
- `GET /api/tasks` - Get all tasks (with filters)
- `GET /api/tasks/:id` - Get task by ID
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Users (Master/Admin only)
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

## Production Deployment

1. **Change JWT Secret:**
   ```env
   JWT_SECRET=<generate-a-strong-random-string>
   ```

2. **Use MongoDB Atlas** (recommended for production)

3. **Set Environment Variables:**
   - `NODE_ENV=production`
   - Configure CORS properly

4. **Build Frontend:**
   ```bash
   npm run build
   ```

5. **Start Production Server:**
   ```bash
   npm start
   ```

## Troubleshooting

### MongoDB Connection Issues

If you see "MongoDB connection error":
1. Verify MongoDB is running (local) or connection string is correct (Atlas)
2. Check firewall settings for Atlas
3. Ensure network access is configured in Atlas

### Port Already in Use

If port 5000 is in use:
- Change `PORT` in `.env` file
- Update `VITE_API_URL` in frontend if needed

### Authentication Not Working

1. Check that JWT_SECRET is set
2. Verify token is being stored in localStorage
3. Check browser console for API errors

## Next Steps

After setup:
1. Login with master account
2. Create companies
3. Create users for each company
4. Start managing tasks!

For component updates to use the API, see the component files - they need to be updated to call the API service instead of LocalStorage.

