import { pipeline } from '@xenova/transformers';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ═══════════════════════════════════════════════════════════
// Real catalog product images — standardized e-commerce shots
// ═══════════════════════════════════════════════════════════
const products = [
  // ── SNEAKERS ─────────────────────────────────────────────
  {
    name: "Diesel Sneakers",
    brand: "Diesel",
    price: "Rs 12999",
    category: "sneakers",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/SEPTEMBER/17/pvpQ7k7w_27ae04204d644720b6837871ec94f122.jpg",
  },
  {
    name: "Sport Sneakers",
    brand: "Myntra",
    price: "Rs 4999",
    category: "sneakers",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/NOVEMBER/7/WwebsS5T_2905988a76a6448995bdf3773121a5cd.jpg",
  },
  {
    name: "Casual Sneakers",
    brand: "Myntra",
    price: "Rs 3999",
    category: "sneakers",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/NOVEMBER/7/CJyGDVKD_16afc9955817445aad41537a3b6eaf67.jpg",
  },
  {
    name: "Running Sneakers",
    brand: "Myntra",
    price: "Rs 5499",
    category: "sneakers",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/SEPTEMBER/17/Q0MkWig5_c23103c2356346ffb5c06f9470fe8146.jpg",
  },

  // ── JEANS ────────────────────────────────────────────────
  {
    name: "Diesel Jeans",
    brand: "Diesel",
    price: "Rs 11999",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/SEPTEMBER/8/pURoJbb2_3db19d111a564d8498eb7307665ff66d.jpg",
  },
  {
    name: "Slim Fit Jeans",
    brand: "Myntra",
    price: "Rs 2999",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/OCTOBER/16/KpWdCl18_494ca097bf844f0b968a9c01cd5b50f6.jpg",
  },
  {
    name: "Washed Denim Jeans",
    brand: "Myntra",
    price: "Rs 3499",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/MAY/21/y2vERMSO_351548713c604f8188cf2bf5abbdd856.jpg",
  },
  {
    name: "Roadster Jeans",
    brand: "Roadster",
    price: "Rs 1999",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/32591728/2025/7/2/cc0b90a7-7577-45ff-b7bc-6f6389f76d241751435828672-Roadster-Men-Jeans-2551751435827427-2.jpg",
  },
  {
    name: "Regular Fit Jeans",
    brand: "Myntra",
    price: "Rs 2499",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/NOVEMBER/3/gk0JQpFt_273024dcaa934a0ca876dac6d4fab634.jpg",
  },
  {
    name: "Straight Fit Jeans",
    brand: "Myntra",
    price: "Rs 2799",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/FEBRUARY/10/5UF0jrad_1e841eb145ee4ba587e9a7cb6fbd805b.jpg",
  },
  {
    name: "HERE&NOW Jeans",
    brand: "HERE&NOW",
    price: "Rs 1799",
    category: "jeans",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/32001129/2025/5/6/8da4e535-d937-4876-bc37-c24235295dd11746521439963-HERENOW-Men-Jeans-5941746521439324-2.jpg",
  },
  {
    name: "HERE&NOW Jeans",
    brand: "HERE&NOW",
    price: "Rs 1899",
    category: "jeans",
    imageUrl: "https://cdn-images.farfetch-contents.com/24/06/05/75/24060575_65020822_2048.jpg",
  },


  // ── SWEATSHIRTS ──────────────────────────────────────────

  {
    name: "Classic Sweatshirt",
    brand: "Myntra",
    price: "Rs 2499",
    category: "sweatshirt",
    imageUrl: "https://assets.myntassets.com/h_720,q_90,w_540/v1/assets/images/2025/JULY/24/Q6Bx9Iba_d8512212fdfd4433a84aff58a4cad63f.jpg",
  },

  // ── SWEATSHIRTS (Look 2) ──────────────────────────────────

  {
    name: "Roadster Sweatshirt",
    brand: "Roadster",
    price: "Rs 1799",
    category: "sweatshirt",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/22875694/2023/11/8/8f78e8ee-0f23-4661-80f5-0cde899c37701699438497139-Roadster-Women-Sweatshirts-631699438496757-1.jpg",
  },
  {
    name: "Pullover Sweatshirt",
    brand: "Myntra",
    price: "Rs 3499",
    category: "sweatshirt",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/DECEMBER/1/HlADkcG6_9b0b615874e84c3a95bec78a18aee1c2.jpg",
  },
  {
    name: "Zip-up Sweatshirt",
    brand: "Myntra",
    price: "Rs 2799",
    category: "sweatshirt",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2026/JANUARY/16/2RjrVfmy_1671d09c422f4e758efec9a1543dad6e.jpg",
  },

  {
    name: "Roadster Sweater",
    brand: "Roadster",
    price: "Rs 1599",
    category: "sweatshirt",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/11990860/2020/12/5/ca4d42a8-10a0-465e-8ac0-d9defccaee341607160731630-Roadster-Women-Sweaters-1341607160729916-1.jpg",
  },


  // ── SHORTS ───────────────────────────────────────────────
  {
    name: "Casual Shorts",
    brand: "Myntra",
    price: "Rs 1499",
    category: "shorts",
    imageUrl: "https://www.jiomart.com/images/product/original/rvxukcsrcu/robinbosky-women-s-premium-4-way-stretchable-cycling-sports-jogging-yoga-shorts-tights_pack-of-1_beige_xl-product-images-rvxukcsrcu-3-202302270641.jpg?im=Resize=(600,750)",
  },
  {
    name: "NEXT Shorts",
    brand: "NEXT",
    price: "Rs 1999",
    category: "shorts",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/31431166/2024/12/30/0153d184-ba75-4663-a16e-abfe2aeb33a61735549844975-NEXT-Women-Shorts-8201735549844821-1.jpg",
  },
  {
    name: "Denim Shorts",
    brand: "Myntra",
    price: "Rs 1799",
    category: "shorts",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2026/FEBRUARY/22/m4CL8E9z_ba0e5983c3cf4537bed5016ead0663fa.jpg",
  },
  {
    name: "Formal Shorts",
    brand: "Myntra",
    price: "Rs 2299",
    category: "shorts",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/28556158/2024/3/28/8e56146b-a78f-4ce7-b7e4-6874da245a581711636276839Trousers1.jpg",
  },
  {
    name: "Sport Shorts",
    brand: "Myntra",
    price: "Rs 1299",
    category: "shorts",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/NOVEMBER/28/LU6kDVrj_9bbdeeb8f9944c76871c137ccea6194a.jpg",
  },
  {
    name: "High-Rise Shorts",
    brand: "Clovia",
    price: "Rs 999",
    category: "shorts",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/21868626/2023/2/6/29664571-0063-4aea-9312-6932675aedf31675693269203CloviaWomenBlueHigh-RiseShorts1.jpg",
  },

  // ── SHOES ────────────────────────────────────────────────
  {
    name: "Block Heel Shoes",
    brand: "Myntra",
    price: "Rs 3999",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/JANUARY/23/N7zqhNCS_71525c68bf344223b01960115be11781.jpg",
  },
  {
    name: "Casual Shoes",
    brand: "Myntra",
    price: "Rs 2999",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2024/SEPTEMBER/3/KFXj6BaX_ed19e2e696284811b690497563cd39f0.jpg",
  },
  {
    name: "Heeled Sandals",
    brand: "Myntra",
    price: "Rs 2499",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/JUNE/27/1dXtx0S0_77e5b870786f494a8edc2b0a52be0f7c.jpg",
  },
  {
    name: "Pointed Toe Boots",
    brand: "Shoetopia",
    price: "Rs 3499",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/32222421/2025/1/13/897f0ab8-9416-46c1-9869-30c86425ea5c1736764461422-Shoetopia-Women-Pointed-Toe-Block-Heel-Regular-Boots-3321736-1.jpg",
  },
  {
    name: "Strappy Heels",
    brand: "Myntra",
    price: "Rs 2799",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/JUNE/26/UUHeKFoU_27dcef3b801f4c97977c959cfbf86ee7.jpg",
  },
  {
    name: "Platform Shoes",
    brand: "Myntra",
    price: "Rs 3299",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/JUNE/25/4tli6JBS_49c7e1323abc4feca19fe5818bfacace.jpg",
  },
  {
    name: "Ankle Boots",
    brand: "Myntra",
    price: "Rs 4499",
    category: "shoes",
    imageUrl: "https://assets.myntassets.com/h_1440,q_90,w_1080/v1/assets/images/2025/SEPTEMBER/1/EUGtVziB_28a252148ae04706b34d3d1e3e0ee93f.jpg",
  },
];

async function main() {
  console.log('═══════════════════════════════════════════════');
  console.log('  AI Fashion App — Product Seeder');
  console.log(`  Seeding ${products.length} products into Supabase`);
  console.log('═══════════════════════════════════════════════\n');

  // 1. Clear existing products
  console.log('🗑️  Clearing existing products table...');
  const { error: deleteError } = await supabase.from('products').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (deleteError) {
    console.error('Failed to clear table:', deleteError.message);
    console.log('Continuing anyway...\n');
  } else {
    console.log('   Table cleared.\n');
  }

  // 2. Load CLIP model
  console.log('🧠 Loading CLIP model (Xenova/clip-vit-base-patch32)...');
  const extractor = await pipeline('image-feature-extraction', 'Xenova/clip-vit-base-patch32');
  console.log('   ✅ Model loaded!\n');

  // 3. Seed products
  const productMap = {};
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const progress = `[${i + 1}/${products.length}]`;

    try {
      process.stdout.write(`${progress} Processing "${product.name}" (${product.brand})... `);

      const output = await extractor(product.imageUrl);
      const embedding = Array.from(output.data);

      const { data, error } = await supabase
        .from('products')
        .insert({
          name: product.name,
          brand: product.brand,
          price: product.price,
          category: product.category,
          image_url: product.imageUrl,
          embedding: embedding,
        })
        .select('id')
        .single();

      if (error) {
        console.log(`❌ DB Error: ${error.message}`);
        failCount++;
      } else {
        console.log(`✅ ${data.id}`);
        productMap[`${product.category}:${product.name}`] = data.id;
        successCount++;
      }
    } catch (err) {
      console.log(`❌ Error: ${err.message}`);
      failCount++;
    }
  }

  console.log('\n═══════════════════════════════════════════════');
  console.log(`  Done! ✅ ${successCount} succeeded, ❌ ${failCount} failed`);
  console.log('═══════════════════════════════════════════════\n');

  // Save mapping
  const mappingPath = './scripts/product-ids.json';
  writeFileSync(mappingPath, JSON.stringify(productMap, null, 2));
  console.log(`📄 Product ID mapping saved to ${mappingPath}\n`);

  // Print key IDs for Looks
  console.log('── Key product IDs for Look 1 ──');
  const sneakersId = productMap['sneakers:Diesel Sneakers'];
  const jeansId = productMap['jeans:Diesel Jeans'];
  const sweatshirtId = productMap['sweatshirt:Khaki Sweatshirt'];
  console.log(`  Sneakers:    ${sneakersId || 'N/A'}`);
  console.log(`  Jeans:       ${jeansId || 'N/A'}`);
  console.log(`  Sweatshirt:  ${sweatshirtId || 'N/A'}`);

  console.log('\n── Key product IDs for Look 2 ──');
  const sweatshirt2Id = productMap['sweatshirt:Oversized Sweatshirt'];
  const shortsId = productMap['shorts:Casual Shorts'];
  const shoesId = productMap['shoes:Block Heel Shoes'];
  console.log(`  Sweatshirt:  ${sweatshirt2Id || 'N/A'}`);
  console.log(`  Shorts:      ${shortsId || 'N/A'}`);
  console.log(`  Shoes:       ${shoesId || 'N/A'}`);
}

main().catch(console.error);