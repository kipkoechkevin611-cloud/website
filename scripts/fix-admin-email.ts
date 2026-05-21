import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function fixAdminEmail() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const User = (await import('../lib/models/User')).default;
    const bcrypt = (await import('bcryptjs')).default;
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const emailOneL = 'kipkoechkevin611@gmail.com';
    const emailTwoL = 'kipkoechkevin611@gmaill.com';

    // Check if user with one L exists
    let user = await User.findOne({ email: emailOneL });

    if (!user) {
      // Create user with one L email
      const hashedPassword = await bcrypt.hash('admin123', 10);
      user = await User.create({
        name: 'Admin',
        email: emailOneL,
        password: hashedPassword,
        isAdmin: true,
        role: 'admin',
      });
      console.log('✅ Created admin user with email:', emailOneL);
    } else {
      // Update existing user
      user.isAdmin = true;
      user.role = 'admin';
      await user.save();
      console.log('✅ Updated admin user with email:', emailOneL);
    }

    console.log('\nUser details:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name);
    console.log('  isAdmin:', user.isAdmin);
    console.log('  role:', user.role);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing admin email:', error);
    process.exit(1);
  }
}

// Run the function
fixAdminEmail();
