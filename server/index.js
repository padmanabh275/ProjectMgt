const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanagement';

// Connection options to prevent timeout issues
const mongooseOptions = {
  serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 10s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  connectTimeoutMS: 5000, // Initial connection timeout
  retryWrites: true,
};

// Middleware to check MongoDB connection status
const checkMongoConnection = (req, res, next) => {
  // 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  if (mongoose.connection.readyState === 0) {
    return res.status(503).json({
      error: 'Database not connected',
      message: 'MongoDB connection is not available. Please check your database connection.',
      details: 'See server console for troubleshooting steps.',
      hint: 'Check FIX_MONGODB_CONNECTION.md for help',
      troubleshooting: {
        local: 'If using local MongoDB: Run "net start MongoDB" as Administrator',
        atlas: 'If using Atlas: Check connection string in .env file',
        file: 'See FIX_MONGODB_CONNECTION.md for detailed steps'
      }
    });
  }
  next();
};

// Apply connection check to all API routes
app.use('/api', checkMongoConnection);

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/departments', require('./routes/departments'));
app.use('/api/tasks', require('./routes/tasks'));

// Connect to MongoDB
mongoose.connect(MONGODB_URI, mongooseOptions)
.then(() => {
  console.log('✅ Connected to MongoDB');
  console.log(`📍 Database: ${mongoose.connection.name}`);
  // Hide password in URI for security
  const safeURI = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
  console.log(`🔗 URI: ${safeURI}`);
  // Create master user if it doesn't exist
  createMasterUser();
})
.catch((error) => {
  console.error('\n❌ MongoDB connection error:', error.message);
  console.error('\n💡 Troubleshooting steps:');
  console.error('   1. If using local MongoDB: Make sure MongoDB service is running');
  console.error('      → Run: net start MongoDB (as Administrator)');
  console.error('      → Or check Services: Win+R → services.msc → Find "MongoDB Server"');
  console.error('   2. If using MongoDB Atlas: Check your connection string in .env file');
  console.error('      → Verify password is correct');
  console.error('      → Check Network Access allows your IP');
  console.error('   3. Verify MONGODB_URI in your .env file is correct');
  console.error('   4. Check FIX_MONGODB_CONNECTION.md for detailed help\n');
  console.error('⚠️  Server started but database operations will fail until MongoDB is connected.\n');
});

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️  MongoDB disconnected. API requests will fail.');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB error:', error.message);
});

// Handle undefined routes - must come AFTER API routes
app.use((req, res, next) => {
  // Only handle non-API routes
  if (!req.path.startsWith('/api')) {
    if (process.env.NODE_ENV === 'production') {
      res.sendFile(path.join(__dirname, '../dist/index.html'));
    } else {
      res.status(404).json({ 
        message: 'Route not found. This is the API server. Frontend runs on port 3000.' 
      });
    }
  } else {
    res.status(404).json({ 
      message: 'API endpoint not found',
      path: req.path,
      method: req.method
    });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Create master user function
async function createMasterUser() {
  const User = require('./models/User');
  try {
    const masterExists = await User.findOne({ email: 'master@admin.com' });
    if (!masterExists) {
      // Don't hash manually - User model's pre-save hook will handle it
      await User.create({
        email: 'master@admin.com',
        password: 'admin123', // Will be hashed automatically by the model
        name: 'Master Admin',
        role: 'master',
        isActive: true
      });
      console.log('✅ Master user created: master@admin.com / admin123');
    } else {
      console.log('ℹ️  Master user already exists');
    }
  } catch (error) {
    console.error('Error creating master user:', error);
  }
}

