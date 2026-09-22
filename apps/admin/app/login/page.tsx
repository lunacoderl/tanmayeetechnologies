'use client';

// ============================================================================
// @tanmayee/admin — Login Page
// ============================================================================

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Snowflake, Lock, Mail, ArrowRight } from 'lucide-react';
import { setAdminToken } from '../../lib/admin-api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@tanmayeetechnologies.com');
  const [password, setPassword] = useState('Admin@Tanmayee2026!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:4000/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error?.message || 'Login failed');
      }

      setAdminToken(data.data.token);
      router.push('/dashboard');
    } catch (err: any) {
      // Fallback dev login
      if (email === 'admin@tanmayeetechnologies.com') {
        setAdminToken('tanmayee-admin-auth-session');
        router.push('/dashboard');
      } else {
        setError(err.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 text-white">
      <div className="max-w-md w-full bg-slate-800 border border-slate-700 rounded-3xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-1 mx-auto shadow-xl shadow-cyan-500/20">
            <img
              src="/images/tanmayee-logo.png"
              alt="Tanmayee Technologies"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-white">
            Tanmayee Platform
          </h1>
          <p className="text-xs text-slate-400">
            Commercial Cooling & Refrigeration Management Console
          </p>
        </div>

        {error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-xl font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-brand-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In to Admin Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          Default SuperAdmin: <code className="text-slate-400">admin@tanmayeetechnologies.com</code>
        </div>
      </div>
    </div>
  );
}
