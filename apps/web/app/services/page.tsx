'use client';

// ============================================================================
// @tanmayee/web — Comprehensive Services & AMC Hub (/services)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  Clock,
  CheckCircle2,
  PhoneCall,
  MessageSquare,
  Sparkles,
  Check,
  Snowflake,
  AlertTriangle,
  Zap,
  FileText,
  HelpCircle,
  ArrowRight,
  Gauge,
  Cpu,
  BadgeCheck,
} from 'lucide-react';
import { SEED_SERVICES } from '@tanmayee/database';
import { fetchFromApi } from '../../lib/api-client';
import { COMPANY } from '@tanmayee/config';

export default function ServicesPage() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    service_id: SEED_SERVICES[0]?.id || '',
    equipment_type: 'AC',
    unit_count: '1-5',
    description: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const selectedService = SEED_SERVICES.find((s) => s.id === formData.service_id);
      const newRequestRecord = {
        id: `sr-${Date.now()}`,
        request_number: `TT-SR-${new Date().toISOString().slice(0, 7).replace('-', '')}-${Math.floor(1000 + Math.random() * 9000)}`,
        service_id: formData.service_id,
        service_name: selectedService?.name || 'Turnkey Commercial Service',
        customer_name: formData.name,
        customer_phone: formData.phone,
        customer_email: formData.email,
        customer_company: formData.company,
        equipment_details: `${formData.equipment_type} (${formData.unit_count} units) - ${formData.description}`,
        status: 'PENDING',
        preferred_date: new Date().toISOString().slice(0, 10),
        notes: formData.description,
        created_at: new Date().toISOString(),
      };

      try {
        if (typeof window !== 'undefined') {
          const raw = localStorage.getItem('tanmayee_service_requests');
          const existing = raw ? JSON.parse(raw) : [];
          localStorage.setItem(
            'tanmayee_service_requests',
            JSON.stringify([newRequestRecord, ...existing])
          );
        }
      } catch (storageErr) {
        console.error('Storage save error:', storageErr);
      }

      await fetchFromApi('/service-requests', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSubmitted(true);
    } catch {
      // Graceful fallback
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* 1. Header Hero Banner */}
      <section className="bg-gradient-to-br from-navy-950 via-slate-900 to-[#00529b] text-white py-16 sm:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.18),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-bold mb-4 uppercase tracking-widest">
              <BadgeCheck className="w-3.5 h-3.5" />
              <span>OEM Certified Engineering Service Division</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
              Turnkey HVAC Installation, Cold Chain Commissioning &amp; Annual AMC
            </h1>
            <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
              Protect your commercial cooling assets with factory-trained engineers. We provide turnkey installations, precision vacuum dehydration, emergency breakdown response, and comprehensive Annual Maintenance Contracts (AMC) across Visakhapatnam, Andhra Pradesh &amp; Telangana.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="#booking-form"
                className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 inline-flex items-center gap-2"
              >
                <span>Book Service Technician</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href={`tel:${COMPANY.PHONE}`}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2"
              >
                <PhoneCall className="w-4 h-4 text-cyan-400" />
                <span>Emergency Service Hotline: {COMPANY.PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md text-center">
            <div className="font-display font-black text-2xl sm:text-3xl text-[#00529b]">4 Hours</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Breakdown SLA</div>
            <div className="text-[11px] text-slate-400">Within Visakhapatnam city limits</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md text-center">
            <div className="font-display font-black text-2xl sm:text-3xl text-emerald-600">100%</div>
            <div className="text-xs font-bold text-slate-700 mt-1">OEM Genuine Parts</div>
            <div className="text-[11px] text-slate-400">Blue Star &amp; Rockwell factory spares</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md text-center">
            <div className="font-display font-black text-2xl sm:text-3xl text-amber-500">500 Microns</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Vacuum Dehydration</div>
            <div className="text-[11px] text-slate-400">Standard deep evacuation protocol</div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-md text-center">
            <div className="font-display font-black text-2xl sm:text-3xl text-[#0284c7]">350+</div>
            <div className="text-xs font-bold text-slate-700 mt-1">Active AMC Clients</div>
            <div className="text-[11px] text-slate-400">Hospitals, hotels &amp; retail chains</div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Services Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
            Core Service Offerings
          </span>
          <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 mt-1">
            Engineered HVAC &amp; Refrigeration Maintenance
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Each service is executed according to strict OEM standard operating procedures (SOP), backed by serialized digital job sheets and warranty protection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {SEED_SERVICES.map((service, idx) => (
            <div
              key={service.id}
              className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm hover:shadow-lg transition-all space-y-5 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 text-[#00529b] flex items-center justify-center">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-3 py-1 rounded-full uppercase">
                    Service #{idx + 1}
                  </span>
                </div>

                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-900">
                    {service.name}
                  </h3>
                  <p className="text-xs text-[#0284c7] font-bold mt-1">
                    {service.short_description}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {service.description}
                </p>

                {/* SOP Highlights */}
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2 text-xs text-slate-700">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">
                    Execution Deliverables:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Certified OEM SOP</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Digital Pressure Test Log</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Chemical Coil Sanitization</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>Electrical Load Certification</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <Link
                  href={`/services/${service.slug}`}
                  className="text-xs font-bold text-[#00529b] hover:underline flex items-center gap-1"
                >
                  <span>Read Full Technical SOP &amp; Pricing</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <a
                  href={`https://wa.me/${COMPANY.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                    `Hello Tanmayee Technologies, I would like to book a service technician for: ${service.name}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Book via WhatsApp</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. AMC Tier Comparison Table */}
      <section className="bg-slate-100 border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
              Annual Maintenance Contracts
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Commercial AMC Package Comparison
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Choose the level of uptime protection suitable for your enterprise, hospital, hotel, or retail chain.
            </p>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200 shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white font-display">
                    <th className="p-4 sm:p-5 font-bold">Feature &amp; Deliverable</th>
                    <th className="p-4 sm:p-5 font-bold text-center">Basic Preventive AMC</th>
                    <th className="p-4 sm:p-5 font-bold text-center bg-[#00529b]">
                      Comprehensive AMC (Recommended)
                    </th>
                    <th className="p-4 sm:p-5 font-bold text-center">Enterprise 24/7 SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Scheduled Preventive Visits</td>
                    <td className="p-4 text-center">4 Visits / Year</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-blue-900">4 Visits / Year</td>
                    <td className="p-4 text-center font-bold">Monthly (12 Visits / Year)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Breakdown Callouts</td>
                    <td className="p-4 text-center">Chargeable at 50%</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-blue-900">Unlimited Free Callouts</td>
                    <td className="p-4 text-center font-bold">Unlimited Free Callouts</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Response Time (SLA)</td>
                    <td className="p-4 text-center">Within 24 Hours</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-blue-900">Within 4 to 8 Hours</td>
                    <td className="p-4 text-center font-bold text-emerald-700">Within 2 Hours (Priority)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">High-Pressure Chemical Coil Wash</td>
                    <td className="p-4 text-center">1 Time / Year</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-blue-900">2 Times / Year</td>
                    <td className="p-4 text-center font-bold">Quarterly (4 Times / Year)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Refrigerant (Gas) Top-Up</td>
                    <td className="p-4 text-center text-slate-400">Chargeable at cost</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-emerald-600">Included (100% Free)</td>
                    <td className="p-4 text-center font-bold text-emerald-600">Included (100% Free)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Compressor &amp; Fan Motor Spares</td>
                    <td className="p-4 text-center text-slate-400">Chargeable</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-emerald-600">Included (100% Free)</td>
                    <td className="p-4 text-center font-bold text-emerald-600">Included (100% Free)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">PCB &amp; Electronic Relay Spares</td>
                    <td className="p-4 text-center text-slate-400">Chargeable</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-emerald-600">Included (100% Free)</td>
                    <td className="p-4 text-center font-bold text-emerald-600">Included (100% Free)</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Electrical &amp; Earth Resistance Audit</td>
                    <td className="p-4 text-center">Annual</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-blue-900">Bi-Annual</td>
                    <td className="p-4 text-center font-bold">Quarterly</td>
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-900">Ideal For</td>
                    <td className="p-4 text-center text-slate-500">Small retail cabins, homes</td>
                    <td className="p-4 text-center bg-blue-50/50 font-bold text-blue-900">Offices, restaurants, clinics</td>
                    <td className="p-4 text-center font-bold text-slate-900">Hospitals, cold rooms, server rooms</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-xs text-slate-600 font-medium">
                Custom fleet pricing available for installations with 10+ machines.
              </span>
              <a
                href="#booking-form"
                className="bg-[#00529b] hover:bg-[#003d73] text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow transition-colors"
              >
                Request Custom AMC Quotation
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 5. 5-Step Turnkey Execution Process */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
            Standard Operating Procedure
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
            How We Execute Every Service Ticket
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Structured workflow ensuring transparency, documented test results, and complete client satisfaction.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              step: '01',
              title: 'Site Diagnosis',
              desc: 'Thermal camera scan, electrical check, and operating pressure check to pinpoint root failure.',
            },
            {
              step: '02',
              title: 'Written Scope',
              desc: 'Transparent estimate outlining spare parts, refrigerant weights, and labour scope before work begins.',
            },
            {
              step: '03',
              title: 'OEM Execution',
              desc: 'Certified technicians replace parts using specialized digital vacuum pumps and manifold gauges.',
            },
            {
              step: '04',
              title: 'Commissioning',
              desc: '15-minute stabilized run test verifying Delta-T temperature drop and electrical current draw.',
            },
            {
              step: '05',
              title: 'Digital Warranty',
              desc: 'Serialized job card issued via SMS/email with 90-day service warranty on replaced components.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2 relative"
            >
              <span className="font-display font-black text-2xl text-blue-200 block">
                {item.step}
              </span>
              <h3 className="font-bold text-sm text-slate-900">{item.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Service Request & Proposal Form */}
      <section id="booking-form" className="bg-slate-900 text-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 py-12 mb-16 shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30">
              Direct Technical Desk
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl text-white">
              Schedule An On-Site Engineering Inspection or AMC Audit
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Submit your equipment details and location. Our senior HVAC coordinator will contact you within 2 hours to confirm technician slot availability or provide an institutional AMC proposal.
            </p>

            <div className="space-y-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Free site cooling load and copper piping layout assessment</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Multi-unit institutional AMC fleet discounts (5+ units)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>24/7 Priority Emergency Breakdown Line for hospital &amp; cold storage accounts</span>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
              <div className="text-slate-400">Prefer direct telephone contact?</div>
              <a
                href={`tel:${COMPANY.PHONE}`}
                className="font-display font-bold text-lg text-cyan-400 hover:text-cyan-300 flex items-center gap-2"
              >
                <PhoneCall className="w-5 h-5" />
                <span>{COMPANY.PHONE_DISPLAY}</span>
              </a>
            </div>
          </div>

          {/* Form */}
          <div className="bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-xl">
            {submitted ? (
              <div className="text-center py-8 space-y-4">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-xl text-slate-900">Service Request Registered</h3>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Your request has been logged into our service dispatch queue. A technical supervisor will call you shortly to confirm the site inspection window.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="bg-brand-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  Submit Another Request
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Select Required Service *
                  </label>
                  <select
                    value={formData.service_id}
                    onChange={(e) => setFormData({ ...formData, service_id: e.target.value })}
                    className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-brand-500"
                  >
                    {SEED_SERVICES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Rajesh Sharma"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="93901 15553"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Company / Organization
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="Hotel / Hospital / Office"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="rajesh@company.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Equipment Type
                    </label>
                    <select
                      value={formData.equipment_type}
                      onChange={(e) => setFormData({ ...formData, equipment_type: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <option value="Inverter Split AC">Inverter Split AC</option>
                      <option value="Cassette AC">Cassette AC</option>
                      <option value="Tower / Verticool AC">Tower / Verticool AC</option>
                      <option value="Rockwell Deep Freezer">Rockwell Deep Freezer</option>
                      <option value="Visi Cooler">Visi Cooler</option>
                      <option value="Water Cooler / Dispenser">Water Cooler / Dispenser</option>
                      <option value="Commercial Cold Room">Commercial Cold Room</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Number of Units
                    </label>
                    <select
                      value={formData.unit_count}
                      onChange={(e) => setFormData({ ...formData, unit_count: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
                    >
                      <option value="1 unit">1 unit</option>
                      <option value="2-4 units">2-4 units</option>
                      <option value="5-10 units">5-10 units</option>
                      <option value="10-25 units">10-25 units</option>
                      <option value="25+ units (Enterprise)">25+ units (Enterprise)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Problem Details / Site Location
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mention cooling issues, location in Visakhapatnam, error codes on display..."
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#00529b] hover:bg-[#003d73] text-white font-bold py-3 rounded-xl text-xs shadow-md transition-all cursor-pointer"
                >
                  {isSubmitting ? 'Registering Ticket...' : 'Dispatch Technician / Request AMC Contract'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
