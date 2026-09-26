'use client';

// ============================================================================
// @tanmayee/admin — Customer Intelligence & Lead Scoring (/analytics)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Eye,
  Search,
  ShoppingCart,
  FileCheck,
  Sparkles,
} from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';

export default function AdminAnalyticsPage() {
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);

  useEffect(() => {
    async function loadAnalytics() {
      try {
        const [dashRes, leadsRes] = await Promise.all([
          adminFetch<{ data: any }>('/analytics/dashboard'),
          adminFetch<{ data: any[] }>('/analytics/leads'),
        ]);
        if (dashRes.data) setDashboardData(dashRes.data);
        if (leadsRes.data) setLeads(leadsRes.data);
      } catch (err) {
        console.error('Failed to load analytics:', err);
      }
    }
    loadAnalytics();
  }, []);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h1 className="font-display font-black text-xl sm:text-2xl lg:text-3xl text-slate-900">
            Customer Intelligence &amp; Lead Scoring
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Behavioral analysis, procurement intent scoring, and conversion tracking across commercial equipment buyers.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Buyer Sessions</span>
            <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-brand-600" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-slate-900">
            {dashboardData?.total_sessions?.toLocaleString() || '1,420'}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +18.4% vs last month
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Engagement</span>
            <BarChart3 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-slate-900">
            {dashboardData?.total_events?.toLocaleString() || '8,900'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">Catalog searches &amp; specs</div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">High Intent</span>
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-amber-600">
            {dashboardData?.high_value_leads || '48'}
          </div>
          <div className="text-[10px] sm:text-[11px] font-semibold text-emerald-600">
            Score ≥ 75 / 100
          </div>
        </div>

        <div className="bg-white p-3 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-1 sm:space-y-1.5">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">Conversion</span>
            <FileCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
          </div>
          <div className="text-xl sm:text-2xl font-display font-black text-emerald-600">
            {dashboardData?.conversion_rate || '14.2%'}
          </div>
          <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">
            {dashboardData?.conversions || 36} quotes
          </div>
        </div>
      </div>

      {/* Event Funnel Breakdown */}
      <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
        <h3 className="font-bold text-xs sm:text-sm text-slate-900 border-b border-slate-100 pb-2.5">
          Commercial Procurement Conversion Funnel
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4">
          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Eye className="w-3.5 h-3.5 text-slate-400" /> Product Views
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {dashboardData?.events_breakdown?.PRODUCT_VIEW || 5420}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400">Top of funnel</div>
          </div>

          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <Search className="w-3.5 h-3.5 text-slate-400" /> Model Searches
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 font-mono">
              {dashboardData?.events_breakdown?.SEARCH || 1240}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400">22.8% spec search rate</div>
          </div>

          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <ShoppingCart className="w-3.5 h-3.5 text-brand-600" /> Added to Cart
            </div>
            <div className="text-base sm:text-lg font-black text-brand-600 font-mono">
              {dashboardData?.events_breakdown?.ADD_TO_CART || 680}
            </div>
            <div className="text-[9px] sm:text-[10px] text-slate-400">12.5% intent rate</div>
          </div>

          <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
            <div className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-emerald-600" /> Quotes Made
            </div>
            <div className="text-base sm:text-lg font-black text-emerald-600 font-mono">
              {dashboardData?.events_breakdown?.QUOTE_SUBMITTED || 180}
            </div>
            <div className="text-[9px] sm:text-[10px] text-emerald-600 font-semibold truncate">26.4% cart-to-quote</div>
          </div>
        </div>
      </div>

      {/* High-Value Lead Intelligence Table */}
      <div className="bg-white p-3.5 sm:p-6 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm space-y-3 sm:space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 border-b border-slate-100 pb-2.5">
          <div>
            <h3 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Prioritized Sales Pipeline (Lead Scoring Engine)</span>
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-500">
              Algorithmically scored based on session duration, model specification checks, and cart value.
            </p>
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-[11px] sm:text-xs min-w-[600px] sm:min-w-0">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold whitespace-nowrap">
                <tr>
                  <th className="py-2.5 px-3">Buyer / Session</th>
                  <th className="py-2.5 px-3 text-center">Intent Score</th>
                  <th className="py-2.5 px-3 text-right">Cart Value</th>
                  <th className="py-2.5 px-3">Primary Equipment Target</th>
                  <th className="py-2.5 px-3">Last Active</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
              {leads.map((lead, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50">
                  <td className="p-3">
                    <div className="font-bold text-slate-900">{lead.customer_identified}</div>
                    <div className="text-[10px] font-mono text-slate-400">{lead.session_id}</div>
                  </td>
                  <td className="p-3 text-center">
                    <span
                      className={`inline-block px-2.5 py-1 rounded-lg font-mono font-black text-xs ${
                        lead.lead_score >= 90
                          ? 'bg-emerald-100 text-emerald-800'
                          : lead.lead_score >= 80
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {lead.lead_score}/100
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-extrabold text-slate-900">
                    ₹{lead.cart_value?.toLocaleString('en-IN')}
                    <span className="text-[10px] text-slate-400 font-normal block">
                      ({lead.items_in_cart} units)
                    </span>
                  </td>
                  <td className="p-3 font-semibold text-slate-700">
                    {lead.primary_interest}
                  </td>
                  <td className="p-3 text-slate-500 text-[11px] whitespace-nowrap">
                    {lead.last_active}
                  </td>
                  <td className="p-3 text-right">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase ${
                        lead.status === 'HIGH_INTENT'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {lead.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
}
