import React from 'react';
import Link from 'next/link';
import {
  Snowflake,
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Target,
  Wrench,
} from 'lucide-react';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Tanmayee Technologies | Blue Star Dealers & Rockwell Distributors',
  description:
    'Learn about Tanmayee Technologies, exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers and Rockwell Commercial Refrigerators Authorized Sales & Service Distributors based in PM Palem, Madhurawada, Visakhapatnam.',
  keywords: [
    'about Tanmayee Technologies',
    'Blue Star dealer Visakhapatnam',
    'Rockwell distributor Vizag',
    'commercial cooling history',
    'Madhurawada electronics store',
  ],
  alternates: {
    canonical: 'https://tanmayeetechnologies.com/about',
  },
  openGraph: {
    title: 'About Tanmayee Technologies | Commercial Cooling Leaders',
    description:
      'Premier commercial cooling dealership and distribution partner for Blue Star and Rockwell in Andhra Pradesh & Telangana.',
    url: 'https://tanmayeetechnologies.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Tanmayee Technologies',
    url: 'https://tanmayeetechnologies.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Tanmayee Technologies Private Limited',
      legalName: 'Tanmayee Technologies Private Limited',
      url: 'https://tanmayeetechnologies.com',
      foundingLocation: 'Visakhapatnam, Andhra Pradesh',
      knowsAbout: [
        'Commercial Air Conditioning',
        'Cold Chain Equipment',
        'Deep Freezers',
        'Visi Coolers',
        'HVAC Engineering',
        'Turnkey Cold Storage',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="flex justify-center mb-2">
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-cyan-500/60 bg-white p-1 shadow-xl shadow-cyan-500/20">
            <img
              src="/images/tanmayee-logo.png"
              alt="Tanmayee Technologies"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
          Corporate Background & Proven Track Record
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Tanmayee Technologies
        </h1>
        <p className="text-xs font-bold text-cyan-600 uppercase tracking-widest">
          Complete Cooling Solutions
        </p>
        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers and Rockwell Commercial Refrigerators Authorized Sales & Service Distributors, located in PM Palem, Madhurawada, Visakhapatnam. Providing genuine commercial cooling equipment, turnkey installation, and certified AMC support across Andhra Pradesh and Telangana.
        </p>
      </div>


      {/* Core Values Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            100% Genuine Manufacturer Supply
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every air conditioner, deep freezer, and chiller is sourced directly through official brand logistics channels with stamped factory warranty papers and complete GST tax invoices.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Wrench className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            Turnkey Engineering Execution
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            We do not simply drop off boxes. Our technical crews handle heat load calculations, architectural duct and cassette alignment, copper piping, high-ambient outdoor framing, and commissioning.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="font-display font-bold text-lg text-slate-900">
            Dedicated AMC & Lifecycle Support
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Annual Maintenance Contracts that guarantee fast response times, certified original spares, and continuous preventive health checks for commercial kitchens, hospitals, and corporate facilities.
          </p>
        </div>
      </div>

      {/* Corporate Philosophy */}
      <div className="bg-navy-950 text-white rounded-3xl p-8 sm:p-12 border border-navy-800 shadow-xl space-y-6">
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
            Our Vision
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-white">
            Reliable Cooling Infrastructure That Protects Your Enterprise
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Whether preserving critical vaccine stocks in a medical facility, preventing frozen food spoilage in a supermarket, or maintaining quiet executive comfort in a boardroom, Tanmayee Technologies delivers cooling performance you can depend on.
          </p>
        </div>

        <div className="pt-4 flex flex-wrap gap-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all"
          >
            <span>Explore Product Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs px-6 py-3.5 rounded-xl transition-all"
          >
            <span>Connect With Sales Team</span>
          </Link>
        </div>
      </div>
    </div>
  </>
  );
}
