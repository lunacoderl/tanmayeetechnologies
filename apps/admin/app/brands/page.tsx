'use client';

// ============================================================================
// @tanmayee/admin — Brands Portfolio Manager (/brands)
// ============================================================================

import React, { useState } from 'react';
import {
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { SEED_BRANDS, SEED_PRODUCTS } from '@tanmayee/database';

export default function AdminBrandsPage() {
  const [brands] = useState(SEED_BRANDS);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900">
            Brand Partners &amp; Dealerships
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Manage principal partnerships with Blue Star Limited and Rockwell Industries.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {brands.map((brand) => {
          const productCount = SEED_PRODUCTS.filter(
            (p) => p.brand_id === brand.id || (p.brand_name || '').toLowerCase() === brand.name.toLowerCase()
          ).length;
          return (
            <div
              key={brand.id}
              className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-4 sm:space-y-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-display font-black text-lg shadow-sm">
                    {brand.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-display font-extrabold text-lg text-slate-900">
                      {brand.name}
                    </h2>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        <CheckCircle2 className="w-3 h-3" /> Authorized Partner
                      </span>
                      <span className="text-xs font-mono text-slate-400">
                        /{brand.slug}
                      </span>
                    </div>
                  </div>
                </div>

                <a
                  href={`http://localhost:3000/brands/${brand.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 border border-slate-200 rounded-xl text-slate-500 hover:text-brand-600 hover:bg-slate-50 transition-colors"
                  title="View Public Brand Page"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                {brand.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Models Represented</span>
                  <span className="text-base font-extrabold text-slate-900">{productCount} Products</span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Official Website</span>
                  <a
                    href={brand.website_url || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-brand-600 hover:underline truncate block"
                  >
                    {brand.website_url?.replace('https://', '') || 'N/A'}
                  </a>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 text-[10px] block font-bold uppercase">Warranty SLA</span>
                  <span className="text-xs font-bold text-emerald-700">OEM Warranty Backed</span>
                </div>
              </div>

              {/* SEO Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/70 text-xs space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Brand SEO Target
                </div>
                <div className="font-semibold text-slate-800">{brand.seo_title}</div>
                <div className="text-slate-500 text-[11px] line-clamp-2">{brand.seo_description}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
