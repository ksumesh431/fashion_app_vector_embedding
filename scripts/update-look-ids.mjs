#!/usr/bin/env node
/**
 * After running seed.mjs, run this script to automatically
 * update the supabaseId fields in src/lib/data.ts using
 * the product-ids.json mapping file.
 *
 * This replaces ALL supabaseIds (not just empty ones),
 * so it's safe to re-run after re-seeding.
 *
 * Usage: node scripts/update-look-ids.mjs
 */
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const mappingPath = resolve('scripts/product-ids.json');
const dataPath = resolve('src/lib/data.ts');

try {
    const mapping = JSON.parse(readFileSync(mappingPath, 'utf-8'));
    let dataSrc = readFileSync(dataPath, 'utf-8');

    // Build lookup: category -> list of IDs
    const categoryToIds = {};
    for (const [key, id] of Object.entries(mapping)) {
        const category = key.split(':')[0];
        if (!categoryToIds[category]) categoryToIds[category] = [];
        categoryToIds[category].push(id);
    }

    console.log('Available categories:', Object.keys(categoryToIds).join(', '));
    console.log('');

    const usedIndices = {};
    let updateCount = 0;

    // Match each product block: find name: "category" ... supabaseId: "anything"
    dataSrc = dataSrc.replace(
        /name:\s*"([^"]+)",[\s\S]*?supabaseId:\s*"[^"]*"/g,
        (match, productName) => {
            const category = productName.toLowerCase();
            const ids = categoryToIds[category];
            if (!ids || ids.length === 0) {
                console.log(`⚠️  No IDs found for category "${category}"`);
                return match;
            }
            const idx = usedIndices[category] || 0;
            const id = ids[idx % ids.length];
            usedIndices[category] = idx + 1;
            updateCount++;
            console.log(`✅ ${category} → ${id}`);
            return match.replace(/supabaseId:\s*"[^"]*"/, `supabaseId: "${id}"`);
        }
    );

    writeFileSync(dataPath, dataSrc);
    console.log(`\n✅ Updated ${updateCount} products in ${dataPath}!`);
} catch (err) {
    if (err.code === 'ENOENT') {
        console.error('❌ product-ids.json not found. Run the seed script first:');
        console.error('   node scripts/seed.mjs');
    } else {
        console.error('Error:', err.message);
    }
    process.exit(1);
}
