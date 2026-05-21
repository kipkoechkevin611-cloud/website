import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function testLogin() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const User = (await import('../lib/models/User')).default;
    const bcrypt = (await import('bcryptjs')).default;
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Test with new admin credentials
    const email = 'kipkoechkevin611@gmaill.com';
    const password = 'admin123';

    console.log(`\nTesting login for: ${email}`);
    console.log(`Password: ${password}\n`);

    // Find user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log('❌ User not found');
      process.exit(1);
    }

    console.log('✅ User found:');
    console.log(`  Email: ${user.email}`);
    console.log(`  Name: ${user.name}`);
    console.log(`  isAdmin: ${user.isAdmin}`);
    console.log(`  Role: ${user.role}`);
    console.log(`  Has password: ${!!user.password}\n`);

    // Test password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log(`Password valid: ${isPasswordValid}\n`);

    // Check if user meets admin requirements
    const isAdmin = user.isAdmin === true;
    const hasAdminRole = user.role === 'admin';
    const meetsRequirements = isAdmin && hasAdminRole;

    console.log(`Admin check:`);
    console.log(`  isAdmin: ${isAdmin}`);
    console.log(`  role === 'admin': ${hasAdminRole}`);
    console.log(`  Meets requirements: ${meetsRequirements}\n`);

    if (!meetsRequirements) {
      console.log('❌ User does not meet admin requirements');
      process.exit(1);
    }

    console.log('✅ User should be able to log in successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error testing login:', error);
    process.exit(1);
  }
}

// Run the function
testLogin();
