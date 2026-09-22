// ============================================================================
// @tanmayee/api — Brand Repository
// ============================================================================

import {
  getSupabaseAdmin,
  isSupabaseConfigured,
  SEED_BRANDS,
} from '@tanmayee/database';
import { Brand } from '@tanmayee/types';
import { v4 as uuidv4 } from 'uuid';

let inMemoryBrands = [...SEED_BRANDS];

export class BrandRepository {
  async findAll(): Promise<Brand[]> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase brands fetch failed, using in-memory:', err);
      }
    }
    return inMemoryBrands.filter((b) => b.is_active);
  }

  async findBySlug(slug: string): Promise<Brand | null> {
    const supabase = getSupabaseAdmin();
    if (isSupabaseConfigured() && supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('slug', slug)
          .single();
        if (!error && data) return data;
      } catch (err) {
        console.warn('Supabase brand findBySlug failed, using in-memory:', err);
      }
    }
    return inMemoryBrands.find((b) => b.slug === slug) || null;
  }

  async findById(id: string): Promise<Brand | null> {
    return inMemoryBrands.find((b) => b.id === id) || null;
  }

  async create(data: Partial<Brand>): Promise<Brand> {
    const newBrand: Brand = {
      id: uuidv4(),
      name: data.name!,
      slug: data.slug!,
      logo_url: data.logo_url || null,
      description: data.description || null,
      seo_title: data.seo_title || null,
      seo_description: data.seo_description || null,
      website_url: data.website_url || null,
      sort_order: data.sort_order || 0,
      is_active: data.is_active ?? true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    inMemoryBrands.push(newBrand);
    return newBrand;
  }

  async update(id: string, updates: Partial<Brand>): Promise<Brand | null> {
    const idx = inMemoryBrands.findIndex((b) => b.id === id);
    if (idx === -1) return null;

    inMemoryBrands[idx] = {
      ...inMemoryBrands[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return inMemoryBrands[idx];
  }
}

export const brandRepository = new BrandRepository();
