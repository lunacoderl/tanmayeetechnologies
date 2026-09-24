import React from 'react';
import Link from 'next/link';
import {
  Snowflake,
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowUpRight,
  CheckCircle2,
  Star,
  ExternalLink,
} from 'lucide-react';
import { SEED_CATEGORIES } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';


export function Footer() {
  const topCategories = SEED_CATEGORIES.filter((c) => c.parent_id === null);

  return (
    <footer className="bg-navy-950 text-slate-400 border-t border-navy-800 text-sm">
      {/* Trust Badges Bar */}
      <div className="border-b border-navy-800/80 py-8 bg-navy-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">100% Genuine</div>
              <div className="text-xs text-slate-400">Direct Brand Warranty</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Authorized Dealer</div>
              <div className="text-xs text-slate-400">Blue Star & Rockwell</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Snowflake className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Turnkey HVAC</div>
              <div className="text-xs text-slate-400">Installation & Commissioning</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center text-brand-400 shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="font-semibold text-white text-sm">Annual AMC</div>
              <div className="text-xs text-slate-400">Dedicated Technician Team</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Company Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg shadow-cyan-500/30 group-hover:scale-105 group-hover:border-cyan-400 transition-all duration-300 bg-white p-0.5">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies - Complete Cooling Solutions"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-display font-black text-xl text-white tracking-tight group-hover:text-cyan-400 transition-colors">
                  TANMAYEE Technologies
                </div>
                <div className="text-[10px] uppercase font-extrabold tracking-widest text-cyan-400">
                  Complete Cooling Solutions
                </div>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers & Rockwell Commercial Refrigerators Authorized Sales & Service Distributors in Visakhapatnam, Andhra Pradesh.
            </p>

            {/* Google Reviews Badge */}
            <a
              href={COMPANY.GOOGLE_MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 bg-slate-900 border border-slate-700/80 hover:border-amber-400/60 px-3.5 py-2 rounded-xl transition-colors group/review"
            >
              <div className="flex items-center gap-1 text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-display font-black text-sm text-white">{COMPANY.GOOGLE_RATING}</span>
              </div>
              <span className="text-xs text-slate-300 font-medium group-hover/review:text-white">
                ({COMPANY.GOOGLE_REVIEW_COUNT} Google reviews)
              </span>
              <ExternalLink className="w-3 h-3 text-slate-500 group-hover/review:text-amber-400 ml-1" />
            </a>

            <div className="flex flex-wrap gap-2 pt-1">
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                In-Store Shopping
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                In-Store Pickup
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-medium bg-brand-500/10 text-brand-300 border border-brand-500/20">
                Doorstep Delivery
              </span>
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Products
            </h4>
            <ul className="space-y-2.5">
              {topCategories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categories/${c.slug}`}
                    className="hover:text-white transition-colors"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Brands & Services */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Brands & Services
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/brands/blue-star"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Blue Star Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link
                  href="/brands/rockwell"
                  className="hover:text-white transition-colors flex items-center justify-between"
                >
                  <span>Rockwell Portfolio</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
                </Link>
              </li>
              <li>
                <Link href="/services/ac-installation" className="hover:text-white transition-colors">
                  AC Installation
                </Link>
              </li>
              <li>
                <Link href="/services/freezer-installation" className="hover:text-white transition-colors">
                  Freezer Setup
                </Link>
              </li>
              <li>
                <Link href="/services/annual-maintenance-contract" className="hover:text-white transition-colors">
                  Annual AMC Contracts
                </Link>
              </li>
              <li>
                <Link href="/cart" className="hover:text-white transition-colors">
                  Quotation Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact / Head Office */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">
              Showroom & Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex flex-col gap-1.5">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 mt-0.5 shrink-0" />
                  <span className="text-xs leading-relaxed text-slate-300">
                    {COMPANY.FULL_ADDRESS}
                  </span>
                </div>
                <a
                  href="https://maps.app.goo.gl/ndzjgar89V8CXgaC7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-cyan-400 hover:text-cyan-300 hover:underline pl-6.5 transition-colors"
                >
                  <ExternalLink className="w-3 h-3" /> Get Directions on Google Maps →
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`tel:${COMPANY.PHONE}`} className="text-xs hover:text-white text-slate-300 font-semibold">
                  {COMPANY.PHONE_DISPLAY}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-brand-400 shrink-0" />
                <span className="text-xs text-slate-300">
                  {COMPANY.STORE_HOURS}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-400 shrink-0" />
                <a href={`mailto:${COMPANY.EMAIL}`} className="text-xs hover:text-white text-slate-300">
                  {COMPANY.EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>


        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-navy-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} Tanmayee Technologies. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/terms" className="hover:text-cyan-400 transition-colors">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-cyan-400 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/wishlist" className="hover:text-cyan-400 transition-colors">
              Wishlist
            </Link>
            <Link href="/contact" className="hover:text-cyan-400 transition-colors">
              Corporate Enquiries
            </Link>
            <span className="text-slate-500">Authorized Commercial Partner</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
