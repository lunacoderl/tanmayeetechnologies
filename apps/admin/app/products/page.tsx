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
  Bell,
  Phone,
  MessageSquare,
} from 'lucide-react';
import { getMergedProducts } from '@tanmayee/database';
import { ProductStatus } from '@tanmayee/config';

export default function AdminProductsPage() {
  const [products, setProducts] = useState(getMergedProducts());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [brandFilter, setBrandFilter] = useState('ALL');
  const [selectedVersionProduct, setSelectedVersionProduct] = useState<any>(null);

  // Tab & Notification Leads states
  const [activeTab, setActiveTab] = useState<'catalog' | 'alerts'>('catalog');
  const [stockNotifications, setStockNotifications] = useState<any[]>([]);
  const [updatingAvailabilityId, setUpdatingAvailabilityId] = useState<string | null>(null);
  const [availabilityToast, setAvailabilityToast] = useState<string | null>(null);

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

  // Background load stock availability inquiries from buyers
  useEffect(() => {
    let isMounted = true;
    async function loadNotifications() {
      try {
        const res = await fetch(`/api/stock-notifications?t=${Date.now()}`, { cache: 'no-store' });
        if (res.ok) {
          const json = await res.json();
          if (isMounted && json.notifications && Array.isArray(json.notifications)) {
            setStockNotifications(json.notifications);
          }
        }
      } catch (err) {
        console.warn('Could not load stock notifications:', err);
      }
    }
    loadNotifications();
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

  const handleToggleAvailability = async (product: any) => {
    const isCurrentlyAvailable = product.is_available !== false && product.in_stock !== false;
    const newAvailable = !isCurrentlyAvailable;
    setUpdatingAvailabilityId(product.id);

    try {
      const updatedProduct = {
        ...product,
        is_available: newAvailable,
        in_stock: newAvailable,
      };

      // 1. Optimistic UI update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? updatedProduct : p))
      );

      // 2. Persist to API
      const res = await fetch('/api/products/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProduct),
      });

      if (!res.ok) {
        throw new Error('Server error toggling availability');
      }

      // 3. Persist to localStorage for immediate client reactivity
      if (typeof window !== 'undefined') {
        try {
          const stored = localStorage.getItem('tanmayee_custom_products');
          let list = stored ? JSON.parse(stored) : [];
          const idx = list.findIndex((p: any) => p.id === product.id);
          if (idx >= 0) {
            list[idx] = updatedProduct;
          } else {
            list.unshift(updatedProduct);
          }
          localStorage.setItem('tanmayee_custom_products', JSON.stringify(list));
        } catch (e) {
          console.error(e);
        }
      }

      setAvailabilityToast(
        `${product.product_name} is now marked as ${newAvailable ? 'IN STOCK / AVAILABLE' : 'NOT AVAILABLE'}`
      );
      setTimeout(() => setAvailabilityToast(null), 4000);
    } catch (err: any) {
      console.error('Error toggling availability:', err);
      // Revert optimistic update
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? product : p))
      );
    } finally {
      setUpdatingAvailabilityId(null);
    }
  };

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
    <div className="space-y-4 sm:space-y-6">
      {/* Toast Notification Banner */}
      {availabilityToast && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-900">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{availabilityToast}</span>
          </div>
          <button
            type="button"
            onClick={() => setAvailabilityToast(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-bold"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top Bar with Mobile Responsive Sizing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900">
            Product Catalogue Manager
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Manage {products.length} commercial HVAC &amp; refrigeration models, stock availability, and specs.
          </p>
        </div>

        <Link
          href="/products/new"
          className="inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2 px-3.5 sm:py-2.5 sm:px-4 rounded-xl shadow transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </Link>
      </div>

      {/* View Switcher Tabs: Products Catalog vs Customer Stock Alerts */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'catalog'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          Equipment Catalog ({products.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('alerts')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-brand-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
          }`}
        >
          <Bell className="w-3.5 h-3.5" />
          <span>Stock Availability Leads</span>
          {stockNotifications.length > 0 && (
            <span className="bg-rose-500 text-white text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">
              {stockNotifications.length}
            </span>
          )}
        </button>
      </div>

      {/* Tab Content: Stock Alerts / Inquiries */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-sm sm:text-base text-slate-900">
                Customer Stock Availability Inquiries ({stockNotifications.length})
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500">
                Customers who tapped &quot;Notify Me When Available&quot; on out-of-stock products. Call or WhatsApp them directly.
              </p>
            </div>
          </div>

          {stockNotifications.length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Bell className="w-8 h-8 mx-auto text-slate-300" />
              <p className="text-xs font-semibold">No pending stock availability requests from customers.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {stockNotifications.map((notif, idx) => {
                const phone = notif.customer_phone || '';
                const cleanPhone = phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`}?text=${encodeURIComponent(
                  `Hello ${notif.customer_name || 'Sir/Madam'}, this is Tanmayee Technologies Visakhapatnam regarding your inquiry for ${notif.product_name}. We have updates regarding stock availability!`
                )}`;

                return (
                  <div
                    key={notif.id || idx}
                    className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-brand-600" />
                        <span>{phone}</span>
                      </span>
                      <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                        {notif.status || 'NEW LEAD'}
                      </span>
                    </div>

                    <div>
                      <div className="font-bold text-xs text-slate-800 line-clamp-1">
                        {notif.product_name}
                      </div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        Model: {notif.model_number || 'N/A'}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-400">
                      Requested: {notif.created_at ? new Date(notif.created_at).toLocaleString('en-IN') : 'Just now'}
                    </div>

                    {/* Quick Call & WhatsApp Action Buttons */}
                    <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                      <a
                        href={`tel:${cleanPhone}`}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-xl transition-colors shadow-xs"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Call</span>
                      </a>
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 inline-flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] py-1.5 px-2.5 rounded-xl transition-colors shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Equipment Catalog Table */}
      {activeTab === 'catalog' && (
        <>
          {/* Filter and Search Toolbar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
            {/* Search */}
            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search model or name..."
                className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2 sm:top-2.5" />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              {/* Brand select */}
              <select
                value={brandFilter}
                onChange={(e) => setBrandFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2.5 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Brands</option>
                <option value="blue-star">Blue Star</option>
                <option value="rockwell">Rockwell</option>
              </select>

              {/* Status select */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:flex-none px-2.5 py-1.5 sm:py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="ALL">All Statuses</option>
                <option value={ProductStatus.PUBLISHED}>Published</option>
                <option value={ProductStatus.DRAFT}>Draft</option>
                <option value={ProductStatus.ARCHIVED}>Archived</option>
              </select>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-[11px] sm:text-xs text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold text-[9px] sm:text-[10px] tracking-wider whitespace-nowrap">
                  <tr>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Equipment Model</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Brand</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Category</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Price</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Availability</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Status</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5">Version</th>
                    <th className="py-2 sm:py-3 px-2 sm:px-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredList.map((p, index) => {
                    const brandName = p.brand_name || (p.product_name?.toLowerCase().includes('blue star') ? 'Blue Star' : 'Rockwell');
                    const isBlueStar = brandName.toLowerCase().includes('blue star');
                    const adminImgUrl = (p as any).primary_image_url || p.media?.[0]?.url || (isBlueStar
                      ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
                      : 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png');
                    const isAvailable = p.is_available !== false && p.in_stock !== false;
                    const isUpdating = updatingAvailabilityId === p.id;

                    return (
                      <tr key={`${p.id}-${index}`} className="hover:bg-slate-50/70 transition-colors">
                        {/* Model & Name */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 font-semibold text-slate-900">
                          <div className="flex items-center gap-2 sm:gap-2.5">
                            <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                              <img
                                src={adminImgUrl}
                                alt={p.product_name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-bold text-[11px] sm:text-xs text-slate-900 truncate max-w-[130px] sm:max-w-xs">
                                {p.product_name}
                              </div>
                              <div className="text-[9px] sm:text-[10px] text-slate-400 font-mono">
                                {p.model_number || 'NO-SKU'}
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Brand */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 whitespace-nowrap">
                          <span
                            className={`font-bold px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] uppercase ${
                              isBlueStar
                                ? 'bg-blue-50 text-blue-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {brandName}
                          </span>
                        </td>

                        {/* Category */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 text-slate-600 font-medium whitespace-nowrap text-[11px] sm:text-xs">
                          {p.category_name}
                        </td>

                        {/* Price */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 font-bold text-slate-900 whitespace-nowrap text-[11px] sm:text-xs">
                          {p.reference_price ? (
                            <>₹{p.reference_price.toLocaleString('en-IN')}</>
                          ) : (
                            <span className="text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px]">
                              On Quote
                            </span>
                          )}
                        </td>

                        {/* Availability Toggle Button */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(p)}
                            disabled={isUpdating}
                            className={`inline-flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-[10px] font-bold transition-all shadow-xs cursor-pointer ${
                              isAvailable
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                            }`}
                            title="Click to toggle availability on website"
                          >
                            {isUpdating ? (
                              <Loader2 className="w-3 h-3 animate-spin text-slate-500" />
                            ) : isAvailable ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span>In Stock</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                                <span>Not Available</span>
                              </>
                            )}
                          </button>
                        </td>

                        {/* Status */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 font-bold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full ${
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
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 font-mono text-slate-500 whitespace-nowrap text-[10px]">
                          v{p.current_version || 1}
                        </td>

                        {/* Actions */}
                        <td className="py-2 sm:py-2.5 px-2 sm:px-3.5 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            <Link
                              href={`/products/${p.id}/edit`}
                              className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </Link>

                            <button
                              type="button"
                              onClick={() => setSelectedVersionProduct(p)}
                              className="p-1 sm:p-1.5 rounded-lg text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                              title="Version History"
                            >
                              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                            </button>

                            {p.status !== ProductStatus.PUBLISHED ? (
                              <button
                                type="button"
                                onClick={() => handlePublish(p.id)}
                                className="p-1 sm:p-1.5 rounded-lg text-emerald-600 hover:bg-emerald-50 transition-colors"
                                title="Publish Product"
                              >
                                <Globe className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => handleArchive(p.id)}
                                className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                title="Archive Product"
                              >
                                <Archive className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
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
        </>
      )}

      {/* Version History Modal */}
      {selectedVersionProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 max-w-xl w-full shadow-2xl space-y-3 sm:space-y-4 max-h-[85vh] flex flex-col">
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
