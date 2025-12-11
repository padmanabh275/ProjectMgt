/**
 * MongoDB Connection Checker
 * This script helps diagnose MongoDB connection issues
 */

require('dotenv').config();
const mongoose = require('mongoose');

console.log('\n🔍 MongoDB Connection Diagnostic Tool\n');
console.log('=' .repeat(50));

// Check if MONGODB_URI is set
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('\n❌ ERROR: MONGODB_URI is not set in .env file');
  console.log('\n💡 Add this to your .env file:');
  console.log('   MONGODB_URI=mongodb://localhost:27017/taskmanagement');
  console.log('   OR for MongoDB Atlas:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority');
  process.exit(1);
}

console.log('\n✅ MONGODB_URI found in .env file');

// Show URI (hide password)
const safeURI = MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
console.log(`📍 Connection String: ${safeURI}`);

// Determine connection type
if (MONGODB_URI.includes('mongodb+srv://')) {
  console.log('🌐 Type: MongoDB Atlas (Cloud)');
} else if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
  console.log('💻 Type: Local MongoDB');
} else {
  console.log('🔗 Type: Custom MongoDB Connection');
}

// Check other required env vars
console.log('\n📋 Environment Variables:');
console.log(`   PORT: ${process.env.PORT || '5000 (default)'}`);
console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'not set'}`);
console.log(`   JWT_SECRET: ${process.env.JWT_SECRET ? '✅ Set' : '❌ Not set'}`);
console.log(`   FRONTEND_URL: ${process.env.FRONTEND_URL || 'not set'}`);

// Try to connect
console.log('\n🔄 Attempting to connect to MongoDB...');
console.log('   (This may take a few seconds)\n');

const connectionOptions = {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 5000,
};

mongoose.connect(MONGODB_URI, connectionOptions)
  .then(() => {
    console.log('✅ SUCCESS! Connected to MongoDB');
    console.log(`   Database: ${mongoose.connection.name}`);
    console.log(`   Host: ${mongoose.connection.host}`);
    console.log(`   Port: ${mongoose.connection.port || 'N/A (Atlas)'}`);
    console.log('\n🎉 Your MongoDB connection is working!');
    console.log('   You can now run your server with: npm run dev\n');
    
    // Test a simple operation
    return mongoose.connection.db.admin().ping();
  })
  .then(() => {
    console.log('✅ Database ping successful - connection is healthy\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ FAILED to connect to MongoDB\n');
    console.error('Error details:', error.message);
    
    if (MONGODB_URI.includes('localhost') || MONGODB_URI.includes('127.0.0.1')) {
      console.error('\n💡 Local MongoDB Troubleshooting:');
      console.error('   1. Check if MongoDB service is running:');
      console.error('      → Open Services (Win+R → services.msc)');
      console.error('      → Find "MongoDB Server" and start it');
      console.error('   2. Or run in PowerShell (as Administrator):');
      console.error('      → net start MongoDB');
      console.error('   3. Verify MongoDB is installed:');
      console.error('      → mongod --version');
    } else if (MONGODB_URI.includes('mongodb+srv://')) {
      console.error('\n💡 MongoDB Atlas Troubleshooting:');
      console.error('   1. Check your connection string in .env file:');
      console.error('      → Make sure password is correct');
      console.error('      → Make sure username is correct');
      console.error('      → URL-encode special characters in password');
      console.error('   2. Check Network Access in Atlas:');
      console.error('      → Go to Network Access in Atlas dashboard');
      console.error('      → Make sure your IP is allowed (or "Allow from anywhere")');
      console.error('   3. Check if cluster is running (not paused)');
      console.error('   4. Verify connection string format:');
      console.error('      mongodb+srv://username:password@cluster.xxxxx.mongodb.net/database?retryWrites=true&w=majority');
    }
    
    console.error('\n📚 For more help, see:');
    console.error('   - QUICK_FIX_MONGODB.md');
    console.error('   - FIX_MONGODB_CONNECTION.md\n');
    
    process.exit(1);
  });

// Handle connection events
mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
});

