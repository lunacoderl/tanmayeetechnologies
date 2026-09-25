// ============================================================================
// @tanmayee/web — Service Detail Page (/services/[slug])
// Dynamic SEO & Technical Scope for Commercial HVAC & Refrigeration Services
// ============================================================================

import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  Wrench,
  ShieldCheck,
  CheckCircle2,
  Clock,
  PhoneCall,
  MessageSquare,
  ArrowRight,
  Sparkles,
  HelpCircle,
  FileCheck,
  Check,
} from 'lucide-react';
import { SEED_SERVICES } from '@tanmayee/database';
import { COMPANY } from '@tanmayee/config';

interface ServicePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SEED_SERVICES.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    return {
      title: 'Service Not Found | Tanmayee Technologies',
    };
  }

  const title = `${service.name} | Tanmayee Technologies Vizag`;
  const description =
    service.seo_description ||
    `${service.description} Factory-trained certified engineers for Blue Star & Rockwell in Visakhapatnam, Andhra Pradesh.`;

  return {
    title,
    description,
    keywords: [
      service.name,
      `${service.name} Visakhapatnam`,
      'HVAC maintenance Vizag',
      'commercial cooling repair Andhra Pradesh',
      'Tanmayee Technologies engineering',
    ],
    alternates: {
      canonical: `https://tanmayeetechnologies.com/services/${service.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://tanmayeetechnologies.com/services/${service.slug}`,
      siteName: 'Tanmayee Technologies',
      type: 'website',
    },
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { slug } = await params;
  const service = SEED_SERVICES.find((s) => s.slug === slug || s.id === slug);

  if (!service) {
    notFound();
  }

  const otherServices = SEED_SERVICES.filter((s) => s.id !== service.id);

  // Specific service deliverables based on type
  const isAMC = service.slug.includes('amc') || service.slug.includes('maintenance-contract');
  const isInstall = service.slug.includes('installation');

  const deliverables = isAMC
    ? [
        '4 Scheduled Comprehensive Maintenance Visits per Year',
        'Unlimited Emergency Breakdown Calls with 4-Hour Response Time',
        'Complete Condenser & Evaporator Coil Chemical Descaling',
        'Refrigerant Gas Pressure Checks & Leak Rectification',
        'Electrical Terminal, Capacitor & Compressor Health Diagnostics',
        'Priority Spare Parts Availability with 15% Institutional Discount',
      ]
    : isInstall
    ? [
        'Site Structural Inspection & Vibration-Damped Wall / Floor Mounting',
        'Heavy-Gauge Copper Piping with Class-O Armaflex Nitrile Insulation',
        'Deep Nitrogen Pressure Testing (350+ PSI) for Zero Refrigerant Leakage',
        'High-Vacuum Evacuation down to 500 Microns using Digital Gauge',
        'Precision Refrigerant Top-Up by Weight to OEM Specifications',
        'Electrical Earthing & Voltage Fluctuation Safety Validation',
      ]
    : [
        'High-Pressure Jet Wash of Indoor and Outdoor Coil Units',
        'Drain Pipe Flushing, Anti-Bacterial Sanitization & Biological Cleansing',
        'Operating Current (Ampere) & Operating Voltage Verification',
        'Blower Fan Motor Lubrication and Bearing Alignment Inspection',
        'Air Filter Mesh Replacement or Deep Ultrasonic Cleaning',
        'Comprehensive Cooling Delta-T Temperature Drop Verification',
      ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-semibold text-slate-500">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <Link href="/services" className="hover:text-slate-900 transition-colors">
          Services &amp; AMC
        </Link>
        <span>/</span>
        <span className="text-[#0284c7] font-bold">{service.name}</span>
      </nav>

      {/* Hero Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        <div className="lg:col-span-2 space-y-5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-cyan-600" />
            <span>OEM Certified Engineering • Direct Brand Warranty</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl text-slate-900 tracking-tight leading-tight">
            {service.name}
          </h1>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
            {service.description}
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${COMPANY.WHATSAPP_NUMBER}?text=${encodeURIComponent(
                `Hello Tanmayee Technologies, I would like to book or inquire about: ${service.name}.`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Book via WhatsApp</span>
            </a>

            <a
              href={`tel:${COMPANY.PHONE}`}
              className="inline-flex items-center gap-2 bg-[#0b2847] hover:bg-[#002b49] text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all hover:scale-105"
            >
              <PhoneCall className="w-4 h-4" />
              <span>Call Desk: {COMPANY.PHONE_DISPLAY}</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-5 py-3.5 rounded-xl border border-slate-300 shadow-sm transition-all"
            >
              <span>Request Formal Proposal</span>
            </Link>
          </div>
        </div>

        {/* Quick Facts Card */}
        <div className="bg-slate-50 border border-slate-200/90 rounded-3xl p-6 sm:p-7 space-y-5">
          <h3 className="font-display font-black text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-600" />
            Service Specifications
          </h3>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Service Coverage:</span>
              <span className="font-bold text-slate-900">Visakhapatnam &amp; AP / TG</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Technicians:</span>
              <span className="font-bold text-slate-900">Blue Star &amp; Rockwell Certified</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Turnaround Time:</span>
              <span className="font-bold text-emerald-700">Same-Day / 24-48 Hours</span>
            </div>
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-200">
              <span className="text-slate-500 font-medium">Spares Guarantee:</span>
              <span className="font-bold text-slate-900">100% Genuine OEM Parts</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 font-medium">Billing &amp; Audit:</span>
              <span className="font-bold text-slate-900">GST Invoice &amp; Report Provided</span>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/services"
              className="w-full inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl border border-slate-300 transition-colors"
            >
              <span>Explore All AMC &amp; Maintenance Plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Scope of Work Section */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-10 shadow-sm space-y-6">
        <div className="max-w-2xl space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Standard Operating Procedure (SOP)
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            Detailed Scope of Work &amp; Deliverables
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Every procedure is executed in compliance with OEM Blue Star &amp; Rockwell factory installation guidelines and ASHRAE cooling standards.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliverables.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5 font-bold text-xs">
                <Check className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
                {item}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Process Flow */}
      <div className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
            Execution Lifecycle
          </span>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 tracking-tight">
            How We Deliver Turnkey Precision
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '01',
              title: 'Site Survey & Heat Load',
              desc: 'Our HVAC engineers inspect your commercial space, electrical load, airflow dynamics, and structural mounting positions.',
            },
            {
              step: '02',
              title: 'Transparent BOQ Quote',
              desc: 'Receive an itemized commercial quotation including equipment, copper piping, drain line, and certified installation charges.',
            },
            {
              step: '03',
              title: 'Engineering Execution',
              desc: 'Trained technical staff mount, vacuum, connect, and pressure-test equipment with nitrogen before refrigerant release.',
            },
            {
              step: '04',
              title: 'Commissioning & Handover',
              desc: 'Performance testing of temperature delta, amp draw, and formal handover of warranty documentation and AMC options.',
            },
          ].map((s) => (
            <div
              key={s.step}
              className="bg-white rounded-3xl border border-slate-200 p-6 space-y-3 relative group hover:border-cyan-400/80 transition-all shadow-xs"
            >
              <span className="font-display font-black text-3xl text-slate-200 group-hover:text-cyan-600 transition-colors">
                {s.step}
              </span>
              <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Other Services Grid */}
      <div className="pt-8 border-t border-slate-200 space-y-6">
        <h3 className="font-display font-black text-xl text-slate-900">
          Other Specialized Engineering Services
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {otherServices.map((other) => (
            <Link
              key={other.id}
              href={`/services/${other.slug}`}
              className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all group block"
            >
              <h4 className="font-bold text-sm text-slate-900 group-hover:text-[#0284c7] transition-colors mb-2">
                {other.name}
              </h4>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                {other.short_description || other.description}
              </p>
              <span className="text-xs font-bold text-[#0284c7] inline-flex items-center gap-1 group-hover:underline">
                <span>View Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
