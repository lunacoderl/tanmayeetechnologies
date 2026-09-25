import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Tag,
  Percent,
  CheckCircle2,
  Building2,
  Snowflake,
  ShieldCheck,
  Phone,
  FileText,
  Clock,
  ArrowRight,
  Sparkles,
  Zap,
} from 'lucide-react';
import { INITIAL_OFFERS } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';

export const metadata: Metadata = {
  title: 'Commercial HVAC & Refrigeration Offers | B2B Bulk Discounts',
  description:
    'Exclusive commercial procurement discounts, festival rebates, and tiered volume savings on Blue Star ACs and Rockwell Deep Freezers in Visakhapatnam, Andhra Pradesh & Telangana.',
  alternates: {
    canonical: 'https://www.tanmayeetechnologies.com/offers',
  },
  openGraph: {
    title: 'Commercial HVAC & Refrigeration Offers | Tanmayee Technologies',
    description:
      'Save on commercial cooling & cold chain procurement with official dealer bulk tiers and seasonal rebates.',
    url: 'https://www.tanmayeetechnologies.com/offers',
    siteName: 'Tanmayee Technologies',
    type: 'website',
  },
};

export default function OffersPage() {
  const activeOffers = INITIAL_OFFERS.filter((o) => o.is_active);

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Hero Banner */}
      <section className="bg-gradient-to-br from-navy-950 via-slate-900 to-[#00529b] text-white py-16 sm:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.18),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-4 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official OEM Dealer Procurement Schemes</span>
            </div>
            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-5xl tracking-tight leading-tight">
              Exclusive Commercial Cooling &amp; Cold Chain Offers
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Wholesale volume rebates, institutional tiers, and limited-time festival discounts for businesses, hotels, hospitals, and educational institutions across Andhra Pradesh &amp; Telangana.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 inline-flex items-center gap-2"
              >
                <span>Browse Eligible Products</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href={`tel:${COMPANY.PHONE}`}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <Phone className="w-4 h-4 text-cyan-400" />
                <span>Call Commercial Desk: {COMPANY.PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Procurement Highlights */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-700 shrink-0 font-display font-black text-xl">
              5-12%
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Automatic Bulk Tiers</h3>
              <p className="text-xs text-slate-500">Tiered rebates applied directly to quotation PDFs.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0 font-display font-black text-xl">
              100%
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Direct Factory Warranty</h3>
              <p className="text-xs text-slate-500">Comprehensive OEM compressor warranties included.</p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 font-display font-black text-xl">
              FREE
            </div>
            <div>
              <h3 className="font-bold text-sm text-slate-900">Site Heat Load Survey</h3>
              <p className="text-xs text-slate-500">Certified HVAC engineering layout for institutional orders.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Active Offers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
            Active Commercial Campaigns
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            Current B2B Deals &amp; Procurement Schemes
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            Mention the deal code during enquiry or request an official quotation to lock in these discounted prices.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeOffers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between relative overflow-hidden group"
            >
              {/* Badge */}
              <div className="flex items-center justify-between gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Code: {offer.code}</span>
                </span>
                {offer.is_permanent ? (
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Always Active
                  </span>
                ) : (
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Limited Time
                  </span>
                )}
              </div>

              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-900 group-hover:text-blue-700 transition-colors">
                  {offer.name}
                </h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  {offer.description}
                </p>

                {/* Offer Highlights */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Discount Value:</span>
                    <span className="font-black text-emerald-600 text-sm">
                      {offer.discount_type === 'PERCENTAGE'
                        ? `${offer.discount_value}% OFF`
                        : `₹${offer.discount_value.toLocaleString('en-IN')} Flat`}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Order Quantity:</span>
                    <span className="font-bold text-slate-800">
                      {offer.min_quantity}
                      {offer.max_quantity ? ` to ${offer.max_quantity} units` : '+ units'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Scope:</span>
                    <span className="font-bold text-slate-800">
                      {offer.applicable_scope.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  href="/contact?intent=quote"
                  className="text-xs font-bold text-[#0284c7] hover:underline flex items-center gap-1"
                >
                  <span>Request RFQ with this code</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  href="/products"
                  className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-colors"
                  title="View Products"
                >
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Turnkey Contract Benefits */}
      <section className="bg-slate-100 border-t border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
                Institutional Advantage
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                Why Procure Commercial Equipment from Tanmayee Technologies?
              </h2>
              <p className="text-sm text-slate-600 mt-3 leading-relaxed">
                As direct authorized sales and service partners for Blue Star and Rockwell in Visakhapatnam, we provide guaranteed factory pricing without distributor markups, combined with localized installation and warranty support.
              </p>

              <div className="mt-6 space-y-3.5">
                {[
                  '100% Genuine brand units with serialized factory warranties.',
                  'Priority commissioning by certified HVAC engineers within 48 hours.',
                  'GST input tax credit compliance with formal commercial invoicing.',
                  'Comprehensive Annual Maintenance Contract (AMC) packages with dedicated emergency SLA.',
                  'Free site survey, heat-load calculation, and copper piping estimation.',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">Lock In Custom Project Pricing</h3>
                  <p className="text-xs text-slate-500">Need 10+ ACs or cold chain equipment for an upcoming project?</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Contact our commercial sales division directly. We formulate custom quotation proposals with line-item pricing, electrical specifications, and delivery schedules.
              </p>

              <div className="space-y-3 pt-2">
                <a
                  href={`tel:${COMPANY.PHONE}`}
                  className="w-full bg-[#00529b] hover:bg-[#003d73] text-white font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Commercial Officer: {COMPANY.PHONE_DISPLAY}</span>
                </a>
                <Link
                  href="/contact"
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Submit RFP / Tender Enquiry Online</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
