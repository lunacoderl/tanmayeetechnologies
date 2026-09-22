'use client';

// ============================================================================
// @tanmayee/admin — Offers & Bulk Procurement Rules Studio (/offers)
// Full CRUD: Add, Edit, Delete, Toggle Status, Permanent & Time-Limited Rules
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  Calendar,
  Zap,
  Plus,
  Edit2,
  Trash2,
  Tag,
  Clock,
  Infinity,
  AlertCircle,
  X,
  Check,
  Search,
  Percent,
  Layers,
  Sparkles,
  SlidersHorizontal,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';
import { CommercialOffer } from '@tanmayee/database';

interface OfferFormData {
  id?: string;
  name: string;
  code: string;
  description: string;
  discount_type: 'PERCENTAGE' | 'FLAT';
  discount_value: number;
  min_quantity: number;
  max_quantity: number | '';
  min_order_value: number | '';
  applicable_scope: CommercialOffer['applicable_scope'];
  is_permanent: boolean;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const DEFAULT_FORM: OfferFormData = {
  name: '',
  code: '',
  description: '',
  discount_type: 'PERCENTAGE',
  discount_value: 10,
  min_quantity: 1,
  max_quantity: '',
  min_order_value: '',
  applicable_scope: 'ALL_PRODUCTS',
  is_permanent: false,
  start_date: new Date().toISOString().split('T')[0],
  end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  is_active: true,
};

export default function AdminOffersPage() {
  const [offers, setOffers] = useState<CommercialOffer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [scopeFilter, setScopeFilter] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
  const [formData, setFormData] = useState<OfferFormData>(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete confirmation
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setIsLoading(true);
      const res = await adminFetch<{ data: CommercialOffer[] }>('/offers');
      if (res.data) {
        setOffers(res.data);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const handleOpenAdd = () => {
    setEditingOfferId(null);
    setFormData(DEFAULT_FORM);
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (offer: CommercialOffer) => {
    setEditingOfferId(offer.id);
    setFormData({
      id: offer.id,
      name: offer.name,
      code: offer.code,
      description: offer.description,
      discount_type: offer.discount_type,
      discount_value: offer.discount_value,
      min_quantity: offer.min_quantity || 1,
      max_quantity: offer.max_quantity ?? '',
      min_order_value: offer.min_order_value ?? '',
      applicable_scope: offer.applicable_scope,
      is_permanent: offer.is_permanent,
      start_date: offer.start_date ? offer.start_date.split('T')[0] : '',
      end_date: offer.end_date ? offer.end_date.split('T')[0] : '',
      is_active: offer.is_active,
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (offer: CommercialOffer) => {
    try {
      const updated = { ...offer, is_active: !offer.is_active };
      await adminFetch('/offers', {
        method: 'PUT',
        body: JSON.stringify(updated),
      });
      setOffers((prev) => prev.map((o) => (o.id === offer.id ? updated : o)));
      showToast(`Offer ${offer.code} is now ${updated.is_active ? 'ACTIVE' : 'INACTIVE'}`);
    } catch {
      showToast('Error toggling status');
    }
  };

  const handleDeleteOffer = async (id: string) => {
    try {
      await adminFetch(`/offers/${id}`, { method: 'DELETE' });
      setOffers((prev) => prev.filter((o) => o.id !== id));
      setDeleteConfirmId(null);
      showToast('Offer deleted successfully!');
    } catch {
      showToast('Failed to delete offer');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim()) {
      setFormError('Offer Name and Code are required.');
      return;
    }
    if (formData.discount_value <= 0) {
      setFormError('Discount value must be greater than 0.');
      return;
    }
    if (!formData.is_permanent && !formData.end_date) {
      setFormError('Please provide an end date or select Permanent Offer.');
      return;
    }

    const payload: CommercialOffer = {
      id: editingOfferId || `off-${Date.now()}`,
      name: formData.name.trim(),
      code: formData.code.trim().toUpperCase(),
      description: formData.description.trim(),
      discount_type: formData.discount_type,
      discount_value: Number(formData.discount_value),
      min_quantity: Number(formData.min_quantity) || 1,
      max_quantity: formData.max_quantity !== '' ? Number(formData.max_quantity) : null,
      min_order_value: formData.min_order_value !== '' ? Number(formData.min_order_value) : null,
      applicable_scope: formData.applicable_scope,
      is_permanent: formData.is_permanent,
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : new Date().toISOString(),
      end_date: formData.is_permanent || !formData.end_date ? null : new Date(formData.end_date + 'T23:59:59Z').toISOString(),
      is_active: formData.is_active,
      created_at: new Date().toISOString(),
    };

    try {
      if (editingOfferId) {
        await adminFetch('/offers', {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setOffers((prev) => prev.map((o) => (o.id === editingOfferId ? payload : o)));
        showToast(`Offer ${payload.code} updated successfully!`);
      } else {
        await adminFetch('/offers', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setOffers((prev) => [payload, ...prev]);
        showToast(`New Offer ${payload.code} created successfully!`);
      }
      setIsModalOpen(false);
    } catch {
      setFormError('Failed to save offer. Please try again.');
    }
  };

  // Filtered list
  const filteredOffers = offers.filter((o) => {
    if (scopeFilter !== 'ALL' && o.applicable_scope !== scopeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.name.toLowerCase().includes(q) ||
        o.code.toLowerCase().includes(q) ||
        o.description.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const activeCount = offers.filter((o) => o.is_active).length;
  const permanentCount = offers.filter((o) => o.is_permanent).length;
  const timeLimitedCount = offers.filter((o) => !o.is_permanent).length;

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-cyan-600 uppercase tracking-wider">
            Commercial Promotions & B2B Rules
          </span>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Offers & Discount Rules Studio
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage volume pricing tiers, seasonal discount campaigns, and permanent B2B partner incentives.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold text-xs py-3 px-5 rounded-2xl shadow-md shadow-blue-500/25 transition-all hover:scale-102 active:scale-98"
        >
          <Plus className="w-4 h-4" />
          <span>+ Create New Offer</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-sm space-y-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Rules</span>
          <div className="font-display font-black text-2xl sm:text-3xl text-slate-900">{offers.length}</div>
          <div className="text-[11px] text-slate-500 font-medium">Configured in system</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-emerald-200/80 bg-emerald-50/20 shadow-sm space-y-1">
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Active Offers</span>
          <div className="font-display font-black text-2xl sm:text-3xl text-emerald-700">{activeCount}</div>
          <div className="text-[11px] text-emerald-600 font-medium">Currently applying</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-indigo-200/80 bg-indigo-50/20 shadow-sm space-y-1">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Permanent Offers</span>
          <div className="font-display font-black text-2xl sm:text-3xl text-indigo-700">{permanentCount}</div>
          <div className="text-[11px] text-indigo-600 font-medium">No expiry date</div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-amber-200/80 bg-amber-50/20 shadow-sm space-y-1">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Time-Limited</span>
          <div className="font-display font-black text-2xl sm:text-3xl text-amber-700">{timeLimitedCount}</div>
          <div className="text-[11px] text-amber-600 font-medium">Date-constrained campaigns</div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, title, or terms..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-cyan-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          <select
            value={scopeFilter}
            onChange={(e) => setScopeFilter(e.target.value)}
            className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl focus:outline-none focus:border-cyan-500 font-semibold text-slate-700"
          >
            <option value="ALL">All Applicable Scopes</option>
            <option value="ALL_PRODUCTS">All Products</option>
            <option value="ROCKWELL_ONLY">Rockwell Only</option>
            <option value="BLUE_STAR_ONLY">Blue Star Only</option>
            <option value="FREEZERS_ONLY">Freezers Only</option>
            <option value="VISI_COOLERS_ONLY">Visi Coolers Only</option>
            <option value="WATER_COOLERS_ONLY">Water Coolers Only</option>
          </select>
        </div>
      </div>

      {/* Offers Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOffers.map((offer) => {
          const isExpired =
            !offer.is_permanent && offer.end_date && new Date(offer.end_date) < new Date();

          return (
            <div
              key={offer.id}
              className={`bg-white rounded-3xl border transition-all duration-300 p-6 shadow-sm flex flex-col justify-between relative overflow-hidden group ${
                !offer.is_active
                  ? 'border-slate-200 opacity-60 bg-slate-50/50'
                  : 'border-slate-200/90 hover:border-cyan-400 hover:shadow-xl'
              }`}
            >
              <div className="space-y-4">
                {/* Header: Code + Status Badge */}
                <div className="flex items-start justify-between">
                  <span className="font-mono text-xs font-black text-cyan-800 bg-cyan-50 border border-cyan-200 px-3 py-1 rounded-xl shadow-xs">
                    {offer.code}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {/* Time limit tag */}
                    {offer.is_permanent ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                        <Infinity className="w-3 h-3" /> Permanent
                      </span>
                    ) : (
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                          isExpired
                            ? 'text-red-700 bg-red-50 border-red-200'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        <Clock className="w-3 h-3" />
                        {isExpired ? 'Expired' : 'Time-Limited'}
                      </span>
                    )}

                    {/* Active toggle switch */}
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(offer)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md border transition-colors ${
                        offer.is_active
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                          : 'bg-slate-100 text-slate-500 border-slate-300 hover:bg-slate-200'
                      }`}
                    >
                      {offer.is_active ? 'ACTIVE' : 'INACTIVE'}
                    </button>
                  </div>
                </div>

                {/* Offer Name & Description */}
                <div>
                  <h3 className="font-extrabold text-base text-slate-900 leading-snug">
                    {offer.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {offer.description}
                  </p>
                </div>

                {/* Offer Parameters Card */}
                <div className="p-4 bg-gradient-to-br from-slate-50 to-slate-100/60 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 font-medium">Discount Value:</span>
                    <span className="text-xl font-black text-emerald-600 font-display">
                      {offer.discount_type === 'PERCENTAGE'
                        ? `${offer.discount_value}% OFF`
                        : `₹${offer.discount_value.toLocaleString('en-IN')} FLAT`}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-slate-700 font-semibold border-t border-slate-200/60 pt-2">
                    <span className="text-slate-500 font-normal">Bracket / Quantity:</span>
                    <span className="font-bold text-slate-900">
                      {offer.min_quantity} {offer.max_quantity ? `to ${offer.max_quantity}` : '+'} units
                    </span>
                  </div>

                  {offer.min_order_value && (
                    <div className="flex justify-between items-center text-slate-700 font-semibold">
                      <span className="text-slate-500 font-normal">Min. Order Value:</span>
                      <span className="font-bold text-slate-900">
                        ₹{offer.min_order_value.toLocaleString('en-IN')}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center text-slate-500 text-[11px] border-t border-slate-200/60 pt-2">
                    <span>Scope:</span>
                    <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                      {offer.applicable_scope}
                    </span>
                  </div>
                </div>

                {/* Date Window */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {offer.is_permanent ? (
                    <span className="text-slate-600 font-semibold">
                      Permanent Ongoing Offer (Always Applied)
                    </span>
                  ) : (
                    <span>
                      Valid: <strong>{offer.start_date.split('T')[0]}</strong> →{' '}
                      <strong>{offer.end_date ? offer.end_date.split('T')[0] : 'Open'}</strong>
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons: Edit & Delete */}
              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(offer)}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-900 bg-cyan-50 hover:bg-cyan-100/80 px-3 py-1.5 rounded-xl transition-colors border border-cyan-200/80"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Rule</span>
                </button>

                {deleteConfirmId === offer.id ? (
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleDeleteOffer(offer.id)}
                      className="text-xs font-bold text-white bg-red-600 hover:bg-red-700 px-2.5 py-1 rounded-lg transition-colors"
                    >
                      Confirm Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmId(null)}
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2 py-1"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(offer.id)}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-800 p-1.5 rounded-lg hover:bg-red-50 transition-colors"
                    title="Delete offer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Add / Edit Offer */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 w-full max-w-xl p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="font-display font-black text-xl text-slate-900">
                  {editingOfferId ? 'Edit Offer & Discount Rule' : 'Create New Offer Rule'}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Configure discount amounts, minimum quantities, product scopes, and expiration dates.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-semibold rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Row 1: Name and Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Offer / Campaign Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Festival Volume Rebate"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Promo Code (Uppercase) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    placeholder="e.g. VIZAGFEST10"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-xs font-mono font-bold"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Description & Customer Terms *
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Explains who qualifies and what discount is applied..."
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-xs"
                />
              </div>

              {/* Row 2: Discount Type and Discount Value */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discount_type}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_type: e.target.value as any })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-xs font-semibold"
                  >
                    <option value="PERCENTAGE">Percentage (% Discount)</option>
                    <option value="FLAT">Flat Amount (₹ Off Total)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Discount Value ({formData.discount_type === 'PERCENTAGE' ? '%' : '₹'}) *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.discount_value}
                    onChange={(e) =>
                      setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="10"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-xs font-bold"
                  />
                </div>
              </div>

              {/* Row 3: Applicable Scope */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Applicable Product Scope *
                </label>
                <select
                  value={formData.applicable_scope}
                  onChange={(e) =>
                    setFormData({ ...formData, applicable_scope: e.target.value as any })
                  }
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-cyan-500 focus:bg-white text-xs font-semibold"
                >
                  <option value="ALL_PRODUCTS">All Products (Universal Catalog)</option>
                  <option value="ROCKWELL_ONLY">Rockwell Commercial Refrigeration Only</option>
                  <option value="BLUE_STAR_ONLY">Blue Star Air Conditioning Only</option>
                  <option value="FREEZERS_ONLY">Commercial Freezers (Green & Hard Top) Only</option>
                  <option value="VISI_COOLERS_ONLY">Visi Display Coolers Only</option>
                  <option value="WATER_COOLERS_ONLY">Stainless Steel Water Coolers Only</option>
                </select>
              </div>

              {/* Row 4: Quantity Bracket & Min Order Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Min. Quantity (Units)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.min_quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, min_quantity: parseInt(e.target.value, 10) || 1 })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Max. Quantity (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_quantity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        max_quantity: e.target.value ? parseInt(e.target.value, 10) : '',
                      })
                    }
                    placeholder="No upper limit"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Min. Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.min_order_value}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        min_order_value: e.target.value ? parseFloat(e.target.value) : '',
                      })
                    }
                    placeholder="Optional ₹"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>
              </div>

              {/* Row 5: Permanent Offer vs. Time-Limited Expiration */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Infinity className="w-4 h-4 text-indigo-600" />
                      Permanent Offer
                    </span>
                    <p className="text-[11px] text-slate-500">
                      Does this offer stay active indefinitely without an expiration date?
                    </p>
                  </div>

                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_permanent}
                      onChange={(e) =>
                        setFormData({ ...formData, is_permanent: e.target.checked })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* If Not Permanent, Show Date Range Inputs */}
                {!formData.is_permanent && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-200">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        required={!formData.is_permanent}
                        value={formData.start_date}
                        onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">
                        End Date (Expiration) *
                      </label>
                      <input
                        type="date"
                        required={!formData.is_permanent}
                        value={formData.end_date}
                        onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                        className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Row 6: Active Toggle */}
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="font-bold text-slate-800">Set Offer as Active Immediately</span>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 text-cyan-600 rounded border-slate-300 focus:ring-cyan-500"
                />
              </div>

              {/* Form Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold shadow-md transition-all active:scale-98"
                >
                  {editingOfferId ? 'Save Changes' : 'Create Offer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
