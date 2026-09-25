import { MetadataRoute } from 'next';
import { getMergedProducts, SEED_CATEGORIES, SEED_BRANDS, SEED_SERVICES } from '@tanmayee/database';

export default function sitemap(): MetadataRoute.Sitemap {
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
      changeFrequency: 'weekly',
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
      priority: 0.75,
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
      priority: 0.65,
    },
  ];

  // 2. Brand Landing Pages
  const brandRoutes: MetadataRoute.Sitemap = SEED_BRANDS.map((brand) => ({
    url: `${baseUrl}/brands/${brand.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }));

  // 3. Category Landing Pages (Parent categories and subcategories)
  const categoryRoutes: MetadataRoute.Sitemap = SEED_CATEGORIES.map((category) => ({
    url: `${baseUrl}/categories/${category.slug}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: category.parent_id === null ? 0.85 : 0.8,
  }));

  // 4. Service Landing Pages
  const serviceRoutes: MetadataRoute.Sitemap = SEED_SERVICES.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  // 5. Product Detail Pages (All commercial models including merged overrides)
  const allProducts = getMergedProducts();
  const productRoutes: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${baseUrl}/products/${product.slug}`,
    lastModified: product.updated_at ? new Date(product.updated_at) : currentDate,
    changeFrequency: 'weekly',
    priority: product.featured ? 0.85 : 0.75,
  }));

  return [...staticRoutes, ...brandRoutes, ...categoryRoutes, ...serviceRoutes, ...productRoutes];
}
