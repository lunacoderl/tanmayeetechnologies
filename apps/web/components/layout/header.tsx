'use client';

// ============================================================================
// @tanmayee/web — Header Component (Pixel-Matched to Reference Design)
// Features:
// 1. Top Bar: "Your Partner for Cooling Solutions", hotline, email, "Get a Quote"
// 2. Official Tanmayee Technologies Logo (Circular + Modern Typography)
// 3. Robust Character-by-Character Instant Live Search across 155+ Products & Services
// 4. Fully Functional Wishlist (live count) & Quotation Cart Buttons
// 5. Navigation Bar with Complete AC Categories & Refrigeration Mega-Menus
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  Heart,
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
  ThermometerSnowflake,
  Wind,
  Box,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useUserStore } from '../../lib/user-store-context';
import { SEED_CATEGORIES, SEED_BRANDS, getMergedProducts, SEED_SERVICES } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { itemCount, openDrawer, openQuoteModal } = useCart();
  const {
    wishlistCount,
    openWishlist,
    trackSearchQuery,
    trackProductView,
  } = useUserStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [matchingProducts, setMatchingProducts] = useState<any[]>([]);
  const [matchingServices, setMatchingServices] = useState<any[]>([]);
  const [matchingCategories, setMatchingCategories] = useState<any[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Dropdown states
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Commercial services list for instant search
  const allServices = [
    {
      id: 'srv-install',
      name: 'Turnkey HVAC & Refrigeration Installation',
      slug: 'installation',
      type: 'Service',
      desc: 'Certified professional installation for Split, Cassette, Tower ACs, and Cold Rooms.',
    },
    {
      id: 'srv-amc',
      name: 'Comprehensive & Non-Comprehensive AMC',
      slug: 'amc',
      type: 'Service',
      desc: 'Annual maintenance contracts for commercial facilities with quarterly servicing & 24/7 SLA.',
    },
    {
      id: 'srv-repair',
      name: 'Diagnostic Breakdown Repair & Gas Charging',
      slug: 'repair',
      type: 'Service',
      desc: 'Rapid fault diagnosis, genuine spare parts replacement, and eco-friendly gas top-up.',
    },
    {
      id: 'srv-maintenance',
      name: 'Preventative Maintenance & Coil Sanitization',
      slug: 'maintenance',
      type: 'Service',
      desc: 'Deep chemical cleaning, coil sanitization, airflow balancing, and energy audits.',
    },
  ];

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

  // Instant character-by-character live search filtering
  useEffect(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      setMatchingProducts([]);
      setMatchingServices([]);
      setMatchingCategories([]);
      setIsSearchOpen(false);
      return;
    }

    // 1. Filter Products (Matches name, model number, sku, brand, category, capacity)
    const filteredProducts = (getMergedProducts() as any[]).filter((p) => {
      const name = (p.product_name || '').toLowerCase();
      const model = (p.model_number || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      const brand = (p.brand_name || '').toLowerCase();
      const cat = (p.category_name || '').toLowerCase();
      const capacity = (p.attributes || []).find((a: any) =>
        (a.name || '').toLowerCase().includes('capacity')
      )?.value?.toLowerCase() || '';

      return (
        name.includes(q) ||
        model.includes(q) ||
        sku.includes(q) ||
        brand.includes(q) ||
        cat.includes(q) ||
        capacity.includes(q)
      );
    });

    // 2. Filter Services
    const filteredServices = allServices.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
    );

    // 3. Filter Categories
    const filteredCategories = SEED_CATEGORIES.filter(
      (c) => c.name.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q)
    );

    setMatchingProducts(filteredProducts.slice(0, 8));
    setMatchingServices(filteredServices.slice(0, 3));
    setMatchingCategories(filteredCategories.slice(0, 4));
    setIsSearchOpen(true);
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      trackSearchQuery(searchQuery.trim());
      setIsSearchOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleProductClick = (product: any) => {
    trackProductView(product);
    setIsSearchOpen(false);
    setSearchQuery('');
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
          {/* Upper Row: Logo, Live Search Bar, and Action Icons */}
          <div className="flex items-center justify-between h-20 gap-4 lg:gap-8">
            {/* Logo with official circular Tanmayee badge */}
            <Link href="/" className="flex items-center gap-3 shrink-0 group">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#0284c7]/40 p-0.5 bg-white shadow-md group-hover:scale-105 group-hover:border-[#0284c7] transition-all">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>

              {/* Brand Typography */}
              <div className="flex flex-col">
                <div className="font-display font-black text-lg sm:text-xl tracking-tight text-[#0b2847] leading-tight group-hover:text-[#0284c7] transition-colors">
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

            {/* Center: Robust Character-by-Character Live Search Bar */}
            <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                <div className="relative w-full">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim()) setIsSearchOpen(true);
                    }}
                    placeholder="Search for products, models, categories (e.g. Split AC, GFR250, Cassette, AMC)..."
                    className="w-full pl-4 pr-16 py-2.5 bg-slate-50 hover:bg-slate-100/70 border border-slate-300 rounded-lg text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[#0284c7] focus:bg-white transition-all shadow-inner"
                  />

                  {/* Clear Search Input Button */}
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setIsSearchOpen(false);
                      }}
                      className="absolute right-12 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    type="submit"
                    aria-label="Search"
                    className="absolute right-1 top-1 bottom-1 px-3.5 bg-[#0f4c81] hover:bg-[#0b3860] text-white rounded-md flex items-center justify-center transition-colors"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </form>

              {/* Instant Live Search Results Overflow Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full mt-1.5 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-100">
                    {/* 1. Services Results */}
                    {matchingServices.length > 0 && (
                      <div className="p-3 bg-cyan-50/40">
                        <div className="text-[10px] font-black text-cyan-800 uppercase tracking-wider px-2 mb-1.5 flex items-center gap-1.5">
                          <Wrench className="w-3.5 h-3.5 text-[#0284c7]" />
                          <span>Matching HVAC &amp; Refrigeration Services</span>
                        </div>
                        <div className="space-y-1">
                          {matchingServices.map((srv) => (
                            <Link
                              key={srv.id}
                              href="/services"
                              onClick={() => setIsSearchOpen(false)}
                              className="flex items-center justify-between p-2 rounded-xl bg-white hover:bg-cyan-100/50 border border-cyan-100/60 transition-colors group"
                            >
                              <div>
                                <div className="font-bold text-xs text-slate-900 group-hover:text-[#0284c7]">
                                  {srv.name}
                                </div>
                                <div className="text-[11px] text-slate-500 line-clamp-1">
                                  {srv.desc}
                                </div>
                              </div>
                              <span className="text-[10px] font-bold text-[#0284c7] whitespace-nowrap pl-2">
                                Book Service &rarr;
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 2. Products Results */}
                    <div className="p-3">
                      <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider px-2 mb-2 flex items-center justify-between">
                        <span>Available Products ({matchingProducts.length})</span>
                        <span className="text-[10px] font-medium text-slate-400">
                          Click row for instant product detail
                        </span>
                      </div>

                      {matchingProducts.length === 0 ? (
                        <div className="p-6 text-center text-slate-400 text-xs">
                          No exact products found matching &ldquo;{searchQuery}&rdquo;. Press Enter to search catalog.
                        </div>
                      ) : (
                        <div className="space-y-1">
                          {matchingProducts.map((p) => {
                            const capacity = (p.attributes || []).find((a: any) =>
                              (a.name || '').toLowerCase().includes('capacity')
                            )?.value;

                            return (
                              <Link
                                key={p.id}
                                href={`/products/${p.slug}`}
                                onClick={() => handleProductClick(p)}
                                className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                              >
                                {/* Thumbnail */}
                                <div className="w-12 h-12 rounded-lg bg-slate-100 border border-slate-200 p-1 flex items-center justify-center shrink-0 overflow-hidden">
                                  <img
                                    src={p.media?.[0]?.url || '/images/categories/air-conditioners.jpg'}
                                    alt={p.product_name}
                                    className="w-full h-full object-contain"
                                  />
                                </div>

                                {/* Text & Badges */}
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded ${
                                        p.brand_name === 'Blue Star'
                                          ? 'bg-blue-100 text-blue-800'
                                          : 'bg-emerald-100 text-emerald-800'
                                      }`}
                                    >
                                      {p.brand_name}
                                    </span>
                                    {p.model_number && (
                                      <span className="text-[10px] font-mono text-slate-500 font-bold">
                                        {p.model_number}
                                      </span>
                                    )}
                                    {capacity && (
                                      <span className="text-[10px] font-bold text-[#0284c7]">
                                        • {capacity}
                                      </span>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-xs text-slate-900 group-hover:text-[#0284c7] transition-colors truncate">
                                    {p.product_name}
                                  </h4>
                                </div>

                                {/* Price / Quote Badge */}
                                <div className="text-right shrink-0">
                                  <span className="text-xs font-bold text-slate-900 block">
                                    {p.reference_price
                                      ? `₹${p.reference_price.toLocaleString('en-IN')}`
                                      : 'Instant RFQ'}
                                  </span>
                                  <span className="text-[10px] text-slate-400">View &rarr;</span>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Dropdown Footer: Full Search Submission */}
                  <div className="p-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500 font-medium">
                      Press <kbd className="bg-white px-1.5 py-0.5 rounded border border-slate-300 font-mono text-[10px]">Enter</kbd> to see full comparison &amp; filters
                    </span>
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                    >
                      <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Wishlist, My Quote Action Items */}
            <div className="flex items-center gap-5 sm:gap-7 shrink-0">
              {/* Wishlist Icon Button */}
              <button
                type="button"
                onClick={openWishlist}
                className="flex flex-col items-center group relative text-slate-600 hover:text-[#0284c7] transition-colors cursor-pointer"
                title="View Your Saved Wishlist"
              >
                <div className="relative">
                  <Heart
                    className={`w-5 h-5 transition-colors ${
                      wishlistCount > 0
                        ? 'text-rose-500 fill-rose-500'
                        : 'text-slate-700 group-hover:text-rose-500'
                    }`}
                  />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1.5 -right-2 bg-rose-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-pop-scale">
                      {wishlistCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-semibold text-slate-600 mt-1">
                  Wishlist
                </span>
              </button>

              {/* My Quote Icon Button */}
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

          {/* ── 3. Bottom Row: Navigation Links with Expanded AC Categories ─ */}
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

            {/* Products Mega Dropdown with ALL AC Categories */}
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
                <div className="absolute top-full left-0 w-[720px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-6 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="grid grid-cols-2 gap-6">
                    {/* Column 1: Blue Star Commercial & Inverter AC Lines */}
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-blue-100 mb-3">
                        <span className="font-display font-black text-sm text-[#00529b] flex items-center gap-1.5">
                          <Wind className="w-4 h-4 text-blue-600" />
                          Air Conditioners (Blue Star)
                        </span>
                        <Link
                          href="/brands/blue-star"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[10px] font-bold text-blue-600 hover:underline"
                        >
                          All Blue Star &rarr;
                        </Link>
                      </div>

                      <div className="space-y-1.5">
                        <Link
                          href="/categories/inverter-split-ac"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-blue-700">
                              Inverter Split ACs
                            </div>
                            <div className="text-[10px] text-slate-400">
                              1 to 2.5 Ton 5-Star &amp; 3-Star Inverters
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">36 models</span>
                        </Link>

                        <Link
                          href="/categories/commercial-cassette-ac"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-blue-700">
                              Commercial Cassette ACs
                            </div>
                            <div className="text-[10px] text-slate-400">
                              4-Way 360° airflow ceiling recessed units
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">7 models</span>
                        </Link>

                        <Link
                          href="/categories/commercial-verticool-ac"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-blue-700">
                              Tower / Verticool ACs
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Floor standing commercial air conditioning
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">3 models</span>
                        </Link>

                        <Link
                          href="/categories/window-ac"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-blue-700">
                              Window ACs
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Compact heavy-duty window inverter ACs
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">4 models</span>
                        </Link>

                        <Link
                          href="/categories/fixed-speed-split-ac"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-blue-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-blue-700">
                              Fixed Speed Split ACs
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Commercial workhorse cooling units
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">6 models</span>
                        </Link>
                      </div>
                    </div>

                    {/* Column 2: Rockwell Commercial Refrigeration Lines */}
                    <div>
                      <div className="flex items-center justify-between pb-2 border-b border-emerald-100 mb-3">
                        <span className="font-display font-black text-sm text-[#0a2540] flex items-center gap-1.5">
                          <ThermometerSnowflake className="w-4 h-4 text-emerald-600" />
                          Refrigeration (Rockwell)
                        </span>
                        <Link
                          href="/brands/rockwell"
                          onClick={() => setActiveDropdown(null)}
                          className="text-[10px] font-bold text-emerald-600 hover:underline"
                        >
                          All Rockwell &rarr;
                        </Link>
                      </div>

                      <div className="space-y-1.5">
                        <Link
                          href="/categories/convertible-green-freezer"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-emerald-700">
                              Convertible Green Freezers
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Dual-temp chest freezers (194L to 550L)
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">8 models</span>
                        </Link>

                        <Link
                          href="/categories/visi-cooler"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-emerald-700">
                              Visi Coolers &amp; Display Fridges
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Glass door beverage display refrigeration
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">14 models</span>
                        </Link>

                        <Link
                          href="/categories/stainless-steel-water-cooler"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-emerald-700">
                              Stainless Steel Water Coolers
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Heavy duty RO and storage dispensers
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">10 models</span>
                        </Link>

                        <Link
                          href="/categories/ice-makers"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-emerald-700">
                              Commercial Ice Makers
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Automatic cube and bullet ice machines
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">8 models</span>
                        </Link>

                        <Link
                          href="/categories/commercial-kitchen-refrigeration"
                          onClick={() => setActiveDropdown(null)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-emerald-50/70 text-slate-800 transition-colors group"
                        >
                          <div>
                            <div className="font-bold text-xs group-hover:text-emerald-700">
                              Kitchen Chillers &amp; Freezers
                            </div>
                            <div className="text-[10px] text-slate-400">
                              Reach-in chillers, under-counters &amp; blast
                            </div>
                          </div>
                          <span className="text-[10px] font-mono text-slate-400">16 models</span>
                        </Link>
                      </div>
                    </div>
                  </div>

                  {/* Mega Menu Footer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-6 -mb-6 px-6 py-3 rounded-b-2xl">
                    <span className="text-xs text-slate-500 font-medium">
                      155+ Certified Commercial HVAC &amp; Cold Chain Models
                    </span>
                    <Link
                      href="/products"
                      onClick={() => setActiveDropdown(null)}
                      className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                    >
                      <span>Explore Entire Catalogue</span>
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
                <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <Link
                    href="/brands/blue-star"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 text-slate-800 hover:text-blue-900 transition-colors"
                  >
                    <div className="w-12 h-6 bg-white border border-slate-200 rounded p-1 flex items-center justify-center shrink-0">
                      <img src="/images/bluestar-logo.png" alt="Blue Star" className="max-h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-blue-950">Blue Star</div>
                      <div className="text-[10px] text-slate-500">Air Conditioners &amp; Deep Freezers</div>
                    </div>
                  </Link>

                  <Link
                    href="/brands/rockwell"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-emerald-50 text-slate-800 hover:text-emerald-900 transition-colors"
                  >
                    <div className="w-12 h-6 bg-white border border-slate-200 rounded p-1 flex items-center justify-center shrink-0">
                      <img src="/images/rockwell-logo.png" alt="Rockwell" className="max-h-full object-contain" />
                    </div>
                    <div>
                      <div className="font-bold text-xs text-emerald-950">Rockwell</div>
                      <div className="text-[10px] text-slate-500">Commercial Cold Chain &amp; Freezers</div>
                    </div>
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
                <div className="absolute top-full left-0 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <Link
                    href="/services"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  >
                    <Wrench className="w-4 h-4 text-[#0284c7]" />
                    <div>
                      <div className="font-bold text-xs">Turnkey HVAC Installation</div>
                      <div className="text-[10px] text-slate-400">Certified technicians &amp; commissioning</div>
                    </div>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#0284c7]" />
                    <div>
                      <div className="font-bold text-xs">Annual Maintenance Contracts (AMC)</div>
                      <div className="text-[10px] text-slate-400">Quarterly visits, parts coverage &amp; priority SLA</div>
                    </div>
                  </Link>
                  <Link
                    href="/services"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-slate-50 text-slate-700 hover:text-slate-900"
                  >
                    <FileText className="w-4 h-4 text-[#0284c7]" />
                    <div>
                      <div className="font-bold text-xs">Diagnostic Repair &amp; Gas Charging</div>
                      <div className="text-[10px] text-slate-400">Genuine OEM compressors &amp; refrigerant</div>
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
                <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-slate-200 p-2 z-50">
                  <Link
                    href="/about"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Product Catalogues &amp; PDFs
                  </Link>
                  <Link
                    href="/about"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Cold Storage &amp; HVAC Guide
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Bulk Procurement &amp; Tenders
                  </Link>
                  <Link
                    href="/terms"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Terms &amp; Conditions
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setActiveDropdown(null)}
                    className="block p-2 rounded-lg hover:bg-slate-50 text-xs font-semibold text-slate-700"
                  >
                    Privacy Policy
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
                  placeholder="Search products, models, services..."
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
                Blue Star Air Conditioners
              </Link>
              <Link
                href="/brands/rockwell"
                className="block px-3 py-2 rounded-lg text-xs font-semibold text-emerald-900 bg-emerald-50/50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Rockwell Commercial Refrigeration
              </Link>
              <Link
                href="/services"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services &amp; AMC
              </Link>
              <Link
                href="/terms"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Terms &amp; Conditions
              </Link>
              <Link
                href="/privacy"
                className="block px-3 py-2 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Privacy Policy
              </Link>
            </div>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openWishlist();
                }}
                className="flex items-center justify-center gap-1.5 bg-slate-100 text-slate-800 py-2.5 rounded-lg font-bold text-xs"
              >
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Wishlist ({wishlistCount})
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openDrawer();
                }}
                className="flex items-center justify-center gap-1.5 bg-[#0b2847] text-white py-2.5 rounded-lg font-bold text-xs"
              >
                <ShoppingBag className="w-3.5 h-3.5" /> Quote ({itemCount})
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
