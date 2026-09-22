import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Commercial Air Conditioners & Deep Freezers Catalog | Tanmayee Technologies',
  description:
    'Browse our comprehensive catalog of 155+ Blue Star commercial air conditioners and Rockwell deep freezers, visi coolers, cold rooms, and water dispensers. Instant B2B quotations and wholesale pricing.',
  keywords: [
    'commercial cooling equipment',
    'Blue Star AC catalog',
    'Rockwell freezer catalog',
    'commercial refrigeration Visakhapatnam',
    'cassette air conditioners',
    'deep freezer models',
    'visi coolers B2B',
  ],
  alternates: {
    canonical: 'https://tanmayeetechnologies.com/products',
  },
  openGraph: {
    title: 'Commercial ACs & Refrigeration Catalog | Tanmayee Technologies',
    description:
      'Explore 155+ commercial cooling products with full technical specifications and direct B2B quotation generator.',
    url: 'https://tanmayeetechnologies.com/products',
    type: 'website',
  },
};

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
        name: 'Products',
        item: 'https://tanmayeetechnologies.com/products',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
