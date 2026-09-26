'use client';

// ============================================================================
// @tanmayee/web — Interactive Product Listing Client Component
// Faceted dynamic filtering, search, sorting, and live Supabase sync
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import {
  Filter,
  SlidersHorizontal,
  X,
  Search,
  Check,
  ChevronDown,
  RotateCcw,
} from 'lucide-react';
import { SEED_CATEGORIES, SEED_BRANDS } from '@tanmayee/database';
import { ProductCard } from '../../components/product/product-card';
import { RecommendedProducts } from '../../components/product/recommended-products';
import { useUserStore } from '../../lib/user-store-context';

interface ProductsClientProps {
  initialProducts: any[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const { trackSearchQuery, trackCategoryClick } = useUserStore();
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStar, setSelectedStar] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'name'>('relevance');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Initialize with server-fetched live Supabase products
  const [productList, setProductList] = useState<any[]>(initialProducts);

  // Behavioral interaction tracking
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const timer = setTimeout(() => {
        trackSearchQuery(searchQuery);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [searchQuery, trackSearchQuery]);

  useEffect(() => {
    if (selectedCategory !== 'all') {
      trackCategoryClick(selectedCategory);
    }
  }, [selectedCategory, trackCategoryClick]);

  // Keep state synchronized with server props
  useEffect(() => {
    if (Array.isArray(initialProducts) && initialProducts.length > 0) {
      setProductList(initialProducts);
    }
  }, [initialProducts]);

  // Background non-cached refresh from /api/products
  useEffect(() => {
    let isMounted = true;
    async function loadLiveProducts() {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.products && Array.isArray(json.products) && json.products.length > 0) {
            setProductList(json.products);
          }
        }
      } catch (e) {
        // Fall back to server-rendered initial products
      }
    }
    loadLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    let result = [...productList];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q)) ||
          (p.brand_name && p.brand_name.toLowerCase().includes(q)) ||
          (p.category_name && p.category_name.toLowerCase().includes(q))
      );
    }

    // Brand filter
    if (selectedBrand !== 'all') {
      result = result.filter((p) => {
        const bName = (p.brand_name || (p.product_name?.toLowerCase().includes('blue star') ? 'Blue Star' : 'Rockwell')).toLowerCase();
        return (
          bName.replace(/\s+/g, '-') === selectedBrand ||
          (selectedBrand === 'rockwell' && bName.includes('rockwell')) ||
          (selectedBrand === 'blue-star' && bName.includes('blue star'))
        );
      });
    }

    // Category filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => {
        const catSlug = selectedCategory;
        const catNameLower = (p.category_name || '').toLowerCase();
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
        (p.attributes || []).some((a: any) => (a.name || '').toLowerCase().includes('star') && (a.value || '').includes(selectedStar))
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
        result.sort((a, b) => (a.product_name || '').localeCompare(b.product_name || ''));
        break;
      default:
        result.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));
    }

    return result;
  }, [productList, selectedBrand, selectedCategory, selectedStar, searchQuery, sortBy]);

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
          Browse the complete inventory of 155 commercial Blue Star air conditioners and Rockwell refrigeration systems. Filter by equipment specifications, capacity, or brand.
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
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Brand Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Authorized Brands
            </label>
            <div className="space-y-1.5">
              {[
                { id: 'all', name: 'All Brands' },
                { id: 'blue-star', name: 'Blue Star (A/C Shoppe)' },
                { id: 'rockwell', name: 'Rockwell Refrigeration' },
              ].map((brand) => (
                <button
                  key={brand.id}
                  type="button"
                  onClick={() => setSelectedBrand(brand.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    selectedBrand === brand.id
                      ? 'bg-brand-50 text-brand-700 border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span>{brand.name}</span>
                  {selectedBrand === brand.id && <Check className="w-3.5 h-3.5 text-brand-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* Equipment Category Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Category
            </label>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-brand-50 text-brand-700 border border-brand-200'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>All Categories</span>
                {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </button>

              {/* Main Category Groups */}
              {[
                { id: 'air-conditioners', name: 'Air Conditioners (All)' },
                { id: 'inverter-split-ac', name: 'Inverter Split ACs' },
                { id: 'fixed-speed-split-ac', name: 'Fixed Speed Split ACs' },
                { id: 'commercial-cassette-ac', name: 'Commercial Cassette ACs' },
                { id: 'commercial-verticool-ac', name: 'Commercial Verticool / Tower' },
                { id: 'window-ac', name: 'Window ACs' },
                { id: 'mega-split-ac', name: 'Mega Split ACs' },
                { id: 'freezers', name: 'Deep Freezers (All)' },
                { id: 'convertible-green-freezer', name: 'Convertible Green Freezers' },
                { id: 'curved-glass-freezer', name: 'Curved Glass Freezers' },
                { id: 'visi-coolers', name: 'Visi Coolers' },
                { id: 'water-coolers-dispensers', name: 'Water Coolers & Dispensers' },
                { id: 'commercial-kitchen-refrigeration', name: 'Kitchen Chillers & Freezers' },
                { id: 'ice-makers', name: 'Commercial Ice Machines' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left ${
                    selectedCategory === cat.id
                      ? 'bg-brand-50 text-brand-700 border border-brand-200'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  {selectedCategory === cat.id && <Check className="w-3.5 h-3.5 text-brand-600 shrink-0 ml-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Rating Filter */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              BEE Star Rating
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {['all', '3 Star', '5 Star'].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setSelectedStar(star)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-semibold text-center transition-all ${
                    selectedStar === star
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {star === 'all' ? 'Any' : star}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Mobile Filter Modal */}
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-t-3xl max-h-[85vh] overflow-y-auto p-6 space-y-6 animate-slide-up">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-brand-600" />
                  <span>Filters</span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Brand Filter */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase">Brand</div>
                <div className="flex gap-2">
                  {[
                    { id: 'all', name: 'All' },
                    { id: 'blue-star', name: 'Blue Star' },
                    { id: 'rockwell', name: 'Rockwell' },
                  ].map((brand) => (
                    <button
                      key={brand.id}
                      type="button"
                      onClick={() => setSelectedBrand(brand.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedBrand === brand.id
                          ? 'bg-brand-600 text-white border-brand-600'
                          : 'bg-white text-slate-700 border-slate-200'
                      }`}
                    >
                      {brand.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 uppercase">Category</div>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'all', name: 'All Categories' },
                    { id: 'air-conditioners', name: 'Air Conditioners' },
                    { id: 'freezers', name: 'Deep Freezers' },
                    { id: 'visi-coolers', name: 'Visi Coolers' },
                    { id: 'water-coolers-dispensers', name: 'Water Coolers' },
                    { id: 'commercial-kitchen-refrigeration', name: 'Kitchen Chillers' },
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-2 rounded-xl text-xs font-semibold text-left border truncate ${
                        selectedCategory === cat.id
                          ? 'bg-brand-50 text-brand-700 border-brand-300'
                          : 'bg-slate-50 text-slate-600 border-slate-200'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="flex-1 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs"
                >
                  Reset
                </button>
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-2 py-3 bg-brand-600 text-white font-bold rounded-xl text-xs"
                >
                  Show {filteredProducts.length} Results
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid & Active Filter Pills */}
        <div className="lg:col-span-3 space-y-6">
          {/* Top Sort Bar & Results Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <div className="text-xs text-slate-600 font-medium">
              Showing <span className="font-bold text-slate-900">{filteredProducts.length}</span> of {productList.length} commercial cooling models
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500 cursor-pointer"
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
