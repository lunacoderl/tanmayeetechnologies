'use client';

// ============================================================================
// @tanmayee/admin — Security & Audit Logs (/audit-logs)
// ============================================================================

import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { adminFetch } from '../../lib/admin-api';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  useEffect(() => {
    async function loadLogs() {
      try {
        const res = await adminFetch<{ data: any[] }>('/audit-logs');
        if (res.data) setLogs(res.data);
      } catch (err) {
        console.error('Failed to load audit logs:', err);
      }
    }
    loadLogs();
  }, []);

  const filteredLogs = logs.filter((l) => {
    if (actionFilter !== 'ALL' && l.action !== actionFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        l.action.toLowerCase().includes(q) ||
        l.user_email.toLowerCase().includes(q) ||
        l.details.toLowerCase().includes(q) ||
        l.entity_type.toLowerCase().includes(q)
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
            Administrative Audit Trail & Security
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Immutable log of all catalogue modifications, quotation status updates, and administrative logins.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search audit actions, user, or details..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 text-xs font-bold">
          {['ALL', 'PUBLISH_CATALOG_SNAPSHOT', 'UPDATE_QUOTATION_STATUS', 'UPDATE_PRODUCT_PRICE'].map(
            (act) => (
              <button
                key={act}
                onClick={() => setActionFilter(act)}
                className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                  actionFilter === act
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {act.replace(/_/g, ' ')}
              </button>
            )
          )}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
            <tr>
              <th className="p-3.5">Action Event</th>
              <th className="p-3.5">Entity / Scope</th>
              <th className="p-3.5">Operator</th>
              <th className="p-3.5">Audit Details</th>
              <th className="p-3.5 text-right">Timestamp</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-50/60">
                <td className="p-3.5">
                  <span className="font-mono font-bold text-xs text-brand-700 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
                    {log.action}
                  </span>
                </td>
                <td className="p-3.5">
                  <span className="text-slate-800 font-semibold capitalize">
                    {log.entity_type}
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono block">
                    {log.entity_id}
                  </span>
                </td>
                <td className="p-3.5 text-slate-700 font-medium">
                  {log.user_email}
                </td>
                <td className="p-3.5 text-slate-600 max-w-md">
                  {log.details}
                </td>
                <td className="p-3.5 text-right font-mono text-slate-400 whitespace-nowrap">
                  {new Date(log.created_at).toLocaleString('en-IN', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-slate-400 text-xs">
            No audit records found matching criteria.
          </div>
        )}
      </div>
    </div>
  );
}
