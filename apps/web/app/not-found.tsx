'use client';

// ============================================================================
// @tanmayee/web — Custom 404 Error Page (Cooling & HVAC Theme)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { Snowflake, Home, Search, FileText, ArrowRight, ShieldCheck } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 via-cyan-50/20 to-white">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Animated Icon */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-gradient-to-tr from-blue-600 via-cyan-500 to-teal-400 p-0.5 shadow-xl shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-white rounded-3xl flex items-center justify-center">
            <Snowflake className="w-12 h-12 text-cyan-600 animate-spin" style={{ animationDuration: '12s' }} />
          </div>
        </div>

        {/* Heading */}
        <div className="space-y-3">
          <span className="text-xs font-black uppercase tracking-widest text-cyan-700 bg-cyan-100/80 px-3.5 py-1 rounded-full border border-cyan-300">
            Error 404 • Thermal Anomaly
          </span>
          <h1 className="font-display font-black text-4xl sm:text-5xl text-slate-900 tracking-tight">
            Equipment Locus Not Found
          </h1>
          <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
            The page or commercial HVAC model you are looking for has been decommissioned, relocated, or temporarily chilled.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-cyan-500/25 transition-all hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Return to Homepage</span>
          </Link>

          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all hover:scale-105"
          >
            <Search className="w-4 h-4 text-cyan-600" />
            <span>Browse Full Catalogue</span>
          </Link>
        </div>

        {/* Quick Shortcuts */}
        <div className="pt-6 border-t border-slate-200">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
            Popular Equipment Sectors
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { name: 'Inverter Split ACs', href: '/categories/inverter-split-ac' },
              { name: 'Cassette ACs', href: '/categories/commercial-cassette-ac' },
              { name: 'Green Freezers', href: '/categories/convertible-green-freezer' },
              { name: 'Visi Coolers', href: '/categories/visi-cooler' },
              { name: 'Tower ACs', href: '/categories/commercial-verticool-ac' },
            ].map((item, idx) => (
              <Link
                key={idx}
                href={item.href}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-cyan-50 hover:text-cyan-800 text-slate-700 transition-colors border border-slate-200"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-600" />
          <span>Tanmayee Technologies Vizag • Blue Star & Rockwell Authorized Channel</span>
        </div>
      </div>
    </div>
  );
}
