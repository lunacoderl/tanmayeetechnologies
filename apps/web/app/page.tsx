import React from 'react';
import Link from 'next/link';
import {
  Snowflake,
  ShieldCheck,
  ArrowRight,
  TrendingDown,
  CheckCircle2,
  PhoneCall,
  Sparkles,
  Building2,
  UtensilsCrossed,
  Hospital,
  Store,
  GraduationCap,
  Wrench,
  Clock,
  FileSpreadsheet,
  Star,
  MapPin,
  Quote,
  ExternalLink,
} from 'lucide-react';
import { SEED_CATEGORIES, SEED_BRANDS, SEED_PRODUCTS } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';
import { ProductCard } from '../components/product/product-card';


export default function HomePage() {
  const featuredProducts = SEED_PRODUCTS.filter((p) => p.featured).slice(0, 8);
  const parentCategories = SEED_CATEGORIES.filter((c) => c.parent_id === null);

  return (
    <div className="space-y-20 pb-20">
      {/* ── 1. Hero Section ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-navy-950 via-navy-900 to-slate-900 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        {/* Background glow effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/20 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-[400px] h-[300px] bg-sky-500/15 blur-[100px] rounded-full pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6 animate-fade-in-up">
            {/* Official Logo Badge with Glowing Rim */}
            <div className="flex justify-center mb-2">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-1 shadow-2xl shadow-cyan-500/30 animate-pulse-glow">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>

            {/* Trust Pill */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-200 shadow-lg">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Authorized Commercial Partner: Blue Star & Rockwell</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.15] text-white">
              Engineering{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-300 to-white">
                Commercial Cooling
              </span>{' '}
              & Cold Storage for Business.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal max-w-2xl mx-auto">
              Supply, turnkey installation, and certified AMC maintenance for 155+ commercial HVAC and refrigeration models across Visakhapatnam, Andhra Pradesh & Telangana.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="/products"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-500 hover:from-blue-700 hover:to-teal-600 text-white font-bold px-8 py-4 rounded-2xl shadow-xl shadow-cyan-500/25 transition-all hover:scale-105"
              >
                <span>Explore 155+ Catalogue</span>
                <ArrowRight className="w-5 h-5" />
              </Link>

              <Link
                href="/cart"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl backdrop-blur-md transition-all hover:scale-105"
              >
                <FileSpreadsheet className="w-5 h-5 text-cyan-300" />
                <span>Instant B2B Quotation</span>
              </Link>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 border-t border-white/10 text-left">
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  155
                </div>
                <div className="text-xs text-slate-400 font-medium">Commercial Models</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-cyan-400">
                  100%
                </div>
                <div className="text-xs text-slate-400 font-medium">Manufacturer Warranty</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-white">
                  Tiered
                </div>
                <div className="text-xs text-slate-400 font-medium">Bulk Corporate Pricing</div>
              </div>
              <div>
                <div className="font-display font-extrabold text-2xl sm:text-3xl text-emerald-400">
                  Turnkey
                </div>
                <div className="text-xs text-slate-400 font-medium">Delivery & Installation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. Authorized Brand Portfolios ───────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Brand Portfolios
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-3">
            Two Industry Giants. One Direct Trusted Source.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Blue Star Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-navy-900 text-white p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-brand-500/20 text-brand-300 border border-brand-500/30 px-3 py-1 rounded-full">
                  Air Conditioning Solutions
                </span>
                <span className="text-xs font-bold text-cyan-300">58 Models Available</span>
              </div>
              <h3 className="font-display font-extrabold text-3xl text-white">
                Blue Star
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                India&apos;s foremost air conditioning company. From 1 to 4 Ton split, cassette, tower, and window inverter units built with 100% copper condensers for severe ambient heat up to 52°C.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Inverter Split ACs
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Ceiling Cassette ACs
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> High-Flow Tower ACs
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Window Inverter Units
                </div>
              </div>
            </div>
            <div className="pt-8">
              <Link
                href="/brands/blue-star"
                className="inline-flex items-center gap-2 bg-white text-slate-900 font-bold px-6 py-3 rounded-xl text-sm hover:bg-slate-100 transition-colors"
              >
                <span>View All 58 Blue Star ACs</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Rockwell Card */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 to-navy-900 text-white p-8 sm:p-10 border border-slate-800 shadow-xl flex flex-col justify-between group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full">
                  Commercial Refrigeration
                </span>
                <span className="text-xs font-bold text-emerald-300">97 Models Available</span>
              </div>
              <h3 className="font-display font-extrabold text-3xl text-white">
                Rockwell
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                Pioneers of green refrigeration in India. High efficiency commercial convertible freezers, visi display coolers, stainless steel water coolers, and commercial kitchen reach-in chillers.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Green Deep Freezers
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Glass Visi Coolers
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> SS304 Water Coolers
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> Ice Cube Makers
                </div>
              </div>
            </div>
            <div className="pt-8">
              <Link
                href="/brands/rockwell"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors"
              >
                <span>View All Rockwell Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3. Featured Commercial Products ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
              Featured Equipment
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
              High-Demand Commercial Models
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Top rated equipment with ready stock and turnkey installation support.
            </p>
          </div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-800 transition-colors"
          >
            <span>View Full 155 Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product, index) => (
            <ProductCard key={`${product.id}-${index}`} product={product} />
          ))}
        </div>
      </section>

      {/* ── 4. Commercial Categories ─────────────────────────────────── */}
      <section className="bg-slate-100/70 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
              Explore By Category
            </span>
            <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
              Complete Cooling & Cold Chain Spectrum
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {parentCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-brand-300 transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-brand-600 mb-1">
                    {cat.product_count} Equipment Models
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {cat.description}
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1 text-xs font-bold text-slate-700 group-hover:text-brand-600">
                  <span>Browse Category</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. Solutions by Industry ─────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
            Tailored Industry Solutions
          </span>
          <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 mt-2">
            Cooling Infrastructure Built For Your Sector
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-sky-50 text-sky-600 rounded-xl flex items-center justify-center mx-auto">
              <UtensilsCrossed className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Hotels & Restaurants</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Reach-in chillers, back bar coolers, cassette dining ACs, and gourmet ice makers.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mx-auto">
              <Hospital className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Hospitals & Pharma</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Precision cold chain storage, stainless steel water coolers, and sanitized clean air ACs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center mx-auto">
              <Store className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Supermarkets & Retail</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Glass top ice cream freezers, vertical illuminated visi coolers, and cold displays.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mx-auto">
              <Building2 className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Corporate Offices</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Energy-efficient 5-star inverter split ACs, cassette units, and centralized AMC service.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
            <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center mx-auto">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900 text-sm">Schools & Universities</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              High-capacity SS304 drinking water coolers, auditorium tower ACs, and laboratory freezers.
            </p>
          </div>
        </div>
      </section>

      {/* ── 6. Services & Turnkey Assurance ─────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-navy-900 via-navy-950 to-slate-900 rounded-3xl text-white p-8 sm:p-12 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
            <div className="lg:col-span-2 space-y-4">
              <span className="text-xs font-bold text-brand-400 uppercase tracking-wider bg-brand-500/20 px-3 py-1 rounded-full border border-brand-500/30">
                End-to-End Execution
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                We Don&apos;t Just Supply Equipment. We Guarantee Its Lifecycle.
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Tanmayee Technologies provides complete commercial delivery, copper piping fabrication, structural mounting, electrical load consultation, manufacturer-compliant commissioning, and priority breakdown response under our Annual Maintenance Contracts.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Certified HVAC Engineers
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Direct Manufacturer Spare Parts
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Scheduled Preventative Service
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-brand-400 shrink-0" /> Emergency Breakdown Coverage
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-brand-500 text-white flex items-center justify-center mx-auto shadow-md">
                <Wrench className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Need Installation or AMC?</h3>
              <p className="text-xs text-slate-300">
                Book our technical inspection team for site feasibility and cooling load calculations.
              </p>
              <Link
                href="/services"
                className="w-full inline-block bg-white text-slate-900 font-bold py-3 rounded-xl text-xs hover:bg-slate-100 transition-colors"
              >
                Explore Services & Maintenance
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. Verified Google Reviews & Visakhapatnam Showroom ─────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span>Google Verified Business · 4.6 ★ (98 Reviews)</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
              Trusted by Andhra Pradesh Businesses
            </h2>
            <p className="text-sm text-slate-500 max-w-2xl">
              Authentic customer testimonials from our Google Business Profile in Madhurawada, Visakhapatnam.
            </p>
          </div>

          <a
            href={COMPANY.GOOGLE_MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl border border-brand-200 transition-colors w-fit"
          >
            <span>Read all 98 Google Reviews</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {COMPANY.REVIEWS.map((review, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-7 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="text-[11px] font-medium text-slate-400">{review.date}</span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  &ldquo;{review.text}&rdquo;
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-slate-900">{review.author}</div>
                  <div className="text-[10px] text-slate-400">Verified Google Customer</div>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  Verified
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Showroom & Dealership Details Strip */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-xl grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 block">
              Official Showroom
            </span>
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-brand-400 mt-1 shrink-0" />
              <div className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block font-semibold">{COMPANY.NAME}</strong>
                {COMPANY.FULL_ADDRESS}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 block">
              Authorized Dealerships
            </span>
            <div className="space-y-1 text-xs text-slate-300">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Exclusive Blue Star A/C Shoppe</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-brand-400 shrink-0" />
                <span>Rockwell Commercial Refrigerators Distributor</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-widest text-brand-400 block">
              Hours & Service Options
            </span>
            <div className="space-y-1 text-xs text-slate-300">
              <div>{COMPANY.STORE_HOURS}</div>
              <div className="text-slate-400 text-[11px]">
                Service Options: In-Store Shopping · In-Store Pickup · Delivery
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 8. Final High-Conversion Quotation Banner ─────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-sky-600 text-white p-8 sm:p-12 text-center space-y-6 shadow-2xl relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-3 relative z-10">
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Ready to Upgrade Your Commercial Cooling?
            </h2>
            <p className="text-sm sm:text-base text-sky-100 leading-relaxed">
              Have a tender specification, BOQ, or immediate equipment requirement? Connect with our Visakhapatnam commercial sales desk for immediate stock checks and tax invoice quotes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10 pt-2">
            <a
              href={`https://wa.me/${COMPANY.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Tanmayee Technologies, I have a commercial cooling requirement and would like to request a quotation.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white text-brand-700 hover:bg-sky-50 font-bold px-8 py-4 rounded-2xl shadow-xl transition-all hover:scale-105"
            >
              <PhoneCall className="w-5 h-5 text-emerald-600" />
              <span>Direct WhatsApp Desk ({COMPANY.PHONE_DISPLAY})</span>
            </a>

            <Link
              href="/contact"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-brand-800/60 hover:bg-brand-800/80 border border-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-all hover:scale-105"
            >
              <span>Visit Madhurawada Showroom</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

