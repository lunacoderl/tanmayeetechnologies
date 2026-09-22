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
} from 'lucide-react';
import { SEED_PRODUCTS } from '@tanmayee/database';
import { ProductStatus } from '@tanmayee/config';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [selectedVersionProduct, setSelectedVersionProduct] = useState<any>(null);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tanmayee_custom_products');
        if (stored) {
          const custom = JSON.parse(stored);
          if (Array.isArray(custom) && custom.length > 0) {
            setProducts((prev) => {
              const copy = [...prev];
              custom.forEach((cp: any) => {
                const idx = copy.findIndex((p) => p.id === cp.id);
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
  }, []);

  const filteredList = useMemo(() => {
    return products.filter((p) => {
      if (statusFilter !== 'ALL' && p.status !== statusFilter) return false;
      if (brandFilter !== 'ALL' && p.brand_name.toLowerCase().replace(/\s+/g, '-') !== brandFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.product_name.toLowerCase().includes(q) ||
          (p.model_number && p.model_number.toLowerCase().includes(q))
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
                const isBlueStar = p.brand_name.toLowerCase().includes('blue star');
                const adminImgUrl = p.media?.[0]?.url || (isBlueStar
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
                        {p.brand_name}
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
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">Version History</h3>
                <div className="text-xs text-slate-500 truncate max-w-xs">
                  {selectedVersionProduct.product_name}
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedVersionProduct(null)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div>
                  <div className="font-bold text-emerald-900">
                    Version {selectedVersionProduct.current_version || 1} (Current Active)
                  </div>
                  <div className="text-[10px] text-emerald-700">Published to public website</div>
                </div>
                <span className="font-mono text-emerald-800 font-bold">ACTIVE</span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between opacity-80">
                <div>
                  <div className="font-bold text-slate-800">Version 1 (Initial Seed)</div>
                  <div className="text-[10px] text-slate-500">Created from manufacturer catalogue</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    alert('Version snapshot restored successfully');
                    setSelectedVersionProduct(null);
                  }}
                  className="text-brand-600 font-bold text-[11px] hover:underline"
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
