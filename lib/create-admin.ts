import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function createAdminUser() {
  try {
    const connectDB = (await import('./mongodb')).default;
    const User = (await import('./models/User')).default;
    const bcrypt = (await import('bcryptjs')).default;

    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Get admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'kipkoechkevin611@gmaill.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log('ℹ️  Admin user already exists');
      console.log('   Email:', adminEmail);
      console.log('   Login URL: http://localhost:3001/admin/login');
      console.log('   Please use the existing password or reset if needed');
      process.exit(0);
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 10);
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashedPassword,
      isAdmin: true,
      role: 'admin',
    });

    console.log('✅ Admin user created successfully');
    console.log('   Email:', adminEmail);
    console.log('   Password:', adminPassword);
    console.log('   Role: admin');
    console.log('   Login URL: http://localhost:3001/admin/login');
    console.log('   ⚠️  Please change the password after first login');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  }
}

// Run the function
createAdminUser();
