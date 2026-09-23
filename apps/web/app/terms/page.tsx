import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText, ShieldCheck, Scale, AlertCircle } from 'lucide-react';
import { COMPANY } from '@tanmayee/config';

export const metadata: Metadata = {
  title: 'Terms & Conditions | Commercial B2B Policies',
  description:
    'Commercial terms of sale, quotation validity, OEM warranty guarantees, delivery timelines, and AMC service level agreements for Tanmayee Technologies Visakhapatnam.',
};

export default function TermsPage() {
  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="space-y-3 border-b border-slate-200 pb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/80 text-cyan-800 text-xs font-bold">
            <Scale className="w-3.5 h-3.5 text-cyan-600" />
            <span>Legal Documentation & Policies</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
            Terms &amp; Conditions of Commercial Sale
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Last Updated: September 2026 • Governing Law: Jurisdiction of Visakhapatnam Courts, Andhra Pradesh, India
          </p>
        </div>

        {/* Content Sections */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8 text-slate-700 text-sm leading-relaxed">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">1</span>
              Commercial Quotations &amp; Price Validity
            </h2>
            <p>
              All quotations generated via <strong>Tanmayee Technologies</strong> (operating online at tanmayeetechnologies.com and physically at PM Palem, Madhurawada, Visakhapatnam) represent indicative wholesale rates for commercial HVAC air conditioners and industrial refrigeration appliances manufactured by <strong>Blue Star Limited</strong> and <strong>Rockwell Industries Limited</strong>.
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li>Formal stamped quotations remain valid for a duration of <strong>15 calendar days</strong> from issuance date unless expressly stated otherwise in writing.</li>
              <li>Final invoice prices are subject to raw material copper and statutory GST rate revisions enacted by the Central or State Governments of India.</li>
              <li>Bulk volume tier discounts require verified PO issuance and advance mobilization payment.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">2</span>
              GST Invoicing &amp; Tax Compliance
            </h2>
            <p>
              Tanmayee Technologies is a registered corporate enterprise under the Goods and Services Tax (GST) Act of India.
            </p>
            <p className="text-xs sm:text-sm text-slate-600">
              Tax invoices will be issued including valid corporate GSTINs supplied by buyers, enabling 100% eligible Input Tax Credit (ITC) claiming under relevant HSN codes (8415 for Air Conditioners, 8418 for Refrigerators/Freezers).
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">3</span>
              Manufacturer Warranty &amp; Service SLAs
            </h2>
            <p>
              As authorized sales and service partners:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-slate-600 text-xs sm:text-sm">
              <li><strong>Blue Star Products:</strong> Backed by Blue Star Limited factory warranty (typically 1 year comprehensive on unit, and up to 5 or 10 years on inverter compressors).</li>
              <li><strong>Rockwell Refrigeration:</strong> Backed by Rockwell standard factory warranty on tanks, coils, and heavy-duty tropical compressors.</li>
              <li>Warranty validation is strictly fulfilled through serialized manufacturer QR cards and OEM-authorized service center logs.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">4</span>
              Logistics, Dispatch &amp; Turnkey Installation
            </h2>
            <p>
              Delivery spans Visakhapatnam, Vizianagaram, Srikakulam, Anakapalle, Kakinada, and wider Andhra Pradesh &amp; Telangana. Standard turnkey installation includes outdoor bracket placement, standard copper piping, and core electrical interconnects. Extended piping, core cutting, or structural scaffolding will be itemized separately on the site inspection report.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center text-xs font-black">5</span>
              Dispute Resolution &amp; Jurisdiction
            </h2>
            <p>
              Any disputes, controversies, or claims arising out of commercial transactions, tenders, or supply agreements with Tanmayee Technologies shall be governed exclusively by the laws of India and subject to the exclusive jurisdiction of the competent courts in <strong>Visakhapatnam, Andhra Pradesh</strong>.
            </p>
          </section>

          {/* Contact Box */}
          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-2 text-xs">
            <div className="font-bold text-slate-900">Commercial Contact &amp; Grievances:</div>
            <div>Tanmayee Technologies • Plot No. SFS MIG-131, Housing Board Colony PM Palem, Madhurawada, Visakhapatnam – 530041</div>
            <div>Direct Phone: {COMPANY.PHONE_DISPLAY} • Email: {COMPANY.EMAIL}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
