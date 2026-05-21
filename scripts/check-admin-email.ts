import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function checkAdminEmail() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const User = (await import('../lib/models/User')).default;
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Find all admin users
    const adminUsers = await User.find({ isAdmin: true });
    
    console.log(`\nFound ${adminUsers.length} admin user(s):\n`);
    
    adminUsers.forEach((user, index) => {
      console.log(`Admin User ${index + 1}:`);
      console.log(`  Email: "${user.email}"`);
      console.log(`  Name: ${user.name}`);
      console.log(`  isAdmin: ${user.isAdmin}`);
      console.log(`  role: ${user.role}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin email:', error);
    process.exit(1);
  }
}

// Run the function
checkAdminEmail();
