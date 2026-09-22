'use client';

// ============================================================================
// @tanmayee/web — Search Results Page (/search)
// ============================================================================

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { SEED_PRODUCTS, SEED_BRANDS, SEED_CATEGORIES } from '@tanmayee/database';
import { ProductCard } from '../../components/product/product-card';

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    setQuery(initialQuery);
  }, [initialQuery]);

  const q = query.trim().toLowerCase();

  const matchingProducts = q
    ? SEED_PRODUCTS.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q)) ||
          p.brand_name.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          (p.features && p.features.some((f) => f.toLowerCase().includes(q)))
      )
    : [];

  const matchingBrands = q
    ? SEED_BRANDS.filter((b) => b.name.toLowerCase().includes(q))
    : [];

  const matchingCategories = q
    ? SEED_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q))
    : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Input Bar */}
      <div className="max-w-2xl mx-auto text-center space-y-4">
        <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900">
          Search Equipment Catalogue
        </h1>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by brand, tonnage, model number, or category..."
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-300 rounded-2xl shadow-sm text-sm focus:outline-none focus:border-brand-500"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
        </div>
      </div>

      {q && (
        <div className="space-y-8">
          {/* Matched Brands / Categories chips */}
          {(matchingBrands.length > 0 || matchingCategories.length > 0) && (
            <div className="flex flex-wrap items-center gap-3 bg-slate-100/70 p-4 rounded-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Related:
              </span>
              {matchingBrands.map((b) => (
                <Link
                  key={b.id}
                  href={`/brands/${b.slug}`}
                  className="bg-white border border-slate-200 text-brand-700 font-bold text-xs px-3 py-1 rounded-lg shadow-2xs hover:bg-brand-50"
                >
                  Brand: {b.name}
                </Link>
              ))}
              {matchingCategories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categories/${c.slug}`}
                  className="bg-white border border-slate-200 text-slate-800 font-bold text-xs px-3 py-1 rounded-lg shadow-2xs hover:bg-slate-50"
                >
                  Category: {c.name}
                </Link>
              ))}
            </div>
          )}

          {/* Results Count & Grid */}
          <div className="space-y-6">
            <h2 className="font-display font-bold text-lg text-slate-900">
              Found {matchingProducts.length} product(s) matching &ldquo;{query}&rdquo;
            </h2>

            {matchingProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
                <p className="text-sm">No products found for this search term.</p>
                <Link
                  href="/products"
                  className="inline-block text-xs font-bold text-brand-600 hover:underline"
                >
                  Browse our full 130+ equipment catalogue →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {matchingProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center text-slate-500">
          Loading equipment search...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
