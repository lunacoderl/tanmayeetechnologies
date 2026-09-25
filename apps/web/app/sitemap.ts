import { MetadataRoute } from 'next';
import {
  fetchLiveProductsFromSupabase,
  SEED_CATEGORIES,
  SEED_BRANDS,
  SEED_SERVICES,
} from '@tanmayee/database';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Use canonical www domain matching the live 200 OK host to prevent GSC redirect warnings
  const baseUrl = 'https://www.tanmayeetechnologies.com';
  const currentDate = new Date();

  // 1. Static Core Pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  // 2. Brand Landing Pages
  const brandRoutes: MetadataRoute.Sitemap = SEED_BRANDS.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. Category Landing Pages (Parent categories, subcategories, and aliases)
  const categoryRoutes: MetadataRoute.Sitemap = SEED_CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: category.parent_id === null ? 0.85 : 0.8,
  }));

  // Dedicated specialized category aliases for HVAC & Refrigeration SEO
  const extraCategoryAliases = [
    'commercial-cassette-ac',
    'commercial-verticool-ac',
    'window-ac',
    'fixed-speed-split-ac',
    'convertible-green-freezer',
    'visi-cooler',
    'stainless-steel-water-cooler',
  ].map((slug) => ({
    url: `${baseUrl}/categories/${slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // 4. Service Landing Pages
  const primaryServiceSlugs = [
    'ac-installation',
    'freezer-installation',
    'annual-maintenance-contract',
    'preventive-maintenance',
    'cold-room-installation',
    'repair-emergency',
  ];

  const serviceRoutes: MetadataRoute.Sitemap = [
    ...SEED_SERVICES.map((service) => ({
      url: `${baseUrl}/services/${service.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
    ...primaryServiceSlugs.map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.85,
    })),
  ];

  // 5. Product Detail Pages (Live from Supabase + Seed Catalogue)
  const allProducts = await fetchLiveProductsFromSupabase();
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : currentDate,
    changeFrequency: 'weekly',
    priority: product.featured ? 0.85 : 0.75,
  }));

  return [
    ...staticRoutes,
    ...brandRoutes,
    ...categoryRoutes,
    ...extraCategoryAliases,
    ...serviceRoutes,
    ...productRoutes,
  ];
}
