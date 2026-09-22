'use client';

// ============================================================================
// @tanmayee/admin — Sidebar Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  FileText,
  Wrench,
  Layers,
  Award,
  Tag,
  BarChart3,
  Globe,
  History,
  LogOut,
  ExternalLink,
  Snowflake,
} from 'lucide-react';
import { clearAdminToken } from '../../lib/admin-api';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Product Catalogue', href: '/products', icon: Package },
  { name: 'Quotations & B2B', href: '/quotations', icon: FileText },
  { name: 'Services & AMC Leads', href: '/services', icon: Wrench },
  { name: 'Categories & Filters', href: '/categories', icon: Layers },
  { name: 'Brands', href: '/brands', icon: Award },
  { name: 'Offers & Bulk Rules', href: '/offers', icon: Tag },
  { name: 'Customer Intelligence', href: '/analytics', icon: BarChart3 },
  { name: 'Publish Engine', href: '/publishing', icon: Globe },
  { name: 'Audit Logs', href: '/audit-logs', icon: History },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show sidebar
  if (pathname === '/login') return null;

  const handleLogout = () => {
    clearAdminToken();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between shrink-0 min-h-screen border-r border-slate-800">
      <div>
        {/* Official Logo */}
        <div className="p-5 border-b border-slate-800/80 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-0.5 shrink-0 shadow-lg shadow-cyan-500/20">
            <img
              src="/images/tanmayee-logo.png"
              alt="Tanmayee Technologies"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <div>
            <div className="font-display font-extrabold text-white text-sm tracking-tight leading-none">
              TANMAYEE
            </div>
            <div className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase mt-1">
              Admin CMS & Desk
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1.5 text-xs font-semibold">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer Info & Logout */}
      <div className="p-4 border-t border-slate-800/80 space-y-2">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <span className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-emerald-400" /> View Public Site
          </span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>

        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
