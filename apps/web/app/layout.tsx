import React from 'react';
import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { Header } from '../components/layout/header';
import { Footer } from '../components/layout/footer';
import { CartProvider } from '../lib/cart-context';
import { CartDrawer } from '../components/cart/cart-drawer';
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

export const metadata: Metadata = {
  title: 'Tanmayee Technologies | Commercial ACs & Refrigeration (Blue Star & Rockwell)',
  description:
    'Authorized commercial partner for Blue Star Air Conditioners and Rockwell Commercial Freezers & Refrigeration equipment. Wholesale B2B pricing, turnkey installation, and AMC services in Hyderabad & Telangana.',
  keywords: [
    'Blue Star AC Hyderabad',
    'Rockwell deep freezers',
    'commercial air conditioners',
    'commercial refrigeration B2B',
    'Tanmayee Technologies',
    'cassette AC price quotation',
    'eutectic freezer Hyderabad',
    'visi coolers Telangana',
  ],
  authors: [{ name: 'Tanmayee Technologies' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://tanmayeetechnologies.com'),
  openGraph: {
    title: 'Tanmayee Technologies — B2B Cooling & Commercial Refrigeration',
    description:
      'Official Blue Star & Rockwell commercial cooling solutions. Direct B2B quotations, volume discounts, and engineering support.',
    url: 'https://tanmayeetechnologies.com',
    siteName: 'Tanmayee Technologies',
    locale: 'en_IN',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <QuoteModal />
          <FloatingCTAs />
        </CartProvider>
      </body>
    </html>
  );
}
