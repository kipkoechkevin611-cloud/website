import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

// MongoDB URI from environment variable (required)
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment variable is required');
  console.error('   Please set MONGODB_URI in your .env.local file');
  process.exit(1);
}

// Define User schema inline for seed script
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  cartItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
  }],
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
});

// Define Product schema inline for seed script
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  stock: { type: Number, required: true },
  featured: { type: Boolean, default: false },
  ratings: { type: Number, default: 0 },
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: String,
    rating: Number,
    comment: String,
    createdAt: { type: Date, default: Date.now },
  }],
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const sampleProducts = [
  {
    name: 'Samsung 253L Double Door Refrigerator',
    price: 85000,
    category: 'Refrigeration',
    description: 'Energy-efficient double door refrigerator with frost-free technology, digital display, and spacious compartments for all your storage needs.',
    image: '/assets/products/samsung-fridge.jpg',
    stock: 10,
    featured: true,
    ratings: 4.5,
    reviews: [],
  },
  {
    name: 'LG 8kg Front Load Washing Machine',
    price: 65000,
    category: 'Laundry Appliances',
    description: 'Advanced washing machine with AI Direct Drive technology, steam cleaning, and multiple wash programs for all fabric types.',
    image: '/assets/products/lg-washing-machine.jpg',
    stock: 8,
    featured: true,
    ratings: 4.7,
    reviews: [],
  },
  {
    name: 'Mika 60cm Gas Cooker with Oven',
    price: 45000,
    category: 'Cooking Appliances',
    description: 'Professional 4-burner gas cooker with electric oven, automatic ignition, and tempered glass top for modern kitchens.',
    image: '/assets/products/mika-cooker.jpg',
    stock: 15,
    featured: true,
    ratings: 4.3,
    reviews: [],
  },
  {
    name: 'Ramtons 30L Microwave Oven',
    price: 18000,
    category: 'Cooking Appliances',
    description: 'Versatile microwave oven with grill and convection functions, digital controls, and multiple cooking presets.',
    image: '/assets/products/ramtons-microwave.jpg',
    stock: 20,
    featured: false,
    ratings: 4.2,
    reviews: [],
  },
  {
    name: 'Samsung 55" 4K Smart TV',
    price: 95000,
    category: 'Electronics',
    description: 'Ultra HD Smart TV with HDR, built-in WiFi, streaming apps, and voice control for the ultimate entertainment experience.',
    image: '/assets/products/samsung-tv.jpg',
    stock: 12,
    featured: true,
    ratings: 4.8,
    reviews: [],
  },
  {
    name: 'Philips 750W Blender',
    price: 12000,
    category: 'Small Home Appliances',
    description: 'High-performance blender with stainless steel blades, multiple speed settings, and pulse function for smooth blending.',
    image: '/assets/products/philips-blender.jpg',
    stock: 25,
    featured: false,
    ratings: 4.4,
    reviews: [],
  },
  {
    name: 'Ramtons 1.7L Electric Kettle',
    price: 4500,
    category: 'Small Home Appliances',
    description: 'Fast-boiling electric kettle with auto shut-off, water level indicator, and cool-touch handle for safe operation.',
    image: '/assets/products/ramtons-kettle.jpg',
    stock: 30,
    featured: false,
    ratings: 4.1,
    reviews: [],
  },
  {
    name: 'Philips 2400W Steam Iron',
    price: 8000,
    category: 'Small Home Appliances',
    description: 'Powerful steam iron with variable steam control, anti-drip system, and ceramic soleplate for smooth ironing.',
    image: '/assets/products/philips-iron.jpg',
    stock: 22,
    featured: false,
    ratings: 4.3,
    reviews: [],
  },
  {
    name: 'Mika 45L Electric Oven',
    price: 32000,
    category: 'Cooking Appliances',
    description: 'Large capacity electric oven with convection, grill, and rotisserie functions for versatile cooking.',
    image: '/assets/products/mika-oven.jpg',
    stock: 10,
    featured: false,
    ratings: 4.4,
    reviews: [],
  },
  {
    name: 'Philips Air Fryer HD9650',
    price: 28000,
    category: 'Small Home Appliances',
    description: 'Rapid Air technology air fryer with digital display, preset programs, and large capacity for healthy frying.',
    image: '/assets/products/philips-airfryer.jpg',
    stock: 18,
    featured: true,
    ratings: 4.6,
    reviews: [],
  },
  {
    name: 'Hisense 195L Single Door Refrigerator',
    price: 42000,
    category: 'Refrigeration',
    description: 'Compact single door refrigerator with direct cooling, adjustable shelves, and vegetable crisper drawer.',
    image: '/assets/products/hisense-fridge.jpg',
    stock: 14,
    featured: false,
    ratings: 4.2,
    reviews: [],
  },
  {
    name: 'LG 7kg Top Load Washing Machine',
    price: 38000,
    category: 'Laundry Appliances',
    description: 'Efficient top load washing machine with inverter technology, multiple wash programs, and turbo drum.',
    image: '/assets/products/lg-topload-washer.jpg',
    stock: 16,
    featured: false,
    ratings: 4.3,
    reviews: [],
  },
  {
    name: 'Von 4-Burner Gas Cooker',
    price: 28000,
    category: 'Cooking Appliances',
    description: 'Affordable 4-burner gas cooker with manual ignition, enamel coating, and sturdy construction.',
    image: '/assets/products/von-cooker.jpg',
    stock: 20,
    featured: false,
    ratings: 4.0,
    reviews: [],
  },
  {
    name: 'Samsung 32" HD Smart TV',
    price: 45000,
    category: 'Electronics',
    description: 'Compact Smart TV with HD display, built-in WiFi, and smart features for small spaces.',
    image: '/assets/products/samsung-32tv.jpg',
    stock: 15,
    featured: false,
    ratings: 4.4,
    reviews: [],
  },
  {
    name: 'Bruhm 50L Chest Freezer',
    price: 35000,
    category: 'Refrigeration',
    description: 'Large capacity chest freezer with fast freezing, adjustable thermostat, and energy-efficient operation.',
    image: '/assets/products/bruhm-freezer.jpg',
    stock: 8,
    featured: false,
    ratings: 4.3,
    reviews: [],
  },
  {
    name: 'Moulinex Food Processor',
    price: 15000,
    category: 'Small Home Appliances',
    description: 'Multi-functional food processor with chopping, slicing, grating, and kneading attachments.',
    image: '/assets/products/moulinex-processor.jpg',
    stock: 12,
    featured: false,
    ratings: 4.2,
    reviews: [],
  },
  {
    name: 'Syinix 9kg Twin Tub Washing Machine',
    price: 22000,
    category: 'Laundry Appliances',
    description: 'Budget-friendly twin tub washing machine with wash and spin functions, compact design.',
    image: '/assets/products/syinix-washer.jpg',
    stock: 25,
    featured: false,
    ratings: 4.1,
    reviews: [],
  },
  {
    name: 'Nasco 20L Microwave Oven',
    price: 14000,
    category: 'Cooking Appliances',
    description: 'Compact microwave oven with mechanical controls, defrost function, and easy operation.',
    image: '/assets/products/nasco-microwave.jpg',
    stock: 18,
    featured: false,
    ratings: 4.0,
    reviews: [],
  },
  {
    name: 'LG 43" FHD Smart TV',
    price: 58000,
    category: 'Electronics',
    description: 'Full HD Smart TV with webOS, built-in WiFi, and smart features for enhanced viewing.',
    image: '/assets/products/lg-43tv.jpg',
    stock: 10,
    featured: false,
    ratings: 4.5,
    reviews: [],
  },
  {
    name: 'Kenwood 2-Slice Toaster',
    price: 6500,
    category: 'Small Home Appliances',
    description: 'Stylish 2-slice toaster with browning control, cancel function, and removable crumb tray.',
    image: '/assets/products/kenwood-toaster.jpg',
    stock: 28,
    featured: false,
    ratings: 4.2,
    reviews: [],
  },
  {
    name: 'Hotpoint 50/50 Fridge Freezer',
    price: 55000,
    category: 'Refrigeration',
    description: 'Split fridge freezer with equal capacity, frost-free freezer, and adjustable shelves.',
    image: '/assets/products/hotpoint-fridgefreezer.jpg',
    stock: 9,
    featured: false,
    ratings: 4.3,
    reviews: [],
  },
  {
    name: 'Bosch 9kg Washing Machine',
    price: 72000,
    category: 'Laundry Appliances',
    description: 'Premium washing machine with EcoSilence drive, anti-stain technology, and VarioPerfect.',
    image: '/assets/products/bosch-washer.jpg',
    stock: 6,
    featured: true,
    ratings: 4.7,
    reviews: [],
  },
  {
    name: 'Scanfrost 4-Burner Gas Cooker',
    price: 32000,
    category: 'Cooking Appliances',
    description: 'Reliable gas cooker with electric ignition, enamel coating, and oven thermostat.',
    image: '/assets/products/scanfrost-cooker.jpg',
    stock: 12,
    featured: false,
    ratings: 4.1,
    reviews: [],
  },
  {
    name: 'Sony 65" 4K Android TV',
    price: 120000,
    category: 'Electronics',
    description: 'Premium Android TV with 4K HDR, Google Assistant, and Dolby Vision for cinema-quality viewing.',
    image: '/assets/products/sony-65tv.jpg',
    stock: 5,
    featured: true,
    ratings: 4.9,
    reviews: [],
  },
  {
    name: 'NutriBullet 600W Blender',
    price: 9500,
    category: 'Small Home Appliances',
    description: 'Powerful personal blender for smoothies, shakes, and nutrient extraction.',
    image: '/assets/products/nutribullet.jpg',
    stock: 30,
    featured: false,
    ratings: 4.5,
    reviews: [],
  },
];

async function seed() {
  try {
    if (!MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is required');
    }
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing data');

    // Create default admin user
    const hashedPassword = await bcrypt.hash('Admin123@', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@ilosunot.com',
      password: hashedPassword,
      isAdmin: true,
      cartItems: [],
      wishlist: [],
    });
    console.log('✅ Created admin user: admin@ilosunot.com');

    // Create sample products
    await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${sampleProducts.length} sample products`);

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📝 Login credentials:');
    console.log('   Email: admin@ilosunot.com');
    console.log('   Password: Admin123@');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seed();
