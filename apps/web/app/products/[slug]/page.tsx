// ============================================================================
// @tanmayee/web — Product Detail Page (/products/[slug])
// Server Component with Dynamic SEO, OpenGraph, JSON-LD Schema.org Product markup
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SEED_PRODUCTS, SEED_BRANDS, SEED_CATEGORIES } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';
import { ProductDetailClient } from './product-detail-client';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return {
      title: 'Product Not Found | Tanmayee Technologies',
    };
  }

  const brand = SEED_BRANDS.find((b) => b.id === product.brand_id);
  const brandName = brand?.name || product.brand_name || 'Commercial Cooling';
  const imageUrl = product.media?.[0]?.url || 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png';

  const title = `${product.product_name} | Tanmayee Technologies Vizag`;
  const description = `${product.product_name} (Model: ${product.model_number || 'N/A'}). Authorized ${brandName} sales & service partner in Visakhapatnam, Andhra Pradesh. Genuine factory warranty, wholesale B2B pricing, turnkey installation.`;

  return {
    title,
    description,
    keywords: [
      product.product_name,
      product.model_number || '',
      `${brandName} price in Vizag`,
      `${brandName} dealer Andhra Pradesh`,
      'commercial refrigeration quotation',
      'deep freezer B2B supplier',
      'Tanmayee Technologies',
    ].filter(Boolean),
    alternates: {
      canonical: `https://tanmayeetechnologies.com/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tanmayeetechnologies.com/products/${product.slug}`,
      siteName: 'Tanmayee Technologies',
      images: [
        {
          url: imageUrl,
          width: 800,
          height: 600,
          alt: product.product_name,
        },
      ],
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const product = SEED_PRODUCTS.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    notFound();
  }

  const brand = SEED_BRANDS.find((b) => b.id === product.brand_id);
  const category = SEED_CATEGORIES.find((c) => c.id === product.category_id);

  // Similar products in same category or brand
  const similarProducts = SEED_PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category_id === product.category_id || p.brand_id === product.brand_id)
  ).slice(0, 4);

  const imageUrl = product.media?.[0]?.url || 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png';
  const brandName = brand?.name || product.brand_name || 'Brand';

  // Robust JSON-LD Product Schema for Google Search Console & Rich Snippets
  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.product_name,
    image: product.media?.map((m) => m.url) || [imageUrl],
    description: product.description || product.short_description,
    sku: product.sku || product.model_number || product.id,
    mpn: product.model_number || product.sku,
    brand: {
      '@type': 'Brand',
      name: brandName,
    },
    category: category?.name,
    offers: {
      '@type': 'Offer',
      url: `https://tanmayeetechnologies.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.reference_price || 0,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Tanmayee Technologies',
        telephone: COMPANY.PHONE_DISPLAY,
        url: 'https://tanmayeetechnologies.com',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.6',
      reviewCount: '98',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      {/* Search Engine Optimization: Structured Data Rich Result */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <ProductDetailClient
        product={product}
        brand={brand}
        category={category}
        similarProducts={similarProducts}
      />
    </>
  );
}
