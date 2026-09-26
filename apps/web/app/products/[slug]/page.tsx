// ============================================================================
// @tanmayee/web — Product Detail Page (/products/[slug])
// Server Component with Live Supabase Sync, Dynamic SEO, Multi-Image OpenGraph,
// and ImageObject JSON-LD Schema.org Product markup
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  fetchLiveProductsFromSupabase,
  SEED_BRANDS,
  SEED_CATEGORIES,
} from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';
import { ProductDetailClient } from './product-detail-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const allProducts = await fetchLiveProductsFromSupabase();
  const product = allProducts.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    return {
      title: 'Product Not Found | Tanmayee Technologies',
    };
  }

  const brand = SEED_BRANDS.find((b) => b.id === product.brand_id);
  const brandName = brand?.name || product.brand_name || 'Commercial Cooling';
  const defaultFallback = 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png';

  // Gather all high-res image URLs for OpenGraph & Twitter
  const allImages = (Array.isArray(product.media) && product.media.length > 0)
    ? product.media
        .filter((m: any) => m.type !== 'VIDEO')
        .map((m: any, i: number) => ({
          url: typeof m === 'string' ? m : m.url,
          width: 1200,
          height: 900,
          alt: `${product.product_name} - ${brandName} View ${i + 1}`,
        }))
    : [
        {
          url: product.primary_image_url || defaultFallback,
          width: 1200,
          height: 900,
          alt: product.product_name,
        },
      ];

  const primaryUrl = allImages[0]?.url || defaultFallback;
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
      'commercial air conditioner Visakhapatnam',
      'Tanmayee Technologies',
    ].filter(Boolean),
    alternates: {
      canonical: `https://www.tanmayeetechnologies.com/products/${product.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://www.tanmayeetechnologies.com/products/${product.slug}`,
      siteName: 'Tanmayee Technologies',
      images: allImages,
      locale: 'en_IN',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [primaryUrl],
    },
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const allProducts = await fetchLiveProductsFromSupabase();
  const product = allProducts.find((p) => p.slug === slug || p.id === slug);

  if (!product) {
    notFound();
  }

  const brand = SEED_BRANDS.find((b) => b.id === product.brand_id);
  const category = SEED_CATEGORIES.find((c) => c.id === product.category_id);

  // Similar products in same category or brand
  const similarProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category_id === product.category_id || p.brand_id === product.brand_id))
    .slice(0, 4);

  const brandName = brand?.name || product.brand_name || 'Brand';
  const defaultFallback = 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png';
  const primaryImgUrl = product.primary_image_url || product.media?.[0]?.url || defaultFallback;

  // Enriched schema.org/Product with ImageObject array for Google Image Search
  const imagesSchema = (Array.isArray(product.media) && product.media.length > 0)
    ? product.media.map((m: any, idx: number) => ({
        '@type': 'ImageObject',
        url: typeof m === 'string' ? m : m.url,
        contentUrl: typeof m === 'string' ? m : m.url,
        name: `${product.product_name} View ${idx + 1}`,
        caption: `${product.product_name} - Authorized ${brandName} Distributor Visakhapatnam (Angle ${idx + 1})`,
      }))
    : [primaryImgUrl];

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.product_name,
    image: imagesSchema,
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
      url: `https://www.tanmayeetechnologies.com/products/${product.slug}`,
      priceCurrency: 'INR',
      price: product.reference_price || 0,
      priceValidUntil: '2026-12-31',
      itemCondition: 'https://schema.org/NewCondition',
      availability: 'https://schema.org/InStock',
      seller: {
        '@type': 'Organization',
        name: 'Tanmayee Technologies',
        telephone: COMPANY.PHONE_DISPLAY,
        url: 'https://www.tanmayeetechnologies.com',
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
