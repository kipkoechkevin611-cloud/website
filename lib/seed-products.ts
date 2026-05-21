import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function seedProducts() {
  try {
    const connectDB = (await import('./mongodb')).default;
    const Product = (await import('./models/Product')).default;
    const { productsData } = await import('./products-data');

    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Check if products already exist
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`ℹ️  ${existingCount} products already exist in database`);
      console.log('   Skipping seed to prevent duplicates');
      console.log('   To re-seed, clear the database first');
      process.exit(0);
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️  Cleared existing products');

    // Insert products from static data
    await Product.insertMany(productsData);
    console.log(`✅ Seeded ${productsData.length} products to MongoDB`);
    console.log('   All products imported successfully');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    process.exit(1);
  }
}

// Run the seed function
seedProducts();
