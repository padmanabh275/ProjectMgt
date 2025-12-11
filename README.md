# Task Reminder & Management

A comprehensive task management application for managing tasks across multiple companies, departments, and team members with intelligent reminders, dashboard analytics, **database storage**, and **user authentication**.

## ✨ Features

### 🔐 Authentication & User Management
- **User Roles:**
  - **Master:** Full access to all companies and users
  - **Admin:** Manage their assigned company
  - **User:** Access only to their company's tasks
- **Secure Login/Registration** with JWT tokens
- **Role-based Access Control**

### 🏢 Company Management
- **Company List View:** Main screen displaying all companies as interactive cards
- Add new companies (Master/Admin only)
- View task counts and completion progress for each company
- Delete companies with all related data

### 📋 Task Structure
For each company, organize tasks by:
- **Departments** (Tech, Marketing, Finance, Sales, HR, Operations, Legal, Support, or custom)
- **Tasks** with:
  - Task name
  - Assigned team member
  - Deadline date
  - Status (Not Started / In Progress / Completed / Delayed)

### ➕ Task Input
- Easy-to-use form for adding tasks
- Fields: Company, Department, Task Name, Assigned To, Deadline Date, Status
- Validation ensures all required fields are filled

### 🔔 Reminder System
- **Daily reminders** for:
  - Tasks due today (🟡)
  - Overdue tasks (🔴)
- Browser notification support
- Color-coded visual indicators:
  - 🔴 Red: Overdue tasks
  - 🟡 Yellow: Due today
  - 🟢 Green: Completed tasks

### 📊 Dashboard & Summary
Comprehensive overview showing:
- **Overdue tasks** count and list
- **Tasks due today** count and list
- **Upcoming tasks** (next 7 days)
- **Completed tasks** list
- **Company statistics:**
  - Total tasks per company
  - Completed tasks count
  - Overdue/due today indicators
  - Progress percentage

### 💾 Database Storage
- **MongoDB** for persistent data storage
- All data stored securely in database
- User accounts and authentication
- Company-specific data isolation

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or MongoDB Atlas)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd Project_Mgt
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env` file in the root directory:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/taskmanagement
   JWT_SECRET=your-super-secret-jwt-key-change-in-production
   FRONTEND_URL=http://localhost:3000
   ```

   For MongoDB Atlas (cloud):
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/taskmanagement
   ```

4. **Start MongoDB:**
   - Local: Start MongoDB service on your machine
   - Atlas: Use the connection string from your Atlas dashboard

5. **Start the application:**
   ```bash
   npm run dev
   ```

   This starts both:
   - Backend server on `http://localhost:5000`
   - Frontend dev server on `http://localhost:3000`

### Default Login Credentials

When you first start the server, a master account is automatically created:

- **Email:** `master@admin.com`
- **Password:** `admin123`

⚠️ **Important:** Change this password in production!

## 📚 Documentation

- **[SETUP.md](SETUP.md)** - Detailed setup instructions
- **[QUICKSTART.md](QUICKSTART.md)** - Quick start guide

## 🏗️ Technology Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **lucide-react** - Icons

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📁 Project Structure

```
Project_Mgt/
├── server/                 # Backend server
│   ├── models/            # Database models
│   │   ├── User.js
│   │   ├── Company.js
│   │   ├── Department.js
│   │   └── Task.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── companies.js
│   │   ├── departments.js
│   │   └── tasks.js
│   ├── middleware/        # Auth middleware
│   │   └── auth.js
│   └── index.js          # Server entry point
├── src/                   # Frontend React app
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── services/         # API service layer
│   └── utils/            # Utilities
├── package.json
└── README.md
```

## 🔑 User Roles & Permissions

### Master
- ✅ Full access to all companies
- ✅ Create/manage companies
- ✅ Create/manage all users
- ✅ Delete companies and data

### Admin
- ✅ Access to assigned company
- ✅ Create/manage departments and tasks
- ✅ Create/manage users for their company
- ❌ Cannot delete companies

### User
- ✅ Access only to assigned company
- ✅ View and manage tasks
- ❌ Cannot create companies/departments
- ❌ Cannot manage users

## 🔒 Security Features

- JWT token-based authentication
- Password hashing with bcrypt
- Role-based access control
- Company data isolation
- Secure API endpoints
- CORS configuration

## 📱 Features in Detail

### Color Coding
- **Red border/background:** Overdue tasks (past deadline, not completed)
- **Yellow border/background:** Tasks due today
- **Green border/background:** Completed tasks
- **Gray:** Normal/upcoming tasks

### Task Status
- **Not Started:** Newly created tasks
- **In Progress:** Tasks currently being worked on
- **Completed:** Finished tasks
- **Delayed:** Tasks that are behind schedule

### Responsive Design
The application is fully responsive and works on:
- Desktop computers
- Tablets
- Mobile devices

## 🚧 Development Status

**Completed:**
- ✅ Backend API with MongoDB
- ✅ Authentication system
- ✅ User management
- ✅ Company management
- ✅ Login/Register pages
- ✅ Protected routes

**In Progress:**
- 🔄 Updating components to use API (CompanyList, CompanyDetail, Dashboard)
- 🔄 User management UI for master/admin

**Future Enhancements:**
- Voice input for task creation
- Export/import functionality
- Advanced filtering and search
- Task templates
- Recurring tasks
- Email notifications

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

MIT License - feel free to use and modify as needed.

## 🆘 Support

For setup issues, see [SETUP.md](SETUP.md) for detailed troubleshooting.

For questions or issues, please open an issue on the repository.
