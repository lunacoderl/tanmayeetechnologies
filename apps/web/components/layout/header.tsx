'use client';

// ============================================================================
// @tanmayee/web — Header Component
// ============================================================================

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Search,
  ShoppingCart,
  PhoneCall,
  Menu,
  X,
  ChevronDown,
  Snowflake,
  ShieldCheck,
  ArrowRight,
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
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
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
      {/* Top Banner: Emergency Support & Authorized Partner Notice */}
      <div className="bg-navy-900 text-slate-300 text-xs py-2 px-4 border-b border-navy-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 bg-brand-600/30 text-brand-300 px-2 py-0.5 rounded font-medium text-[11px] border border-brand-500/30">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-400" /> Authorized Commercial Partner
            </span>
            <a
              href="https://maps.app.goo.gl/ndzjgar89V8CXgaC7"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline text-slate-300 hover:text-cyan-300 hover:underline transition-colors"
            >
              📍 PM Palem, Madhurawada, Visakhapatnam (Get Directions)
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${COMPANY.PHONE}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-400" />
              <span className="font-semibold text-slate-200">{COMPANY.PHONE_DISPLAY}</span>
            </a>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline text-slate-400">{COMPANY.STORE_HOURS}</span>
          </div>
        </div>
      </div>


      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 gap-4">
            {/* Official Brand Logo */}
            <Link href="/" className="flex items-center gap-3.5 shrink-0 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-md shadow-cyan-500/20 group-hover:scale-105 group-hover:border-cyan-500 transition-all duration-300 bg-white p-0.5">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies - Complete Cooling Solutions"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display font-black text-xl tracking-tight text-slate-900 group-hover:text-cyan-700 transition-colors">
                    TANMAYEE
                  </span>
                  <span className="text-xs font-bold text-cyan-600 tracking-wider">
                    TECHNOLOGIES
                  </span>
                </div>
                <span className="text-[10px] uppercase font-extrabold tracking-widest text-slate-500 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping inline-block" />
                  Complete Cooling Solutions
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1.5">
              {/* Products Mega-Menu */}
              <div
                className="relative"
                onMouseEnter={() => setIsCategoryMenuOpen(true)}
                onMouseLeave={() => setIsCategoryMenuOpen(false)}
              >
                <button
                  type="button"
                  onClick={() => router.push('/products')}
                  className={`px-3.5 py-2 rounded-xl text-sm font-bold flex items-center gap-1.5 transition-all ${
                    pathname.startsWith('/products') || pathname.startsWith('/brands') || pathname.startsWith('/categories')
                      ? 'text-cyan-700 bg-cyan-50'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span>Products</span>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCategoryMenuOpen ? 'rotate-180 text-cyan-600' : 'text-slate-400'}`} />
                </button>

                {isCategoryMenuOpen && (
                  <div className="absolute top-full left-0 w-[540px] bg-white rounded-2xl shadow-2xl border border-slate-200 p-5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="grid grid-cols-2 gap-4">
                      {/* Brand 1: Blue Star */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-100 hover:border-blue-300 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <Link
                            href="/brands/blue-star"
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="font-bold text-sm text-blue-900 group-hover:text-blue-700 flex items-center gap-1"
                          >
                            <span>Blue Star</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                            Authorized Dealers
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
                          Precision Inverter Split ACs, Cassettes, Ductables & Deep Freezers.
                        </p>
                        <Link
                          href="/brands/blue-star"
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="text-xs font-semibold text-blue-600 hover:underline inline-flex items-center gap-1"
                        >
                          View Blue Star Range &rarr;
                        </Link>
                      </div>

                      {/* Brand 2: Rockwell */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-br from-emerald-50/70 to-slate-50 border border-emerald-100 hover:border-emerald-300 transition-all group">
                        <div className="flex items-center justify-between mb-2">
                          <Link
                            href="/brands/rockwell"
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="font-bold text-sm text-emerald-900 group-hover:text-emerald-700 flex items-center gap-1"
                          >
                            <span>Rockwell</span>
                            <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Authorized Distributors
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 mb-2.5 leading-relaxed">
                          Commercial Chest Freezers, Visi Coolers, Solar Freezers & Cold Storage.
                        </p>
                        <Link
                          href="/brands/rockwell"
                          onClick={() => setIsCategoryMenuOpen(false)}
                          className="text-xs font-semibold text-emerald-600 hover:underline inline-flex items-center gap-1"
                        >
                          View Rockwell Range &rarr;
                        </Link>
                      </div>
                    </div>

                    {/* Popular Categories */}
                    <div className="mt-4 pt-3.5 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Browse by Equipment Category
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {SEED_CATEGORIES.slice(0, 6).map((cat) => (
                          <Link
                            key={cat.id}
                            href={`/categories/${cat.slug}`}
                            onClick={() => setIsCategoryMenuOpen(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-100 text-slate-700 hover:text-slate-900 transition-colors"
                          >
                            <span className="truncate">{cat.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">{cat.product_count}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* All Products Footer Link */}
                    <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between bg-slate-50 -mx-5 -mb-5 px-5 py-3 rounded-b-2xl">
                      <span className="text-xs text-slate-500 font-medium">155+ Certified Commercial Models</span>
                      <Link
                        href="/products"
                        onClick={() => setIsCategoryMenuOpen(false)}
                        className="text-xs font-bold text-cyan-700 hover:text-cyan-800 flex items-center gap-1"
                      >
                        <span>View All Products</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Services & AMC */}
              <Link
                href="/services"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname.startsWith('/services')
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Services & AMC
              </Link>

              {/* About */}
              <Link
                href="/about"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === '/about'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                About
              </Link>

              {/* Contact */}
              <Link
                href="/contact"
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  pathname === '/contact'
                    ? 'text-brand-600 bg-brand-50'
                    : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Search Bar */}
            <div className="flex-1 max-w-xs relative hidden md:block" ref={searchRef}>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search 155+ ACs, Freezers..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-transparent rounded-full text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>
              </form>

              {/* Instant Search Suggestions Dropdown */}
              {isSearchOpen && suggestions && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 p-2">
                  {suggestions.brands.length > 0 && (
                    <div className="mb-2">
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                        Brands
                      </div>
                      {suggestions.brands.map((b: any) => (
                        <Link
                          key={b.id}
                          href={`/brands/${b.slug}`}
                          className="flex items-center justify-between px-3 py-1.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <span>{b.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                        </Link>
                      ))}
                    </div>
                  )}

                  {suggestions.categories.length > 0 && (
                    <div>
                      <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 py-1">
                        Categories
                      </div>
                      {suggestions.categories.map((c: any) => (
                        <Link
                          key={c.id}
                          href={`/categories/${c.slug}`}
                          className="flex items-center justify-between px-3 py-1.5 text-sm text-slate-700 hover:bg-brand-50 hover:text-brand-600 rounded-lg"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <span>{c.name}</span>
                          <ArrowRight className="w-3.5 h-3.5 opacity-50" />
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="mt-2 pt-2 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={handleSearchSubmit}
                      className="w-full text-center text-xs font-semibold text-brand-600 hover:underline py-1"
                    >
                      View all results for &ldquo;{searchQuery}&rdquo;
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Actions: Cart Drawer Button + Request Quote CTA */}
            <div className="flex items-center gap-3">
              {/* Cart Drawer Icon Button */}
              <button
                type="button"
                onClick={openDrawer}
                className="relative p-2.5 rounded-full text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors"
                aria-label="View Quotation Cart"
              >
                <ShoppingCart className="w-5 h-5" />
                {itemCount > 0 && (
                  <span
                    key={itemCount}
                    className="absolute -top-1 -right-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-pop-scale"
                  >
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Quotation Button */}
              <button
                type="button"
                onClick={itemCount > 0 ? openQuoteModal : openDrawer}
                className="hidden sm:inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-blue-500/20 hover:from-blue-700 hover:to-cyan-700 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Quotation</span>
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
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
                  placeholder="Search 155+ products, models..."
                  className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              </div>
            </form>

            <div className="space-y-1">
              <Link
                href="/products"
                className="flex items-center justify-between px-3 py-2.5 rounded-xl font-bold text-sm text-slate-900 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>All Products (155+ Models)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>

              <div className="pt-2 pb-1 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Authorized Brand Lines
              </div>
              <Link
                href="/brands/blue-star"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-blue-900 bg-blue-50/60 hover:bg-blue-100/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Blue Star</span>
                <span className="text-[10px] font-bold uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  Authorized Dealers
                </span>
              </Link>
              <Link
                href="/brands/rockwell"
                className="flex items-center justify-between px-3 py-2 rounded-xl text-sm font-semibold text-emerald-900 bg-emerald-50/60 hover:bg-emerald-100/60"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span>Rockwell</span>
                <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">
                  Authorized Distributors
                </span>
              </Link>

              <div className="pt-3 pb-1 px-3 text-[11px] font-extrabold uppercase tracking-wider text-slate-400">
                Company & Services
              </div>
              <Link
                href="/services"
                className="block px-3 py-2 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Services & AMC
              </Link>
              <Link
                href="/about"
                className="block px-3 py-2 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About Us (Showroom & Profile)
              </Link>
              <Link
                href="/contact"
                className="block px-3 py-2 rounded-xl font-medium text-sm text-slate-800 hover:bg-slate-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact & Directions
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openDrawer();
                }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 text-white py-3 rounded-xl font-bold text-sm shadow-md"
              >
                <ShoppingCart className="w-4 h-4" /> View Quotation Cart ({itemCount})
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
