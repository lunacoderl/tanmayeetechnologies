// ============================================================================
// @tanmayee/api — Product Repository
// ============================================================================

import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SEED_PRODUCTS,
  SEED_BRANDS,
  SEED_CATEGORIES,
} from '@tanmayee/database';
import { ProductVersion } from '@tanmayee/types';
import { ProductStatus } from '@tanmayee/config';
import { v4 as uuidv4 } from 'uuid';

export interface ProductFilterOptions {
  category?: string;
  brand?: string | string[];
  price_min?: number;
  price_max?: number;
  search?: string;
  attributes?: Record<string, string | string[]>;
  sort?: 'relevance' | 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc' | 'newest';
  page?: number;
  limit?: number;
  status?: string;
}

// In-memory working copy of products for development / fallback
let inMemoryProducts = [...SEED_PRODUCTS];
let inMemoryVersions: ProductVersion[] = [];

export class ProductRepository {
  /**
   * Find published products for public website with filters, pagination, and sorting
   */
  async findPublished(options: ProductFilterOptions = {}) {
    const page = options.page || 1;
    const limit = Math.min(options.limit || 20, 100);
    const offset = (page - 1) * limit;

    const supabase = getSupabaseAdmin();

    if (isSupabaseConfigured() && supabase) {
      try {
        let query = supabase
          .from('published_catalog')
          .select('*', { count: 'exact' });

        if (options.category) {
          query = query.or(`category_slug.eq.${options.category},subcategory_id.eq.${options.category}`);
        }

        if (options.brand) {
          if (Array.isArray(options.brand)) {
            query = query.in('brand_slug', options.brand);
          } else {
            query = query.eq('brand_slug', options.brand);
          }
        }

        if (options.price_min !== undefined) {
          query = query.gte('reference_price', options.price_min);
        }
        if (options.price_max !== undefined) {
          query = query.lte('reference_price', options.price_max);
        }

        if (options.search) {
          query = query.textSearch('search_vector', options.search);
        }

        // Sorting
        switch (options.sort) {
          case 'price_asc':
            query = query.order('reference_price', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('reference_price', { ascending: false });
            break;
          case 'name_asc':
            query = query.order('product_name', { ascending: true });
            break;
          case 'name_desc':
            query = query.order('product_name', { ascending: false });
            break;
          default:
            query = query.order('view_count', { ascending: false });
        }

        const { data, count, error } = await query.range(offset, offset + limit - 1);

        if (!error && data) {
          return {
            items: data,
            total: count || data.length,
            page,
            limit,
            totalPages: Math.ceil((count || data.length) / limit),
          };
        }
      } catch (err) {
        console.warn('Supabase query failed, falling back to in-memory store:', err);
      }
    }

    // Fallback: In-memory store
    let filtered = inMemoryProducts.filter((p) => p.status === ProductStatus.PUBLISHED && p.visibility);

    if (options.category) {
      filtered = filtered.filter(
        (p) =>
          p.category_name.toLowerCase().replace(/\s+/g, '-') === options.category ||
          p.category_id === options.category ||
          p.subcategory_id === options.category
      );
    }

    if (options.brand) {
      const brands = Array.isArray(options.brand) ? options.brand : [options.brand];
      filtered = filtered.filter((p) =>
        brands.some(
          (b) =>
            b.toLowerCase() === p.brand_name.toLowerCase() ||
            b.toLowerCase() === p.brand_name.toLowerCase().replace(/\s+/g, '-')
        )
      );
    }

    if (options.price_min !== undefined) {
      filtered = filtered.filter((p) => (p.reference_price || 0) >= options.price_min!);
    }
    if (options.price_max !== undefined) {
      filtered = filtered.filter((p) => (p.reference_price || 0) <= options.price_max!);
    }

    if (options.search) {
      const q = options.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q)) ||
          p.brand_name.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q)) ||
          (p.features && p.features.some((f) => f.toLowerCase().includes(q)))
      );
    }

    // Dynamic attribute filtering
    if (options.attributes && Object.keys(options.attributes).length > 0) {
      filtered = filtered.filter((p) => {
        return Object.entries(options.attributes!).every(([attrName, attrVal]) => {
          const match = p.attributes.find((a) => a.name.toLowerCase() === attrName.toLowerCase());
          if (!match) return false;
          if (Array.isArray(attrVal)) {
            return attrVal.some((v) => match.value.toLowerCase().includes(v.toLowerCase()));
          }
          return match.value.toLowerCase().includes(attrVal.toLowerCase());
        });
      });
    }

    // Sort
    switch (options.sort) {
      case 'price_asc':
        filtered.sort((a, b) => (a.reference_price || 0) - (b.reference_price || 0));
        break;
      case 'price_desc':
        filtered.sort((a, b) => (b.reference_price || 0) - (a.reference_price || 0));
        break;
      case 'name_asc':
        filtered.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.product_name.localeCompare(a.product_name));
        break;
      default:
        filtered.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }

    const total = filtered.length;
    const paginated = filtered.slice(offset, offset + limit);

    return {
      items: paginated,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Find product by slug
   */
  async findBySlug(slug: string) {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('published_catalog')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase findBySlug failed, using in-memory:', err);
      }
    }

    const item = inMemoryProducts.find((p) => p.slug === slug);
    if (item) {
      item.view_count = (item.view_count || 0) + 1;
    }
    return item || null;
  }

  /**
   * Find product by ID
   */
  async findById(id: string) {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*, product_attributes(*), product_media(*)')
          .eq('id', id)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase findById failed, using in-memory:', err);
      }
    }

    return inMemoryProducts.find((p) => p.id === id) || null;
  }

  /**
   * Admin: List all products (Draft, Published, Archived)
   */
  async findAllAdmin(options: { status?: string; page?: number; limit?: number; search?: string } = {}) {
    let list = [...inMemoryProducts];
    if (options.status) {
      list = list.filter((p) => p.status === options.status);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q))
      );
    }

    const page = options.page || 1;
    const limit = options.limit || 20;
    const total = list.length;
    const offset = (page - 1) * limit;

    return {
      items: list.slice(offset, offset + limit),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  /**
   * Admin: Create product
   */
  async create(data: any) {
    const newProduct: any = {
      id: uuidv4(),
      ...data,
      current_version: 1,
      view_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      attributes: data.attributes || [],
      media: data.media || [],
      brand_name: SEED_BRANDS.find((b) => b.id === data.brand_id)?.name || 'Brand',
      category_name: SEED_CATEGORIES.find((c) => c.id === data.category_id)?.name || 'Category',
    };

    inMemoryProducts.unshift(newProduct);
    return newProduct;
  }

  /**
   * Admin: Update product with automatic version history snapshot
   */
  async update(id: string, updates: any, changedBy?: string, changeSummary?: string) {
    const idx = inMemoryProducts.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const oldProduct = inMemoryProducts[idx];

    // Create version snapshot
    const versionRecord: ProductVersion = {
      id: uuidv4(),
      product_id: id,
      version_number: oldProduct.current_version || 1,
      snapshot: JSON.parse(JSON.stringify(oldProduct)),
      change_summary: changeSummary || 'Product updated',
      changed_by: changedBy || null,
      created_at: new Date().toISOString(),
    };
    inMemoryVersions.unshift(versionRecord);

    const updatedProduct = {
      ...oldProduct,
      ...updates,
      current_version: (oldProduct.current_version || 1) + 1,
      updated_at: new Date().toISOString(),
    };

    inMemoryProducts[idx] = updatedProduct;
    return updatedProduct;
  }

  /**
   * Admin: Publish product
   */
  async publish(id: string) {
    const product = inMemoryProducts.find((p) => p.id === id);
    if (!product) return null;

    product.status = ProductStatus.PUBLISHED;
    product.published_at = new Date().toISOString();
    product.updated_at = new Date().toISOString();
    return product;
  }

  /**
   * Admin: Archive product
   */
  async archive(id: string) {
    const product = inMemoryProducts.find((p) => p.id === id);
    if (!product) return null;

    product.status = ProductStatus.ARCHIVED;
    product.archived_at = new Date().toISOString();
    product.updated_at = new Date().toISOString();
    return product;
  }

  /**
   * Get version history for product
   */
  async getVersions(productId: string) {
    return inMemoryVersions.filter((v) => v.product_id === productId);
  }

  /**
   * Restore specific version
   */
  async restoreVersion(productId: string, versionNumber: number) {
    const version = inMemoryVersions.find(
      (v) => v.product_id === productId && v.version_number === versionNumber
    );
    if (!version) return null;

    const idx = inMemoryProducts.findIndex((p) => p.id === productId);
    if (idx === -1) return null;

    inMemoryProducts[idx] = {
      ...inMemoryProducts[idx],
      ...version.snapshot,
      current_version: (inMemoryProducts[idx].current_version || 1) + 1,
      updated_at: new Date().toISOString(),
    };

    return inMemoryProducts[idx];
  }
}

export const productRepository = new ProductRepository();
