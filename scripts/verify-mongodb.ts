import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function verifyConnection() {
  try {
    console.log('🔍 Verifying MongoDB connection...');
    console.log('   MongoDB URI:', process.env.MONGODB_URI);

    // Dynamic import after env vars are loaded
    const connectDB = (await import('../lib/mongodb')).default;
    await connectDB();

    console.log('✅ MongoDB connection successful!');
    console.log('   Database is ready for use.');
    process.exit(0);
  } catch (error) {
    console.error('❌ MongoDB connection failed!');
    console.error('   Error:', error);
    console.error('\n   Please ensure:');
    console.error('   1. MongoDB is running on your system');
    console.error('   2. The MONGODB_URI in .env.local is correct');
    console.error('   3. MongoDB is accessible at the specified URI');
    process.exit(1);
  }
}

verifyConnection();
