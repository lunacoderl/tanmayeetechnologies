'use client';

// ============================================================================
// @tanmayee/admin — Admin Shell Component
// Fixed-sidebar viewport container providing persistent navigation layout
// ============================================================================

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Menu, Globe, ExternalLink } from 'lucide-react';
import { Sidebar } from './sidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const isLoginPage = pathname === '/login';

  // Prevent background body scrolling when mobile drawer is open
  React.useEffect(() => {
    if (isMobileSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileSidebarOpen]);

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans antialiased flex flex-col lg:flex-row">
      {/* Mobile Top Navigation Bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-30 h-14 bg-slate-900 border-b border-slate-800 px-3.5 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Open Navigation Menu"
          >
            <Menu className="w-5 h-5 text-cyan-400" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full overflow-hidden border border-cyan-400 bg-white p-0.5 shrink-0">
              <img
                src="/images/tanmayee-logo.png"
                alt="Tanmayee Technologies"
                className="w-full h-full object-contain rounded-full"
              />
            </div>
            <span className="font-display font-extrabold text-white text-xs tracking-tight">
              TANMAYEE ADMIN
            </span>
          </div>
        </div>

        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold text-cyan-400 bg-cyan-950/40 border border-cyan-500/30 hover:bg-cyan-900/50 transition-colors"
        >
          <Globe className="w-3 h-3" />
          <span>Public</span>
        </a>
      </header>

      {/* Persistent / Drawer Sidebar */}
      <Sidebar
        isOpen={isMobileSidebarOpen}
        onClose={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main Scrollable Content Area */}
      <main className="flex-1 w-full lg:ml-64 min-h-screen overflow-x-hidden pt-16 lg:pt-0 p-3 sm:p-6 lg:p-8 transition-all">
        {children}
      </main>
    </div>
  );
}
