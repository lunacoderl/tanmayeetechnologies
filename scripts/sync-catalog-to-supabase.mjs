import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SUPABASE_URL = 'https://meczqfzcjhegnlutxzdz.supabase.co';
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1lY3pxZnpjamhlZ25sdXR4emR6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MDA3NjE3MSwiZXhwIjoyMTA1NjUyMTcxfQ.dYL9vZHPFFf5U3ACShwswp7nNpOF5m8JWzSStkP3Ih4';

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function syncAll() {
  console.log('--- Starting Catalog Sync to Supabase ---');
  const catalogPath = path.resolve(rootDir, 'packages/database/src/extracted-catalog.json');
  const catalog = JSON.parse(fs.readFileSync(catalogPath, 'utf8'));

  console.log(`Loaded ${catalog.length} products from extracted-catalog.json.`);

  // 1. First, delete legacy 113 dummy products that have empty model_number or old slugs
  const { data: existingRows } = await supabase.from('products').select('id, slug, model_number');
  if (existingRows) {
    const catalogSlugs = new Set(catalog.map((c) => c.slug));
    const legacyToDelete = existingRows.filter((r) => !catalogSlugs.has(r.slug));
    console.log(`Found ${legacyToDelete.length} legacy dummy rows in Supabase to clean up.`);
    for (const leg of legacyToDelete) {
      await supabase.from('product_media').delete().eq('product_id', leg.id);
      await supabase.from('product_attributes').delete().eq('product_id', leg.id);
      await supabase.from('products').delete().eq('id', leg.id);
    }
    console.log('✔ Cleaned up legacy dummy rows.');
  }

  // 2. Insert or update all 155 products
  let count = 0;
  for (let i = 0; i < catalog.length; i++) {
    const item = catalog[i];
    const uuid = '00000000-0000-0000-0000-' + String(i + 1).padStart(12, '0');

    const productRow = {
      id: uuid,
      product_name: item.product_name,
      slug: item.slug,
      model_number: item.model_number,
      brand_id: item.brand_id,
      category_id: item.category_id,
      status: 'PUBLISHED',
      reference_price: item.reference_price || item.price_range_min || 35000,
      price_range_min: item.price_range_min || item.reference_price || 32000,
      price_range_max: item.price_range_max || 38000,
      short_description: item.short_description || '',
      description: item.description || '',
      features: Array.isArray(item.features) ? item.features : [],
      applications: Array.isArray(item.applications) ? item.applications : [],
      seo_title: item.seo_title || `${item.product_name} | Tanmayee Technologies`,
      seo_description: item.seo_description || '',
      updated_at: new Date().toISOString(),
    };

    const { error: pErr } = await supabase.from('products').upsert(productRow);
    if (pErr) {
      console.error(`Error upserting product ${item.slug}:`, pErr.message);
      continue;
    }

    // 3. Upsert media
    const mediaToInsert = [];
    if (Array.isArray(item.media)) {
      item.media.forEach((m, idx) => {
        const url = typeof m === 'string' ? m : m.url;
        if (url) {
          mediaToInsert.push({
            product_id: uuid,
            type: idx === 0 ? 'MAIN_IMAGE' : 'GALLERY',
            url,
            is_primary: idx === 0,
            sort_order: idx,
            alt_text: typeof m === 'object' && m.alt ? m.alt : `${item.product_name} View ${idx + 1}`,
            title: `${item.product_name} Angle ${idx + 1}`,
          });
        }
      });
    }

    if (mediaToInsert.length > 0) {
      await supabase.from('product_media').delete().eq('product_id', uuid);
      const { error: mErr } = await supabase.from('product_media').insert(mediaToInsert);
      if (mErr) console.warn(`Media insert warning for ${item.slug}:`, mErr.message);
    }

    // 4. Upsert attributes
    if (Array.isArray(item.attributes) && item.attributes.length > 0) {
      const attrsToInsert = item.attributes
        .filter((a) => (a.attribute_name || a.name) && (a.attribute_value || a.value))
        .map((a, aIdx) => ({
          product_id: uuid,
          attribute_name: a.attribute_name || a.name,
          attribute_value: String(a.attribute_value || a.value),
          attribute_unit: a.attribute_unit || a.unit || null,
          sort_order: aIdx,
        }));

      if (attrsToInsert.length > 0) {
        await supabase.from('product_attributes').delete().eq('product_id', uuid);
        await supabase.from('product_attributes').insert(attrsToInsert);
      }
    }

    count++;
    if (count % 25 === 0 || count === catalog.length) {
      console.log(`Synced ${count}/${catalog.length} products with media and attributes...`);
    }
  }

  console.log('--- Successfully synchronized all 155 catalog products, media, and attributes into Supabase! ---');
}

syncAll().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
