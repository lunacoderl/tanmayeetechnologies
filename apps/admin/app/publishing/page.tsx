'use client';

// ============================================================================
// @tanmayee/admin — Publishing Engine & Snapshot Manager (/publishing)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Globe,
  RefreshCw,
  CheckCircle2,
  Zap,
  Server,
  Database,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';
import { SEED_PRODUCTS } from '@tanmayee/database';

export default function AdminPublishingPage() {
  const [publishStatus, setPublishStatus] = useState<any>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishSuccess, setPublishSuccess] = useState(false);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await adminFetch<{ data: any }>('/publish');
        if (res.data) setPublishStatus(res.data);
      } catch (err) {
        console.error('Failed to load publish status:', err);
      }
    }
    loadStatus();
  }, []);

  const handleTriggerPublish = async () => {
    setIsPublishing(true);
    setPublishSuccess(false);

    try {
      const res = await adminFetch<{ data: any }>('/publish', {
        method: 'POST',
      });
      if (res.data) {
        setPublishStatus(res.data);
      }
      setPublishSuccess(true);
    } catch (err) {
      console.error('Publish error:', err);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900">
            Publishing Engine &amp; Public Snapshot
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Synchronize master catalog modifications with the high-performance public cache and materialized view.
          </p>
        </div>

        <button
          onClick={handleTriggerPublish}
          disabled={isPublishing}
          className="inline-flex items-center gap-1.5 sm:gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-3.5 sm:py-2.5 sm:px-5 rounded-xl shadow transition-all disabled:opacity-50 self-start sm:self-auto cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPublishing ? 'animate-spin' : ''}`} />
          <span>{isPublishing ? 'Rebuilding Snapshot...' : 'Publish Snapshot to Live Web'}</span>
        </button>
      </div>

      {publishSuccess && (
        <div className="p-3 sm:p-4 bg-emerald-50 border border-emerald-200 rounded-xl sm:rounded-2xl flex items-center justify-between text-xs text-emerald-800 font-bold">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Public snapshot refreshed! All {SEED_PRODUCTS.length} models and prices updated.</span>
          </span>
          <button
            onClick={() => setPublishSuccess(false)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Status Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Live Snapshot Status</span>
            <Globe className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-emerald-600 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            OPERATIONAL
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500">
            Version: {publishStatus?.version || '2026.09.22-v1'}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Published Models</span>
            <Server className="w-4 h-4 text-brand-600" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-slate-900">
            {publishStatus?.products_published || SEED_PRODUCTS.length} Models
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500">Blue Star &amp; Rockwell commercial catalog</div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Edge CDN Cache</span>
            <Zap className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-slate-900">
            Sub-50ms
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500">Zero database strain during peak traffic</div>
        </div>
      </div>

      {/* Architectural Guarantee Card */}
      <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center gap-2 text-brand-400 font-bold text-xs uppercase tracking-wider">
          <Database className="w-4 h-4" /> Architectural Isolation Principle
        </div>
        <h3 className="font-display font-bold text-lg text-white">
          Why Master Data ≠ Published Snapshot
        </h3>
        <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
          Tanmayee Technologies uses an enterprise-grade dual-tier publishing architecture: admin users can edit prices, add drafts, or restructure technical specifications without affecting live public website visitors. Only when you click <strong>&ldquo;Publish Snapshot&rdquo;</strong> does the system refresh the <code className="text-brand-300">published_catalog</code> materialized view and invalidate edge caches.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-slate-800 text-xs">
          <div className="space-y-1">
            <span className="text-emerald-400 font-bold block">1. Draft Safety</span>
            <span className="text-slate-400 text-[11px]">Unpublished changes stay completely private to admins.</span>
          </div>
          <div className="space-y-1">
            <span className="text-emerald-400 font-bold block">2. High Availability</span>
            <span className="text-slate-400 text-[11px]">Admin API maintenance never takes down the public storefront.</span>
          </div>
          <div className="space-y-1">
            <span className="text-emerald-400 font-bold block">3. Immutable Quotes</span>
            <span className="text-slate-400 text-[11px]">Historic client quotations freeze their pricing forever.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
