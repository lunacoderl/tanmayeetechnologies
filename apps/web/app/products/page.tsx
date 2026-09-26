// ============================================================================
// @tanmayee/web — Product Listing Page (/products)
// Server Component with Live Supabase Sync & ProductsClient Faceted View
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { fetchLiveProductsFromSupabase } from '@tanmayee/database';
import { ProductsClient } from './products-client';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'All Commercial Products & Equipment | Tanmayee Technologies Vizag',
  description:
    'Explore complete commercial HVAC and refrigeration inventory from Blue Star and Rockwell. Inverter Split ACs, Cassette ACs, Deep Freezers, and Visi Coolers with instant B2B quotation requests.',
  openGraph: {
    title: 'Commercial HVAC & Refrigeration Catalog | Tanmayee Technologies',
    description:
      'Official wholesale catalog for Blue Star and Rockwell commercial cooling equipment in Visakhapatnam and Andhra Pradesh.',
    url: 'https://www.tanmayeetechnologies.com/products',
    siteName: 'Tanmayee Technologies',
    type: 'website',
  },
};

interface PageProps {
  searchParams?: Promise<{
    category?: string;
    brand?: string;
    q?: string;
    deals?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const [products, resolvedSearchParams] = await Promise.all([
    fetchLiveProductsFromSupabase(),
    searchParams ? searchParams : Promise.resolve({ category: 'all', brand: 'all', q: '', deals: '' }),
  ]);

  const category = (resolvedSearchParams as any)?.category || 'all';
  const brand = (resolvedSearchParams as any)?.brand || 'all';
  const q = (resolvedSearchParams as any)?.q || '';

  return (
    <ProductsClient
      initialProducts={products}
      initialCategory={category}
      initialBrand={brand}
      initialQuery={q}
    />
  );
}
