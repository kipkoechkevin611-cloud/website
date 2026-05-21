import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function fixAdminRole() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const User = (await import('../lib/models/User')).default;
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Update old admin user's role
    const result = await User.updateOne(
      { email: 'admin@ilosunot.com' },
      { role: 'admin' }
    );

    if (result.modifiedCount > 0) {
      console.log('✅ Updated admin@ilosunot.com role to "admin"');
    } else {
      console.log('ℹ️  admin@ilosunot.com already has correct role or not found');
    }

    // Verify the update
    const adminUsers = await User.find({ isAdmin: true });
    console.log(`\nCurrent admin users:\n`);
    
    adminUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email}`);
      console.log(`   isAdmin: ${user.isAdmin}`);
      console.log(`   Role: ${user.role || 'not set'}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin role:', error);
    process.exit(1);
  }
}

// Run the function
fixAdminRole();
