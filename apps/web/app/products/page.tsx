'use client';

// ============================================================================
// @tanmayee/web — Product Listing Page (/products)
// Faceted dynamic filtering, search, and sorting
// ============================================================================

import React, { useState, useMemo } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { SEED_PRODUCTS, SEED_CATEGORIES, SEED_BRANDS } from '@tanmayee/database';
import { ProductCard } from '../../components/product/product-card';
import { RecommendedProducts } from '../../components/product/recommended-products';
import { useUserStore } from '../../lib/user-store-context';

export default function ProductsPage() {
  const { trackSearchQuery, trackCategoryClick } = useUserStore();
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStar, setSelectedStar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'name'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Behavioral interaction tracking
  React.useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        trackSearchQuery(searchQuery);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, trackSearchQuery]);

  React.useEffect(() => {
    if (selectedCategory !== 'all') {
      trackCategoryClick(selectedCategory);
    }
  }, [selectedCategory, trackCategoryClick]);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...SEED_PRODUCTS];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q)) ||
          p.brand_name.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q)
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter(
        (p) =>
          p.brand_name.toLowerCase().replace(/\s+/g, '-') === selectedBrand ||
          (selectedBrand === 'rockwell' && p.brand_name.toLowerCase().includes('rockwell')) ||
          (selectedBrand === 'blue-star' && p.brand_name.toLowerCase().includes('blue star'))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        const catSlug = selectedCategory;
        const catNameLower = p.category_name.toLowerCase();
        return (
          catNameLower.replace(/\s+/g, '-') === catSlug ||
          p.category_id === selectedCategory ||
          p.subcategory_id === selectedCategory ||
          (catSlug === 'freezers' && (catNameLower.includes('freezer') || p.category_id === 'c0000001-0000-0000-0000-000000000002')) ||
          (catSlug === 'visi-coolers' && (catNameLower.includes('visi') || p.category_id === 'c0000001-0000-0000-0000-000000000003')) ||
          (catSlug === 'water-coolers-dispensers' && (catNameLower.includes('water cooler') || catNameLower.includes('dispenser') || p.category_id === 'c0000001-0000-0000-0000-000000000004')) ||
          (catSlug === 'air-conditioners' && (catNameLower.includes('ac') || catNameLower.includes('air conditioner') || p.category_id === 'c0000001-0000-0000-0000-000000000001')) ||
          (catSlug === 'commercial-kitchen-refrigeration' && (p.category_id === 'c0000001-0000-0000-0000-000000000006' || catNameLower.includes('chiller') || catNameLower.includes('reach-in') || catNameLower.includes('under counter')))
        );
      });
    }


    // Star rating filter
    if (selectedStar !== 'all') {
      result = result.filter((p) =>
        p.attributes.some((a) => a.name.toLowerCase().includes('star') && a.value.includes(selectedStar))
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.reference_price || 0) - (b.reference_price || 0));
        break;
      case 'price_desc':
        result.sort((a, b) => (b.reference_price || 0) - (a.reference_price || 0));
        break;
      case 'name':
        result.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      default:
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }

    return result;
  }, [selectedBrand, selectedCategory, selectedStar, searchQuery, sortBy]);

  const resetFilters = () => {
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedStar('all');
    setSearchQuery('');
    setSortBy('relevance');
  };

  const hasActiveFilters =
    selectedBrand !== 'all' ||
    selectedCategory !== 'all' ||
    selectedStar !== 'all' ||
    searchQuery.trim() !== '';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900">
          Commercial Equipment Catalogue
        </h1>
        <p className="text-sm text-slate-500 max-w-3xl">
          Browse the complete inventory of 130+ Blue Star air conditioners and Rockwell commercial refrigeration systems. Filter by equipment specifications, capacity, or brand.
        </p>
      </div>

      {/* Main Layout: Filters Sidebar + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Mobile Filter Button */}
        <div className="lg:hidden flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(true)}
            className="flex items-center gap-2 text-sm font-bold text-slate-800"
          >
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Filter Equipment ({filteredProducts.length})</span>
          </button>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs text-brand-600 font-semibold"
            >
              Reset
            </button>
          )}
        </div>

        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block bg-white rounded-3xl border border-slate-200 p-6 space-y-6 shadow-sm sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-semibold text-brand-600 hover:text-brand-800 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            )}
          </div>

          {/* Search Box in sidebar */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Keyword Search
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search models, specs..."
                className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Manufacturer Brand
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => setSelectedBrand('all')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedBrand === 'all'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Brands</span>
                <span className="text-slate-400">155</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBrand('blue-star')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedBrand === 'blue-star'
                    ? 'bg-blue-50 text-blue-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Blue Star</span>
                <span className="text-slate-400 font-bold">58</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedBrand('rockwell')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-colors ${
                  selectedBrand === 'rockwell'
                    ? 'bg-emerald-50 text-emerald-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>Rockwell</span>
                <span className="text-slate-400 font-bold">97</span>
              </button>
            </div>
          </div>

          {/* Categories Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Equipment Category
            </label>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                  selectedCategory === 'all'
                    ? 'bg-brand-50 text-brand-700 font-bold'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
              </button>
              {SEED_CATEGORIES.filter((c) => c.parent_id === null).map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between ${
                    selectedCategory === cat.slug
                      ? 'bg-brand-50 text-brand-700 font-bold'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] text-slate-400">{cat.product_count}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Energy Rating Filter */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Star Rating (ACs)
            </label>
            <div className="flex gap-2">
              {['all', '3 Star', '5 Star'].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStar(star)}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border transition-colors ${
                    selectedStar === star
                      ? 'bg-amber-500 text-white border-amber-500'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {star === 'all' ? 'All' : star}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Products Grid Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort & Count Bar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="text-xs font-semibold text-slate-600">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> commercial models
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
              >
                <option value="relevance">Popularity / Relevance</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="name">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Product Cards Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 animate-fade-in-up">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-lg text-slate-900">No matching equipment found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Try loosening your filters or resetting to view our full 155 commercial equipment inventory of Blue Star and Rockwell models.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-102"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={`${product.id}-${index}`}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${Math.min(index, 9) * 40}ms` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* Smart Recommendations Section */}
          <div className="pt-10 border-t border-slate-200">
            <RecommendedProducts
              title="Products You May Like"
              subtitle="Curated models matched to your active filters, capacity needs, and past searches"
              limit={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
