'use client';

import React, { useState, useEffect } from 'react';
import { PhoneCall, MessageCircle, FileText, ChevronUp } from 'lucide-react';
import { useCart } from '../../lib/cart-context';

export function FloatingCTAs() {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const { openCart, totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 280) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div
      className="fixed right-4 md:right-6 bottom-6 z-50 flex flex-col items-center gap-3.5 pointer-events-auto animate-float-dock"
      aria-label="Quick Actions"
    >
      {/* 1. Direct Phone Call */}
      <div className="relative group">
        <a
          href="tel:09390115553"
          className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-500 text-white shadow-xl shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-110 active:scale-95 transition-all duration-300 ring-2 ring-white/90 animate-pulse-glow"
          aria-label="Call Tanmayee Technologies at 093901 15553"
        >
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-cyan-300"></span>
          </span>
          <PhoneCall className="w-5 h-5 md:w-6 md:h-6" />
        </a>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-slate-700/50">
          Call: 093901 15553
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-slate-900/95"></div>
        </div>
      </div>

      {/* 2. WhatsApp Official Chat */}
      <div className="relative group">
        <a
          href="https://wa.me/919390115553?text=Hello%20Tanmayee%20Technologies%2C%20I%20would%20like%20to%20get%20information%20and%20quotation%20for%20commercial%20cooling%20equipment."
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-green-500 to-teal-400 text-white shadow-xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-110 active:scale-95 transition-all duration-300 ring-2 ring-white/90 animate-pulse-green-glow"
          aria-label="Chat on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
        </a>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-slate-700/50">
          WhatsApp Instant Chat
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-slate-900/95"></div>
        </div>
      </div>

      {/* 3. Quotation Request Drawer */}
      <div className="relative group">
        <button
          onClick={openCart}
          className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-500 text-white shadow-xl shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-110 active:scale-95 transition-all duration-300 ring-2 ring-white/90"
          aria-label="Open Quotation Cart"
        >
          <FileText className="w-5 h-5 md:w-6 md:h-6" />
          {totalItems > 0 && (
            <span
              key={totalItems}
              className="absolute -top-1 -right-1 flex items-center justify-center min-w-5 h-5 px-1 rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white text-[11px] font-black shadow-lg border-2 border-white animate-pop-scale"
            >
              {totalItems}
            </span>
          )}
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-slate-700/50">
          View Quotation ({totalItems})
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-slate-900/95"></div>
        </div>
      </div>

      {/* 4. Scroll To Top Button with Smooth Transition */}
      <div
        className={`relative group transition-all duration-300 transform ${
          showScrollTop
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <button
          onClick={scrollToTop}
          className="flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full bg-slate-900/90 text-cyan-400 hover:text-white hover:bg-slate-950 backdrop-blur-md border border-cyan-500/30 hover:border-cyan-400 shadow-xl shadow-slate-950/40 hover:scale-110 active:scale-95 transition-all duration-300 ring-1 ring-white/20"
          aria-label="Scroll back to top"
        >
          <ChevronUp className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:-translate-y-0.5" />
        </button>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-slate-900/95 backdrop-blur-md text-white text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none shadow-xl border border-slate-700/50">
          Back to Top
          <div className="absolute left-full top-1/2 -translate-y-1/2 -ml-1 border-4 border-transparent border-l-slate-900/95"></div>
        </div>
      </div>
    </div>
  );
}
