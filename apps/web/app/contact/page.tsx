'use client';

// ============================================================================
// @tanmayee/web — Contact Page (/contact)
// ============================================================================

import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare,
  Building,
  CheckCircle2,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react';
import { COMPANY } from '@tanmayee/config';


export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    subject: 'Bulk Equipment Procurement',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
          Get In Touch
        </span>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
          Contact Tanmayee Technologies
        </h1>
        <p className="text-sm text-slate-600">
          Connect directly with our commercial cooling and refrigeration sales desk for tenders, quotations, and service bookings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Direct Phone & Desk</h3>
            <p className="text-xs text-slate-600">
              Immediate connection to our commercial HVAC & refrigeration sales engineers.
            </p>
            <a
              href={`tel:${COMPANY.PHONE}`}
              className="font-display font-bold text-base text-brand-700 block hover:underline"
            >
              {COMPANY.PHONE_DISPLAY}
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">WhatsApp Fast Desk</h3>
            <p className="text-xs text-slate-600">
              Send your tender BOQ, product list, or floor plan for quick quotation reply.
            </p>
            <a
              href={`https://wa.me/${COMPANY.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                'Hello Tanmayee Technologies, I would like to request a commercial B2B quotation.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100"
            >
              <MessageSquare className="w-3.5 h-3.5" /> Chat on WhatsApp
            </a>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Registered Showroom & Office</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              {COMPANY.FULL_ADDRESS}
            </p>
            <div className="text-[11px] text-slate-500 pt-1">
              {COMPANY.STORE_HOURS}
            </div>
          </div>

          {/* Google Reviews & Showroom Card with Maps Link */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50/40 p-6 rounded-3xl border border-amber-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex items-center text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <span className="font-black text-sm text-slate-900">{COMPANY.GOOGLE_RATING} / 5.0</span>
              </div>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded-full">
                Verified Business
              </span>
            </div>

            <h3 className="font-bold text-slate-900 text-sm">{COMPANY.GOOGLE_REVIEW_COUNT} Verified Google Reviews</h3>
            <p className="text-xs text-slate-600 italic">
              &ldquo;Great service, genuine products, competitive pricing, and helpful staff.&rdquo;
            </p>

            <a
              href="https://maps.app.goo.gl/ndzjgar89V8CXgaC7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-between w-full p-3.5 bg-white border border-amber-200 rounded-2xl text-xs font-extrabold text-amber-900 hover:bg-amber-50 transition-all shadow-sm hover:scale-[1.02]"
            >
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Open in Google Maps</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
            </a>
          </div>

          {/* Showroom Directions Callout */}
          <div className="bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 p-6 rounded-3xl text-white shadow-xl space-y-4 border border-blue-800">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-0.5 shrink-0">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <div className="font-bold text-sm text-white">Visit Our Experience Center</div>
                <div className="text-[11px] text-cyan-300">Plot SFS MIG-131, PM Palem, Madhurawada</div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Experience Blue Star VRF, commercial cassette ACs, and Rockwell double-door deep freezers live in person before placing your commercial order.
            </p>

            <a
              href="https://maps.app.goo.gl/ndzjgar89V8CXgaC7"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:scale-105"
            >
              <MapPin className="w-4 h-4" />
              <span>Get Showroom Directions</span>
            </a>
          </div>
        </div>


        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm">
          {submitted ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <Check className="w-9 h-9" />
              </div>
              <h2 className="font-display font-bold text-2xl text-slate-900">
                Message Successfully Dispatched
              </h2>
              <p className="text-xs text-slate-600 max-w-md mx-auto">
                Thank you for contacting Tanmayee Technologies. A commercial account representative will follow up with you promptly.
              </p>
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="bg-brand-600 text-white text-xs font-bold px-6 py-2.5 rounded-xl"
              >
                Send Another Note
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  Send A Corporate Inquiry
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your project specifications and equipment requirements.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Full Name"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Mobile Number"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={form.company}
                    onChange={(e) => setForm({ ...form, company: e.target.value })}
                    placeholder="Organization / Entity"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="name@company.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Inquiry Topic
                </label>
                <select
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                >
                  <option value="Bulk Equipment Procurement">Bulk Equipment Procurement (ACs/Freezers)</option>
                  <option value="Turnkey HVAC Installation">Turnkey HVAC Installation</option>
                  <option value="Annual Maintenance Contract (AMC)">Annual Maintenance Contract (AMC)</option>
                  <option value="Commercial Cold Room Inquiry">Commercial Cold Room Inquiry</option>
                  <option value="General Inquiry">General Corporate Inquiry</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Message / Project Details
                </label>
                <textarea
                  rows={4}
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  placeholder="Share details regarding tonnage, number of units, location, or requested delivery timeline..."
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
                />
              </div>

              <button
                type="submit"
                className="bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-8 rounded-xl text-xs shadow-md transition-all"
              >
                Send Message to Sales Desk
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
