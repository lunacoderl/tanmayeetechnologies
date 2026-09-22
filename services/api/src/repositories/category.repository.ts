// ============================================================================
// @tanmayee/api — Category Repository
// ============================================================================

import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SEED_CATEGORIES,
  SEED_CATEGORY_ATTRIBUTES,
} from '@tanmayee/database';
import { Category, CategoryAttribute } from '@tanmayee/types';
import { v4 as uuidv4 } from 'uuid';

let inMemoryCategories = [...SEED_CATEGORIES];
let inMemoryAttributes = [...SEED_CATEGORY_ATTRIBUTES];

export class CategoryRepository {
  /**
   * Get all active categories organized with children hierarchy
   */
  async findAllTree(): Promise<Category[]> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (!error && data) {
          return this.buildTree(data);
        }
      } catch (err) {
        console.warn('Supabase categories fetch failed, falling back to in-memory:', err);
      }
    }

    return this.buildTree(inMemoryCategories.filter((c) => c.is_active));
  }

  /**
   * Get flat list of categories
   */
  async findAllFlat(): Promise<Category[]> {
    return inMemoryCategories.filter((c) => c.is_active);
  }

  /**
   * Find category by slug
   */
  async findBySlug(slug: string): Promise<Category | null> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase find category by slug failed, using in-memory:', err);
      }
    }

    return inMemoryCategories.find((c) => c.slug === slug) || null;
  }

  /**
   * Find dynamic filter attributes for a category
   */
  async findAttributes(categoryId: string): Promise<CategoryAttribute[]> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('category_attributes')
          .select('*')
          .eq('category_id', categoryId)
          .eq('is_filterable', true)
          .order('sort_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase find category attributes failed, using in-memory:', err);
      }
    }

    return inMemoryAttributes.filter(
      (a) => a.category_id === categoryId && a.is_filterable
    );
  }

  /**
   * Admin: Create category
   */
  async create(data: Partial<Category>): Promise<Category> {
    const newCategory: Category = {
      id: uuidv4(),
      parent_id: data.parent_id || null,
      name: data.name!,
      slug: data.slug!,
      description: data.description || null,
      image_url: data.image_url || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      sort_order: data.sort_order || 0,
      is_active: data.is_active ?? true,
      product_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    inMemoryCategories.push(newCategory);
    return newCategory;
  }

  /**
   * Admin: Update category
   */
  async update(id: string, updates: Partial<Category>): Promise<Category | null> {
    const idx = inMemoryCategories.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    inMemoryCategories[idx] = {
      ...inMemoryCategories[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return inMemoryCategories[idx];
  }

  private buildTree(flatCategories: Category[]): Category[] {
    const map = new Map<string, Category>();
    const roots: Category[] = [];

    flatCategories.forEach((c) => {
      map.set(c.id, { ...c, children: [] });
    });

    flatCategories.forEach((c) => {
      if (c.parent_id && map.has(c.parent_id)) {
        map.get(c.parent_id)!.children!.push(map.get(c.id)!);
      } else {
        roots.push(map.get(c.id)!);
      }
    });

    return roots;
  }
}

export const categoryRepository = new CategoryRepository();
