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
  X,
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

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // If on login page, don't show sidebar
  if (pathname === '/login') return null;

  const handleLogout = () => {
    clearAdminToken();
    router.push('/login');
    if (onClose) onClose();
  };

  const handleNavClick = () => {
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          aria-label="Close navigation"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Escape' || e.key === 'Enter') onClose?.();
          }}
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden transition-opacity animate-fade-in"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 max-w-[85vw] h-screen bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 overflow-y-auto shrink-0 select-none shadow-2xl transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Official Logo & Mobile Close Button */}
          <div className="p-4 sm:p-5 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-0.5 shrink-0 shadow-lg shadow-cyan-500/20">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-display font-extrabold text-white text-xs sm:text-sm tracking-tight leading-none">
                  TANMAYEE
                </div>
                <div className="text-[9px] font-bold text-cyan-400 tracking-wider uppercase mt-1">
                  Admin CMS & Desk
                </div>
              </div>
            </div>

            {/* Close button on mobile */}
            <button
              type="button"
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Close Navigation"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 sm:p-4 space-y-1 text-xs font-semibold">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className={`flex items-center gap-2.5 px-3 py-2 sm:py-2.5 rounded-xl transition-colors text-xs ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-sm font-bold'
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
        <div className="p-3 sm:p-4 border-t border-slate-800/80 space-y-1.5">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleNavClick}
            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <span className="flex items-center gap-2 text-[11px] sm:text-xs">
              <Globe className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> Public Site
            </span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </a>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
