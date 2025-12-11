#!/usr/bin/env node

/**
 * MongoDB Setup Helper
 * This script helps you create your .env file for MongoDB configuration
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setup() {
  console.log('\n🚀 MongoDB Setup Helper\n');
  console.log('This will help you create a .env file with MongoDB configuration.\n');

  // Check if .env already exists
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const overwrite = await question('⚠️  .env file already exists. Overwrite? (y/n): ');
    if (overwrite.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      rl.close();
      return;
    }
  }

  console.log('\nChoose your MongoDB option:');
  console.log('1. MongoDB Atlas (Cloud - Recommended)');
  console.log('2. Local MongoDB');
  const option = await question('\nEnter option (1 or 2): ');

  let mongodbUri;
  let connectionType;

  if (option === '1') {
    connectionType = 'MongoDB Atlas';
    console.log('\n📡 MongoDB Atlas Setup');
    console.log('\nTo get your connection string:');
    console.log('1. Go to https://www.mongodb.com/cloud/atlas');
    console.log('2. Create a free cluster');
    console.log('3. Click "Connect" → "Connect your application"');
    console.log('4. Copy the connection string\n');
    
    const connectionString = await question('Paste your MongoDB Atlas connection string: ');
    
    // Add database name if not present
    if (connectionString.includes('/?')) {
      mongodbUri = connectionString.replace('/?', '/taskmanagement?');
    } else if (connectionString.includes('mongodb.net/')) {
      mongodbUri = connectionString + 'taskmanagement';
    } else {
      mongodbUri = connectionString;
    }
    
    // Replace <password> placeholder if present
    mongodbUri = mongodbUri.replace('<password>', await question('Enter your MongoDB password: '));
    
  } else if (option === '2') {
    connectionType = 'Local MongoDB';
    mongodbUri = 'mongodb://localhost:27017/taskmanagement';
    console.log('\n💻 Using Local MongoDB');
    console.log('Make sure MongoDB is installed and running!');
    console.log('Start it with: net start MongoDB\n');
  } else {
    console.log('Invalid option. Setup cancelled.');
    rl.close();
    return;
  }

  const port = await question('\nEnter server port (default: 5000): ') || '5000';
  
  // Generate a random JWT secret
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');

  // Create .env content
  const envContent = `# Server Configuration
PORT=${port}
NODE_ENV=development

# MongoDB Configuration
# ${connectionType}
MONGODB_URI=${mongodbUri}

# JWT Secret (Auto-generated - keep this secure!)
JWT_SECRET=${jwtSecret}

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000
`;

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file created successfully!\n');
    console.log('📝 Configuration saved:');
    console.log(`   - Connection Type: ${connectionType}`);
    console.log(`   - Server Port: ${port}`);
    console.log(`   - JWT Secret: Generated automatically`);
    console.log('\n🎉 Setup complete! You can now run: npm run dev\n');
    console.log('Default master login:');
    console.log('   Email: master@admin.com');
    console.log('   Password: admin123\n');
  } catch (error) {
    console.error('\n❌ Error creating .env file:', error.message);
  }

  rl.close();
}

setup().catch(console.error);

