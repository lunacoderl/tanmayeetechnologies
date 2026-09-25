// ============================================================================
// @tanmayee/database — Unified Product Storage & Two-Way Supabase Synchronization
// Safe for both client-side browser bundles, Next.js SSR, and Node.js server runtime
// Persists products, full image/video galleries, and attributes to Supabase
// ============================================================================

import { SEED_PRODUCTS } from './seed-products';
import { SEED_BRANDS, SEED_CATEGORIES } from './seed-data';
import { getSupabaseAdmin } from './index';
import customProductsStatic from './custom-products.json';

// In-memory cache of custom products
let inMemoryCustomProducts: any[] | null = null;
let lastSupabaseFetchTime = 0;
const CACHE_TTL_MS = 15000; // 15 seconds cache to balance freshness and speed

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
 * Helper to test if a media URL represents a video
 */
export function isMediaVideo(url: string): boolean {
  if (!url) return false;
  return (
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(url) ||
    url.includes('youtube.com') ||
    url.includes('youtu.be') ||
    url.includes('vimeo.com')
  );
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
        if (Array.isArray(parsed) && parsed.length > 0) {
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
 * Synchronous getMergedProducts (uses in-memory cache, static custom, and SEED_PRODUCTS)
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
        media: normalizeMediaArray(custom, merged[existingIndex]),
      };
    } else {
      // New custom product added by admin
      merged.unshift(custom);
    }
  }

  return merged;
}

/**
 * Normalizes media list from primary image and gallery URLs
 */
function normalizeMediaArray(custom: any, fallbackProduct?: any): any[] {
  if (Array.isArray(custom.media) && custom.media.length > 0) {
    return custom.media.map((m: any, i: number) => ({
      url: typeof m === 'string' ? m : m.url,
      type: (typeof m === 'object' && m.type) ? m.type : (isMediaVideo(typeof m === 'string' ? m : m.url) ? 'VIDEO' : (i === 0 ? 'MAIN_IMAGE' : 'GALLERY')),
      is_primary: typeof m === 'object' && m.is_primary !== undefined ? m.is_primary : (i === 0),
      alt: (typeof m === 'object' && m.alt) ? m.alt : `${custom.product_name || 'Product'} View ${i + 1}`,
    }));
  }

  const result: any[] = [];
  const primary = custom.primary_image_url || fallbackProduct?.primary_image_url || fallbackProduct?.media?.[0]?.url;
  if (primary) {
    result.push({
      url: primary,
      type: isMediaVideo(primary) ? 'VIDEO' : 'MAIN_IMAGE',
      is_primary: true,
      alt: custom.product_name || 'Product Main Image',
    });
  }

  if (Array.isArray(custom.gallery_urls)) {
    custom.gallery_urls.forEach((url: string, i: number) => {
      if (url && url !== primary) {
        result.push({
          url,
          type: isMediaVideo(url) ? 'VIDEO' : 'GALLERY',
          is_primary: false,
          alt: `${custom.product_name || 'Product'} View ${i + 2}`,
        });
      }
    });
  }

  return result.length > 0 ? result : (fallbackProduct?.media || []);
}

/**
 * Asynchronously fetch live products from Supabase database.
 * Merges with SEED_PRODUCTS and updates the shared in-memory cache.
 */
export async function fetchLiveProductsFromSupabase(): Promise<any[]> {
  const now = Date.now();
  // Return memory cache if fresh
  if (inMemoryCustomProducts && inMemoryCustomProducts.length > 0 && now - lastSupabaseFetchTime < CACHE_TTL_MS) {
    return getMergedProducts();
  }

  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return getMergedProducts();
    }

    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('*, product_media(*), product_attributes(*)')
      .order('updated_at', { ascending: false });

    if (error || !dbProducts) {
      console.warn('Supabase fetch products notice (falling back to local):', error?.message);
      return getMergedProducts();
    }

    const mappedDbProducts: any[] = dbProducts.map((row: any) => {
      // Process media
      const mediaList: any[] = [];
      let primaryUrl = '';

      if (Array.isArray(row.product_media) && row.product_media.length > 0) {
        // Sort by sort_order
        const sortedMedia = [...row.product_media].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        sortedMedia.forEach((m: any, i: number) => {
          const isPrimary = m.is_primary || m.type === 'MAIN_IMAGE' || i === 0;
          if (isPrimary && !primaryUrl) {
            primaryUrl = m.url;
          }
          mediaList.push({
            id: m.id,
            url: m.url,
            type: m.type || (isMediaVideo(m.url) ? 'VIDEO' : 'GALLERY'),
            is_primary: isPrimary,
            alt: m.alt_text || `${row.product_name} View ${i + 1}`,
          });
        });
      }

      // Resolve Brand and Category Names safely
      const brand = SEED_BRANDS.find((b) => b.id === row.brand_id);
      const brandName =
        row.brand_name ||
        brand?.name ||
        (row.product_name?.toLowerCase().includes('blue star') ? 'Blue Star' : 'Rockwell');

      const cat = SEED_CATEGORIES.find((c) => c.id === row.category_id);
      const categoryName = row.category_name || cat?.name || 'Cooling Equipment';

      // Find matching seed product by slug or model_number for fallback media/data
      const matchingSeed = SEED_PRODUCTS.find(
        (sp) => sp.slug === row.slug || (row.model_number && sp.model_number === row.model_number)
      ) as any;

      if (mediaList.length === 0 && matchingSeed) {
        if (matchingSeed.primary_image_url) {
          primaryUrl = matchingSeed.primary_image_url;
        } else if (matchingSeed.media?.[0]?.url) {
          primaryUrl = matchingSeed.media[0].url;
        }
        if (Array.isArray(matchingSeed.media)) {
          matchingSeed.media.forEach((m: any) => {
            if (typeof m === 'object' && m.url) mediaList.push(m);
          });
        }
      }

      // If no media in table but product has an image in seed, fallback
      const galleryUrls = mediaList.filter((m) => !m.is_primary).map((m) => m.url);

      // Process attributes
      const attributes = Array.isArray(row.product_attributes) && row.product_attributes.length > 0
        ? row.product_attributes
            .sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((attr: any) => ({
              attribute_name: attr.attribute_name,
              name: attr.attribute_name,
              attribute_value: attr.attribute_value,
              value: attr.attribute_value,
              attribute_unit: attr.attribute_unit || '',
              unit: attr.attribute_unit || '',
            }))
        : (matchingSeed?.attributes || []);

      return {
        id: row.id,
        slug: row.slug,
        product_name: row.product_name,
        model_number: row.model_number || matchingSeed?.model_number || '',
        brand_id: row.brand_id,
        category_id: row.category_id,
        brand_name: brandName,
        category_name: categoryName,
        status: row.status || 'PUBLISHED',
        reference_price: row.reference_price || row.price_range_min || 0,
        dealer_price: row.price_range_min || row.reference_price || 0,
        base_mrp: row.price_range_max || row.reference_price || 0,
        short_description: row.short_description || '',
        description: row.description || '',
        long_description: row.description || '',
        features: Array.isArray(row.features) && row.features.length > 0 ? row.features : (matchingSeed?.features || []),
        applications: Array.isArray(row.applications) && row.applications.length > 0 ? row.applications : (matchingSeed?.applications || []),
        primary_image_url: primaryUrl || matchingSeed?.primary_image_url || '',
        gallery_urls: galleryUrls.length > 0 ? galleryUrls : (matchingSeed?.gallery_urls || []),
        media: mediaList.length > 0 ? mediaList : (matchingSeed?.media || []),
        attributes,
        seo_title: row.seo_title || matchingSeed?.seo_title,
        seo_description: row.seo_description || matchingSeed?.seo_description,
        updated_at: row.updated_at,
      };
    });

    // Update memory cache
    inMemoryCustomProducts = mappedDbProducts;
    lastSupabaseFetchTime = now;

    // Merge with SEED_PRODUCTS
    const merged = [...SEED_PRODUCTS];
    for (const custom of mappedDbProducts) {
      const idx = merged.findIndex(
        (p) =>
          p.id === custom.id ||
          (custom.slug && p.slug === custom.slug) ||
          (custom.model_number && p.model_number && p.model_number === custom.model_number)
      );
      if (idx >= 0) {
        const existing = merged[idx] as any;
        merged[idx] = {
          ...existing,
          ...custom,
          brand_name: custom.brand_name || existing.brand_name,
          category_name: custom.category_name || existing.category_name,
          primary_image_url: custom.primary_image_url || existing.primary_image_url,
          gallery_urls: custom.gallery_urls?.length ? custom.gallery_urls : existing.gallery_urls,
          media: custom.media?.length ? custom.media : existing.media,
          attributes: custom.attributes?.length ? custom.attributes : existing.attributes,
        } as any;
      } else {
        merged.unshift(custom as any);
      }
    }

    return merged;
  } catch (err) {
    console.error('fetchLiveProductsFromSupabase error:', err);
    return getMergedProducts();
  }
}

/**
 * Save a custom product permanently to Supabase and local disk (when writable)
 */
export async function saveCustomProduct(productPayload: any): Promise<{ success: boolean; product: any; error?: string }> {
  try {
    const now = new Date().toISOString();
    const updatedPayload = {
      ...productPayload,
      updated_at: now,
    };

    // 1. Update in-memory cache immediately
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
    lastSupabaseFetchTime = Date.now();

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

    // 3. Two-Way Sync to Supabase database (Central Shared Source of Truth)
    try {
      const supabase = getSupabaseAdmin();
      if (supabase) {
        // Find existing product by slug, model_number, or id
        let targetId: string | null = null;
        let query = supabase.from('products').select('id, slug, model_number');
        if (updatedPayload.slug) {
          query = query.eq('slug', updatedPayload.slug);
        } else if (updatedPayload.model_number) {
          query = query.eq('model_number', updatedPayload.model_number);
        } else if (updatedPayload.id && !updatedPayload.id.startsWith('p')) {
          query = query.eq('id', updatedPayload.id);
        }

        const { data: existingRows } = await query;

        const productData: any = {
          product_name: updatedPayload.product_name,
          slug: updatedPayload.slug || updatedPayload.product_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
          short_description: updatedPayload.short_description || null,
          description: updatedPayload.long_description || updatedPayload.description || null,
          features: Array.isArray(updatedPayload.features) ? updatedPayload.features : null,
          applications: Array.isArray(updatedPayload.applications) ? updatedPayload.applications : null,
          status: updatedPayload.status || 'PUBLISHED',
          reference_price: updatedPayload.dealer_price || updatedPayload.reference_price || null,
          price_range_min: updatedPayload.dealer_price || null,
          price_range_max: updatedPayload.base_mrp || null,
          seo_title: updatedPayload.seo_title || null,
          seo_description: updatedPayload.seo_description || null,
          updated_at: now,
        };

        if (updatedPayload.model_number) {
          productData.model_number = updatedPayload.model_number;
        }

        if (existingRows && existingRows.length > 0) {
          targetId = existingRows[0].id;
          const { error: updateErr } = await supabase.from('products').update(productData).eq('id', targetId);
          if (updateErr) console.warn('Supabase product update error:', updateErr);
        } else {
          // Insert new row with standard UUID
          const uuid = (updatedPayload.id && !updatedPayload.id.startsWith('p'))
            ? updatedPayload.id
            : (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `00000000-0000-0000-0000-${Date.now().toString().padStart(12, '0')}`);
          
          targetId = uuid;
          const insertPayload: any = {
            id: uuid,
            ...productData,
            brand_id: updatedPayload.brand_id || 'b0000001-0000-0000-0000-000000000001',
            category_id: updatedPayload.category_id || 'c0000001-0000-0000-0000-000000000001',
            created_at: now,
          };

          const { error: insertErr } = await supabase.from('products').insert(insertPayload);
          if (insertErr) console.warn('Supabase product insert error:', insertErr);
        }

        // 4. Synchronize all Media (Primary Image + Gallery Images + Videos)
        if (targetId) {
          // Delete existing media for this product
          await supabase.from('product_media').delete().eq('product_id', targetId);

          const mediaToInsert: any[] = [];

          // Primary image
          if (updatedPayload.primary_image_url) {
            mediaToInsert.push({
              product_id: targetId,
              type: isMediaVideo(updatedPayload.primary_image_url) ? 'VIDEO' : 'MAIN_IMAGE',
              url: updatedPayload.primary_image_url,
              is_primary: true,
              sort_order: 0,
              alt_text: `${updatedPayload.product_name} - Authorized Tanmayee Technologies Dealer Visakhapatnam`,
              title: `${updatedPayload.product_name} Primary Image`,
            });
          }

          // Gallery images / videos
          const gallery = Array.isArray(updatedPayload.gallery_urls) ? updatedPayload.gallery_urls : [];
          gallery.forEach((url: string, index: number) => {
            if (url && url !== updatedPayload.primary_image_url && !mediaToInsert.some((x) => x.url === url)) {
              mediaToInsert.push({
                product_id: targetId,
                type: isMediaVideo(url) ? 'VIDEO' : 'GALLERY',
                url,
                is_primary: false,
                sort_order: mediaToInsert.length,
                alt_text: `${updatedPayload.product_name} View ${index + 2}`,
                title: `${updatedPayload.product_name} Angle ${index + 2}`,
              });
            }
          });

          // Also check updatedPayload.media
          if (Array.isArray(updatedPayload.media)) {
            updatedPayload.media.forEach((m: any) => {
              const url = typeof m === 'string' ? m : m.url;
              if (url && !mediaToInsert.some((x) => x.url === url)) {
                mediaToInsert.push({
                  product_id: targetId,
                  type: m.type || (isMediaVideo(url) ? 'VIDEO' : 'GALLERY'),
                  url,
                  is_primary: !!m.is_primary,
                  sort_order: mediaToInsert.length,
                  alt_text: m.alt || `${updatedPayload.product_name} View ${mediaToInsert.length + 1}`,
                  title: `${updatedPayload.product_name} Media ${mediaToInsert.length + 1}`,
                });
              }
            });
          }

          // Invalidate cache to ensure fresh read
          lastSupabaseFetchTime = 0;

          if (mediaToInsert.length > 0) {
            const { error: mediaErr } = await supabase.from('product_media').insert(mediaToInsert);
            if (mediaErr) {
              console.warn('Supabase media insert error:', mediaErr);
            }
          }

          // 5. Synchronize attributes if provided
          if (Array.isArray(updatedPayload.attributes) && updatedPayload.attributes.length > 0) {
            await supabase.from('product_attributes').delete().eq('product_id', targetId);

            const attrsToInsert = updatedPayload.attributes
              .filter((a: any) => (a.attribute_name || a.name) && (a.attribute_value || a.value))
              .map((a: any, i: number) => ({
                product_id: targetId,
                attribute_name: a.attribute_name || a.name,
                attribute_value: String(a.attribute_value || a.value),
                attribute_unit: a.attribute_unit || a.unit || null,
                sort_order: i,
              }));

            if (attrsToInsert.length > 0) {
              await supabase.from('product_attributes').insert(attrsToInsert);
            }
          }
        }
      }
    } catch (sbErr) {
      console.warn('Supabase two-way sync warning (non-fatal):', sbErr);
    }

    return { success: true, product: updatedPayload };
  } catch (err: any) {
    console.error('saveCustomProduct error:', err);
    return { success: false, product: productPayload, error: err.message || 'Failed to save product' };
  }
}
