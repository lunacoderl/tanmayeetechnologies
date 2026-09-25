'use client';

// ============================================================================
// @tanmayee/web — Comprehensive Corporate Contact & Consultation Center (/contact)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
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
  ShieldCheck,
  Wrench,
  Truck,
  FileText,
  AlertTriangle,
  ChevronRight,
  Headphones,
  Navigation,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { COMPANY } from '@tanmayee/config';

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    subject: 'Bulk Equipment Procurement',
    facilityType: 'Retail / Showroom',
    city: 'Visakhapatnam',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="space-y-16 py-10 bg-slate-50/50">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-8 sm:p-14 text-white shadow-xl relative overflow-hidden border border-slate-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 text-xs font-bold uppercase tracking-wider border border-brand-400/20">
              <Headphones className="w-3.5 h-3.5" /> Corporate Engineering & Sales Helpdesk
            </div>
            <h1 className="text-3xl sm:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Connect With Tanmayee Technologies
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              Authorized commercial HVAC and deep refrigeration partners for Blue Star and Rockwell in Coastal Andhra Pradesh. From technical heat load consultations to bulk OEM procurement tenders and mission-critical 4-hour breakdown response, our engineering desk is at your service.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-medium text-slate-300">
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Direct OEM Factory Pricing
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> On-Site Engineering Survey
              </span>
              <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-lg border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 100% Tax-Deductible GST Invoicing
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form & Direct Info Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="space-y-4">
            {/* Phone Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold">
                <Phone className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Direct Phone & Desk</h3>
              <p className="text-xs text-slate-600">
                Immediate connection to commercial HVAC & refrigeration sales engineers for instant stock availability.
              </p>
              <a
                href={`tel:${COMPANY.PHONE}`}
                className="font-display font-black text-lg text-brand-700 block hover:underline tracking-tight"
              >
                {COMPANY.PHONE_DISPLAY}
              </a>
              <div className="text-[11px] text-slate-500 font-medium">Mon - Sat: 9:00 AM – 8:30 PM IST</div>
            </div>

            {/* WhatsApp Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">WhatsApp Fast Desk</h3>
              <p className="text-xs text-slate-600">
                Send your equipment schedule, floor plans, or tender specifications for same-day official quotation.
              </p>
              <a
                href={`https://wa.me/${COMPANY.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                  'Hello Tanmayee Technologies, I would like to request an official commercial B2B quotation for Blue Star / Rockwell equipment.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-bold text-xs text-emerald-800 bg-emerald-50 px-4 py-2.5 rounded-xl border border-emerald-200 hover:bg-emerald-100 transition-colors w-full justify-center"
              >
                <MessageSquare className="w-4 h-4 text-emerald-600" /> Instant WhatsApp Chat
              </a>
            </div>

            {/* Email Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Corporate Tender & RFP Email</h3>
              <p className="text-xs text-slate-600">
                Official procurement emails, vendor onboarding, and government/defence supply inquiries.
              </p>
              <a
                href={`mailto:${COMPANY.EMAIL}`}
                className="font-mono font-bold text-xs text-blue-700 block hover:underline break-all"
              >
                {COMPANY.EMAIL}
              </a>
            </div>

            {/* Registered Showroom & Experience Center Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Registered Showroom & Office</h3>
                <p className="text-xs text-slate-600 leading-relaxed mt-1">
                  {COMPANY.FULL_ADDRESS}
                </p>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-1">
                <div className="flex items-center gap-1.5 font-medium text-slate-700">
                  <Navigation className="w-3.5 h-3.5 text-brand-600" /> Landmark: Near PM Palem Last Bus Stop, Madhurawada
                </div>
                <div>Free customer & commercial vehicle parking available on site.</div>
              </div>
            </div>

            {/* Google Rating Verification */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 p-6 rounded-3xl border border-amber-200/80 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex items-center text-amber-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-black text-sm text-slate-900">{COMPANY.GOOGLE_RATING} / 5.0</span>
                </div>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  Google Verified
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs">{COMPANY.GOOGLE_REVIEW_COUNT} Client Reviews</h3>
              <p className="text-xs text-slate-600 italic">
                &ldquo;Top-notch commercial refrigeration partner. Fast delivery of Rockwell deep freezers and flawless Blue Star VRF commissioning.&rdquo;
              </p>
              <a
                href="https://maps.app.goo.gl/ndzjgar89V8CXgaC7"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-between w-full p-3 bg-white border border-amber-200 rounded-xl text-xs font-bold text-amber-900 hover:bg-amber-50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-600" />
                  <span>Open in Google Maps</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-amber-600" />
              </a>
            </div>
          </div>

          {/* Right Column: Corporate Inquiry Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-8 sm:p-10 shadow-sm space-y-6">
            {submitted ? (
              <div className="text-center py-16 space-y-5">
                <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <Check className="w-10 h-10" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
                    Inquiry Transmitted
                  </span>
                  <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
                    Thank You, {form.name || 'Valued Client'}
                  </h2>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Your commercial procurement inquiry has been assigned to our Senior HVAC & Refrigeration Applications Engineer. An official response and preliminary estimation will reach you within 2 to 4 business hours.
                  </p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-md mx-auto text-left text-xs space-y-1">
                  <div className="font-bold text-slate-800">Inquiry Summary:</div>
                  <div className="text-slate-600">Company: <span className="font-semibold text-slate-800">{form.company || 'Direct Client'}</span></div>
                  <div className="text-slate-600">Category: <span className="font-semibold text-slate-800">{form.subject}</span></div>
                  <div className="text-slate-600">Facility Type: <span className="font-semibold text-slate-800">{form.facilityType}</span></div>
                  <div className="text-slate-600">Target Location: <span className="font-semibold text-slate-800">{form.city}</span></div>
                </div>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold px-8 py-3 rounded-xl transition-all shadow-md"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 uppercase tracking-wider mb-2">
                    <Sparkles className="w-3.5 h-3.5" /> Project Estimation & RFP Desk
                  </div>
                  <h2 className="font-display font-black text-2xl text-slate-900">
                    Request Commercial Quotation or Site Survey
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    Provide your preliminary cooling, refrigeration, or AMC specifications. Our HVAC engineers will analyze heat loads and deliver an itemized OEM proposal.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="e.g., Rajesh Verma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Mobile Number / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="e.g., 98480 12345"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Corporate / Establishment Name
                    </label>
                    <input
                      type="text"
                      value={form.company}
                      onChange={(e) => setForm({ ...form, company: e.target.value })}
                      placeholder="e.g., Coastal Seafoods Pvt Ltd / MedHealth Hospital"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Official Corporate Email
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g., procurement@company.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Inquiry Category
                    </label>
                    <select
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    >
                      <option value="Bulk Equipment Procurement">Bulk Equipment Supply</option>
                      <option value="Turnkey HVAC Installation">Commercial HVAC / VRF Project</option>
                      <option value="Cold Room / Chiller Plant">Cold Room & Freezer Storage</option>
                      <option value="Annual Maintenance Contract (AMC)">Comprehensive AMC Contract</option>
                      <option value="Breakdown & Repair Support">Emergency Service Callout</option>
                      <option value="Other Commercial Project">Custom Project Consultation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Facility Type
                    </label>
                    <select
                      value={form.facilityType}
                      onChange={(e) => setForm({ ...form, facilityType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    >
                      <option value="Retail / Showroom">Retail Showroom / Supermarket</option>
                      <option value="Hospitality / Hotel / Restaurant">Hotel, Restaurant or Cloud Kitchen</option>
                      <option value="Hospital / Healthcare / Pharma">Hospital, Diagnostic or Pharma</option>
                      <option value="Cold Storage / Seafood Processing">Seafood / Cold Chain Warehouse</option>
                      <option value="Corporate Office / IT Park">Corporate Office / IT Park</option>
                      <option value="Industrial / Manufacturing">Factory / Industrial Facility</option>
                      <option value="Educational / Campus">University / Institution</option>
                      <option value="Residential Luxury Villa">Luxury Villa / Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">
                      Project Location (City)
                    </label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setForm({ ...form, city: e.target.value })}
                      placeholder="e.g. Visakhapatnam, Kakinada..."
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Project Details & Equipment Specifications *
                  </label>
                  <textarea
                    rows={5}
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Provide details such as room dimensions, number of units needed, model preferences (e.g. Blue Star 2 Ton Inverter Split, Rockwell 500L Deep Freezer, Cassette AC), target installation schedule, or custom requirements..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-brand-500 focus:bg-white transition-all leading-relaxed"
                  />
                </div>

                <div className="p-4 bg-brand-50/60 rounded-2xl border border-brand-100 flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-600 leading-relaxed">
                    <span className="font-bold text-slate-900">OEM Privacy & Warranty Assurance:</span> We respect your corporate confidential data. Information submitted is handled strictly by our internal engineering team for project estimation and is never disclosed to third parties.
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-brand-600 hover:bg-brand-700 text-white font-black py-4 px-10 rounded-2xl text-xs shadow-lg shadow-brand-600/20 transition-all hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <FileText className="w-4 h-4" />
                  <span>Transmit Official Inquiry to Sales Desk</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Corporate Departments & Escalation Matrix */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
              Organizational Contacts
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              Departmental Escalation & Direct Lines
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Reach the exact specialist division directly to avoid switchboard delays for urgent project requirements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Department 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Building className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Commercial Sales & Tenders</h3>
                <p className="text-xs text-slate-500 mt-1">
                  OEM Equipment procurement, corporate wholesale pricing, institutional supply tenders, and GST invoices.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Head of Sales:</span>
                  <span className="font-bold text-slate-900">G. V. Ramana</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Direct Mobile:</span>
                  <a href={`tel:${COMPANY.PHONE}`} className="font-bold text-brand-600 hover:underline">{COMPANY.PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Turnaround:</span>
                  <span className="font-bold text-emerald-700">Same-Day Proposal</span>
                </div>
              </div>
            </div>

            {/* Department 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Site Engineering & Projects</h3>
                <p className="text-xs text-slate-500 mt-1">
                  ISHRAE heat load audits, VRF ducting layouts, cold storage panel erection, and architectural site integration.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Project Lead:</span>
                  <span className="font-bold text-slate-900">P. K. Nambiar, HVAC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Field Survey:</span>
                  <span className="font-bold text-slate-800">Within 24 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Coverage:</span>
                  <span className="font-bold text-slate-800">All North Andhra</span>
                </div>
              </div>
            </div>

            {/* Department 3 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4 hover:border-brand-300 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">AMC & 24/7 Breakdown Cell</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Emergency compressor replacement, nitrogen pressure testing, refrigerant top-ups, and corporate AMC claims.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Hotline Desk:</span>
                  <a href={`tel:${COMPANY.PHONE}`} className="font-bold text-rose-600 hover:underline">{COMPANY.PHONE_DISPLAY}</a>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Emergency SLA:</span>
                  <span className="font-bold text-rose-700">Under 4 Hours</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-medium">Spares:</span>
                  <span className="font-bold text-emerald-700">100% Genuine OEM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regional Field Service Coverage */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider bg-brand-50 px-3 py-1 rounded-full">
              Field Operations Map
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900">
              Regional Dispatch Hubs & Service Reach
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We maintain mobile service vans equipped with precision vacuum pumps, digital manifold gauges, nitrogen charging cylinders, and genuine OEM spares stationed throughout Coastal Andhra Pradesh.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { city: 'Visakhapatnam', time: 'Under 2 Hours', units: 'Primary Hub (PM Palem)' },
              { city: 'Vizianagaram', time: 'Under 4 Hours', units: 'Express Van Route' },
              { city: 'Srikakulam', time: 'Same-Day Route', units: 'Dedicated Tech Base' },
              { city: 'Anakapalli / Atchutapuram', time: 'Under 3 Hours', units: 'SEZ Industrial Corridor' },
              { city: 'Kakinada', time: 'Within 6 Hours', units: 'Port & Cold Chain Team' },
              { city: 'Rajahmundry', time: 'Within 8 Hours', units: 'Godavari Commercial Desk' },
            ].map((route, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-center">
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs mx-auto">
                  <Truck className="w-4 h-4" />
                </div>
                <div className="font-bold text-xs text-slate-900">{route.city}</div>
                <div className="text-[11px] font-bold text-emerald-700">{route.time}</div>
                <div className="text-[10px] text-slate-500">{route.units}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequently Asked Contact & Procurement Questions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-blue-950 rounded-3xl p-8 sm:p-12 text-white shadow-xl space-y-8 border border-slate-800">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800">
              Procurement & Service FAQ
            </span>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
              Commercial Client Inquiries
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Frequently asked questions regarding commercial delivery timelines, quotation validity, and warranty support.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">How fast can Tanmayee Technologies supply bulk commercial units?</h4>
              <p className="leading-relaxed">
                For standard Blue Star split ACs (0.8 to 2.0 Ton) and Rockwell commercial deep freezers (100L to 1000L), ready stock is maintained at our Visakhapatnam warehouse for same-day or 24-hour local dispatch. Large VRF systems and specialized industrial blast freezers require 5–10 business days direct factory freight.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">Do you offer on-site heat load calculations before quoting?</h4>
              <p className="leading-relaxed">
                Yes. For hotels, hospitals, retail stores, and commercial office complexes, our certified HVAC engineers conduct physical site inspections, evaluating room orientation, window solar heat gain, glass exposure, occupancy headcount, and internal electrical heat loads using standard ISHRAE methodologies.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">Are GST tax credits and corporate OEM warranties guaranteed?</h4>
              <p className="leading-relaxed">
                Absolutely. Every invoice issued by Tanmayee Technologies carries valid 18% or 28% GST breakdown with official HSN coding, allowing 100% input tax credit claim. All warranty registrations are linked directly to OEM warranty systems (Blue Star India and Rockwell Industries).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
              <h4 className="font-bold text-white text-sm">Can I visit the experience center to inspect machines in operation?</h4>
              <p className="leading-relaxed">
                Yes, our PM Palem experience center features running display units including Blue Star Inverter Cassette ACs, heavy-duty Verticool tower units, and Rockwell double-door hard-top deep freezers. Walk-ins and architect appointments are welcome Monday through Saturday.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-blue-700 via-brand-600 to-indigo-700 rounded-3xl p-8 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-black font-display">
              Ready to Discuss Your Commercial Cooling Schedule?
            </h3>
            <p className="text-xs sm:text-sm text-blue-100 max-w-xl">
              Connect with our principal applications engineer today or schedule a site visit at your convenience.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href={`tel:${COMPANY.PHONE}`}
              className="bg-white hover:bg-slate-100 text-brand-900 font-black text-xs px-6 py-3.5 rounded-xl shadow-md transition-all hover:scale-105"
            >
              Call {COMPANY.PHONE_DISPLAY}
            </a>
            <Link
              href="/offers"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all"
            >
              View Bulk B2B Offers
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
