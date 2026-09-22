'use client';

// ============================================================================
// @tanmayee/web — Category Client View
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@tanmayee/types';
import type { SEED_PRODUCTS } from '@tanmayee/database';
import { ProductCard } from '../../../components/product/product-card';

interface CategoryClientProps {
  category: Category;
  subcategories: Category[];
  initialProducts: (typeof SEED_PRODUCTS)[0][];
}

export function CategoryClient({
  category,
  subcategories,
  initialProducts,
}: CategoryClientProps) {
  const [selectedSubcat, setSelectedSubcat] = useState<string>('all');

  const products = initialProducts.filter((p) => {
    if (selectedSubcat !== 'all') {
      return p.subcategory_id === selectedSubcat;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium">
        <Link href="/" className="hover:text-brand-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-brand-600 transition-colors">
          Categories
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-12 border border-slate-800 shadow-xl space-y-3">
        <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/20 px-3 py-1 rounded-full">
          Equipment Division
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-white">
          {category.name}
        </h1>
        <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
          {category.description}
        </p>
      </div>

      {/* Subcategories Filter Tabs if available */}
      {subcategories.length > 0 && (
        <div className="space-y-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
            Filter by Subcategory:
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedSubcat('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                selectedSubcat === 'all'
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              All {category.name}
            </button>
            {subcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => setSelectedSubcat(sub.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                  selectedSubcat === sub.id
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="space-y-6">
        <div className="flex items-baseline justify-between border-b border-slate-200 pb-4">
          <h2 className="font-display font-bold text-xl text-slate-900">
            Available Models ({products.length})
          </h2>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-500">
            No models found in this specific subcategory.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
