// ============================================================================
// @tanmayee/web — Category Page (/categories/[slug])
// Server Component with Dynamic SEO, OpenGraph & CollectionPage Schema
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@tanmayee/database';
import { CategoryClient } from './category-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = SEED_CATEGORIES.find((c) => c.slug === slug || c.id === slug);

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
      canonical: `https://tanmayeetechnologies.com/categories/${category.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tanmayeetechnologies.com/categories/${category.slug}`,
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
  const category = SEED_CATEGORIES.find((c) => c.slug === slug || c.id === slug);

  if (!category) {
    notFound();
  }

  const subcategories = SEED_CATEGORIES.filter((c) => c.parent_id === category.id);

  const initialProducts = SEED_PRODUCTS.filter((p) => {
    const catSlug = category.slug;
    const catNameLower = p.category_name.toLowerCase();

    return (
      p.category_id === category.id ||
      catNameLower.replace(/\s+/g, '-') === catSlug ||
      (catSlug === 'freezers' &&
        (catNameLower.includes('freezer') ||
          p.category_id === 'c0000001-0000-0000-0000-000000000002')) ||
      (catSlug === 'visi-coolers' &&
        (catNameLower.includes('visi') ||
          p.category_id === 'c0000001-0000-0000-0000-000000000003')) ||
      (catSlug === 'water-coolers-dispensers' &&
        (catNameLower.includes('water cooler') ||
          catNameLower.includes('dispenser') ||
          p.category_id === 'c0000001-0000-0000-0000-000000000004')) ||
      (catSlug === 'air-conditioners' &&
        (catNameLower.includes('ac') ||
          catNameLower.includes('air conditioner') ||
          p.category_id === 'c0000001-0000-0000-0000-000000000001')) ||
      (catSlug === 'commercial-kitchen-refrigeration' &&
        (p.category_id === 'c0000001-0000-0000-0000-000000000006' ||
          catNameLower.includes('chiller') ||
          catNameLower.includes('reach-in') ||
          catNameLower.includes('under counter')))
    );
  });

  const categoryJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: category.name,
    description: category.description,
    url: `https://tanmayeetechnologies.com/categories/${category.slug}`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: initialProducts.slice(0, 10).map((prod, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `https://tanmayeetechnologies.com/products/${prod.slug}`,
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
        item: 'https://tanmayeetechnologies.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Categories',
        item: 'https://tanmayeetechnologies.com/products',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: category.name,
        item: `https://tanmayeetechnologies.com/categories/${category.slug}`,
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
