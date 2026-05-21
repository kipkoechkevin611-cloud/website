import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local BEFORE any imports
config({ path: resolve(process.cwd(), '.env.local') });

async function updateProductImages() {
  try {
    const connectDB = (await import('../lib/mongodb')).default;
    const Product = (await import('../lib/models/Product')).default;

    await connectDB();
    console.log('✅ Connected to MongoDB');

    // Map of product names to actual image files
    const imageMap = {
      'Samsung 253L Double Door Refrigerator': 'Hisense Double Door Fridge 91 Litres REF091DR @ 20,000.jpeg',
      'LG 8kg Front Load Washing Machine': 'hssense wshng machne.jpeg',
      'Mika 60cm Gas Cooker with Oven': 'Electromate Standing Cooker 3G+1E 50×55  19000.jpeg',
      'Ramtons 30L Microwave Oven': 'Von Digital Microwave + Grill 20 Litres VAMG-20DGB @ 12,500.jpeg',
      'Samsung 55" 4K Smart TV': 'Hisense 65 Q6 Series QLED SMART TV 4K @ 73,000.jpeg',
      'Philips 750W Blender': 'Syinix 2 In 1 Blender @ 4,200 .jpeg',
      'Ramtons 1.7L Electric Kettle': 'Vitron Cordless Kettle P5 P6 2L @ 1,800.jpeg',
      'Philips 2400W Steam Iron': 'OLEAR OL-6008 Rechargeable Shaver @ 1400.jpeg',
      'Mika 45L Electric Oven': 'Electromate Standing Cooker 3G+1E 50×55  19000.jpeg',
      'Philips Air Fryer HD9650': 'Ailyons Air Fryer 5L AF-389  4800.jpeg',
      'Hisense 195L Single Door Refrigerator': 'Hisense Single Door Fridge 94 Litres REF094DR @ 18,500.jpeg',
      'LG 7kg Top Load Washing Machine': 'hssense wshng machne.jpeg',
      'Von 4-Burner Gas Cooker': 'Electromate Standing Cooker 3G+1E 50×55  19000.jpeg',
      'Samsung 32" HD Smart TV': 'Amtec 32 Smart TV AC DC  13,400.jpeg',
      'Bruhm 50L Chest Freezer': 'Hisense Double Door Fridge 91 Litres REF091DR @ 20,000.jpeg',
      'Moulinex Food Processor': 'Syinix 2 In 1 Blender @ 4,200 .jpeg',
      'Syinix 9kg Twin Tub Washing Machine': 'hssense wshng machne.jpeg',
      'Nasco 20L Microwave Oven': 'Von Digital Microwave + Grill 20 Litres VAMG-20DGB @ 12,500.jpeg',
      'LG 43" FHD Smart TV': 'Amtec 32 Smart TV AC DC  13,400.jpeg',
      'Kenwood 2-Slice Toaster': 'Vitron Cordless Kettle P5 P6 2L @ 1,800.jpeg',
      'Hotpoint 50/50 Fridge Freezer': 'Hisense Double Door Fridge 91 Litres REF091DR @ 20,000.jpeg',
      'Bosch 9kg Washing Machine': 'hssense wshng machne.jpeg',
      'Scanfrost 4-Burner Gas Cooker': 'Electromate Standing Cooker 3G+1E 50×55  19000.jpeg',
      'Sony 65" 4K Android TV': 'Hisense 65 Q6 Series QLED SMART TV 4K @ 73,000.jpeg',
      'NutriBullet 600W Blender': 'Syinix 2 In 1 Blender @ 4,200 .jpeg',
      // Additional products with better image mappings
      'Ailipu KL-6309 3.1': 'Ailipu KL-6309 3.1  4,600.jpeg',
      'Ailipu KL-8302 3.1 Tallboy': 'Ailipu KL-8302 3.1 Tallboy  11,700.jpeg',
      'Ailyons Air Fryer 5L AF-389': 'Ailyons Air Fryer 5L AF-389  4800.jpeg',
      'Amtec 32 Smart TV AC DC': 'Amtec 32 Smart TV AC DC  13,400.jpeg',
      'Amtec AM-721 3.1 Tallboy': 'Amtec AM-721 3.1 Tallboy  9,500.jpeg',
      'Amtec Wireless Soundbar AM-03': 'Amtec Wireless Soundbar AM-03  6,100.jpeg',
      'Boschmann Car Amplifier 1500 Watts': 'Boschmann Car Amplifier 1500 Watts  9500.jpeg',
      'Car Android Player 10': 'Car Android Player 10  11,500.jpeg',
      'Car Android Player 8': 'Car Android Player 8  10,500gg.jpeg',
      'Car Android Player 9': 'Car Android Player 9.jpeg',
      'Electromate Soundbar SB01': 'Electromate Soundbar SB01  4,200.jpeg',
      'Electromate Soundbar SB02': 'Electromate Soundbar SB02  6,400.jpeg',
      'Electromate Standing Cooker 3G+1E': 'Electromate Standing Cooker 3G+1E 50×55  19000.jpeg',
      'Eoco Double Fryer 6L+6L': 'Eoco Double Fryer 6L+6L  7,200.jpeg',
      'Eoco Single Fryer 6L': 'Eoco Single Fryer 6L  3,800.jpeg',
      'GLD 55 Smart VIDAA 4K TV': 'GLD 55 Smart VIDAA 4K TV @ 38,000.jpeg',
      'Greatstar 14pc Cookware Set': 'Greatstar 14pc Cookware Set.@6800.jpeg',
      'Hisense 65 Q6 Series QLED SMART TV 4K': 'Hisense 65 Q6 Series QLED SMART TV 4K @ 73,000.jpeg',
      'Hisense Double Door Fridge 91 Litres': 'Hisense Double Door Fridge 91 Litres REF091DR @ 20,000.jpeg',
      'Hisense Single Door Fridge 94 Litres': 'Hisense Single Door Fridge 94 Litres REF094DR @ 18,500.jpeg',
      'Nunix Dispenser K1S H&N': 'Nunix Dispenser K1S H&N @ 3,300.jpeg',
      'OLEAR 3 In 1 Rechargeable Shaver': 'OLEAR 3 In 1 Rechargeable Shaver @ 800.jpeg',
      'OLEAR OL-6008 Rechargeable Shaver': 'OLEAR OL-6008 Rechargeable Shaver @ 1400.jpeg',
      'Olelon Standing Cooker 3G + 1 Electric': 'Olelon Standing Cooker 3G + 1 Electric Hot Plate & Electric Oven 50×55 @ 20000.jpeg',
      'Skyworth 43 Smart Google TV': 'Skyworth 43 Smart Google TV @ 26,500f.jpeg',
      'Sokany juicer': 'Sokany juicer @4800.jpeg',
      'Solarmax 50 Smart TV 4K': 'Solarmax 50 Smart TV 4K @ 29,500.jpeg',
      'Solarmax Power Inverter 1000W': 'Solarmax Power Inverter 1000W @ 5,000.jpeg',
      'Solarmax Power Inverter 1500W': 'Solarmax Power Inverter 1500W @ 75,00.jpeg',
      'Solarmax Power Inverter 2000W': 'Solarmax Power Inverter 2000W @ 9200.jpeg',
      'Solarmax Power Inverter 600W': 'Solarmax Power Inverter 600W @ 3,000.jpeg',
      'Syinix 2 In 1 Blender': 'Syinix 2 In 1 Blender @ 4,200 .jpeg',
      'Syinix Standing Cooker 3 Gas + 1 Electric': 'Syinix Standing Cooker 3 Gas + 1 Electric Burner, Electric Oven Rotisserie 50×60 @ 23,500.jpeg',
      'TCL 43 Smart Google QLED TV 43S5K': 'TCL 43 Smart Google QLED TV 43S5K @ 27,500.jpeg',
      'TCL 43 Smart Google TV 4K V6D': 'TCL 43 Smart Google TV 4K V6D @ 31,000.jpeg',
      'Vention 1 In 4 Out HDMI Splitter 4K': 'Vention 1 In 4 Out HDMI Splitter 4K @ 5000.jpeg',
      'Vention 1 In 8 Out HDMI Splitter 4K': 'Vention 1 In 8 Out HDMI Splitter 4K @ 7,800.jpeg',
      'Vention 5 In 1 Out HDMI Switch 4K': 'Vention 5 In 1 Out HDMI Switch 4K @ 5700.jpeg',
      'Vision Plus 43 Smart Whale TV': 'Vision Plus 43 Smart Whale TV @ 24,200.jpeg',
      'Vision Plus 50 QLED VIDAA 4K TV': 'Vision Plus 50 QLED VIDAA 4K TV @ 38,000.jpeg',
      'Vision Plus 55 QLED VIDAA 4K TV': 'Vision Plus 55 QLED VIDAA 4K TV @42,000.jpeg',
      'Vitron 32 Smart QLED TV': 'Vitron 32 Smart QLED TV @ 12600.jpeg',
      'Vitron 43 Smart QLED TV': 'Vitron 43 Smart QLED TV @ 20,500.jpeg',
      'Vitron Cordless Kettle P5 P6 2L': 'Vitron Cordless Kettle P5 P6 2L @ 1,800.jpeg',
      'Vitron Cordless Kettle P7 2L': 'Vitron Cordless Kettle P7 2L with adjustable temperature @ 2,400.jpeg',
      'Vitron Soundbar V535SB 5.1': 'Vitron Soundbar V535SB 5.1 @ 7300.jpeg',
      'Vitron V837 3.1': 'Vitron V837 3.1 @ 7,000.jpeg',
      'Von Digital Microwave + Grill 20 Litres': 'Von Digital Microwave + Grill 20 Litres VAMG-20DGB @ 12,500.jpeg',
      'Wahl Balding Series Original': 'Wahl Balding Series Original @ 8,700.jpeg',
      'WK-02 Wireless Soundbar': 'WK-02 Wireless Soundbar @ 6,100.jpeg',
      'Xiaomi 43 Google TV': 'Xiaomi 43 Google TV @ 25,600.jpeg',
      'Xiaomi 55 Google TV 4K': 'Xiaomi 55 Google TV 4K @ 47,500.jpeg',
      'Xiaomi 65 Google TV 4K': 'Xiaomi 65 Google TV 4K @ 79,000.jpeg',
      'Zeriotti Blow Dryer Original': 'Zeriotti Blow Dryer Original @ 6,800.jpeg',
    };

    const products = await Product.find();

    console.log(`\nUpdating ${products.length} product(s):\n`);

    for (const product of products) {
      const newImage = imageMap[product.name];
      if (newImage) {
        const oldImage = product.image;
        product.image = `/assets/products/${newImage}`;
        await product.save();
        console.log(`✅ Updated ${product.name}:`);
        console.log(`   Old: ${oldImage}`);
        console.log(`   New: ${product.image}`);
      } else {
        console.log(`⚠️  No image mapping found for: ${product.name}`);
      }
    }

    console.log('\n✅ Product images updated successfully');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating product images:', error);
    process.exit(1);
  }
}

// Run the function
updateProductImages();
