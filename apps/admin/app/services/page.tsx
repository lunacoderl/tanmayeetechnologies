'use client';

// ============================================================================
// @tanmayee/admin — Services & AMC Leads Manager (/services)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  Search,
  Phone,
  MessageCircle,
  ShieldCheck,
  Wrench,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';
import { SEED_SERVICES } from '@tanmayee/database';

export default function AdminServicesPage() {
  const [activeTab, setActiveTab] = useState<'requests' | 'catalogue'>('requests');
  const [requests, setRequests] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>(SEED_SERVICES);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const reqRes = await adminFetch<{ data: any[] }>('/service-requests');
        if (reqRes.data) setRequests(reqRes.data);

        const srvRes = await adminFetch<{ data: any[] }>('/services');
        if (srvRes.data) setServices(srvRes.data);
      } catch (err) {
        console.error('Failed to load service data:', err);
      }
    }
    loadData();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await adminFetch(`/service-requests/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (e) {
      // Mock fallback
    }
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const filteredRequests = requests.filter((r) => {
    if (statusFilter !== 'ALL' && r.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.request_number.toLowerCase().includes(q) ||
        r.customer_name.toLowerCase().includes(q) ||
        (r.customer_company && r.customer_company.toLowerCase().includes(q)) ||
        r.service_name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Services & AMC Management
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Monitor client maintenance requests, AMC proposals, and service technician deployments.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'requests'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Customer Service Inquiries ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('catalogue')}
            className={`px-3.5 py-1.5 rounded-lg transition-colors ${
              activeTab === 'catalogue'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            AMC & Service Offerings ({services.length})
          </button>
        </div>
      </div>

      {activeTab === 'requests' ? (
        <div className="space-y-4">
          {/* Search & Filter Toolbar */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client, request ID, or service..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
              {['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-xl transition-colors ${
                    statusFilter === st
                      ? 'bg-brand-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Service Requests Table / Cards */}
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div
                key={req.id}
                className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
              >
                <div className="space-y-2 lg:max-w-2xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-brand-600 bg-brand-50 px-2.5 py-0.5 rounded-md border border-brand-100">
                      {req.request_number}
                    </span>
                    <span className="text-xs font-extrabold text-slate-900">
                      {req.service_name}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        req.status === 'COMPLETED'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : req.status === 'IN_PROGRESS'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {req.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Customer / Entity</span>
                      <span className="font-bold text-slate-800">
                        {req.customer_name}{' '}
                        {req.customer_company && (
                          <span className="text-slate-500 font-normal">({req.customer_company})</span>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-400 block text-[10px]">Contact Phone</span>
                      <a
                        href={`tel:${req.customer_phone}`}
                        className="font-bold text-brand-600 hover:underline flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" /> {req.customer_phone}
                      </a>
                    </div>
                  </div>

                  {req.equipment_details && (
                    <div className="text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-slate-700">
                      <span className="font-bold text-slate-900 block text-[10px] uppercase tracking-wider mb-0.5">
                        Target Equipment Specs
                      </span>
                      {req.equipment_details}
                    </div>
                  )}

                  {req.notes && (
                    <p className="text-xs text-slate-500 italic">
                      &ldquo;{req.notes}&rdquo;
                    </p>
                  )}
                </div>

                {/* Status Updater & WhatsApp Contact */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end gap-2 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusUpdate(req.id, e.target.value)}
                    className="text-xs font-bold bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 focus:outline-none focus:border-brand-500"
                  >
                    <option value="PENDING">Status: PENDING</option>
                    <option value="IN_PROGRESS">Status: IN PROGRESS</option>
                    <option value="COMPLETED">Status: COMPLETED</option>
                    <option value="CANCELLED">Status: CANCELLED</option>
                  </select>

                  <a
                    href={`https://wa.me/${req.customer_phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                      `Hello ${req.customer_name}, this is Tanmayee Technologies Service Support regarding your request ${req.request_number} (${req.service_name}). We are ready to schedule our certified HVAC technician.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow-sm transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" /> Dispatch via WhatsApp
                  </a>
                </div>
              </div>
            ))}

            {filteredRequests.length === 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-600 flex items-center justify-center mx-auto">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-sm text-slate-900">
                  {requests.length === 0 ? 'No Service Inquiries Yet' : 'No Matching Requests'}
                </h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  {requests.length === 0
                    ? 'No AMC or breakdown repair requests have been submitted yet. Inquiries submitted by clients on the Services page will appear here with instant WhatsApp dispatch.'
                    : 'No requests match your current search query or status filter.'}
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Catalogue tab: list of Tanmayee core services */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {services.map((srv) => (
            <div
              key={srv.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{srv.name}</h3>
                  <span className="text-[10px] font-mono text-slate-400">/{srv.slug}</span>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg">
                  {srv.base_price ? `From ₹${srv.base_price}` : 'On Request'}
                </span>
              </div>
              <p className="text-xs text-slate-500">{srv.description}</p>
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold">
                <ShieldCheck className="w-4 h-4 text-brand-600" />
                <span>Authorized Blue Star & Rockwell Certified Engineers</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
