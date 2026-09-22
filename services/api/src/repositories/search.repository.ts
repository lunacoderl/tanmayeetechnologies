// ============================================================================
// @tanmayee/api — Search Repository
// ============================================================================

import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SEED_PRODUCTS,
  SEED_BRANDS,
  SEED_CATEGORIES,
} from '@tanmayee/database';
import { ProductStatus } from '@tanmayee/config';

export class SearchRepository {
  /**
   * Full search returning products, brands, and categories
   */
  async search(query: string, page = 1, limit = 10) {
    const q = query.trim().toLowerCase();
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, count, error } = await supabase
          .from('published_catalog')
          .select('*', { count: 'exact' })
          .textSearch('search_vector', q)
          .range(offset, offset + limit - 1);

        if (!error && data) {
          return {
            items: data,
            total: count || data.length,
            page,
            limit,
          };
        }
      } catch (err) {
        console.warn('Supabase text search failed, using fallback:', err);
      }
    }

    // In-memory weighted search
    const scoredProducts = SEED_PRODUCTS
      .filter((p) => p.status === ProductStatus.PUBLISHED)
      .map((p) => {
        let score = 0;
        const name = p.product_name.toLowerCase();
        const model = (p.model_number || '').toLowerCase();
        const brand = p.brand_name.toLowerCase();
        const category = p.category_name.toLowerCase();
        const desc = (p.short_description || '').toLowerCase();

        if (model === q) score += 100;
        else if (model.includes(q)) score += 60;

        if (name === q) score += 90;
        else if (name.startsWith(q)) score += 50;
        else if (name.includes(q)) score += 30;

        if (brand.includes(q)) score += 20;
        if (category.includes(q)) score += 20;
        if (desc.includes(q)) score += 10;

        if (p.features && p.features.some((f) => f.toLowerCase().includes(q))) {
          score += 15;
        }

        return { product: p, score };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);

    const total = scoredProducts.length;
    const items = scoredProducts.slice(offset, offset + limit).map((s) => s.product);

    return {
      items,
      total,
      page,
      limit,
    };
  }

  /**
   * Instant suggestions for the global search bar dropdown
   */
  async suggestions(query: string, limit = 5) {
    const q = query.trim().toLowerCase();
    if (!q) {
      return { products: [], brands: [], categories: [] };
    }

    const matchingBrands = SEED_BRANDS.filter((b) =>
      b.name.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchingCategories = SEED_CATEGORIES.filter((c) =>
      c.name.toLowerCase().includes(q)
    ).slice(0, 3);

    const matchingProducts = SEED_PRODUCTS.filter(
      (p) =>
        p.product_name.toLowerCase().includes(q) ||
        (p.model_number && p.model_number.toLowerCase().includes(q))
    )
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        name: p.product_name,
        slug: p.slug,
        model_number: p.model_number,
        brand_name: p.brand_name,
        category_name: p.category_name,
        image_url: p.media[0]?.url || null,
        reference_price: p.reference_price,
        price_display: p.price_display,
      }));

    return {
      products: matchingProducts,
      brands: matchingBrands.map((b) => ({ id: b.id, name: b.name, slug: b.slug })),
      categories: matchingCategories.map((c) => ({ id: c.id, name: c.name, slug: c.slug })),
    };
  }
}

export const searchRepository = new SearchRepository();
