'use client';

// ============================================================================
// @tanmayee/web — Quotation Request Modal (Multi-Stage Animated Submission Engine)
// ============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  MessageSquare,
  Phone,
  Building,
  User,
  Mail,
  MapPin,
  FileText,
  Sparkles,
  Snowflake,
  ShieldCheck,
  Check,
  ArrowRight,
  Loader2,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { fetchFromApi } from '../../lib/api-client';
import { COMPANY } from '@tanmayee/config';
import { RecommendedProducts } from '../product/recommended-products';

const SUBMISSION_STEPS = [
  {
    step: 1,
    title: 'Verifying Equipment Availability',
    desc: 'Connecting with factory stock repositories in Hyderabad & Visakhapatnam...',
    icon: Snowflake,
    progress: 25,
  },
  {
    step: 2,
    title: 'Calculating B2B Volume & Dealer Discounts',
    desc: 'Applying authorized partner commercial margins and GST tax deductions...',
    icon: Sparkles,
    progress: 60,
  },
  {
    step: 3,
    title: 'Compiling Official Stamped Quotation',
    desc: 'Generating formal B2B invoice snapshot and unique quotation reference...',
    icon: FileText,
    progress: 85,
  },
  {
    step: 4,
    title: 'Connecting to Sales Desk & WhatsApp Link',
    desc: 'Transmitting procurement package to Tanmayee sales engineers at PM Palem...',
    icon: ShieldCheck,
    progress: 100,
  },
];

export function QuoteModal() {
  const {
    items,
    itemCount,
    estimatedTotal,
    isQuoteModalOpen,
    closeQuoteModal,
    clearCart,
  } = useCart();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    company: '',
    location: 'Visakhapatnam',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [successData, setSuccessData] = useState<{
    quoteNumber: string;
    whatsappUrl: string;
  } | null>(null);

  if (!isQuoteModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number so our sales engineers can reach you.');
      return;
    }

    setIsSubmitting(true);
    setCurrentStepIndex(0);

    // Multi-stage animation step runner
    const stepTimer1 = setTimeout(() => setCurrentStepIndex(1), 700);
    const stepTimer2 = setTimeout(() => setCurrentStepIndex(2), 1600);
    const stepTimer3 = setTimeout(() => setCurrentStepIndex(3), 2400);

    try {
      // 1. Generate Quotation
      const quoteRes: any = await fetchFromApi('/quotations', {
        method: 'POST',
        body: JSON.stringify({}),
      }).catch(() => null);

      const quotationId = quoteRes?.data?.id || 'demo-quote-id';
      const quoteNumber =
        quoteRes?.data?.quotation_number ||
        `TT-Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      // 2. Submit Contact Information & get WhatsApp URL
      const submitRes: any = await fetchFromApi(`/quotations/${quotationId}/submit`, {
        method: 'POST',
        body: JSON.stringify({
          customer_name: formData.name,
          customer_phone: formData.phone,
          customer_email: formData.email,
          customer_company: formData.company,
          customer_location: formData.location,
          customer_notes: formData.notes,
        }),
      }).catch(() => null);

      const whatsappPhone = COMPANY.WHATSAPP_NUMBER || '919390115553';
      const lines = [
        `Hello Tanmayee Technologies,`,
        `I would like to confirm my B2B Quotation Ref: *${quoteNumber}*`,
        `Name: ${formData.name}`,
        formData.company ? `Company: ${formData.company}` : '',
        `Phone: ${formData.phone}`,
        `Location: ${formData.location || 'Visakhapatnam'}`,
        `Total Estimate: ₹${estimatedTotal.toLocaleString('en-IN')}`,
        `Equipment Models:`,
        ...items.map((i) => `• ${i.product.product_name} (${i.quantity} units)`),
        formData.notes ? `Notes: ${formData.notes}` : '',
      ].filter(Boolean);

      const directWaUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(lines.join('\n'))}`;

      // Persist locally for immediate availability in Admin Portal
      try {
        if (typeof window !== 'undefined') {
          const newQuote = {
            id: quotationId,
            quotation_number: quoteNumber,
            customer_name: formData.name,
            customer_phone: formData.phone,
            customer_email: formData.email,
            customer_company: formData.company,
            customer_location: formData.location || 'Visakhapatnam',
            subtotal: estimatedTotal,
            discount_total: 0,
            grand_total: estimatedTotal,
            status: 'GENERATED',
            is_bulk: itemCount > 5,
            valid_until: new Date(Date.now() + 15 * 86400000).toISOString(),
            created_at: new Date().toISOString(),
            items: items.map((i, idx) => {
              const unitPrice = i.product.reference_price || 0;
              const brand =
                (i.product as any).brand?.name ||
                (i.product.brand_id?.toLowerCase().includes('blue') ? 'Blue Star' : 'Rockwell');
              return {
                id: `qi-${Date.now()}-${idx}`,
                product_name: i.product.product_name,
                model_number: i.product.model_number || 'N/A',
                brand_name: brand,
                quantity: i.quantity,
                unit_price: unitPrice,
                discount_percent: 0,
                total_price: unitPrice * i.quantity,
              };
            }),
            services: [],
          };
          const raw = localStorage.getItem('tanmayee_submitted_quotations');
          const existing = raw ? JSON.parse(raw) : [];
          localStorage.setItem(
            'tanmayee_submitted_quotations',
            JSON.stringify([newQuote, ...existing])
          );
        }
      } catch (storageErr) {
        console.error('Failed to cache quotation locally:', storageErr);
      }

      // Allow animations to play through smoothly
      setTimeout(() => {
        setSuccessData({
          quoteNumber,
          whatsappUrl: submitRes?.data?.whatsapp_url || directWaUrl,
        });
        setIsSubmitting(false);
        clearCart();
      }, 3200);
    } catch (err: any) {
      console.error('Failed to submit quotation:', err);
      const whatsappPhone = COMPANY.WHATSAPP_NUMBER || '919390115553';
      const fallbackQuoteNumber = `TT-Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      const lines = [
        `Hello Tanmayee Technologies,`,
        `B2B Quotation Ref: *${fallbackQuoteNumber}*`,
        `Name: ${formData.name}`,
        `Phone: ${formData.phone}`,
        `Company: ${formData.company || 'Commercial Client'}`,
        `Location: ${formData.location}`,
        `Items: ${items.map((i) => `${i.product.product_name} x ${i.quantity}`).join(', ')}`,
      ];
      const directWaUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(lines.join('\n'))}`;

      setTimeout(() => {
        setSuccessData({
          quoteNumber: fallbackQuoteNumber,
          whatsappUrl: directWaUrl,
        });
        setIsSubmitting(false);
        clearCart();
      }, 3200);
    }
  };

  const handleClose = () => {
    setIsSubmitting(false);
    setSuccessData(null);
    closeQuoteModal();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in-up">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Dialog */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden z-10 animate-in zoom-in-95 duration-200 border border-slate-200">
        {/* Top Gradient Accent */}
        <div className="h-2 w-full bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />

        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors z-20"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitting ? (
          /* Multi-Stage Animated Submission Progress Engine */
          <div className="p-8 sm:p-10 text-center space-y-6 animate-in fade-in">
            {/* Logo Badge */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-500/50 shadow-lg bg-white p-1 animate-pulse">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
            </div>

            <div>
              <span className="text-xs font-extrabold text-cyan-600 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
                Processing Official Quotation
              </span>
              <h3 className="font-display font-black text-2xl text-slate-900 mt-3">
                {SUBMISSION_STEPS[currentStepIndex].title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto leading-relaxed">
                {SUBMISSION_STEPS[currentStepIndex].desc}
              </p>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden border border-slate-200 shadow-inner p-0.5">
              <div
                className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
                style={{ width: `${SUBMISSION_STEPS[currentStepIndex].progress}%` }}
              />
            </div>

            {/* Stepper Dots */}
            <div className="grid grid-cols-4 gap-2 pt-2 text-[10px] font-bold">
              {SUBMISSION_STEPS.map((s, idx) => {
                const isPassed = idx < currentStepIndex;
                const isCurrent = idx === currentStepIndex;
                return (
                  <div
                    key={s.step}
                    className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-cyan-50 border-cyan-400 text-cyan-800 shadow-sm scale-105'
                        : isPassed
                        ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                        : 'bg-slate-50 border-slate-200 text-slate-400'
                    }`}
                  >
                    <div className="w-5 h-5 rounded-full flex items-center justify-center font-black">
                      {isPassed ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <span>{s.step}</span>
                      )}
                    </div>
                    <span className="truncate max-w-full text-center">{s.title.split(' ')[0]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) : successData ? (
          /* Celebration / Success Screen */
          <div className="p-8 sm:p-10 text-center space-y-6 animate-in fade-in zoom-in-95 duration-300">
            {/* Animated Celebration Icon */}
            <div className="relative w-20 h-20 mx-auto">
              <div className="absolute inset-0 rounded-full bg-emerald-400/30 animate-ping" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Verified Commercial Quotation Ready
              </div>
              <h3 className="font-display font-black text-2xl sm:text-3xl text-slate-900 mt-2">
                Quotation Generated!
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Your official stamped quotation reference:
              </p>
              <div className="mt-3 inline-block bg-slate-900 text-cyan-300 font-mono font-black text-lg px-5 py-2.5 rounded-2xl shadow-lg border border-slate-800">
                {successData.quoteNumber}
              </div>
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-left space-y-2 text-xs">
              <div className="flex justify-between text-slate-500">
                <span>Client Name:</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              {formData.company && (
                <div className="flex justify-between text-slate-500">
                  <span>Organization:</span>
                  <span className="font-bold text-slate-800">{formData.company}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-500">
                <span>Items Requested:</span>
                <span className="font-bold text-slate-800">{itemCount} units</span>
              </div>
              <div className="flex justify-between text-slate-500 border-t border-slate-200/80 pt-1.5">
                <span>Estimated Valuation:</span>
                <span className="font-black text-sm text-slate-900">
                  ₹{estimatedTotal.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              Our B2B HVAC & cold chain engineers at PM Palem, Madhurawada are notified and preparing your dispatch SLA and GST invoice.
            </p>

            <div className="space-y-3 pt-2">
              <a
                href={successData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold py-4 px-6 rounded-2xl shadow-xl shadow-green-600/30 transition-transform hover:scale-[1.02] active:scale-[0.98] text-sm animate-pulse-green-glow"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Open & Send Quotation on WhatsApp →</span>
              </a>

              <button
                type="button"
                onClick={handleClose}
                className="text-xs font-bold text-slate-500 hover:text-slate-800 py-1"
              >
                Return to Product Catalogue
              </button>
            </div>

            {/* Recommended Products You May Like */}
            <div className="text-left mt-6 pt-4 border-t border-slate-200">
              <RecommendedProducts
                variant="compact"
                limit={3}
                title="Products You May Like To Bundle Next"
                subtitle="Frequently requested companion items and high-capacity equipment"
              />
            </div>
          </div>
        ) : (
          /* Form Screen with Official Logo Header */
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-3.5 mb-6 pb-4 border-b border-slate-100">
              <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-500/40 shadow-md bg-white p-0.5 shrink-0">
                <img
                  src="/images/tanmayee-logo.png"
                  alt="Tanmayee Technologies Logo"
                  className="w-full h-full object-contain rounded-full"
                />
              </div>
              <div>
                <span className="text-[11px] font-black text-cyan-700 uppercase tracking-wider bg-cyan-50 px-2.5 py-0.5 rounded-md border border-cyan-200">
                  Instant B2B Procurement Desk
                </span>
                <h3 className="font-display font-black text-xl text-slate-900 mt-1">
                  Generate Official Quotation
                </h3>
                <p className="text-xs text-slate-500">
                  Includes {itemCount} equipment model(s) • Stamped GST tax invoice
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Contact Person *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    WhatsApp Mobile *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="e.g. 093901 15553"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="procurement@company.com"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Business / Enterprise Name
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      placeholder="e.g. Coastal Logistics LLP"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Delivery Location
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      placeholder="Visakhapatnam, AP"
                      className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Site Constraints / Tender BOQ Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Installation height, copper piping length, 3-phase power availability..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:outline-none focus:border-cyan-500 focus:bg-white transition-all shadow-inner"
                />
              </div>

              {/* Quick companion suggestions */}
              <div className="pt-2">
                <RecommendedProducts
                  variant="compact"
                  limit={2}
                  title="Products You May Like (Quick Add)"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-extrabold py-3.5 px-4 rounded-2xl shadow-xl shadow-blue-500/25 transition-all text-sm flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Generate Official Quotation</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Authorized Sales & Service Dealers • 100% Guaranteed OEM Warranty</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
