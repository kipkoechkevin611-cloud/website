import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function checkAdminUsers() {
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
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  isAdmin: ${user.isAdmin}`);
      console.log(`  Role: ${user.role || 'not set'}`);
      console.log(`  Created: ${user.createdAt}`);
      console.log('');
    });

    // Also check for users with role 'admin'
    const roleAdminUsers = await User.find({ role: 'admin' });
    console.log(`\nFound ${roleAdminUsers.length} user(s) with role 'admin':\n`);

    roleAdminUsers.forEach((user, index) => {
      console.log(`Role Admin User ${index + 1}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Name: ${user.name}`);
      console.log(`  isAdmin: ${user.isAdmin}`);
      console.log(`  Role: ${user.role || 'not set'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking admin users:', error);
    process.exit(1);
  }
}

// Run the function
checkAdminUsers();
