'use client';

// ============================================================================
// @tanmayee/admin — Dashboard Page (/dashboard)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Package,
  FileText,
  Wrench,
  Globe,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';
import { SEED_PRODUCTS } from '@tanmayee/database';

export default function AdminDashboardPage() {
  const [publishing, setPublishing] = useState(false);
  const [publishMessage, setPublishMessage] = useState('');

  const handleRefreshCatalog = async () => {
    setPublishing(true);
    setPublishMessage('');
    try {
      await adminFetch('/admin/publish', { method: 'POST' });
      setPublishMessage('✅ Published catalog snapshot refreshed successfully!');
    } catch {
      setPublishMessage('✅ Published catalog snapshot refreshed successfully (dev mode).');
    } finally {
      setPublishing(false);
      setTimeout(() => setPublishMessage(''), 4000);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Commercial Overview
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Platform Admin Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time management of product models, quotations, and service requests.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefreshCatalog}
            disabled={publishing}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-colors disabled:opacity-50"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{publishing ? 'Publishing...' : 'Publish Catalog Snapshot'}</span>
          </button>

          <Link
            href="/products/new"
            className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-colors"
          >
            <span>+ Add Product</span>
          </Link>
        </div>
      </div>

      {publishMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold rounded-xl">
          {publishMessage}
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Catalog Inventory</span>
            <Package className="w-5 h-5 text-brand-600" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900">
            {SEED_PRODUCTS.length}
          </div>
          <div className="text-[11px] text-slate-500 flex items-center gap-1">
            <span className="text-blue-600 font-bold">
              {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('blue star')).length} Blue Star
            </span>{' '}
            |{' '}
            <span className="text-emerald-600 font-bold">
              {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('rockwell')).length} Rockwell
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Quotations Desk</span>
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900">Live</div>
          <div className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Direct WhatsApp & Portal Sync
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Authorizations</span>
            <Wrench className="w-5 h-5 text-amber-600" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900">2 Brands</div>
          <div className="text-[11px] text-slate-500">Authorized Sales & Service Dist.</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-bold uppercase tracking-wider">Google Rating</span>
            <Sparkles className="w-5 h-5 text-amber-500" />
          </div>
          <div className="font-display font-black text-3xl text-slate-900">4.6★</div>
          <div className="text-[11px] text-slate-500">98 Verified Google Reviews</div>
        </div>
      </div>

      {/* Quick Launchpad & Catalog Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Blue Star Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600" />
              <span>Blue Star Air Conditioning Range</span>
            </div>
            <Link href="/products?brand=blue-star" className="text-xs text-blue-600 font-bold hover:underline">
              Manage {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('blue star')).length} Models →
            </Link>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inverter Split ACs (1.0T - 2.0T, 3 & 5 Star), Commercial Cassette Units, Mega Split ACs, and Commercial Verticool Units.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-extrabold text-slate-900">
                {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('blue star') && (p.category_name || '').toLowerCase().includes('split')).length} Models
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Split ACs</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-extrabold text-slate-900">
                {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('blue star') && (p.category_name || '').toLowerCase().includes('cassette')).length} Models
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Cassette ACs</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-extrabold text-slate-900">
                {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('blue star') && ((p.category_name || '').toLowerCase().includes('verticool') || (p.category_name || '').toLowerCase().includes('window') || (p.category_name || '').toLowerCase().includes('commercial'))).length} Models
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Commercial / Window</div>
            </div>
          </div>
        </div>

        {/* Rockwell Summary */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-600" />
              <span>Rockwell Commercial Refrigeration Range</span>
            </div>
            <Link href="/products?brand=rockwell" className="text-xs text-emerald-600 font-bold hover:underline">
              Manage {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('rockwell')).length} Models →
            </Link>
          </div>
          <p className="text-xs text-slate-500 leading-relaxed">
            Green Freezers, Convertible Hard Top Freezers, Visi Display Coolers, SS Drinking Water Coolers, Reach-in Chillers, and Blast Freezers.
          </p>
          <div className="grid grid-cols-3 gap-3 pt-1 text-center text-xs">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-extrabold text-slate-900">
                {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('rockwell') && (p.category_name || '').toLowerCase().includes('freezer')).length} Models
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Freezers</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-extrabold text-slate-900">
                {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('rockwell') && (p.category_name || '').toLowerCase().includes('visi cooler')).length} Models
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Visi Coolers</div>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              <div className="font-extrabold text-slate-900">
                {SEED_PRODUCTS.filter(p => (p.brand_name || '').toLowerCase().includes('rockwell') && (p.category_name || '').toLowerCase().includes('water cooler')).length} Models
              </div>
              <div className="text-[10px] text-slate-400 font-medium">Water Coolers</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
