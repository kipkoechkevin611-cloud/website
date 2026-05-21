import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function forceAdminPrivileges() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const User = (await import('../lib/models/User')).default;
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const adminEmail = 'kipkoechkevin611@gmaill.com';

    // Find and update the admin user
    const user = await User.findOne({ email: adminEmail });

    if (!user) {
      console.log('❌ Admin user not found');
      process.exit(1);
    }

    console.log('\nCurrent user state:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  isAdmin:', user.isAdmin);
    console.log('  role:', user.role);
    console.log('  isAdmin type:', typeof user.isAdmin);
    console.log('  role type:', typeof user.role);

    // Force update admin privileges
    user.isAdmin = true;
    user.role = 'admin';
    await user.save();

    console.log('\n✅ Updated user state:');
    console.log('  Email:', user.email);
    console.log('  isAdmin:', user.isAdmin);
    console.log('  role:', user.role);
    console.log('  isAdmin type:', typeof user.isAdmin);
    console.log('  role type:', typeof user.role);

    console.log('\n✅ Admin privileges forced successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error forcing admin privileges:', error);
    process.exit(1);
  }
}

// Run the function
forceAdminPrivileges();
