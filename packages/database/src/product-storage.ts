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

  // If in-memory custom products were populated from live Supabase database,
  // return them directly to guarantee cloud-first single source of truth across all consumers
  if (Array.isArray(customProducts) && customProducts.length >= 100) {
    return customProducts;
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
 * Maps a raw Supabase Postgres product row (with joined product_media and product_attributes)
 * to our unified frontend/admin Product data shape.
 */
export function mapDbProductToUnified(row: any): any {
  // Process media
  const mediaList: any[] = [];
  let primaryUrl = '';

  if (Array.isArray(row.product_media) && row.product_media.length > 0) {
    const sortedMedia = [...row.product_media].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

    // Determine the designated primary image strictly from database records
    const explicitPrimary = sortedMedia.find((m: any) => m.is_primary || m.type === 'MAIN_IMAGE');
    if (explicitPrimary) {
      primaryUrl = explicitPrimary.url;
    } else if (sortedMedia.length > 0) {
      primaryUrl = sortedMedia[0].url;
    }

    sortedMedia.forEach((m: any, i: number) => {
      const isPrimary = primaryUrl ? (m.url === primaryUrl) : (i === 0);
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
    current_version: row.current_version || matchingSeed?.current_version || 1,
    updated_at: row.updated_at,
  };
}

/**
 * Universal Resolver: maps any product reference (UUID, slug, model number, or legacy seed ID)
 * to the canonical Supabase product UUID.
 */
export async function resolveCanonicalProductId(identifier: string): Promise<string | null> {
  if (!identifier) return null;
  const supabase = getSupabaseAdmin();
  if (!supabase) return null;

  // 1. Check if identifier is already a valid UUID
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
  if (isUuid) {
    const { data: byId } = await supabase.from('products').select('id').eq('id', identifier).limit(1);
    if (byId && byId.length > 0) return byId[0].id;
  }

  // 2. Search by slug or model_number
  const { data: bySlugOrModel } = await supabase
    .from('products')
    .select('id')
    .or(`slug.eq.${identifier},model_number.eq.${identifier}`)
    .limit(1);
  if (bySlugOrModel && bySlugOrModel.length > 0) return bySlugOrModel[0].id;

  // 3. Search via SEED_PRODUCTS if given a legacy seed ID (e.g. 'p0000001-rockwell-gfr250-convertible')
  const matchingSeed = SEED_PRODUCTS.find(
    (sp) => sp.id === identifier || sp.slug === identifier || (sp.model_number && sp.model_number === identifier)
  );
  if (matchingSeed) {
    let orQuery = `slug.eq.${matchingSeed.slug}`;
    if (matchingSeed.model_number) {
      orQuery += `,model_number.eq.${matchingSeed.model_number}`;
    }
    const { data: bySeed } = await supabase.from('products').select('id').or(orQuery).limit(1);
    if (bySeed && bySeed.length > 0) return bySeed[0].id;
  }

  return null;
}

/**
 * Fetch a single product directly from Supabase by UUID, slug, model_number, or legacy seed ID.
 * Returns the fully normalized product with real-time media and attributes.
 */
export async function fetchSingleProduct(identifier: string): Promise<any | null> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      const all = getMergedProducts();
      return all.find((p) => p.id === identifier || p.slug === identifier || p.model_number === identifier) || null;
    }

    const canonicalId = await resolveCanonicalProductId(identifier);
    let query = supabase.from('products').select('*, product_media(*), product_attributes(*)');
    if (canonicalId) {
      query = query.eq('id', canonicalId);
    } else {
      query = query.or(`id.eq.${identifier},slug.eq.${identifier},model_number.eq.${identifier}`);
    }

    const { data, error } = await query.limit(1);
    if (!error && data && data.length > 0) {
      return mapDbProductToUnified(data[0]);
    }

    // Fallback to local merged if not found in DB
    const all = getMergedProducts();
    return all.find((p) => p.id === identifier || p.slug === identifier || p.model_number === identifier) || null;
  } catch (err) {
    console.error('fetchSingleProduct error:', err);
    const all = getMergedProducts();
    return all.find((p) => p.id === identifier || p.slug === identifier || p.model_number === identifier) || null;
  }
}

/**
 * Asynchronously fetch live products from Supabase database.
 * Supabase Postgres is the primary authoritative source of truth.
 */
export async function fetchLiveProductsFromSupabase(): Promise<any[]> {
  const now = Date.now();
  // Return memory cache if fresh
  if (inMemoryCustomProducts && inMemoryCustomProducts.length > 0 && now - lastSupabaseFetchTime < CACHE_TTL_MS) {
    return inMemoryCustomProducts;
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

    if (error || !dbProducts || dbProducts.length === 0) {
      console.warn('Supabase fetch products notice (falling back to local):', error?.message);
      return getMergedProducts();
    }

    const mappedDbProducts: any[] = dbProducts.map((row: any) => mapDbProductToUnified(row));

    // Append any seed products that are not yet in Supabase as offline safety
    const supabaseSlugs = new Set(mappedDbProducts.map((p) => p.slug));
    const missingSeeds = SEED_PRODUCTS.filter((sp) => !supabaseSlugs.has(sp.slug));
    const finalProducts = [...mappedDbProducts, ...missingSeeds];

    // Update memory cache with real cloud data
    inMemoryCustomProducts = finalProducts;
    lastSupabaseFetchTime = now;

    return finalProducts;
  } catch (err) {
    console.error('fetchLiveProductsFromSupabase error:', err);
    return getMergedProducts();
  }
}

/**
 * Save a custom product permanently to Supabase (Central Shared Source of Truth).
 * Zero local disk writes so Next.js / Turbopack never restarts or wipes form state.
 */
export async function saveCustomProduct(productPayload: any): Promise<{ success: boolean; product: any; error?: string }> {
  try {
    const now = new Date().toISOString();
    const updatedPayload = {
      ...productPayload,
      updated_at: now,
    };

    // 1. Immediately invalidate in-memory caches so subsequent reads reflect live cloud changes
    inMemoryCustomProducts = null;
    lastSupabaseFetchTime = 0;

    // 2. Persist to Supabase database (Central Shared Source of Truth)
    const supabase = getSupabaseAdmin();
    if (!supabase) {
      return { success: false, product: productPayload, error: 'Database connection unavailable' };
    }

    // Resolve targetId to existing Supabase product row
    let targetId = await resolveCanonicalProductId(
      updatedPayload.id || updatedPayload.slug || updatedPayload.model_number
    );
    let currentVersion = 1;
    let existingProductRow: any = null;

    if (targetId) {
      const { data: existingRows } = await supabase
        .from('products')
        .select('id, current_version, slug, model_number, created_at')
        .eq('id', targetId)
        .limit(1);
      if (existingRows && existingRows.length > 0) {
        existingProductRow = existingRows[0];
        currentVersion = existingRows[0].current_version || 1;
      }
    }

    const nextVersion = currentVersion + 1;

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
      current_version: nextVersion,
      updated_at: now,
    };

    if (updatedPayload.model_number) {
      productData.model_number = updatedPayload.model_number;
    }

    if (targetId && existingProductRow) {
      const { error: updateErr } = await supabase.from('products').update(productData).eq('id', targetId);
      if (updateErr) console.warn('Supabase product update error:', updateErr);
    } else {
      // Generate standard UUID for new product
      const uuid = (updatedPayload.id && !updatedPayload.id.startsWith('p') && updatedPayload.id.includes('-'))
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

    // 3. Synchronize all Media (Primary Image + Gallery Images + Videos)
    if (targetId) {
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

      if (mediaToInsert.length > 0) {
        const { error: mediaErr } = await supabase.from('product_media').insert(mediaToInsert);
        if (mediaErr) {
          console.warn('Supabase media insert error:', mediaErr);
        }
      }

      // 4. Synchronize attributes if provided
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

      // 5. Record complete version history snapshot in product_versions
      try {
        const { data: vCount } = await supabase
          .from('product_versions')
          .select('version_number')
          .eq('product_id', targetId);

        if (!vCount || vCount.length === 0) {
          await supabase.from('product_versions').insert({
            product_id: targetId,
            version_number: 1,
            snapshot: {
              ...(existingProductRow || {}),
              product_name: productData.product_name,
              model_number: productData.model_number,
              brand_name: updatedPayload.brand_name,
              category_name: updatedPayload.category_name,
              primary_image_url: updatedPayload.primary_image_url,
              gallery_urls: gallery,
              media: mediaToInsert,
            },
            change_summary: 'Version 1: Initial catalog release',
            created_at: existingProductRow?.created_at || now,
          });
        }

        const versionSnapshot = {
          id: targetId,
          ...productData,
          brand_id: updatedPayload.brand_id,
          category_id: updatedPayload.category_id,
          brand_name: updatedPayload.brand_name,
          category_name: updatedPayload.category_name,
          primary_image_url: updatedPayload.primary_image_url,
          gallery_urls: gallery,
          media: mediaToInsert,
          attributes: updatedPayload.attributes,
        };

        const mediaCount = mediaToInsert.length;
        const versionSummary =
          updatedPayload._versionSummary ||
          `Version ${nextVersion}: Updated specifications, pricing & ${mediaCount} media asset${mediaCount === 1 ? '' : 's'}`;

        await supabase.from('product_versions').insert({
          product_id: targetId,
          version_number: nextVersion,
          snapshot: versionSnapshot,
          change_summary: versionSummary,
          created_at: now,
        });

        updatedPayload.id = targetId;
        updatedPayload.current_version = nextVersion;
      } catch (vErr) {
        console.warn('Product version history recording notice:', vErr);
      }
    }

    return { success: true, product: updatedPayload };
  } catch (err: any) {
    console.error('saveCustomProduct error:', err);
    return { success: false, product: productPayload, error: err.message || 'Failed to save product' };
  }
}

/**
 * Fetch complete version history for a given product
 */
export async function fetchProductVersions(productIdOrSlug: string): Promise<any[]> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return [];

    const targetId = await resolveCanonicalProductId(productIdOrSlug);
    if (!targetId) {
      console.warn('Could not resolve canonical product ID for version history:', productIdOrSlug);
      return [];
    }

    const { data: versions, error } = await supabase
      .from('product_versions')
      .select('*')
      .eq('product_id', targetId)
      .order('version_number', { ascending: false });

    if (error) {
      console.warn('fetchProductVersions error:', error.message);
      return [];
    }

    // If no versions exist yet, generate initial Version 1 snapshot on-the-fly
    if (!versions || versions.length === 0) {
      const { data: pData } = await supabase
        .from('products')
        .select('*, product_media(*), product_attributes(*)')
        .eq('id', targetId)
        .limit(1);

      if (pData && pData[0]) {
        const p = pData[0];
        const v1 = {
          product_id: targetId,
          version_number: 1,
          snapshot: mapDbProductToUnified(p),
          change_summary: 'Version 1: Initial release from manufacturer catalogue',
          created_at: p.created_at || new Date().toISOString(),
        };
        await supabase.from('product_versions').insert(v1);
        return [v1];
      }
    }

    return versions || [];
  } catch (err) {
    console.error('fetchProductVersions error:', err);
    return [];
  }
}

/**
 * Restore a specific product version from snapshot
 */
export async function restoreProductVersion(
  productIdOrSlug: string,
  versionNumber: number
): Promise<{ success: boolean; product?: any; error?: string }> {
  try {
    const supabase = getSupabaseAdmin();
    if (!supabase) return { success: false, error: 'Database client unavailable' };

    const targetId = await resolveCanonicalProductId(productIdOrSlug);
    if (!targetId) {
      return { success: false, error: 'Product not found' };
    }

    const { data: vRows, error: vErr } = await supabase
      .from('product_versions')
      .select('*')
      .eq('product_id', targetId)
      .eq('version_number', versionNumber)
      .limit(1);

    if (vErr || !vRows || vRows.length === 0) {
      return { success: false, error: `Version ${versionNumber} not found for this product` };
    }

    const snapshot = vRows[0].snapshot;
    const restorePayload = {
      ...snapshot,
      id: targetId,
      _versionSummary: `Restored to Version ${versionNumber} snapshot`,
    };

    return await saveCustomProduct(restorePayload);
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to restore product version' };
  }
}


