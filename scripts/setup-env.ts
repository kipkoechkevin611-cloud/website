import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import crypto from 'crypto';

function generateSecret(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

function setupEnvFile() {
  const envPath = join(process.cwd(), '.env.local');
  let envContent = '';

  // Read existing .env.local if it exists
  if (existsSync(envPath)) {
    envContent = readFileSync(envPath, 'utf-8');
  }

  // Generate secrets if not present
  const jwtSecret = envContent.match(/JWT_SECRET=(.+)/)?.[1] || generateSecret();
  const nextauthSecret = envContent.match(/NEXTAUTH_SECRET=(.+)/)?.[1] || generateSecret();
  const mongodbUri = envContent.match(/MONGODB_URI=(.+)/)?.[1];
  const nextauthUrl = envContent.match(/NEXTAUTH_URL=(.+)/)?.[1] || 'http://localhost:3001';
  const adminEmail = envContent.match(/ADMIN_EMAIL=(.+)/)?.[1] || 'kipkoechkevin611@gmaill.com';
  const adminPassword = envContent.match(/ADMIN_PASSWORD=(.+)/)?.[1] || 'admin123';

  // Require MongoDB URI for production deployment
  if (!mongodbUri) {
    console.error('❌ MONGODB_URI is required in .env.local');
    console.error('   Please add your MongoDB Atlas connection string:');
    console.error('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce?appName=Cluster0');
    process.exit(1);
  }

  // Create/update .env.local
  const newEnvContent = `# MongoDB
MONGODB_URI=${mongodbUri}

# JWT Secret
JWT_SECRET=${jwtSecret}

# Next.js
NEXTAUTH_URL=${nextauthUrl}
NEXTAUTH_SECRET=${nextauthSecret}

# Admin Credentials
ADMIN_EMAIL=${adminEmail}
ADMIN_PASSWORD=${adminPassword}

# Business Info
BUSINESS_NAME=ILOSUNOT JEISO HOME APPLIANCE
BUSINESS_PHONE=254780558800
BUSINESS_WHATSAPP=https://wa.me/254780558800
BUSINESS_LOCATION=Nakuru, Kenya
`;

  writeFileSync(envPath, newEnvContent);
  console.log('✅ .env.local configured successfully');
  console.log('   MongoDB URI:', mongodbUri);
  console.log('   JWT Secret:', jwtSecret.substring(0, 10) + '...');
  console.log('   NextAuth Secret:', nextauthSecret.substring(0, 10) + '...');
  console.log('   NextAuth URL:', nextauthUrl);
  console.log('   Admin Email:', adminEmail);
  console.log('   Admin Password:', adminPassword);
}

setupEnvFile();
