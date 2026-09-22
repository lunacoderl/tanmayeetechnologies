'use client';

// ============================================================================
// @tanmayee/admin — B2B Quotations Manager (/quotations)
// ============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  CheckCircle2,
  Clock,
  XCircle,
  Phone,
  Building,
  MapPin,
  MessageCircle,
  Copy,
  FileText,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';
import { QuotationStatus } from '@tanmayee/config';

export default function AdminQuotationsPage() {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [selectedQuote, setSelectedQuote] = useState<any | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await adminFetch<{ data: any[] }>('/quotations');
        if (res.data) {
          setQuotations(res.data);
          if (res.data.length > 0 && !selectedQuote) {
            setSelectedQuote(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to fetch quotations:', err);
      }
    }
    loadData();
  }, []);

  const filteredQuotes = useMemo(() => {
    return quotations.filter((q) => {
      if (statusFilter !== 'ALL' && q.status !== statusFilter) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          q.quotation_number.toLowerCase().includes(query) ||
          (q.customer_name && q.customer_name.toLowerCase().includes(query)) ||
          (q.customer_company && q.customer_company.toLowerCase().includes(query)) ||
          (q.customer_phone && q.customer_phone.includes(query))
        );
      }
      return true;
    });
  }, [quotations, statusFilter, searchQuery]);

  const handleStatusChange = async (quoteId: string, newStatus: string) => {
    try {
      await adminFetch(`/quotations/${quoteId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // Mock fallback
    }
    setQuotations((prev) =>
      prev.map((q) => (q.id === quoteId ? { ...q, status: newStatus } : q))
    );
    if (selectedQuote?.id === quoteId) {
      setSelectedQuote((prev: any) => ({ ...prev, status: newStatus }));
    }
  };

  const copySummary = (quote: any) => {
    const summary = `Tanmayee Technologies Quotation: ${quote.quotation_number}\nClient: ${quote.customer_name} (${quote.customer_company || 'B2B'})\nTotal: ₹${quote.grand_total?.toLocaleString('en-IN')}\nStatus: ${quote.status}`;
    navigator.clipboard.writeText(summary);
    setCopiedId(quote.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACCEPTED':
      case 'CONVERTED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> {status}
          </span>
        );
      case 'SENT':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="w-3 h-3" /> SENT TO CLIENT
          </span>
        );
      case 'REJECTED':
      case 'EXPIRED':
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="w-3 h-3" /> {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3" /> GENERATED
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            B2B Quotations & RFQ Pipeline
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time tracking of generated B2B pricing quotes, customer procurement interest, and sales closures.
          </p>
        </div>
      </div>

      {/* Main Grid: List + Detail */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Quotation List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Search & Filter */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search quote #, company, or customer..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
              {['ALL', 'GENERATED', 'SENT', 'ACCEPTED', 'CONVERTED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] whitespace-nowrap transition-colors ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Quotations List Cards */}
          <div className="space-y-2.5">
            {filteredQuotes.map((q) => {
              const isSelected = selectedQuote?.id === q.id;
              return (
                <div
                  key={q.id}
                  onClick={() => setSelectedQuote(q)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brand-50/50 border-brand-500 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="font-mono text-xs font-bold text-slate-900">
                        {q.quotation_number}
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-1">
                        {q.customer_name}
                      </div>
                      {q.customer_company && (
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building className="w-3 h-3 text-slate-400" />
                          <span>{q.customer_company}</span>
                        </div>
                      )}
                    </div>
                    <div>{getStatusBadge(q.status)}</div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px]">
                      {new Date(q.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                    <span className="font-extrabold text-slate-900">
                      ₹{q.grand_total?.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredQuotes.length === 0 && (
              <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 text-xs space-y-1">
                <div className="font-bold text-slate-700">
                  {quotations.length === 0 ? 'No quotations submitted yet' : 'No matching quotations'}
                </div>
                <p className="text-[11px] text-slate-400">
                  {quotations.length === 0
                    ? 'When clients generate quotes on the website cart, they will appear here in real time.'
                    : 'Try clearing your search query or adjusting your status filter.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Selected Quotation Details */}
        <div className="lg:col-span-7">
          {selectedQuote ? (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-mono font-black text-lg text-slate-900">
                      {selectedQuote.quotation_number}
                    </h2>
                    {selectedQuote.is_bulk && (
                      <span className="bg-brand-100 text-brand-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                        BULK ORDER
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                    <span>Generated: {new Date(selectedQuote.created_at).toLocaleString()}</span>
                    <span>•</span>
                    <span className="text-amber-600 font-semibold">
                      Valid Until: {new Date(selectedQuote.valid_until).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedQuote.status}
                    onChange={(e) => handleStatusChange(selectedQuote.id, e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    <option value={QuotationStatus.GENERATED}>Status: GENERATED</option>
                    <option value={QuotationStatus.SUBMITTED}>Status: SUBMITTED</option>
                    <option value={QuotationStatus.VIEWED}>Status: VIEWED</option>
                    <option value={QuotationStatus.FOLLOWED_UP}>Status: FOLLOWED UP</option>
                    <option value={QuotationStatus.CONVERTED}>Status: CONVERTED</option>
                    <option value={QuotationStatus.EXPIRED}>Status: EXPIRED</option>
                  </select>

                  <button
                    onClick={() => copySummary(selectedQuote)}
                    className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                    title="Copy Summary"
                  >
                    {copiedId === selectedQuote.id ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Customer Info Card */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80">
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Client Procurement Profile
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Contact Person</span>
                    <span className="font-bold text-slate-900">{selectedQuote.customer_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Company / Entity</span>
                    <span className="font-bold text-slate-900">{selectedQuote.customer_company || 'Individual B2B'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Phone / Mobile</span>
                    <a
                      href={`tel:${selectedQuote.customer_phone}`}
                      className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                    >
                      <Phone className="w-3 h-3" /> {selectedQuote.customer_phone || 'N/A'}
                    </a>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Email</span>
                    <span className="font-medium text-slate-700">{selectedQuote.customer_email || 'N/A'}</span>
                  </div>
                  {selectedQuote.customer_location && (
                    <div className="sm:col-span-2">
                      <span className="text-slate-400 text-[11px] block">Delivery Location</span>
                      <span className="font-medium text-slate-700 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" /> {selectedQuote.customer_location}
                      </span>
                    </div>
                  )}
                </div>

                {/* Instant Actions for Sales Team */}
                {selectedQuote.customer_phone && (
                  <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                    <a
                      href={`https://wa.me/${selectedQuote.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedQuote.customer_name}, Tanmayee Technologies sales team here regarding your official quote ${selectedQuote.quotation_number} for ₹${selectedQuote.grand_total?.toLocaleString('en-IN')}. How may we assist with dispatch and site delivery?`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" /> Direct WhatsApp Chat
                    </a>
                    <a
                      href={`tel:${selectedQuote.customer_phone}`}
                      className="inline-flex items-center gap-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" /> Call Client
                    </a>
                  </div>
                )}
              </div>

              {/* Items Table */}
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Line Items & Frozen Snapshot Specifications
                </div>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                      <tr>
                        <th className="p-3">Product / Model</th>
                        <th className="p-3 text-center">Qty</th>
                        <th className="p-3 text-right">Unit MRP</th>
                        <th className="p-3 text-right">Disc %</th>
                        <th className="p-3 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedQuote.items?.map((item: any) => (
                        <tr key={item.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <div className="font-bold text-slate-900">{item.product_name}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              Model: {item.model_number || 'N/A'} • {item.brand_name}
                            </div>
                          </td>
                          <td className="p-3 text-center font-bold text-slate-800">
                            {item.quantity}
                          </td>
                          <td className="p-3 text-right text-slate-600 font-mono">
                            ₹{item.unit_price?.toLocaleString('en-IN')}
                          </td>
                          <td className="p-3 text-right text-emerald-600 font-bold">
                            {item.discount_percent}%
                          </td>
                          <td className="p-3 text-right font-extrabold text-slate-900 font-mono">
                            ₹{item.total_price?.toLocaleString('en-IN')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Services Breakdown */}
              {selectedQuote.services && selectedQuote.services.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Included Services & AMC Packages
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 text-xs">
                    {selectedQuote.services.map((s: any) => (
                      <div key={s.id} className="flex justify-between items-center">
                        <span className="font-semibold text-slate-800">{s.service_name}</span>
                        <span className="font-mono font-bold text-slate-900">
                          ₹{s.price?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Financial Totals */}
              <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Subtotal:</span>
                  <span className="font-mono">₹{selectedQuote.subtotal?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Bulk B2B Procurement Discount:</span>
                  <span className="font-mono">-₹{selectedQuote.discount_total?.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-base font-black border-t border-slate-800 pt-2 text-white">
                  <span>Final Authorized Quote:</span>
                  <span className="font-mono text-brand-400">
                    ₹{selectedQuote.grand_total?.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm text-slate-800">No Quotation Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {quotations.length === 0
                  ? 'Awaiting inbound client RFQs. Quotations generated by customers on the storefront will appear here with complete bill of materials.'
                  : 'Select a quotation from the list on the left to inspect customer details, itemised models, and update status.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
