'use client';

// ============================================================================
// @tanmayee/web — Brand Client View
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import type { Brand } from '@tanmayee/types';
import type { SEED_PRODUCTS } from '@tanmayee/database';
import { ProductCard } from '../../../components/product/product-card';

interface BrandClientProps {
  brand: Brand;
  products: (typeof SEED_PRODUCTS)[0][];
}

export function BrandClient({ brand, products }: BrandClientProps) {
  const isBlueStar = brand.slug.includes('blue-star');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-brand-600 transition-colors">
          Brands
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">{brand.name}</span>
      </nav>

      {/* Brand Hero Banner */}
      <div
        className={`rounded-3xl p-8 sm:p-12 text-white border shadow-xl ${
          isBlueStar
            ? 'bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 border-blue-800/80'
            : 'bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 border-emerald-800/80'
        }`}
      >
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-200 border border-white/20">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-300" /> Authorized Commercial Distribution
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight">
            {brand.name} Commercial Solutions
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
            {brand.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-brand-400" /> 100% Genuine Brand Sourced
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-brand-400" /> Turnkey Installation Support
            </span>
            <span className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
              <CheckCircle2 className="w-4 h-4 text-brand-400" /> Factory Stamped Warranty
            </span>
          </div>
        </div>
      </div>

      {/* Products Listing Grid */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-900">
              {brand.name} Product Portfolio
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Showing {products.length} models available through Tanmayee Technologies.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
