// ============================================================================
// @tanmayee/database — Unified Product Storage & Custom Product Synchronization
// Safe for both client-side browser bundles, Next.js SSR, and Node.js server runtime
// ============================================================================

import { SEED_PRODUCTS } from './seed-products';
import { getSupabaseAdmin } from './index';
import customProductsStatic from './custom-products.json';

// In-memory cache of custom products
let inMemoryCustomProducts: any[] | null = null;

/**
 * Helper to safely get Node.js fs & path modules without breaking client-side webpack bundles
 */
function getNodeModules(): { fs: any; path: any } | null {
  try {
    if (typeof window === 'undefined' && typeof process !== 'undefined' && process.versions && process.versions.node) {
      // Use eval('require') so webpack does not attempt to bundle 'fs' or 'path' for browser
      const req = eval('require');
      const fs = req('fs');
      const path = req('path');
      return { fs, path };
    }
  } catch {
    // Non-Node environment or bundling restriction
  }
  return null;
}

/**
 * Load custom products from memory, disk (if on Node server), or static import fallback
 */
export function getCustomProducts(): any[] {
  if (inMemoryCustomProducts) {
    return inMemoryCustomProducts;
  }

  // 1. In Node server environment, check if updated file exists on disk
  const node = getNodeModules();
  if (node) {
    try {
      const customPath = node.path.resolve(__dirname, 'custom-products.json');
      if (node.fs.existsSync(customPath)) {
        const fileData = node.fs.readFileSync(customPath, 'utf-8');
        const parsed = JSON.parse(fileData);
        if (Array.isArray(parsed)) {
          inMemoryCustomProducts = parsed;
          return inMemoryCustomProducts;
        }
      }
    } catch {
      // Fall through to static import
    }
  }

  // 2. Browser & Vercel serverless fallback: use bundled customProductsStatic
  if (Array.isArray(customProductsStatic)) {
    inMemoryCustomProducts = [...customProductsStatic];
    return inMemoryCustomProducts;
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
 * Save a custom product permanently to custom-products.json (when writable) and sync to Supabase
 */
export async function saveCustomProduct(productPayload: any): Promise<{ success: boolean; product: any; error?: string }> {
  try {
    const now = new Date().toISOString();
    const updatedPayload = {
      ...productPayload,
      updated_at: now,
    };

    // 1. Update in-memory cache
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

    // 2. Persist to disk if running in local Node environment with write permission
    const node = getNodeModules();
    if (node) {
      try {
        const customPath = node.path.resolve(__dirname, 'custom-products.json');
        node.fs.writeFileSync(customPath, JSON.stringify(currentList, null, 2), 'utf-8');
      } catch (fsErr) {
        console.warn('Local file write skipped (read-only or serverless environment):', fsErr);
      }
    }

    // 3. Sync to Supabase database (primary persistent storage for production)
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
