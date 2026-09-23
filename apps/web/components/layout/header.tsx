'use client';

// ============================================================================
// @tanmayee/web — Header Component (Pixel-Matched to Reference Design)
// Features:
// 1. Top Bar: "Your Partner for Cooling Solutions", hotline, email, "Get a Quote"
// 2. Main Header: Stylized Tanmayee Technologies Logo, Centered Search Bar,
//    Compare (0), Wishlist (0), and My Quote (Live Cart Count)
// 3. Navigation Links Row: Home, Products ▾, Brands ▾, Services ▾, Offers,
//    Resources ▾, About Us, Contact
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
  Scale,
  ShoppingBag,
  ChevronDown,
  ArrowRight,
  Menu,
  X,
  Phone,
  Mail,
  ShieldCheck,
  Wrench,
  FileText,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { SEED_CATEGORIES, SEED_BRANDS } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openDrawer, openQuoteModal } = useCart();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSuggestions(null);
      return;
    }

    const timer = setTimeout(() => {
      const q = searchQuery.toLowerCase();
      const matchedBrands = SEED_BRANDS.filter((b) => b.name.toLowerCase().includes(q));
      const matchedCategories = SEED_CATEGORIES.filter((c) => c.name.toLowerCase().includes(q));
      setSuggestions({
        brands: matchedBrands,
        categories: matchedCategories,
      });
      setIsSearchOpen(true);
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <>
      {/* ── 1. Top Bar (Navy Blue) ────────────────────────────────────── */}
      <div className="bg-[#0b2847] text-slate-200 text-[11px] sm:text-xs py-1.5 px-4 border-b border-[#0f355c]">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          {/* Left: Partner Tagline */}
          <div className="flex items-center gap-2">
            <span className="font-medium text-slate-300">
              Your Partner for Cooling Solutions
            </span>
          </div>

          {/* Right: Phone & Email + Get a Quote Button */}
          <div className="flex items-center gap-3 sm:gap-5">
            <div className="hidden sm:flex items-center gap-3 text-slate-300 font-medium">
              <a
                href="tel:+919340193535"
                className="hover:text-cyan-300 transition-colors flex items-center gap-1.5"
              >
                <span>Sales & Support:</span>
                <span className="font-bold text-white">+91 93401 93535</span>
              </a>
              <span className="text-slate-500">|</span>
              <a
                href="mailto:info@tanmayeetechnologies.in"
                className="hover:text-cyan-300 transition-colors"
              >
                info@tanmayeetechnologies.in
              </a>
            </div>

            {/* Quick Get a Quote CTA Button */}
            <button
              type="button"
              onClick={openQuoteModal}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-[11px] sm:text-xs px-3.5 py-1 rounded transition-colors shadow-sm"
            >
              Get a Quote
            </button>
          </div>
        </div>
      </div>

      {/* ── 2. Main Header (White) ────────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Upper Row: Logo, Search Bar, and Action Icons */}
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              {/* Stylized Cyan & Navy T Emblem */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 relative flex items-center justify-center">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  {/* Top Crossbar (Cyan) */}
                  <rect x="10" y="14" width="80" height="20" rx="4" fill="#0284c7" />
                  {/* Vertical Stem (Deep Navy) */}
                  <rect x="38" y="34" width="24" height="52" rx="4" fill="#0b2847" />
                  {/* Accent Slant Dynamic Dot */}
                  <circle cx="20" cy="50" r="6" fill="#38bdf8" />
                  <circle cx="80" cy="50" r="6" fill="#0284c7" />
                </svg>
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <div className="font-display font-black text-lg sm:text-xl tracking-tight text-[#0b2847] leading-tight">
                  TANMAYEE
                </div>
                <div className="font-display font-extrabold text-xs sm:text-sm tracking-wider text-[#0b2847] leading-none">
                  TECHNOLOGIES
                </div>
                <div className="text-[9px] font-bold tracking-widest text-[#0284c7] uppercase mt-0.5">
                  COOLING A BETTER TOMORROW
                </div>
              </div>
            </Link>

            {/* Center: Search Bar */}
            <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for products, models, categories..."
                    className="w-full pl-4 pr-12 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0284c7] focus:bg-white transition-all shadow-inner"
                  />
                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1 top-1 bottom-1 px-3.5 bg-[#0f4c81] hover:bg-[#0b3860] text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchOpen && suggestions && (
                <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                  {suggestions.brands.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                        Brands
                      </div>
                      {suggestions.brands.map((b: any) => (
                        <Link
                          key={b.id}
                          href={`/brands/${b.slug}`}
                          className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <span className="font-semibold">{b.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {suggestions.categories.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                        Categories
                      </div>
                      {suggestions.categories.map((c: any) => (
                        <Link
                          key={c.id}
                          href={`/categories/${c.slug}`}
                          className="flex items-center justify-between px-3 py-1.5 text-xs text-slate-700 hover:bg-cyan-50 hover:text-cyan-700 rounded-lg"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <span>{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {c.product_count} models
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs font-bold text-cyan-600 hover:underline py-1"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Compare, Wishlist, My Quote Action Items */}
            <div className="flex items-center gap-5 sm:gap-7 shrink-0">
              {/* Compare Icon */}
              <Link
                href="/products"
                className="flex flex-col items-center group relative text-slate-600 hover:text-[#0284c7] transition-colors"
                title="Compare Products"
              >
                <div className="relative">
                  <Scale className="w-5 h-5 text-slate-700 group-hover:text-[#0284c7] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#0b2847] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    0
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 mt-1">
                  Compare
                </span>
              </Link>

              {/* Wishlist Icon */}
              <Link
                href="/products"
                className="flex flex-col items-center group relative text-slate-600 hover:text-[#0284c7] transition-colors"
                title="Your Wishlist"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 text-slate-700 group-hover:text-rose-500 transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#0b2847] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    0
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-600 mt-1">
                  Wishlist
                </span>
              </Link>

              {/* My Quote Icon */}
              <button
                type="button"
                onClick={openDrawer}
                className="flex flex-col items-center group relative text-slate-600 hover:text-[#0284c7] transition-colors cursor-pointer"
                title="View Quotation Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 text-slate-700 group-hover:text-[#0284c7] transition-colors" />
                  <span className="absolute -top-1.5 -right-2 bg-[#0284c7] text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pop-scale">
                    {itemCount}
                  </span>
                </div>
                <span className="text-[10px] font-bold text-slate-800 mt-1">
                  My Quote
                </span>
              </button>

              {/* Mobile Menu Toggle Button */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-1.5 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* ── 3. Bottom Row: Navigation Links ───────────────────────── */}
          <div className="hidden lg:flex items-center gap-1 border-t border-slate-100 py-1" ref={navRef}>
            {/* Home Link (Active) */}
            <Link
              href="/"
              className={`px-3 py-2 text-xs font-bold transition-colors relative ${
                pathname === '/'
                  ? 'text-[#0284c7]'
                  : 'text-slate-700 hover:text-[#0284c7]'
              }`}
            >
              <span>Home</span>
              {pathname === '/' && (
                <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#0284c7] rounded-full" />
              )}
            </Link>

            {/* Products Mega Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('products')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => router.push('/products')}
                className={`px-3 py-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/products') || activeDropdown === 'products'
                    ? 'text-[#0284c7]'
                    : 'text-slate-700 hover:text-[#0284c7]'
                }`}
              >
                <span>Products</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'products' && (
                <div className="absolute top-full left-0 w-[580px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-2 gap-4">
                    {/* Brand 1: Blue Star */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-100 hover:border-blue-300 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href="/brands/blue-star"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-sm text-blue-900 group-hover:text-blue-700 flex items-center gap-1"
                        >
                          <span>Blue Star</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                          Built on Trust
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                        Split ACs, Window ACs, Cassettes, Tower Verticools & Deep Freezers.
                      </p>
                      <Link
                        href="/brands/blue-star"
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        Explore Blue Star &rarr;
                      </Link>
                    </div>

                    {/* Brand 2: Rockwell */}
                    <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/70 to-slate-50 border border-emerald-100 hover:border-emerald-300 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <Link
                          href="/brands/rockwell"
                          onClick={() => setActiveDropdown(null)}
                          className="font-bold text-sm text-emerald-900 group-hover:text-emerald-700 flex items-center gap-1"
                        >
                          <span>Rockwell</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          The Refrigeration Co.
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                        Convertible Green Freezers, Visi Coolers, Water Coolers & Cold Storage.
                      </p>
                      <Link
                        href="/brands/rockwell"
                        onClick={() => setActiveDropdown(null)}
                        className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                      >
                        Explore Rockwell &rarr;
                      </Link>
                    </div>
                  </div>

                  {/* Categories preview */}
                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Key Categories
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      {SEED_CATEGORIES.slice(0, 6).map((cat) => (
                        <Link
                          key={cat.id}
                          href={`/categories/${cat.slug}`}
                          onClick={() => setActiveDropdown(null)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 truncate"
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">155+ Certified Commercial Models</span>
                    <Link
                      href="/products"
                      onClick={() => setActiveDropdown(null)}
                      className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                    >
                      <span>View All Products</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Brands Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('brands')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`px-3 py-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/brands') || activeDropdown === 'brands'
                    ? 'text-[#0284c7]'
                    : 'text-slate-700 hover:text-[#0284c7]'
                }`}
              >
                <span>Brands</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'brands' && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <Link
                    href="/brands/blue-star"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-blue-50 text-slate-800 hover:text-blue-900 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs">Blue Star</div>
                      <div className="text-[10px] text-slate-400">Air Conditioning & Freezers</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>

                  <Link
                    href="/brands/rockwell"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition-colors"
                  >
                    <div>
                      <div className="font-bold text-xs">Rockwell</div>
                      <div className="text-[10px] text-slate-400">Commercial Refrigeration</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('services')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() => router.push('/services')}
                className={`px-3 py-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                  pathname.startsWith('/services') || activeDropdown === 'services'
                    ? 'text-[#0284c7]'
                    : 'text-slate-700 hover:text-[#0284c7]'
                }`}
              >
                <span>Services</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'services' && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <Link
                    href="/services"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  >
                    <Wrench className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-bold text-xs">Installation</div>
                      <div className="text-[10px] text-slate-400">Turnkey HVAC commissioning</div>
                    </div>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  >
                    <ShieldCheck className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-bold text-xs">AMC Plans</div>
                      <div className="text-[10px] text-slate-400">Annual maintenance contracts</div>
                    </div>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  >
                    <FileText className="w-4 h-4 text-cyan-600" />
                    <div>
                      <div className="font-bold text-xs">Repair & Support</div>
                      <div className="text-[10px] text-slate-400">Genuine parts & diagnostics</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Offers Link */}
            <Link
              href="/products?deals=true"
              className="px-3 py-2 text-xs font-bold text-slate-700 hover:text-[#0284c7] transition-colors"
            >
              <span>Offers</span>
            </Link>

            {/* Resources Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown('resources')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                className={`px-3 py-2 text-xs font-bold flex items-center gap-1 transition-colors ${
                  activeDropdown === 'resources' ? 'text-[#0284c7]' : 'text-slate-700 hover:text-[#0284c7]'
                }`}
              >
                <span>Resources</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {activeDropdown === 'resources' && (
                <div className="absolute top-full left-0 w-60 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <Link
                    href="/about"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Product Catalogues & PDFs
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Commercial Cold Storage Guide
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    B2B Enquiries & Procurement
                  </Link>
                </div>
              )}
            </div>

            {/* About Us */}
            <Link
              href="/about"
              className={`px-3 py-2 text-xs font-bold transition-colors ${
                pathname === '/about' ? 'text-[#0284c7]' : 'text-slate-700 hover:text-[#0284c7]'
              }`}
            >
              About Us
            </Link>

            {/* Contact */}
            <Link
              href="/contact"
              className={`px-3 py-2 text-xs font-bold transition-colors ${
                pathname === '/contact' ? 'text-[#0284c7]' : 'text-slate-700 hover:text-[#0284c7]'
              }`}
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={handleSearchSubmit} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products, models, categories..."
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 bg-[#0f4c81] text-white rounded-md flex items-center justify-center"
                >
                  <Search className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            <div className="space-y-1">
              <Link
                href="/"
                className="block px-3 py-2 rounded-lg font-bold text-xs text-slate-900 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block px-3 py-2 rounded-lg font-bold text-xs text-slate-900 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products (155+ Models)
              </Link>
              <Link
                href="/brands/blue-star"
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-blue-900 bg-blue-50/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Blue Star Products
              </Link>
              <Link
                href="/brands/rockwell"
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-50/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rockwell Refrigeration
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services & AMC
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openDrawer();
                }}
                className="flex-1 flex items-center justify-center gap-2 bg-[#0b2847] text-white py-2.5 rounded-lg font-bold text-xs"
              >
                <ShoppingBag className="w-4 h-4" /> My Quote ({itemCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openQuoteModal();
                }}
                className="flex-1 bg-[#0284c7] text-white py-2.5 rounded-lg font-bold text-xs"
              >
                Get a Quote
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
