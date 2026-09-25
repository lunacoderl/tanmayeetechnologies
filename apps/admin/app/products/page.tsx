'use client';

// ============================================================================
// @tanmayee/admin — Product Manager Page (/products)
// ============================================================================

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Plus,
  Edit,
  Globe,
  Archive,
  History,
  X,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
} from 'lucide-react';
import { getMergedProducts } from '@tanmayee/database';
import { ProductStatus } from '@tanmayee/config';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(getMergedProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [selectedVersionProduct, setSelectedVersionProduct] = useState<any>(null);

  // Real database-backed Version History states
  const [productVersions, setProductVersions] = useState<any[]>([]);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);
  const [restoringVersion, setRestoringVersion] = useState<number | null>(null);
  const [versionFeedback, setVersionFeedback] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadLiveProducts() {
      try {
        const res = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.products && Array.isArray(json.products) && json.products.length > 0) {
            setProducts(json.products);
            return;
          }
        }
      } catch (err) {
        console.warn('Live products fetch notice:', err);
      }

      // Local fallback
      try {
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('tanmayee_custom_products');
          if (stored) {
            const custom = JSON.parse(stored);
            if (isMounted && Array.isArray(custom) && custom.length > 0) {
              setProducts((prev) => {
                const copy = [...prev];
                custom.forEach((cp: any) => {
                  const idx = copy.findIndex((p) => p.id === cp.id || p.slug === cp.slug);
                  if (idx >= 0) {
                    copy[idx] = { ...copy[idx], ...cp };
                  } else {
                    copy.unshift(cp);
                  }
                });
                return copy;
              });
            }
          }
        }
      } catch (e) {
        console.error('Failed to load custom products in admin', e);
      }
    }

    loadLiveProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch real version history from database whenever modal opens
  useEffect(() => {
    if (!selectedVersionProduct) {
      setProductVersions([]);
      setVersionFeedback(null);
      return;
    }

    let isMounted = true;
    async function loadVersions() {
      setIsLoadingVersions(true);
      setVersionFeedback(null);
      try {
        const res = await fetch(`/api/products/${selectedVersionProduct.id}/versions`);
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.versions && Array.isArray(json.versions)) {
            setProductVersions(json.versions);
            return;
          }
        }
      } catch (err) {
        console.error('Failed to load version history:', err);
      } finally {
        if (isMounted) setIsLoadingVersions(false);
      }
    }

    loadVersions();
    return () => {
      isMounted = false;
    };
  }, [selectedVersionProduct]);

  // Handle restoring a previous version
  const handleRestoreVersion = async (versionNumber: number) => {
    if (!selectedVersionProduct) return;
    setRestoringVersion(versionNumber);
    setVersionFeedback(null);

    try {
      const res = await fetch(`/api/products/${selectedVersionProduct.id}/versions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ restore_version_number: versionNumber }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to restore version');
      }

      setVersionFeedback({
        message: `Successfully restored to Version ${versionNumber}. Product synchronized across website and database.`,
        type: 'success',
      });

      // Reload products list
      const updatedRes = await fetch(`/api/products?t=${Date.now()}`, { cache: 'no-store' });
      if (updatedRes.ok) {
        const uJson = await updatedRes.json();
        if (uJson.products) setProducts(uJson.products);
      }

      // Refresh versions list
      const vRes = await fetch(`/api/products/${selectedVersionProduct.id}/versions?t=${Date.now()}`, { cache: 'no-store' });
      if (vRes.ok) {
        const vJson = await vRes.json();
        if (vJson.versions) setProductVersions(vJson.versions);
      }
    } catch (err: any) {
      console.error('Restore error:', err);
      setVersionFeedback({
        message: err.message || 'Error restoring version',
        type: 'error',
      });
    } finally {
      setRestoringVersion(null);
    }
  };

  const filteredList = useMemo(() => {
    return products.filter((p) => {
      const bName = (p.brand_name || (p.product_name?.toLowerCase().includes('blue star') ? 'Blue Star' : 'Rockwell')).toLowerCase();
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (brandFilter !== 'ALL' && bName.replace(/\s+/g, '-') !== brandFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q)) ||
          bName.includes(q)
        );
      }
      return true;
    });
  }, [products, statusFilter, brandFilter, searchQuery]);

  const handlePublish = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, status: ProductStatus.PUBLISHED, current_version: (p.current_version || 1) + 1 }
          : p
      )
    );
  };

  const handleArchive = (id: string) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status: ProductStatus.ARCHIVED } : p
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Product Catalogue Manager
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage {products.length} commercial HVAC & refrigeration models, status, and specifications.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* Filter and Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by model or name..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Brand select */}
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Brands</option>
            <option value="blue-star">Blue Star</option>
            <option value="rockwell">Rockwell</option>
          </select>

          {/* Status select */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
          >
            <option value="ALL">All Statuses</option>
            <option value={ProductStatus.PUBLISHED}>Published</option>
            <option value={ProductStatus.DRAFT}>Draft</option>
            <option value={ProductStatus.ARCHIVED}>Archived</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[10px] tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Equipment Model</th>
                <th className="py-3.5 px-4">Brand</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Price Indicator</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Version</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredList.map((p, index) => {
                const brandName = p.brand_name || (p.product_name?.toLowerCase().includes('blue star') ? 'Blue Star' : 'Rockwell');
                const isBlueStar = brandName.toLowerCase().includes('blue star');
                const adminImgUrl = (p as any).primary_image_url || p.media?.[0]?.url || (isBlueStar
                  ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
                  : 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png');
                return (
                  <tr key={`${p.id}-${index}`} className="hover:bg-slate-50/70 transition-colors">
                    {/* Model & Name */}
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                          <img
                            src={adminImgUrl}
                            alt={p.product_name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 truncate max-w-xs">
                            {p.product_name}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono">
                            {p.model_number || 'NO-SKU'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Brand */}
                    <td className="py-3 px-4">
                      <span
                        className={`font-bold px-2 py-0.5 rounded-full text-[10px] uppercase ${
                          isBlueStar
                            ? 'bg-blue-50 text-blue-700'
                            : 'bg-emerald-50 text-emerald-700'
                        }`}
                      >
                        {brandName}
                      </span>
                    </td>

                    {/* Category */}
                    <td className="py-3 px-4 text-slate-600 font-medium">
                      {p.category_name}
                    </td>

                    {/* Price */}
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {p.reference_price ? (
                        <>₹{p.reference_price.toLocaleString('en-IN')}</>
                      ) : (
                        <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[10px]">
                          On Quote
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          p.status === ProductStatus.PUBLISHED
                            ? 'bg-emerald-50 text-emerald-700'
                            : p.status === ProductStatus.DRAFT
                            ? 'bg-amber-50 text-amber-700'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    {/* Version */}
                    <td className="py-3 px-4 font-mono text-slate-500">
                      v{p.current_version || 1}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          href={`/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                          title="Edit Product"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>

                        <button
                          type="button"
                          onClick={() => setSelectedVersionProduct(p)}
                          className="p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Version History"
                        >
                          <History className="w-4 h-4" />
                        </button>

                        {p.status !== ProductStatus.PUBLISHED ? (
                          <button
                            type="button"
                            onClick={() => handlePublish(p.id)}
                            className="p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Publish Product"
                          >
                            <Globe className="w-4 h-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleArchive(p.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                            title="Archive Product"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Version History Modal */}
      {selectedVersionProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-6 max-w-xl w-full shadow-2xl space-y-4 max-h-[85vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-base text-slate-900">Version History</h3>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 font-semibold">
                    v{selectedVersionProduct.current_version || 1} Active
                  </span>
                </div>
                <div className="text-xs text-slate-500 truncate max-w-md mt-0.5">
                  {selectedVersionProduct.product_name}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVersionProduct(null)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Feedback notification banner */}
            {versionFeedback && (
              <div
                className={`p-3 rounded-2xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in duration-200 ${
                  versionFeedback.type === 'success'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {versionFeedback.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                )}
                <span>{versionFeedback.message}</span>
              </div>
            )}

            {/* Version List */}
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {isLoadingVersions ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <Loader2 className="w-6 h-6 animate-spin text-brand-600" />
                  <span className="text-xs">Fetching version snapshots from Supabase...</span>
                </div>
              ) : productVersions.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-500">
                  No previous versions recorded yet. Current active version is v{selectedVersionProduct.current_version || 1}.
                </div>
              ) : (
                productVersions.map((v: any) => {
                  const isActive = v.version_number === (selectedVersionProduct.current_version || productVersions[0]?.version_number);
                  const isBeingRestored = restoringVersion === v.version_number;
                  const snapshotImg = v.snapshot?.primary_image_url || v.snapshot?.media?.[0]?.url;

                  return (
                    <div
                      key={v.id || v.version_number}
                      className={`p-4 rounded-2xl border transition-all ${
                        isActive
                          ? 'bg-emerald-50/60 border-emerald-300 ring-1 ring-emerald-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          {snapshotImg ? (
                            <img
                              src={snapshotImg}
                              alt={`Version ${v.version_number}`}
                              className="w-12 h-12 rounded-xl object-contain bg-slate-50 border border-slate-100 p-0.5 shrink-0"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                              <History className="w-5 h-5 text-slate-400" />
                            </div>
                          )}

                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">
                                Version {v.version_number}
                              </span>
                              {isActive ? (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 font-mono">
                                  CURRENT ACTIVE
                                </span>
                              ) : (
                                <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                                  Archived Snapshot
                                </span>
                              )}
                            </div>

                            <div className="text-[11px] text-slate-600 font-medium">
                              {v.change_summary || `Version ${v.version_number} Snapshot`}
                            </div>

                            <div className="flex items-center gap-3 text-[10px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {v.created_at ? new Date(v.created_at).toLocaleString('en-IN', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                }) : 'Original Release'}
                              </span>
                              {v.snapshot?.media?.length ? (
                                <span>{v.snapshot.media.length} media items</span>
                              ) : null}
                            </div>
                          </div>
                        </div>

                        <div>
                          {isActive ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2.5 py-1 rounded-xl">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Live
                            </span>
                          ) : (
                            <button
                              type="button"
                              disabled={isBeingRestored}
                              onClick={() => handleRestoreVersion(v.version_number)}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold transition-all disabled:opacity-50"
                            >
                              {isBeingRestored ? (
                                <>
                                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  <span>Restoring...</span>
                                </>
                              ) : (
                                <>
                                  <RotateCcw className="w-3.5 h-3.5" />
                                  <span>Restore</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Snapshots stored permanently in Supabase PostgreSQL</span>
              <button
                type="button"
                onClick={() => setSelectedVersionProduct(null)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 font-semibold text-slate-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
