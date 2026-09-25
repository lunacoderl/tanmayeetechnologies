// ============================================================================
// @tanmayee/web — Brand Page (/brands/[slug])
// Server Component with Dynamic SEO, OpenGraph & Brand Schema
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEED_BRANDS, getMergedProducts } from '@tanmayee/database';
import { BrandClient } from './brand-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const brand = SEED_BRANDS.find((b) => b.slug === slug || b.id === slug);

  if (!brand) {
    return {
      title: 'Brand Not Found | Tanmayee Technologies',
    };
  }

  const isBlueStar = brand.slug.includes('blue-star');
  const role = isBlueStar ? 'Authorized Dealers' : 'Authorized Distributors';
  const title = `${brand.name} Commercial Solutions (${role}) | Tanmayee Technologies Vizag`;
  const description =
    brand.seo_description ||
    `Official ${brand.name} ${role} in Visakhapatnam, Andhra Pradesh & Telangana. Explore complete commercial catalog, direct factory pricing, and certified maintenance.`;

  return {
    title,
    description,
    keywords: [
      brand.name,
      `${brand.name} Visakhapatnam`,
      `${brand.name} dealer Vizag`,
      `${brand.name} distributor Andhra Pradesh`,
      'commercial cooling equipment',
      'Tanmayee Technologies',
    ],
    alternates: {
      canonical: `https://www.tanmayeetechnologies.com/brands/${brand.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tanmayeetechnologies.com/brands/${brand.slug}`,
      siteName: 'Tanmayee Technologies',
      images: [
        {
          url: brand.logo_url || '/images/tanmayee-logo.png',
          width: 800,
          height: 600,
          alt: brand.name,
        },
      ],
      type: 'website',
    },
  };
}

export default async function BrandPage({ params }: PageProps) {
  const { slug } = await params;
  const brand = SEED_BRANDS.find((b) => b.slug === slug || b.id === slug);

  if (!brand) {
    notFound();
  }

  const products = getMergedProducts().filter(
    (p) =>
      p.brand_id === brand.id ||
      (brand.slug === 'rockwell' && p.brand_name.toLowerCase().includes('rockwell')) ||
      (brand.slug === 'blue-star' && p.brand_name.toLowerCase().includes('blue star'))
  );

  const brandJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: brand.name,
    description: brand.description,
    url: `https://www.tanmayeetechnologies.com/brands/${brand.slug}`,
    logo: brand.logo_url,
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
        name: 'Brands',
        item: 'https://www.tanmayeetechnologies.com/brands',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: brand.name,
        item: `https://www.tanmayeetechnologies.com/brands/${brand.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(brandJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <BrandClient brand={brand} products={products} />
    </>
  );
}
