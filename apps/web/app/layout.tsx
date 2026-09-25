import React from 'react';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { CartProvider } from '../lib/cart-context';
import { UserStoreProvider } from '../lib/user-store-context';
import { CartDrawer } from '../components/cart/cart-drawer';
import { WishlistDrawer } from '../components/cart/wishlist-drawer';
import { QuoteModal } from '../components/cart/quote-modal';
import { FloatingCTAs } from '../components/layout/floating-ctas';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

import { COMPANY } from '@tanmayee/config';

export const metadata: Metadata = {
  title: {
    default: 'Tanmayee Technologies | Commercial ACs & Refrigeration (Blue Star & Rockwell)',
    template: '%s | Tanmayee Technologies',
  },
  description:
    'Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers and Rockwell Commercial Refrigeration Distributors in Visakhapatnam, Andhra Pradesh & Telangana. Commercial ACs, deep freezers, visi coolers, cold rooms, B2B quotations & AMC.',
  keywords: [
    'Blue Star AC Visakhapatnam',
    'Blue Star AC Vizag dealer',
    'Rockwell deep freezers Andhra Pradesh',
    'commercial air conditioners Vizag',
    'commercial refrigeration B2B',
    'Tanmayee Technologies Madhurawada',
    'PM Palem AC dealer',
    'cassette AC price quotation',
    'eutectic freezer Visakhapatnam',
    'visi coolers Telangana Andhra Pradesh',
    'cold room installation Vizag',
  ],
  authors: [{ name: 'Tanmayee Technologies', url: 'https://www.tanmayeetechnologies.com' }],
  creator: 'Tanmayee Technologies',
  publisher: 'Tanmayee Technologies Private Limited',
  metadataBase: new URL('https://www.tanmayeetechnologies.com'),
  alternates: {
    canonical: 'https://www.tanmayeetechnologies.com',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || 'f40-dIu842kPZ-0g703pM-YOUR_CODE_HERE',
  },
  other: {
    'geo.region': 'IN-AP',
    'geo.placename': 'Visakhapatnam, Andhra Pradesh',
    'geo.position': '17.8188;83.3512',
    'ICBM': '17.8188, 83.3512',
  },
  openGraph: {
    title: 'Tanmayee Technologies — Commercial ACs & Refrigeration',
    description:
      'Official Blue Star & Rockwell commercial cooling equipment distributors. B2B wholesale quotations, volume discounts, turnkey installation, and certified AMC maintenance.',
    url: 'https://www.tanmayeetechnologies.com',
    siteName: 'Tanmayee Technologies',
    images: [
      {
        url: '/images/tanmayee-logo.png',
        width: 512,
        height: 512,
        alt: 'Tanmayee Technologies Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Tanmayee Technologies — B2B Cooling & Commercial Refrigeration',
    description:
      'Authorized Blue Star & Rockwell commercial partner. Turnkey HVAC and cold chain equipment.',
    images: ['/images/tanmayee-logo.png'],
  },
  icons: {
    icon: [
      { url: '/images/tanmayee-logo.png', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    shortcut: ['/images/tanmayee-logo.png'],
    apple: [
      { url: '/images/tanmayee-logo.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const localBusinessJsonLd = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'HVACBusiness', 'Store'],
    '@id': 'https://tanmayeetechnologies.com/#organization',
    name: COMPANY.NAME,
    legalName: COMPANY.LEGAL_NAME,
    alternateName: 'Tanmayee Technologies Vizag',
    description: COMPANY.ABOUT,
    url: 'https://tanmayeetechnologies.com',
    logo: 'https://tanmayeetechnologies.com/images/tanmayee-logo.png',
    image: 'https://tanmayeetechnologies.com/images/tanmayee-logo.png',
    telephone: COMPANY.PHONE_DISPLAY,
    email: COMPANY.EMAIL,
    priceRange: '₹₹ - ₹₹₹₹',
    currenciesAccepted: 'INR',
    paymentAccepted: 'Cash, Credit Card, Bank Transfer, UPI, Cheque',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Plot No. SFS MIG-131, Housing Board Colony PM Palem, Madhurawada',
      addressLocality: 'Visakhapatnam',
      addressRegion: 'Andhra Pradesh',
      postalCode: '530041',
      addressCountry: 'IN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 17.8188,
      longitude: 83.3512,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '09:00',
        closes: '21:00',
      },
    ],
    hasMap: COMPANY.GOOGLE_MAPS_URL,
    areaServed: [
      { '@type': 'City', name: 'Visakhapatnam' },
      { '@type': 'AdministrativeArea', name: 'Andhra Pradesh' },
      { '@type': 'AdministrativeArea', name: 'Telangana' },
    ],
    brand: [
      { '@type': 'Brand', name: 'Blue Star' },
      { '@type': 'Brand', name: 'Rockwell' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: String(COMPANY.GOOGLE_RATING),
      reviewCount: String(COMPANY.GOOGLE_REVIEW_COUNT),
      bestRating: '5',
      worstRating: '1',
    },
    review: COMPANY.REVIEWS.map((rev) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: rev.author },
      reviewRating: {
        '@type': 'Rating',
        ratingValue: String(rev.rating),
        bestRating: '5',
      },
      reviewBody: rev.text,
    })),
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': 'https://www.tanmayeetechnologies.com/#website',
    name: COMPANY.NAME,
    url: 'https://www.tanmayeetechnologies.com',
    publisher: {
      '@id': 'https://www.tanmayeetechnologies.com/#organization',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: 'https://www.tanmayeetechnologies.com/search?q={search_term_string}',
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <UserStoreProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <CartDrawer />
            <WishlistDrawer />
            <QuoteModal />
            <FloatingCTAs />
          </CartProvider>
        </UserStoreProvider>
      </body>
    </html>
  );
}
