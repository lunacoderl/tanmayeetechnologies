// ============================================================================
// @tanmayee/database — Unified Product Storage & Custom Product Synchronization
// Supports local file persistence, Supabase synchronization, and real-time merging
// ============================================================================

import fs from 'fs';
import path from 'path';
import { SEED_PRODUCTS } from './seed-products';
import { getSupabaseAdmin } from './index';

// Path to persistent custom-products.json
const CUSTOM_PRODUCTS_PATH = path.resolve(__dirname, 'custom-products.json');

// In-memory cache of custom products
let inMemoryCustomProducts: any[] | null = null;

/**
 * Load custom products from disk or memory
 */
export function getCustomProducts(): any[] {
  if (inMemoryCustomProducts) {
    return inMemoryCustomProducts;
  }

  try {
    if (fs.existsSync(CUSTOM_PRODUCTS_PATH)) {
      const fileData = fs.readFileSync(CUSTOM_PRODUCTS_PATH, 'utf-8');
      inMemoryCustomProducts = JSON.parse(fileData);
      if (Array.isArray(inMemoryCustomProducts)) {
        return inMemoryCustomProducts;
      }
    }
  } catch (err) {
    console.warn('Could not read custom-products.json from disk:', err);
  }

  try {
    // Fallback to static require
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const staticData = require('./custom-products.json');
    if (Array.isArray(staticData)) {
      inMemoryCustomProducts = staticData;
      return inMemoryCustomProducts;
    }
  } catch {
    // Ignore fallback error
  }

  inMemoryCustomProducts = [];
  return inMemoryCustomProducts;
}

/**
 * Get merged products (SEED_PRODUCTS + custom products overrides)
 * Custom products take precedence by id or slug.
 */
export function getMergedProducts(): any[] {
  const customProducts = getCustomProducts();
  const baseProducts = [...SEED_PRODUCTS];

  if (!customProducts || customProducts.length === 0) {
    return baseProducts;
  }

  const merged = [...baseProducts];

  for (const custom of customProducts) {
    const existingIndex = merged.findIndex(
      (p) => p.id === custom.id || (custom.slug && p.slug === custom.slug)
    );

    if (existingIndex >= 0) {
      // Merge with custom taking precedence
      merged[existingIndex] = {
        ...merged[existingIndex],
        ...custom,
        // Ensure media matches primary_image_url if updated
        media: custom.media || (custom.primary_image_url ? [
          {
            url: custom.primary_image_url,
            type: 'IMAGE',
            is_primary: true,
            alt: custom.product_name,
          },
          ...(merged[existingIndex].media ? merged[existingIndex].media.slice(1) : [])
        ] : merged[existingIndex].media),
      };
    } else {
      // New custom product added by admin
      merged.unshift(custom);
    }
  }

  return merged;
}

/**
 * Save a custom product permanently to custom-products.json and sync to Supabase
 */
export async function saveCustomProduct(productPayload: any): Promise<{ success: boolean; product: any; error?: string }> {
  try {
    const now = new Date().toISOString();
    const updatedPayload = {
      ...productPayload,
      updated_at: now,
    };

    // 1. Update in-memory and write to disk
    const currentList = [...getCustomProducts()];
    const existingIndex = currentList.findIndex(
      (p) => p.id === updatedPayload.id || (updatedPayload.slug && p.slug === updatedPayload.slug)
    );

    if (existingIndex >= 0) {
      currentList[existingIndex] = {
        ...currentList[existingIndex],
        ...updatedPayload,
      };
    } else {
      currentList.unshift(updatedPayload);
    }

    inMemoryCustomProducts = currentList;

    try {
      fs.writeFileSync(CUSTOM_PRODUCTS_PATH, JSON.stringify(currentList, null, 2), 'utf-8');
    } catch (fsErr) {
      console.warn('Failed to write to custom-products.json file:', fsErr);
    }

    // 2. Also sync to Supabase if available
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        // Find existing row in Supabase by slug or id
        let query = supabase.from('products').select('id, slug');
        if (updatedPayload.slug) {
          query = query.eq('slug', updatedPayload.slug);
        } else if (updatedPayload.id && !updatedPayload.id.startsWith('p')) {
          query = query.eq('id', updatedPayload.id);
        }

        const { data: existingRows } = await query;

        const updateData: any = {
          product_name: updatedPayload.product_name,
          short_description: updatedPayload.short_description || null,
          description: updatedPayload.long_description || updatedPayload.description || null,
          features: updatedPayload.features || null,
          applications: updatedPayload.applications || null,
          status: updatedPayload.status || 'PUBLISHED',
          reference_price: updatedPayload.dealer_price || updatedPayload.reference_price || null,
          price_range_min: updatedPayload.dealer_price || null,
          price_range_max: updatedPayload.base_mrp || null,
          seo_title: updatedPayload.seo_title || null,
          seo_description: updatedPayload.seo_description || null,
          updated_at: now,
        };

        if (updatedPayload.model_number) {
          updateData.model_number = updatedPayload.model_number;
        }

        let targetId: string | null = null;

        if (existingRows && existingRows.length > 0) {
          targetId = existingRows[0].id;
          await supabase.from('products').update(updateData).eq('id', targetId);
        }

        // Update media if targetId exists
        if (targetId && updatedPayload.primary_image_url) {
          await supabase
            .from('product_media')
            .delete()
            .eq('product_id', targetId)
            .eq('type', 'MAIN_IMAGE');

          await supabase.from('product_media').insert({
            product_id: targetId,
            type: 'MAIN_IMAGE',
            url: updatedPayload.primary_image_url,
            is_primary: true,
            alt_text: updatedPayload.product_name,
          });
        }
      }
    } catch (sbErr) {
      console.warn('Supabase sync warning (non-fatal):', sbErr);
    }

    return { success: true, product: updatedPayload };
  } catch (err: any) {
    console.error('saveCustomProduct error:', err);
    return { success: false, product: productPayload, error: err.message || 'Failed to save product' };
  }
}
