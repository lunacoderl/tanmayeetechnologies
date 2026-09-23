import React from 'react';
import type { Metadata } from 'next';
import { ShieldCheck, Lock, Eye, CheckCircle2 } from 'lucide-react';
import { COMPANY } from '@tanmayee/config';

export const metadata: Metadata = {
  title: 'Privacy Policy | Tanmayee Technologies',
  description:
    'Privacy Policy and data protection commitments under the Digital Personal Data Protection (DPDP) Act of India for Tanmayee Technologies Visakhapatnam.',
};

export default function PrivacyPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs font-bold">
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
            <span>Digital Data Protection &amp; Confidentiality</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Privacy &amp; Data Protection Policy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compliant with the Digital Personal Data Protection Act (DPDP), 2023 &amp; Information Technology Act of India
          </p>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900">
              1. Information We Collect
            </h2>
            <p>
              When you interact with <strong>Tanmayee Technologies</strong> (requesting quotations, booking HVAC site surveys, or contacting our engineers via WhatsApp), we may collect the following information:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li><strong>Contact Particulars:</strong> Name, business designation, corporate entity name, telephone/WhatsApp contact number, and billing email.</li>
              <li><strong>Project Logistics:</strong> Delivery address, site constraints, tonnage requirements, and electrical phase configurations.</li>
              <li><strong>Browsing Preferences:</strong> Equipment categories viewed, comparison selections, and search terms stored locally within your browser (localStorage) to customize product recommendations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900">
              2. How Your Information is Used
            </h2>
            <p>
              Data collected is strictly used for legitimate commercial B2B procurement purposes:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Stamped Quotation Generation
                </div>
                <p className="text-xs text-slate-500">Formatting itemized equipment estimates, GST discounts, and warranty certificates.</p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1">
                <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> WhatsApp Engineering Dispatch
                </div>
                <p className="text-xs text-slate-500">Instant direct coordination with factory-trained technicians in Visakhapatnam.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900">
              3. Zero Third-Party Monetization
            </h2>
            <p>
              Tanmayee Technologies does <strong>not sell, rent, or lease</strong> customer telephone numbers, emails, or project records to marketing brokers or third-party data aggregators. Data is shared solely with authorized OEM logistics (Blue Star Limited / Rockwell Industries) to fulfill equipment delivery and warranty registration.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900">
              4. Data Security &amp; Retention
            </h2>
            <p>
              We implement enterprise-grade Transport Layer Security (TLS 1.3), encrypted database connections, and restricted administrative role-based access to safeguard your procurement transactions.
            </p>
          </section>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-900">Data Protection Officer:</div>
            <div>Tanmayee Technologies • Visakhapatnam, Andhra Pradesh – 530041</div>
            <div>Email: {COMPANY.EMAIL} • Direct Helpline: {COMPANY.PHONE_DISPLAY}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
