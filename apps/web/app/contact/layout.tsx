import type { Metadata } from 'next';
import React from 'react';
import { COMPANY } from '@tanmayee/config';

export const metadata: Metadata = {
  title: 'Contact Tanmayee Technologies | Showroom, Sales & Service Support',
  description:
    'Contact Tanmayee Technologies in PM Palem, Madhurawada, Visakhapatnam. Call +91 93901 15553 for Blue Star AC and Rockwell commercial refrigeration enquiries, showroom visits, and B2B quotations.',
  keywords: [
    'contact Tanmayee Technologies',
    'Blue Star contact number Vizag',
    'Rockwell dealer phone number',
    'PM Palem showroom address',
    'commercial cooling quote enquiry',
  ],
  alternates: {
    canonical: 'https://tanmayeetechnologies.com/contact',
  },
  openGraph: {
    title: 'Contact Tanmayee Technologies | Sales & Service Support',
    description:
      'Connect with our commercial HVAC & refrigeration specialists. Visit our showroom at PM Palem, Madhurawada, Visakhapatnam or call +91 93901 15553.',
    url: 'https://tanmayeetechnologies.com/contact',
    type: 'website',
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: 'Contact Tanmayee Technologies',
    url: 'https://tanmayeetechnologies.com/contact',
    mainEntity: {
      '@type': 'LocalBusiness',
      name: COMPANY.NAME,
      telephone: COMPANY.PHONE_DISPLAY,
      email: COMPANY.EMAIL,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Plot No. SFS MIG-131, Housing Board Colony PM Palem, Madhurawada',
        addressLocality: 'Visakhapatnam',
        addressRegion: 'Andhra Pradesh',
        postalCode: '530041',
        addressCountry: 'IN',
      },
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
        name: 'Contact',
        item: 'https://tanmayeetechnologies.com/contact',
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
