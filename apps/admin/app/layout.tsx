import React from 'react';
import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '../components/layout/sidebar';

export const metadata: Metadata = {
  title: 'Tanmayee Technologies — Admin Platform',
  description: 'Enterprise B2B management portal for catalogue, quotations, leads, and publishing.',
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
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden p-6 sm:p-10">{children}</main>
      </body>
    </html>
  );
}
