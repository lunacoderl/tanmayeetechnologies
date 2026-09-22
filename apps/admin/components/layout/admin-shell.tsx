'use client';

// ============================================================================
// @tanmayee/admin — Admin Shell Component
// Fixed-sidebar viewport container providing persistent navigation layout
// ============================================================================

import React from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return <main className="min-h-screen bg-slate-900">{children}</main>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900 font-sans antialiased">
      {/* Fixed Persistent Sidebar */}
      <Sidebar />

      {/* Main Scrollable Content Area with offset for fixed sidebar */}
      <main className="flex-1 ml-64 min-h-screen overflow-x-hidden p-6 sm:p-10">
        {children}
      </main>
    </div>
  );
}
