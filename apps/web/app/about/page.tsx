import React from 'react';
import Link from 'next/link';
import {
  Snowflake,
  ShieldCheck,
  Award,
  Users,
  Building2,
  CheckCircle2,
  ArrowRight,
  Target,
  Wrench,
  Clock,
  MapPin,
  Phone,
  Mail,
  Truck,
  FileCheck,
  Star,
  Sparkles,
  Zap,
  HelpCircle,
  Thermometer,
} from 'lucide-react';
import type { Metadata } from 'next';
import { COMPANY } from '@tanmayee/config';

export const metadata: Metadata = {
  title: 'About Tanmayee Technologies | Blue Star Dealers & Rockwell Distributors',
  description:
    'Discover Tanmayee Technologies, exclusive Blue Star A/C Shoppe Authorized Sales & Service Dealers and Rockwell Commercial Refrigerators Authorized Sales & Service Distributors based in PM Palem, Madhurawada, Visakhapatnam. Discover our engineering standards, cold chain expertise, and certified AMC support.',
  keywords: [
    'about Tanmayee Technologies',
    'Blue Star dealer Visakhapatnam',
    'Rockwell distributor Vizag',
    'commercial cooling history',
    'Madhurawada electronics store',
    'PM Palem AC showroom',
    'commercial refrigeration Visakhapatnam',
    'turnkey HVAC contractor Andhra Pradesh',
  ],
  alternates: {
    canonical: 'https://www.tanmayeetechnologies.com/about',
  },
  openGraph: {
    title: 'About Tanmayee Technologies | Commercial Cooling Leaders',
    description:
      'Premier commercial cooling dealership and distribution partner for Blue Star and Rockwell in Andhra Pradesh & Telangana.',
    url: 'https://www.tanmayeetechnologies.com/about',
    siteName: 'Tanmayee Technologies',
    type: 'website',
  },
};

export default function AboutPage() {
  const aboutJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: 'About Tanmayee Technologies',
    url: 'https://www.tanmayeetechnologies.com/about',
    mainEntity: {
      '@type': 'Organization',
      name: 'Tanmayee Technologies Private Limited',
      legalName: 'Tanmayee Technologies Private Limited',
      url: 'https://www.tanmayeetechnologies.com',
      foundingLocation: 'Visakhapatnam, Andhra Pradesh',
      address: {
        '@type': 'PostalAddress',
        streetAddress: COMPANY.FULL_ADDRESS,
        addressLocality: 'Visakhapatnam',
        addressRegion: 'Andhra Pradesh',
        postalCode: COMPANY.ADDRESS_PINCODE,
        addressCountry: 'IN',
      },
      telephone: COMPANY.PHONE_DISPLAY,
      email: COMPANY.EMAIL,
      knowsAbout: [
        'Commercial Air Conditioning',
        'Cold Chain Equipment',
        'Deep Freezers',
        'Visi Coolers',
        'HVAC Engineering',
        'Turnkey Cold Storage',
        'Annual Maintenance Contracts',
      ],
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutJsonLd) }}
      />
      <div className="bg-slate-50 min-h-screen">
        {/* 1. Header Hero Banner */}
        <section className="bg-gradient-to-br from-navy-950 via-slate-900 to-[#00529b] text-white py-16 sm:py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(2,132,199,0.18),transparent_50%)]" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 bg-white p-1 shadow-lg shadow-cyan-500/30 shrink-0">
                  <img
                    src="/images/tanmayee-logo.png"
                    alt="Tanmayee Technologies Logo"
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-cyan-300 uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-500/30">
                    Official OEM Sales &amp; Service Partners
                  </span>
                  <div className="text-sm font-semibold text-slate-300 mt-1">
                    Visakhapatnam • Andhra Pradesh • Telangana
                  </div>
                </div>
              </div>

              <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight">
                Empowering Enterprises with Engineered Cooling Solutions
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed">
                Tanmayee Technologies is the premier authorized sales and service dealer for Blue Star air conditioning systems and authorized commercial distributor for Rockwell refrigeration in Visakhapatnam. We deliver end-to-end HVAC installations, commercial cold chain systems, institutional bulk supplies, and certified round-the-clock maintenance.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/products"
                  className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-extrabold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 inline-flex items-center gap-2"
                >
                  <span>Explore Product Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/contact"
                  className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm px-6 py-3.5 rounded-xl transition-colors inline-flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-cyan-400" />
                  <span>Visit Our PM Palem Showroom</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Key Facts / Stats Strip */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-center">
              <div className="font-display font-black text-3xl sm:text-4xl text-[#00529b]">155+</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Commercial Models</div>
              <div className="text-[11px] text-slate-400">ACs, Chillers, Freezers, Dispensers</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-center">
              <div className="font-display font-black text-3xl sm:text-4xl text-emerald-600">100%</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Genuine OEM Stock</div>
              <div className="text-[11px] text-slate-400">Direct factory warranty &amp; GST bill</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-center">
              <div className="font-display font-black text-3xl sm:text-4xl text-amber-500">4.6 ★</div>
              <div className="text-xs font-bold text-slate-700 mt-1">Google Rating</div>
              <div className="text-[11px] text-slate-400">{COMPANY.GOOGLE_REVIEW_COUNT}+ Verified Customer Reviews</div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-md text-center">
              <div className="font-display font-black text-3xl sm:text-4xl text-[#0284c7]">24/7</div>
              <div className="text-xs font-bold text-slate-700 mt-1">AMC Support Desk</div>
              <div className="text-[11px] text-slate-400">Priority breakdown SLA response</div>
            </div>
          </div>
        </section>

        {/* 3. Who We Are & Dealership Credentials */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
                Official Partnerships
              </span>
              <h2 className="font-display font-black text-2xl sm:text-4xl text-slate-900 leading-tight">
                Two Decades of Engineering Excellence with India&apos;s Leading Cooling Giants
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Operating out of our flagship commercial experience center in PM Palem, Madhurawada, Visakhapatnam, Tanmayee Technologies represents the highest echelon of commercial cooling dealership. We bridge the gap between heavy industrial equipment manufacturers and local enterprises requiring specialized climate control.
              </p>
              <p className="text-sm text-slate-600 leading-relaxed">
                Unlike unverified intermediaries or general home appliance retailers, our operations are dedicated exclusively to high-performance cooling, precision climate conditioning, and commercial cold chain logistics. Every technician on our team is manufacturer-trained and certified in handling modern inverter circuits, hydrocarbon refrigerants, and multi-circuit installations.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/50 space-y-1.5">
                  <div className="font-bold text-xs text-blue-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    <span>Blue Star A/C Shoppe Dealer</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Direct authorized sales &amp; service partner for Split, Cassette, Tower/Verticool, and Commercial Inverter systems.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 space-y-1.5">
                  <div className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Rockwell Authorized Distributor</span>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    Commercial refrigeration partner for Convertible Green Freezers, Visi Coolers, Blast Chillers &amp; Kitchen Tables.
                  </p>
                </div>
              </div>
            </div>

            {/* Official Brand Logos & Trust Visual */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
              <h3 className="font-display font-bold text-lg text-slate-900 border-b border-slate-100 pb-3">
                Authorized Brand Distributorship Credentials
              </h3>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center space-y-3">
                  <div className="h-12 flex items-center justify-center">
                    <img
                      src="/images/bluestar-logo.png"
                      alt="Blue Star Official Logo"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Blue Star Limited</div>
                  <div className="text-[10px] text-slate-500">Commercial ACs &amp; Deep Freezers</div>
                  <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100 px-2.5 py-0.5 rounded-full">
                    Authorized Dealer
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col items-center text-center space-y-3">
                  <div className="h-12 flex items-center justify-center">
                    <img
                      src="/images/rockwell-logo.png"
                      alt="Rockwell Industries Official Logo"
                      className="max-h-full object-contain"
                    />
                  </div>
                  <div className="text-xs font-bold text-slate-800">Rockwell Industries</div>
                  <div className="text-[10px] text-slate-500">Commercial Cold Chain &amp; Chillers</div>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Authorized Distributor
                  </span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Authorized Territory Coverage</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  Full sales, delivery, and warranty support across Visakhapatnam (Vizag), Gajuwaka, Anakapalle, Vizianagaram, Srikakulam, East Godavari, Kakinada, and greater Andhra Pradesh &amp; Telangana.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Complete Technical Capabilities & Engineering Standards */}
        <section className="bg-slate-100 border-y border-slate-200 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
                Engineering Methodology
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
                How We Engineer Precision Cooling for Modern Facilities
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                From initial heat load calculations to final nitrogen pressure testing, our installations adhere to strict ISHRAE and OEM engineering standards.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                  <Thermometer className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Heat Load &amp; Airflow Modeling
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  We calculate room occupancy, solar exposure, electronic equipment heat dissipation, and ceiling height before recommending machine tonnage. This prevents high power bills and premature compressor wear.
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <li>• ISHRAE Heat Load Certification</li>
                  <li>• Multi-zone CFM Airflow Balancing</li>
                  <li>• Noise level (&lt;32 dB) acoustic design</li>
                </ul>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                  <Wrench className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Certified Installation &amp; Piping
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Only virgin high-gauge electrolytic copper tubes are used. We perform triple vacuum dehydration down to 500 microns and nitrogen pressure testing at 450 PSI to guarantee leak-free operation.
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <li>• High-gauge seamless copper piping</li>
                  <li>• Nitrile foam fire-retardant insulation</li>
                  <li>• Anti-vibration heavy-duty outdoor mounts</li>
                </ul>
              </div>

              <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-base text-slate-900">
                  Preventive AMC &amp; Lifecycle Care
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Our Annual Maintenance Contracts provide comprehensive quarterly servicing, non-destructive chemical coil washing, refrigerant top-ups, and guaranteed emergency breakdown callouts.
                </p>
                <ul className="text-[11px] text-slate-500 space-y-1 pt-2 border-t border-slate-100">
                  <li>• 4 Scheduled preventive maintenance visits</li>
                  <li>• 4-Hour emergency breakdown attendance</li>
                  <li>• 100% Genuine OEM spare parts inventory</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Industries & Sectors We Serve */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-black uppercase tracking-wider text-[#0284c7]">
              Commercial Applications
            </span>
            <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-1">
              Trusted Across Critical Commercial &amp; Industrial Sectors
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Our products and installation teams support over 350+ commercial establishments across the region.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Supermarkets & FMCG Retail',
                desc: 'Visi coolers, display chillers, and convertible island freezers engineered for continuous 24/7 product merchandising with low energy footprint.',
                items: ['Rockwell Green Freezers', 'Double Door Visi Coolers', 'Heavy-Duty Commercial Stabilizers'],
              },
              {
                title: 'Restaurants, Hotels & Cloud Kitchens',
                desc: 'Under-counter refrigerated prep tables, stainless steel reach-in chillers, automatic ice makers, and high-CFM kitchen air conditioners.',
                items: ['Reach-in Chillers & Freezers', 'Cube Ice Machines', 'Commercial Cassette ACs'],
              },
              {
                title: 'Healthcare, Pharma & Labs',
                desc: 'Precision temperature vaccine refrigerators, blood bank storage, and air purification split ACs with antimicrobial blue fins.',
                items: ['Temperature Datalogger Units', 'Inverter Split ACs', 'Heavy-Duty Eutectic Freezers'],
              },
              {
                title: 'Corporate Offices & IT Hubs',
                desc: 'Quiet 4-way ceiling cassette ACs, floor standing verticool towers, and heavy-duty cold water dispensing stations for staff cafeterias.',
                items: ['4-Way 360° Cassette ACs', 'Verticool Commercial ACs', 'Stainless Steel Water Coolers'],
              },
              {
                title: 'Colleges, Schools & Hostels',
                desc: 'High-volume drinking water dispensers with multi-stage RO filtration and heavy stainless steel bodies designed for high-traffic environments.',
                items: ['100L to 300L Water Dispensers', 'RO Water Purification Systems', 'Campus AMC Contracts'],
              },
              {
                title: 'Cold Storage & Agro Processing',
                desc: 'Turnkey walk-in cold rooms, deep freezing units for seafood and meat preservation, and high-ambient outdoor condensing units.',
                items: ['Commercial Condensing Units', 'Pre-Cooling Rooms', 'Custom Modular Cold Rooms'],
              },
            ].map((sector, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-display font-bold text-base text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{sector.title}</span>
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">{sector.desc}</p>
                <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {sector.items.map((it, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {it}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Physical Showroom & Contact Card */}
        <section className="bg-navy-950 text-white rounded-3xl max-w-7xl mx-auto px-6 sm:px-12 py-12 mb-16 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest bg-cyan-950 px-3 py-1 rounded-full border border-cyan-500/30">
                Experience Center &amp; Showroom
              </span>
              <h2 className="font-display font-black text-2xl sm:text-3xl text-white">
                Visit Us at PM Palem, Madhurawada
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Experience our extensive product displays firsthand. Inspect interior builds of Rockwell Green Freezers, test the whisper-quiet airflow of Blue Star Inverter Cassettes, and speak with our licensed technical consultants.
              </p>

              <div className="space-y-2.5 pt-2 text-xs">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span className="text-slate-200">{COMPANY.FULL_ADDRESS}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span className="text-slate-200">{COMPANY.STORE_HOURS} (Open All 7 Days)</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                  <a href={`tel:${COMPANY.PHONE}`} className="text-slate-200 hover:text-white font-bold">
                    {COMPANY.PHONE_DISPLAY}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-end">
              <a
                href={COMPANY.GOOGLE_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-cyan-500 hover:bg-cyan-400 text-navy-950 font-black text-xs px-6 py-3.5 rounded-xl transition-all shadow-lg text-center flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                <span>Get Google Maps Directions</span>
              </a>
              <Link
                href="/contact"
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-colors text-center flex items-center justify-center gap-2"
              >
                <span>Request B2B Quotation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
