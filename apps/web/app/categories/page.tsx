// ============================================================================
// @tanmayee/web — Categories Hub Page (/categories)
// Complete directory of Commercial Cooling & Refrigeration Categories
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Wind,
  ThermometerSnowflake,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Package,
  Layers,
  Sparkles,
} from 'lucide-react';
import { SEED_CATEGORIES, SEED_PRODUCTS } from '@tanmayee/database';

export const metadata: Metadata = {
  title: 'Commercial Cooling & Refrigeration Categories | Tanmayee Technologies',
  description:
    'Explore all commercial air conditioners, deep freezers, visi coolers, water coolers, ice machines, and kitchen refrigeration available at Tanmayee Technologies Visakhapatnam. Authorized Blue Star & Rockwell dealers.',
  keywords: [
    'commercial cooling categories',
    'Blue Star AC categories Vizag',
    'Rockwell freezer categories Andhra Pradesh',
    'commercial refrigeration catalogue',
    'Tanmayee Technologies products',
  ],
  alternates: {
    canonical: 'https://tanmayeetechnologies.com/categories',
  },
};

export default function CategoriesPage() {
  const parentCategories = SEED_CATEGORIES.filter((c) => c.parent_id === null);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12 animate-fade-in">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3.5 py-1.5 rounded-full border border-brand-100">
          Equipment Directory &amp; Classification
        </span>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight">
          Commercial Cooling Categories
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Comprehensive inventory of genuine Blue Star air conditioning systems and Rockwell commercial refrigeration machinery. Select any category below for full specifications and wholesale B2B quotations.
        </p>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {parentCategories.map((category) => {
          const subcategories = SEED_CATEGORIES.filter((c) => c.parent_id === category.id);
          const isAC = category.slug === 'air-conditioners';
          const productCount = SEED_PRODUCTS.filter(
            (p) => p.category_id === category.id || subcategories.some((s) => s.id === p.subcategory_id)
          ).length;

          return (
            <div
              key={category.id}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-cyan-400/70 transition-all duration-300 flex flex-col justify-between overflow-hidden group p-6"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                      isAC ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'
                    }`}
                  >
                    {isAC ? <Wind className="w-6 h-6" /> : <ThermometerSnowflake className="w-6 h-6" />}
                  </div>
                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {productCount || category.product_count || 12}+ models
                  </span>
                </div>

                <Link href={`/categories/${category.slug}`} className="block group">
                  <h3 className="font-display font-black text-xl text-slate-900 group-hover:text-[#0284c7] transition-colors mb-2">
                    {category.name}
                  </h3>
                </Link>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3 mb-4">
                  {category.description}
                </p>

                {subcategories.length > 0 && (
                  <div className="space-y-1.5 pt-3 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      Subcategories:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/categories/${sub.slug}`}
                          className="text-[11px] font-medium bg-slate-50 hover:bg-cyan-50 text-slate-700 hover:text-cyan-800 px-2.5 py-1 rounded-lg border border-slate-200/60 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href={`/categories/${category.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0284c7] hover:text-[#00529b] transition-colors"
                >
                  <span>Explore All {category.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* OEM Brand Assurance Banner */}
      <div className="bg-gradient-to-r from-[#002b49] via-[#094067] to-[#00529b] rounded-3xl p-8 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-cyan-300 text-xs font-bold border border-white/10">
            <ShieldCheck className="w-4 h-4" /> Official Dealership &amp; Warranty
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl tracking-tight">
            Direct Commercial Supply with Factory Warranty
          </h2>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
            Every air conditioner, deep freezer, and visi cooler supplied by Tanmayee Technologies comes with 100% genuine OEM manufacturer warranty, factory-trained installation engineers, and full technical documentation for compliance and audits.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-white text-slate-900 hover:bg-slate-100 px-5 py-2.5 rounded-xl font-bold text-xs transition-transform hover:scale-105 shadow-md"
            >
              Request Institutional Quote
            </Link>
            <Link
              href="/services"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/20 px-5 py-2.5 rounded-xl font-bold text-xs transition-colors"
            >
              View Turnkey Services &amp; AMC
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
