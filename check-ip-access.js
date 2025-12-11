/**
 * MongoDB Atlas IP Access Checker
 * This script helps verify if your IP is allowed in Atlas Network Access
 */

require('dotenv').config();
const https = require('https');
const http = require('http');

console.log('\n🔍 MongoDB Atlas IP Access Checker\n');
console.log('=' .repeat(50));

// Get your IP address
const YOUR_IP = '106.201.114.184';

console.log(`\n📍 Your IP Address: ${YOUR_IP}/32`);
console.log('\n📋 Steps to Verify in MongoDB Atlas:\n');

console.log('1. Go to MongoDB Atlas Dashboard:');
console.log('   https://cloud.mongodb.com\n');

console.log('2. Navigate to Network Access:');
console.log('   → Click "Network Access" in the left menu\n');

console.log('3. Check if this IP is in the list:');
console.log(`   ✅ Look for: ${YOUR_IP}/32`);
console.log('   ✅ Or: 0.0.0.0/0 (Allows all IPs)\n');

console.log('4. If NOT found, add it:');
console.log('   → Click "Add IP Address"');
console.log('   → Click "Add Current IP Address" (or enter manually)');
console.log('   → Enter:', YOUR_IP);
console.log('   → Click "Confirm"');
console.log('   → Wait 1-2 minutes for changes to take effect\n');

console.log('5. Alternative - Allow from Anywhere (Development Only):');
console.log('   → Click "Add IP Address"');
console.log('   → Click "Allow Access from Anywhere"');
console.log('   → This adds 0.0.0.0/0 (allows all IPs)');
console.log('   ⚠️  Only use this for development, not production!\n');

console.log('=' .repeat(50));
console.log('\n💡 Tips:');
console.log('   - Changes to Network Access take 1-2 minutes to apply');
console.log('   - You can have multiple IP addresses in the list');
console.log('   - Using 0.0.0.0/0 allows access from any IP (less secure)');
console.log('   - For production, use specific IP addresses\n');

// Try to get public IP (as verification)
console.log('🌐 Verifying your public IP...\n');

const getPublicIP = () => {
  return new Promise((resolve, reject) => {
    https.get('https://api.ipify.org?format=json', (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result.ip);
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
};

getPublicIP()
  .then((publicIP) => {
    console.log(`✅ Your public IP is: ${publicIP}`);
    if (publicIP === YOUR_IP) {
      console.log(`✅ IP matches! (${YOUR_IP})\n`);
    } else {
      console.log(`⚠️  IP mismatch! You provided ${YOUR_IP}, but public IP is ${publicIP}`);
      console.log('   Make sure to add the correct IP in Atlas Network Access\n');
    }
  })
  .catch((err) => {
    console.log('⚠️  Could not verify public IP (internet connection issue?)');
    console.log(`   Using provided IP: ${YOUR_IP}\n`);
  });

// Check connection string
console.log('📝 Checking Connection String...\n');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI not found in .env file');
  console.log('\n💡 Add this to your .env file:');
  console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/taskmanagement?retryWrites=true&w=majority\n');
} else {
  console.log('✅ MONGODB_URI found in .env file');
  
  // Extract hostname
  const match = MONGODB_URI.match(/mongodb\+srv:\/\/[^@]+@([^/]+)/);
  if (match) {
    const hostname = match[1];
    console.log(`📍 Atlas Hostname: ${hostname}`);
    console.log('\n💡 This hostname should be accessible once your IP is allowed\n');
  }
  
  // Show connection type
  if (MONGODB_URI.includes('mongodb+srv://')) {
    console.log('✅ Using MongoDB Atlas (mongodb+srv://)\n');
  } else {
    console.log('⚠️  Not using Atlas connection string (should start with mongodb+srv://)\n');
  }
}

console.log('=' .repeat(50));
console.log('\n📚 Next Steps:');
console.log('   1. Verify IP is added in Atlas Network Access');
console.log('   2. Wait 1-2 minutes for changes to apply');
console.log('   3. Restart your server: npm run dev');
console.log('   4. Check if connection works\n');

console.log('🔗 Quick Links:');
console.log('   - Atlas Dashboard: https://cloud.mongodb.com');
console.log('   - Network Access: https://cloud.mongodb.com/v2#/security/network/whitelist\n');

