/**
 * Script to reset master user password
 * Run with: node server/scripts/resetMasterUser.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/taskmanagement';

async function resetMasterUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing master user
    const deleted = await User.deleteOne({ email: 'master@admin.com' });
    if (deleted.deletedCount > 0) {
      console.log('✅ Deleted old master user');
    } else {
      console.log('ℹ️  No existing master user found');
    }

    // Create new master user (password will be hashed by model)
    const masterUser = await User.create({
      email: 'master@admin.com',
      password: 'admin123', // Model will hash this automatically
      name: 'Master Admin',
      role: 'master',
      isActive: true
    });

    console.log('✅ Master user created successfully!');
    console.log('📧 Email: master@admin.com');
    console.log('🔑 Password: admin123');
    
    // Close connection
    await mongoose.connection.close();
    console.log('✅ Done!');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

resetMasterUser();

