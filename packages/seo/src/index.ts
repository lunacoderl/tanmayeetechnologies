// ============================================================================
// @tanmayee/seo — SEO Utilities
// JSON-LD structured data generators, meta tag helpers, sitemap utilities
// ============================================================================

import { COMPANY } from '@tanmayee/config';
import type { PublishedProduct, Brand, Category, Service } from '@tanmayee/types';

// ──────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────
interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  og: {
    title: string;
    description: string;
    url: string;
    image?: string;
    type: string;
    site_name: string;
  };
}

// ──────────────────────────────────────────────
// Meta Tag Generators
// ──────────────────────────────────────────────

export function getProductMeta(product: PublishedProduct): MetaTags {
  const title =
    product.seo_title ||
    `${product.product_name} | ${product.model_number || ''} | ${COMPANY.NAME}`.trim();
  const description =
    product.seo_description ||
    `Explore ${product.product_name} ${product.model_number || ''} from ${product.brand_name} at ${COMPANY.NAME}. View specifications, features, applications and request a quotation.`.trim();
  const canonical =
    product.canonical_url ||
    `${COMPANY.FULL_URL}/${product.brand_slug}/${product.category_slug}/${product.slug}`;
  const primaryImage = product.media?.find((m) => m.is_primary)?.url;

  return {
    title,
    description,
    canonical,
    og: {
      title,
      description,
      url: canonical,
      image: primaryImage || undefined,
      type: 'product',
      site_name: COMPANY.NAME,
    },
  };
}

export function getCategoryMeta(category: Category): MetaTags {
  const title = category.seo_title || `${category.name} | ${COMPANY.NAME}`;
  const description =
    category.seo_description ||
    `Browse ${category.name} from leading brands at ${COMPANY.NAME}. View specifications, compare products, and request quotations.`;
  const canonical = `${COMPANY.FULL_URL}/products/${category.slug}`;

  return {
    title,
    description,
    canonical,
    og: {
      title,
      description,
      url: canonical,
      image: category.image_url || undefined,
      type: 'website',
      site_name: COMPANY.NAME,
    },
  };
}

export function getBrandMeta(brand: Brand): MetaTags {
  const title = brand.seo_title || `${brand.name} Products | ${COMPANY.NAME}`;
  const description =
    brand.seo_description ||
    `Explore ${brand.name} products available through ${COMPANY.NAME}. View complete range, specifications, and request quotations.`;
  const canonical = `${COMPANY.FULL_URL}/brands/${brand.slug}`;

  return {
    title,
    description,
    canonical,
    og: {
      title,
      description,
      url: canonical,
      image: brand.logo_url || undefined,
      type: 'website',
      site_name: COMPANY.NAME,
    },
  };
}

export function getServiceMeta(service: Service): MetaTags {
  const title = service.seo_title || `${service.name} | ${COMPANY.NAME}`;
  const description =
    service.seo_description ||
    `${service.name} by ${COMPANY.NAME}. ${service.short_description || ''}`.trim();
  const canonical = `${COMPANY.FULL_URL}/services/${service.slug}`;

  return {
    title,
    description,
    canonical,
    og: {
      title,
      description,
      url: canonical,
      image: service.image_url || undefined,
      type: 'website',
      site_name: COMPANY.NAME,
    },
  };
}

// ──────────────────────────────────────────────
// JSON-LD Structured Data Generators
// ──────────────────────────────────────────────

export function getOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: COMPANY.NAME,
    url: COMPANY.FULL_URL,
    logo: `${COMPANY.FULL_URL}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'sales',
      availableLanguage: ['English', 'Hindi', 'Telugu'],
    },
    sameAs: [],
  };
}

export function getWebSiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: COMPANY.NAME,
    url: COMPANY.FULL_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${COMPANY.FULL_URL}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

export function getProductJsonLd(product: PublishedProduct) {
  const primaryImage = product.media?.find((m) => m.is_primary);
  const images = product.media
    ?.filter((m) => m.type === 'MAIN_IMAGE' || m.type === 'GALLERY')
    .map((m) => m.url);

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.product_name,
    description: product.short_description || product.description,
    image: images?.length ? images : undefined,
    brand: {
      '@type': 'Brand',
      name: product.brand_name,
    },
    sku: product.sku || product.model_number,
    mpn: product.model_number,
    url: `${COMPANY.FULL_URL}/${product.brand_slug}/${product.category_slug}/${product.slug}`,
  };

  // Add specifications as additionalProperty
  if (product.attributes?.length) {
    jsonLd.additionalProperty = product.attributes.map((attr) => ({
      '@type': 'PropertyValue',
      name: attr.name,
      value: attr.value,
      unitText: attr.unit || undefined,
    }));
  }

  // Only add offers/pricing if explicitly shown
  if (product.price_display === 'SHOW' && product.reference_price) {
    jsonLd.offers = {
      '@type': 'Offer',
      price: product.reference_price,
      priceCurrency: product.currency,
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: COMPANY.NAME,
      },
    };
  }

  return jsonLd;
}

export function getBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function getLocalBusinessJsonLd(businessInfo: {
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: COMPANY.NAME,
    url: COMPANY.FULL_URL,
    telephone: businessInfo.phone,
    email: businessInfo.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: businessInfo.address,
      addressLocality: businessInfo.city,
      addressRegion: businessInfo.state,
      postalCode: businessInfo.pincode,
      addressCountry: 'IN',
    },
  };
}

export function getFaqJsonLd(
  faqs: Array<{ question: string; answer: string }>
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// ──────────────────────────────────────────────
// Sitemap Utilities
// ──────────────────────────────────────────────

interface SitemapEntry {
  loc: string;
  lastmod?: string;
  changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export function generateSitemapXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (entry) =>
        `  <url>
    <loc>${escapeXml(entry.loc)}</loc>
    ${entry.lastmod ? `<lastmod>${entry.lastmod}</lastmod>` : ''}
    ${entry.changefreq ? `<changefreq>${entry.changefreq}</changefreq>` : ''}
    ${entry.priority !== undefined ? `<priority>${entry.priority}</priority>` : ''}
  </url>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;
}

export function generateSitemapIndex(
  sitemaps: Array<{ loc: string; lastmod?: string }>
): string {
  const entries = sitemaps
    .map(
      (s) =>
        `  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>
    ${s.lastmod ? `<lastmod>${s.lastmod}</lastmod>` : ''}
  </sitemap>`
    )
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</sitemapindex>`;
}

export function generateRobotsTxt(): string {
  return `User-agent: *
Allow: /

Sitemap: ${COMPANY.FULL_URL}/sitemap.xml

# Disallow admin and API routes
Disallow: /admin/
Disallow: /api/
Disallow: /cart/
Disallow: /compare/
`;
}

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Generate a SEO-friendly image filename.
 * Example: "Rockwell 500L Green Freezer" → "rockwell-500l-green-freezer-tanmayee-technologies.webp"
 */
export function generateSeoFilename(
  productName: string,
  extension: string = 'webp'
): string {
  const slug = productName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();

  return `${slug}-tanmayee-technologies.${extension}`;
}

/**
 * Generate SEO-friendly alt text for a product image.
 */
export function generateImageAlt(
  productName: string,
  brandName?: string
): string {
  const parts = [productName];
  if (brandName) {
    // Only add brand if not already in product name
    if (!productName.toLowerCase().includes(brandName.toLowerCase())) {
      parts.unshift(brandName);
    }
  }
  parts.push(`available through ${COMPANY.NAME}`);
  return parts.join(' ');
}
