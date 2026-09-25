// ============================================================================
// @tanmayee/web — Category Page (/categories/[slug])
// Server Component with Dynamic SEO, OpenGraph & CollectionPage Schema
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEED_CATEGORIES, fetchLiveProductsFromSupabase, findCategory } from '@tanmayee/database';
import { CategoryClient } from './category-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = findCategory(slug);

  if (!category) {
    return {
      title: 'Category Not Found | Tanmayee Technologies',
    };
  }

  const title = `${category.name} | Tanmayee Technologies Vizag`;
  const description =
    category.seo_description ||
    `Explore commercial ${category.name.toLowerCase()} available at Tanmayee Technologies Visakhapatnam. Authorized Blue Star & Rockwell commercial distributor. B2B quotations and turnkey supply.`;

  return {
    title,
    description,
    keywords: [
      category.name,
      `${category.name} Visakhapatnam`,
      `${category.name} price Vizag`,
      'commercial refrigeration dealer Andhra Pradesh',
      'Tanmayee Technologies PM Palem',
    ],
    alternates: {
      canonical: `https://www.tanmayeetechnologies.com/categories/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tanmayeetechnologies.com/categories/${category.slug}`,
      siteName: 'Tanmayee Technologies',
      images: [
        {
          url: category.image_url || '/images/tanmayee-logo.png',
          width: 800,
          height: 600,
          alt: category.name,
        },
      ],
      type: 'website',
    },
  };
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const category = findCategory(slug);

  if (!category) {
    notFound();
  }

  const subcategories = SEED_CATEGORIES.filter((c) => c.parent_id === category.id);
  const allProducts = await fetchLiveProductsFromSupabase();

  let initialProducts = allProducts.filter((p) => {
    const catSlug = category.slug;
    const catNameLower = p.category_name.toLowerCase();
    const prodNameLower = p.product_name.toLowerCase();
    const subId = p.subcategory_id;

    // Direct ID match
    if (p.category_id === category.id || p.subcategory_id === category.id) return true;

    // AC Subcategories
    if (catSlug === 'inverter-split-ac' || catSlug === 'split-ac') {
      return (
        subId === 'c0000002-0000-0000-0000-000000000001' ||
        (prodNameLower.includes('inverter') && prodNameLower.includes('split'))
      );
    }
    if (catSlug === 'cassette-ac' || catSlug === 'commercial-cassette-ac') {
      return (
        subId === 'c0000002-0000-0000-0000-000000000003' ||
        prodNameLower.includes('cassette')
      );
    }
    if (catSlug === 'tower-ac' || catSlug === 'commercial-verticool-ac') {
      return (
        subId === 'c0000002-0000-0000-0000-000000000004' ||
        prodNameLower.includes('tower') ||
        prodNameLower.includes('verticool')
      );
    }
    if (catSlug === 'window-inverter-ac' || catSlug === 'window-ac' || catSlug === 'window-non-inverter-ac') {
      return prodNameLower.includes('window');
    }
    if (catSlug === 'non-inverter-split-ac' || catSlug === 'fixed-speed-split-ac') {
      return (
        subId === 'c0000002-0000-0000-0000-000000000002' ||
        prodNameLower.includes('non-inverter') ||
        prodNameLower.includes('fixed speed')
      );
    }

    // Rockwell & Refrigeration Subcategories & Parents
    if (catSlug === 'freezers' || catSlug === 'convertible-green-freezer') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000002' ||
        prodNameLower.includes('freezer')
      );
    }
    if (catSlug === 'visi-coolers' || catSlug === 'visi-cooler') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000003' ||
        prodNameLower.includes('visi') ||
        catNameLower.includes('visi')
      );
    }
    if (catSlug === 'water-coolers-dispensers' || catSlug === 'stainless-steel-water-cooler') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000004' ||
        prodNameLower.includes('water cooler') ||
        prodNameLower.includes('dispenser')
      );
    }
    if (catSlug === 'ice-makers') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000005' ||
        prodNameLower.includes('ice') ||
        catNameLower.includes('ice')
      );
    }
    if (catSlug === 'commercial-kitchen-refrigeration') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000006' ||
        prodNameLower.includes('chiller') ||
        prodNameLower.includes('reach-in') ||
        prodNameLower.includes('under counter') ||
        prodNameLower.includes('saladette')
      );
    }
    if (catSlug === 'specialty-cooling') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000007' ||
        prodNameLower.includes('wine') ||
        prodNameLower.includes('car cooler')
      );
    }
    if (catSlug === 'air-conditioners') {
      return (
        p.category_id === 'c0000001-0000-0000-0000-000000000001' ||
        catNameLower.includes('ac') ||
        catNameLower.includes('air conditioner')
      );
    }

    return false;
  });

  // Fallback if strict filter yields 0: match by category name or parent
  if (initialProducts.length === 0) {
    initialProducts = allProducts.filter(
      (p: any) =>
        p.category_id === category.id ||
        (category.parent_id && p.category_id === category.parent_id) ||
        p.product_name.toLowerCase().includes(category.name.toLowerCase().split(' ')[0])
    );
  }

  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://www.tanmayeetechnologies.com/categories/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: initialProducts.slice(0, 10).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://www.tanmayeetechnologies.com/products/${prod.slug}`,
        name: prod.product_name,
      })),
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://www.tanmayeetechnologies.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://www.tanmayeetechnologies.com/categories',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://www.tanmayeetechnologies.com/categories/${category.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(categoryJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <CategoryClient
        category={category}
        subcategories={subcategories}
        initialProducts={initialProducts}
      />
    </>
  );
}
