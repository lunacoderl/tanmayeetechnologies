'use client';

// ============================================================================
// @tanmayee/web — Homepage (Pixel-Matched to Reference Design)
// Sections:
// 1. Hero Appliance Montage with Dual Brand Badges & Quick Features
// 2. Trust / Value Proposition Strip (5 Cards)
// 3. Explore Our Product Categories (Interactive 8-Category Carousel)
// 4. Two Brand Spotlight Banners (Blue Star & Rockwell)
// 5. Dual Callout Strips (Custom Solution & Bulk Orders)
// 6. Our Services (4 Cards Grid)
// 7. Why Choose Tanmayee Technologies Banner with WhatsApp & Leaf Accents
// ============================================================================

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Headphones,
  Wrench,
  Cog,
  FileText,
  Hammer,
  ShoppingBag,
  MapPin,
  Package,
  Award,
  Users,
  LifeBuoy,
  Globe2,
  Box,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { COMPANY } from '@tanmayee/config';
import { RecommendedProducts } from '../components/product/recommended-products';

export default function HomePage() {
  const { openQuoteModal } = useCart();
  const [activeSlide, setActiveSlide] = useState(0);
  const categoriesScrollRef = useRef<HTMLDivElement>(null);

  // WhatsApp click handler
  const whatsappPhone = COMPANY.WHATSAPP_NUMBER || '919390115553';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    'Hello Tanmayee Technologies! I am interested in commercial air conditioning and refrigeration solutions for my business.'
  )}`;

  // Comprehensive Categories covering all AC categories & Rockwell refrigeration
  const categories = [
    {
      name: 'Inverter Split ACs',
      brand: 'Blue Star',
      href: '/categories/inverter-split-ac',
      image: 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic512qnurav_gallery-images-01_6_3.png?v=1721416682',
    },
    {
      name: 'Fixed Speed ACs',
      brand: 'Blue Star',
      href: '/categories/fixed-speed-split-ac',
      image: 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png',
    },
    {
      name: 'Cassette ACs',
      brand: 'Blue Star',
      href: '/categories/commercial-cassette-ac',
      image: '/images/category-cassette-ac.jpg',
    },
    {
      name: 'Tower / Verticool',
      brand: 'Blue Star',
      href: '/categories/commercial-verticool-ac',
      image: 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/Gallery_Image_01_34dedeb0-0b0f-4b52-943c-663947a8555b.png?v=1779168252',
    },
    {
      name: 'Window ACs',
      brand: 'Blue Star',
      href: '/categories/window-ac',
      image: 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/Gallery_Image_01.png?v=1779164122',
    },
    {
      name: 'Mega Split ACs',
      brand: 'Blue Star',
      href: '/categories/mega-split-ac',
      image: 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png',
    },
    {
      name: 'Green Freezers',
      brand: 'Rockwell',
      href: '/categories/convertible-green-freezer',
      image: 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png',
    },
    {
      name: 'Curved Glass Freezers',
      brand: 'Rockwell',
      href: '/categories/curved-glass-freezer',
      image: 'https://cdn.shopify.com/s/files/1/0701/1929/3028/files/SFR250.png?v=1763989056',
    },
    {
      name: 'Visi Coolers',
      brand: 'Rockwell',
      href: '/categories/visi-cooler',
      image: 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/VC65D.png?v=1727672742',
    },
    {
      name: 'Water Coolers',
      brand: 'Rockwell',
      href: '/categories/stainless-steel-water-cooler',
      image: 'https://cdn.shopify.com/s/files/1/0701/1929/3028/files/Water_coolar_1.png?v=1752055857',
    },
    {
      name: 'Ice Makers',
      brand: 'Rockwell',
      href: '/categories/commercial-ice-machines',
      image: '/images/category-ice-maker.jpg',
    },
  ];

  const scrollCategories = (direction: 'left' | 'right') => {
    if (categoriesScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      categoriesScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 bg-[#f8fafc]">
      {/* ── 1. Hero Section ───────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#051829] via-[#09223d] to-[#0c2f54] text-white pt-10 pb-16 lg:pt-14 lg:pb-20">
        {/* Ambient lighting glows */}
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[300px] bg-blue-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Content Column (7 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Main Headline */}
              <div className="space-y-1">
                <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-[54px] tracking-tight leading-[1.08] text-white uppercase">
                  POWERING <br />
                  <span className="text-[#38bdf8]">COOLER</span> TOMORROWS
                </h1>
                <p className="text-sm sm:text-base text-slate-300 font-normal leading-relaxed pt-2 max-w-xl">
                  Premium Air Conditioning &amp; Refrigeration Solutions from Trusted Global Brands
                </p>
              </div>

              {/* Brand Badges (Blue Star & Rockwell Official Logos) */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                {/* Blue Star Official Logo Badge */}
                <Link
                  href="/brands/blue-star"
                  className="bg-white/95 hover:bg-white px-4 py-2 rounded-xl flex items-center gap-2.5 border border-white/60 shadow-lg hover:scale-105 transition-all"
                >
                  <img
                    src="/images/bluestar-logo.png"
                    alt="Blue Star Official Logo"
                    className="h-7 w-auto object-contain"
                  />
                  <div className="border-l border-slate-200 pl-2 text-left">
                    <span className="text-[9px] font-black text-blue-900 uppercase block tracking-wider leading-none">
                      Authorized
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Sales & Service
                    </span>
                  </div>
                </Link>

                {/* Rockwell Official Logo Badge */}
                <Link
                  href="/brands/rockwell"
                  className="bg-white/95 hover:bg-white px-4 py-2 rounded-xl flex items-center gap-2.5 border border-white/60 shadow-lg hover:scale-105 transition-all"
                >
                  <img
                    src="/images/rockwell-logo.png"
                    alt="Rockwell Official Logo"
                    className="h-7 w-auto object-contain"
                  />
                  <div className="border-l border-slate-200 pl-2 text-left">
                    <span className="text-[9px] font-black text-emerald-900 uppercase block tracking-wider leading-none">
                      Distributor
                    </span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                      Commercial Cold
                    </span>
                  </div>
                </Link>
              </div>

              {/* 4 Quick Features (Grid / Row) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2">
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-2 rounded-xl">
                  <Layers className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-200">
                    Wide Product Range
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-2 rounded-xl">
                  <Users className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-200">
                    Expert Support
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-2 rounded-xl">
                  <Cog className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-200">
                    Reliable Service
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-2.5 py-2 rounded-xl">
                  <Wrench className="w-4 h-4 text-[#38bdf8] shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-200">
                    Custom Solutions
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
                >
                  <span>Explore Products</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  type="button"
                  onClick={openQuoteModal}
                  className="inline-flex items-center gap-2 bg-[#0a1e33] hover:bg-[#0f2d4d] border border-[#1d3d63] text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all hover:scale-105"
                >
                  <span>Request a Quote</span>
                </button>
              </div>
            </div>

            {/* Right Showcase Column (6 cols) */}
            <div className="lg:col-span-6 relative">
              {/* Top-Right Vertical Subtext */}
              <div className="text-right text-[10px] sm:text-[11px] font-extrabold tracking-widest text-[#38bdf8]/80 uppercase space-y-0.5 mb-2 pr-2">
                <div>COOL</div>
                <div>RELIABLE</div>
                <div>SUSTAINABLE</div>
              </div>

              {/* Central Appliance Montage Display */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
                <img
                  src="/images/hero-appliances.jpg"
                  alt="Blue Star & Rockwell Commercial Cooling Appliances Showcase"
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-700"
                />

                {/* Left/Right Carousel Nav Arrows */}
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev === 0 ? 3 : prev - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setActiveSlide((prev) => (prev === 3 ? 0 : prev + 1))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center transition-colors backdrop-blur-sm"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Bottom Carousel Pagination Dots */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/30 backdrop-blur-sm px-2.5 py-1 rounded-full">
                  {[0, 1, 2, 3].map((idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveSlide(idx)}
                      className={`h-1.5 rounded-full transition-all ${
                        activeSlide === idx ? 'w-5 bg-white' : 'w-1.5 bg-white/50 hover:bg-white/80'
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Trust & Value Proposition Strip ───────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10 sm:-mt-12 relative z-20">
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xl p-5 sm:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 lg:gap-6">
          {/* Card 1 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7] shrink-0">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                100+ Products
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Across 2 Leading Brands
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Authorised Products
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Genuine &amp; Reliable
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7] shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                PAN India Support
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Sales &amp; Service Network
              </p>
            </div>
          </div>

          {/* Card 4 */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7] shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Bulk Enquiries
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                Special Pricing Available
              </p>
            </div>
          </div>

          {/* Card 5 */}
          <div className="flex items-center gap-3 col-span-2 md:col-span-1">
            <div className="w-11 h-11 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7] shrink-0">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 leading-tight">
                Expert Consultation
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                We Help You Choose
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 3. Explore Our Product Categories Carousel ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#0b2847] tracking-tight uppercase">
            EXPLORE OUR PRODUCT CATEGORIES
          </h2>
          <Link
            href="/products"
            className="text-xs sm:text-sm font-bold text-[#0284c7] hover:underline flex items-center gap-1"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Horizontal Carousel with Arrows */}
        <div className="relative group">
          {/* Left Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCategories('left')}
            className="absolute -left-3 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#0284c7] transition-all opacity-90 group-hover:opacity-100"
            aria-label="Previous Categories"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Right Arrow Button */}
          <button
            type="button"
            onClick={() => scrollCategories('right')}
            className="absolute -right-3 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white shadow-lg border border-slate-200 text-slate-700 flex items-center justify-center hover:bg-slate-50 hover:text-[#0284c7] transition-all opacity-90 group-hover:opacity-100"
            aria-label="Next Categories"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Categories Horizontal Scroll Strip */}
          <div
            ref={categoriesScrollRef}
            className="flex items-center gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {categories.map((cat, idx) => (
              <Link
                key={idx}
                href={cat.href}
                className="w-36 sm:w-40 shrink-0 bg-white rounded-2xl border border-slate-200 p-3 flex flex-col items-center justify-between text-center hover:shadow-lg hover:border-[#0284c7] transition-all duration-300 group/card"
              >
                {/* Image Container with Containment */}
                <div className="w-full aspect-square relative rounded-xl bg-slate-50/50 p-2 flex items-center justify-center overflow-hidden">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-contain group-hover/card:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Category Labels */}
                <div className="pt-2">
                  <h3 className="font-bold text-xs text-slate-900 leading-tight group-hover/card:text-[#0284c7] transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-slate-400 font-medium">
                    ({cat.brand})
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 4. Two Brand Spotlight Banners (Side-by-Side) ──────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {/* Left Banner: Blue Star */}
          <div className="relative overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 text-white shadow-xl group border border-slate-200">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: 'url(/images/bluestar-spotlight.jpg)' }}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#003866]/90 via-[#003866]/60 to-transparent" />

            {/* Top Logo Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/95 px-4 py-2 rounded-2xl border border-white shadow-lg">
                <img
                  src="/images/bluestar-logo.png"
                  alt="Blue Star Official Partner"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>

            {/* Text & CTA */}
            <div className="relative z-10 space-y-3 max-w-sm pt-8">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight drop-shadow-sm">
                COMFORT FOR A <br />
                BETTER TOMORROW
              </h3>
              <p className="text-xs text-slate-200 font-medium">
                Energy Efficient | Reliable | Advanced Cooling
              </p>
              <div className="pt-1">
                <Link
                  href="/brands/blue-star"
                  className="inline-flex items-center gap-2 bg-[#0b2847] hover:bg-[#0f3866] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <span>View Blue Star Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Banner: Rockwell */}
          <div className="relative overflow-hidden rounded-3xl min-h-[300px] sm:min-h-[340px] flex flex-col justify-between p-6 sm:p-8 text-white shadow-xl group border border-slate-200">
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
              style={{ backgroundImage: 'url(/images/rockwell-spotlight.jpg)' }}
            />
            {/* Subtle Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#032d4e]/90 via-[#032d4e]/65 to-transparent" />

            {/* Top Logo Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center bg-white/95 px-4 py-2 rounded-2xl border border-white shadow-lg">
                <img
                  src="/images/rockwell-logo.png"
                  alt="Rockwell Official Partner"
                  className="h-7 w-auto object-contain"
                />
              </div>
            </div>

            {/* Text & CTA */}
            <div className="relative z-10 space-y-3 max-w-sm pt-8">
              <h3 className="font-display font-black text-2xl sm:text-3xl text-white uppercase leading-tight drop-shadow-sm">
                INNOVATION <br />
                IN EVERY DEGREE
              </h3>
              <p className="text-xs text-slate-200 font-medium">
                Commercial Refrigeration | Food Safety | Built to Last
              </p>
              <div className="pt-1">
                <Link
                  href="/brands/rockwell"
                  className="inline-flex items-center gap-2 bg-[#0b2847] hover:bg-[#0f3866] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105"
                >
                  <span>View Rockwell Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Products You May Like (Behavioral Recommendations) ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <RecommendedProducts
          title="Products You May Like"
          subtitle="Real-time intelligent recommendations matched to your search history, cooling capacity requirements, and viewed models"
          limit={4}
        />
      </section>

      {/* ── 5. Dual Callout Strips ────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Callout 1: Custom Solution (Ice Blue) */}
          <div className="bg-[#e0f2fe] border border-cyan-200/80 rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-cyan-100/80 border border-cyan-200 flex items-center justify-center text-[#0284c7] shrink-0 shadow-inner">
                <Headphones className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-[#0b2847]">
                  Need a Custom Solution?
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xs">
                  Talk to our experts for the right product and service for your business.
                </p>
              </div>
            </div>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-[#0b2847] hover:bg-[#0f3866] text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-sm transition-all hover:scale-105 shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>Contact Our Team</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Callout 2: Bulk Orders (Vibrant Blue) */}
          <div className="bg-gradient-to-r from-[#035ba6] to-[#0284c7] text-white rounded-2xl p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-lg">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white shrink-0 backdrop-blur-sm">
                <Box className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-display font-black text-base sm:text-lg text-white leading-tight">
                  Bulk Orders <br />
                  <span className="font-extrabold text-cyan-200">Get Special Pricing</span>
                </h3>
                <p className="text-[11px] text-cyan-100 mt-1 max-w-xs">
                  For Hospitals, Hotels, Retail Chains, Institutions &amp; More
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openQuoteModal}
              className="inline-flex items-center gap-2 bg-white text-[#035ba6] hover:bg-slate-100 font-bold text-xs px-5 py-2.5 rounded-xl shadow-md transition-all hover:scale-105 shrink-0 self-stretch sm:self-auto justify-center"
            >
              <span>Request Bulk Quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* ── 6. Our Services ───────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-black text-xl sm:text-2xl text-[#0b2847] tracking-tight uppercase">
            OUR SERVICES
          </h2>
          <Link
            href="/services"
            className="text-xs sm:text-sm font-bold text-[#0284c7] hover:underline flex items-center gap-1"
          >
            <span>View All Services</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Service 1: Installation */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#0284c7] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7]">
                <Wrench className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Installation
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Professional installation by trained technicians
                </p>
              </div>
            </div>
          </div>

          {/* Service 2: Maintenance */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#0284c7] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7]">
                <Cog className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Maintenance
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Keep your systems running at peak performance
                </p>
              </div>
            </div>
          </div>

          {/* Service 3: Repair & Support */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#0284c7] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7]">
                <Hammer className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Repair &amp; Support
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Quick and reliable service when you need it
                </p>
              </div>
            </div>
          </div>

          {/* Service 4: AMC */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between hover:shadow-lg hover:border-[#0284c7] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7]">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  AMC (Annual Maintenance)
                </h3>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                  Long-term care for uninterrupted cooling
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Why Choose Tanmayee Technologies? Bottom Banner ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="relative rounded-3xl bg-[#0c233c] text-white p-8 sm:p-12 overflow-hidden shadow-2xl border border-[#1b3a5b]">
          {/* Subtle world map background decoration */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />

          {/* Corner Monstera/Palm Leaf Accent Illustrations */}
          <div
            className="absolute -bottom-8 -left-8 w-44 h-44 bg-contain bg-no-repeat pointer-events-none opacity-85 z-0"
            style={{ backgroundImage: 'url(/images/leaf-accent.jpg)' }}
          />
          <div
            className="absolute -bottom-8 -right-8 w-44 h-44 bg-contain bg-no-repeat pointer-events-none opacity-85 z-0 scale-x-[-1]"
            style={{ backgroundImage: 'url(/images/leaf-accent.jpg)' }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Column: Why Choose 5 Badges */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                Why Choose Tanmayee Technologies?
              </h2>

              {/* 5 Icons Row */}
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 pt-2">
                {/* 1 */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-inner">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    Authorised Distributor
                  </span>
                </div>

                {/* 2 */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-inner">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    Quality Products
                  </span>
                </div>

                {/* 3 */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-inner">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    Expert Team
                  </span>
                </div>

                {/* 4 */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-inner">
                    <LifeBuoy className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    Reliable Support
                  </span>
                </div>

                {/* 5 */}
                <div className="flex flex-col items-center text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[#38bdf8] shadow-inner">
                    <Globe2 className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-semibold text-slate-300">
                    Pan India Reach
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Let's Build a Cooler Tomorrow & Buttons */}
            <div className="lg:col-span-5 lg:pl-6 space-y-4">
              <h3 className="font-display font-black text-xl sm:text-2xl text-white leading-tight">
                Let&apos;s Build a Cooler Tomorrow
              </h3>
              <p className="text-xs text-slate-300">
                Get in touch with us today for the best solutions.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={openQuoteModal}
                  className="inline-flex items-center gap-2 bg-white text-[#0c233c] hover:bg-slate-100 font-black text-xs px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  <span>Get a Quote</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#0c233c]" />
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-[#25d366] hover:bg-[#20ba59] text-white font-black text-xs px-5 py-3 rounded-full shadow-lg transition-transform hover:scale-105"
                >
                  {/* WhatsApp SVG Icon */}
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white" aria-hidden="true">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.698c.99.54 1.761.817 2.796.817 3.18 0 5.766-2.587 5.767-5.767.001-3.182-2.585-5.768-5.767-5.768zm0 10.49c-.89 0-1.745-.251-2.482-.727l-.178-.115-1.579.414.421-1.539-.12-.191c-.512-.816-.782-1.766-.781-2.748.001-2.612 2.126-4.737 4.739-4.737 2.613 0 4.738 2.126 4.739 4.739-.001 2.612-2.127 4.736-4.738 4.736z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
