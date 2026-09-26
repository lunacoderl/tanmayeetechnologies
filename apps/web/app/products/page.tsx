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

export default async function ProductsPage() {
  const products = await fetchLiveProductsFromSupabase();
  return <ProductsClient initialProducts={products} />;
}
