import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function checkProductImages() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const Product = (await import('../lib/models/Product')).default;
    
    await connectDB();
    console.log('✅ Connected to MongoDB');

    const products = await Product.find().limit(10);
    
    console.log(`\nFound ${products.length} product(s):\n`);
    
    products.forEach((product, index) => {
      console.log(`Product ${index + 1}:`);
      console.log(`  Name: ${product.name}`);
      console.log(`  Image: ${product.image}`);
      console.log(`  Category: ${product.category}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking product images:', error);
    process.exit(1);
  }
}

// Run the function
checkProductImages();
