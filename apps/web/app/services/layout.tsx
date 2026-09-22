import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Commercial HVAC Installation & AMC Services | Tanmayee Technologies',
  description:
    'Certified commercial HVAC preventive maintenance, emergency breakdown repair, turnkey cold room commissioning, and annual maintenance contracts (AMC) for Blue Star and Rockwell equipment in Visakhapatnam & Telangana.',
  keywords: [
    'HVAC AMC services Visakhapatnam',
    'commercial AC maintenance Vizag',
    'Blue Star authorized service center',
    'deep freezer repair Andhra Pradesh',
    'cold room installation Telangana',
    'annual maintenance contract cooling',
  ],
  alternates: {
    canonical: 'https://tanmayeetechnologies.com/services',
  },
  openGraph: {
    title: 'Commercial HVAC Installation & AMC Services | Tanmayee Technologies',
    description:
      'Certified commercial HVAC maintenance, 24/7 breakdown support, and genuine OEM parts for Blue Star & Rockwell cooling systems.',
    url: 'https://tanmayeetechnologies.com/services',
    type: 'website',
  },
};

export default function ServicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Commercial HVAC & Refrigeration AMC & Repair',
    provider: {
      '@type': 'LocalBusiness',
      name: 'Tanmayee Technologies',
      url: 'https://tanmayeetechnologies.com',
    },
    areaServed: [
      { '@type': 'City', name: 'Visakhapatnam' },
      { '@type': 'AdministrativeArea', name: 'Andhra Pradesh' },
      { '@type': 'AdministrativeArea', name: 'Telangana' },
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Cooling Equipment AMC & Maintenance Plans',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Comprehensive Commercial AC AMC',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Commercial Deep Freezer Preventive Maintenance',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Turnkey Cold Room Installation & Commissioning',
          },
        },
      ],
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
        name: 'Services & AMC',
        item: 'https://tanmayeetechnologies.com/services',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
