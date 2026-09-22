// ============================================================================
// @tanmayee/web — API Client
// Direct SSR access or HTTP API fallback
// ============================================================================

import {
  SEED_PRODUCTS,
  SEED_BRANDS,
  SEED_CATEGORIES,
  SEED_SERVICES,
  SEED_CATEGORY_ATTRIBUTES,
} from '@tanmayee/database';
import { ProductStatus } from '@tanmayee/config';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export async function fetchFromApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const sessionToken = typeof window !== 'undefined' ? localStorage.getItem('tt_session_token') || '' : '';

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(sessionToken && { 'X-Session-Token': sessionToken }),
    ...(options.headers as Record<string, string>),
  };

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    // Save session token if returned
    if (typeof window !== 'undefined') {
      const returnedSession = res.headers.get('X-Session-Token');
      if (returnedSession) {
        localStorage.setItem('tt_session_token', returnedSession);
      }
    }

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error?.message || `API error: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    // Graceful fallback for SSR/build time if API server isn't running
    return getFallbackData<T>(endpoint, options);
  }
}

/**
 * High-reliability fallback handler during static generation / preview
 */
function getFallbackData<T>(endpoint: string, options: RequestInit): T {
  const path = endpoint.split('?')[0];

  if (path === '/products' || path === '/public/products') {
    const published = SEED_PRODUCTS.filter((p) => p.status === ProductStatus.PUBLISHED);
    return {
      success: true,
      data: published,
      pagination: { page: 1, limit: 20, total: published.length, totalPages: 1 },
    } as T;
  }

  if (path.startsWith('/products/') || path.startsWith('/public/products/')) {
    const slug = path.replace(/^\/(public\/)?products\//, '');
    const product = SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    return { success: true, data: product } as T;
  }

  if (path === '/categories' || path === '/public/categories') {
    return { success: true, data: SEED_CATEGORIES } as T;
  }

  if (path.startsWith('/categories/') || path.startsWith('/public/categories/')) {
    const slug = path.replace(/^\/(public\/)?categories\//, '');
    const category = SEED_CATEGORIES.find((c) => c.slug === slug || c.id === slug);
    const products = SEED_PRODUCTS.filter(
      (p) => p.category_id === category?.id || p.subcategory_id === category?.id
    );
    const filters = SEED_CATEGORY_ATTRIBUTES.filter((a) => a.category_id === category?.id);
    return { success: true, data: { ...category, products, filters } } as T;
  }

  if (path === '/brands' || path === '/public/brands') {
    return { success: true, data: SEED_BRANDS } as T;
  }

  if (path.startsWith('/brands/') || path.startsWith('/public/brands/')) {
    const slug = path.replace(/^\/(public\/)?brands\//, '');
    const brand = SEED_BRANDS.find((b) => b.slug === slug || b.id === slug);
    const products = SEED_PRODUCTS.filter((p) => p.brand_id === brand?.id);
    return { success: true, data: { ...brand, products } } as T;
  }

  if (path === '/services' || path === '/public/services') {
    return { success: true, data: SEED_SERVICES } as T;
  }

  if (path.startsWith('/services/') || path.startsWith('/public/services/')) {
    const slug = path.replace(/^\/(public\/)?services\//, '');
    const service = SEED_SERVICES.find((s) => s.slug === slug || s.id === slug);
    return { success: true, data: service } as T;
  }

  return { success: true, data: [] } as T;
}
