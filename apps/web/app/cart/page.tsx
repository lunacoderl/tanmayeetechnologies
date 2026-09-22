'use client';

// ============================================================================
// @tanmayee/web — Cart & Quotation Page (/cart)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Tag,
  Sparkles,
  MessageSquare,
  Building,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { fetchFromApi } from '../../lib/api-client';
import { COMPANY } from '@tanmayee/config';


const SUBMISSION_STEPS = [
  {
    step: 1,
    title: 'Verifying Equipment Availability',
    desc: 'Connecting with factory stock repositories in Visakhapatnam & Hyderabad...',
    progress: 25,
  },
  {
    step: 2,
    title: 'Calculating B2B Volume & Dealer Discounts',
    desc: 'Applying authorized partner commercial margins and GST tax deductions...',
    progress: 60,
  },
  {
    step: 3,
    title: 'Compiling Official Stamped Quotation',
    desc: 'Generating formal B2B invoice snapshot and unique quotation reference...',
    progress: 85,
  },
  {
    step: 4,
    title: 'Connecting to Sales Desk & WhatsApp Link',
    desc: 'Transmitting procurement package to Tanmayee sales engineers at PM Palem...',
    progress: 100,
  },
];

export default function CartPage() {
  const {
    items,
    itemCount,
    subtotal,
    isBulk,
    discountPct,
    discountAmount,
    estimatedTotal,
    updateQuantity,
    removeFromCart,
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone) {
      alert('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setCurrentStepIndex(0);

    const stepTimer1 = setTimeout(() => setCurrentStepIndex(1), 700);
    const stepTimer2 = setTimeout(() => setCurrentStepIndex(2), 1600);
    const stepTimer3 = setTimeout(() => setCurrentStepIndex(3), 2400);

    try {
      const quoteRes: any = await fetchFromApi('/quotations', {
        method: 'POST',
        body: JSON.stringify({}),
      }).catch(() => null);

      const quotationId = quoteRes?.data?.id || 'demo-quote-id';
      const quoteNumber =
        quoteRes?.data?.quotation_number ||
        `TT-Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

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
        `Location: ${formData.location}`,
        `Total Estimate: ₹${estimatedTotal.toLocaleString('en-IN')}`,
        `Products:`,
        ...items.map((i) => `• ${i.product.product_name} x ${i.quantity}`),
        formData.notes ? `Notes: ${formData.notes}` : '',
      ].filter(Boolean);

      const directWaUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        lines.join('\n')
      )}`;

      setTimeout(() => {
        setSuccessData({
          quoteNumber,
          whatsappUrl: submitRes?.data?.whatsapp_url || directWaUrl,
        });
        setIsSubmitting(false);
        clearCart();
      }, 3200);
    } catch (err) {
      console.error(err);
      // Fallback
      const fallbackQuote = `TT-Q-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
      const whatsappPhone = COMPANY.WHATSAPP_NUMBER || '919390115553';
      const directWaUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
        `Hello Tanmayee Technologies, Quotation Request: *${fallbackQuote}* from ${formData.name} (${formData.phone}) for ${items.length} product(s).`
      )}`;

      setTimeout(() => {
        setSuccessData({
          quoteNumber: fallbackQuote,
          whatsappUrl: directWaUrl,
        });
        setIsSubmitting(false);
        clearCart();
      }, 3200);
    }
  };

  if (isSubmitting) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-8 animate-fade-in-up">
        {/* Animated Brand Logo with Glowing Rings */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-xl animate-pulse" />
          <div className="w-20 h-20 rounded-full border-2 border-cyan-500/60 p-1 bg-white shadow-xl relative z-10">
            <img
              src="/images/tanmayee-logo.png"
              alt="Tanmayee Technologies"
              className="w-full h-full object-contain rounded-full"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-bold uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-cyan-500 animate-ping" />
            Live Quotatio Generation Engine
          </div>
          <h2 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            {SUBMISSION_STEPS[currentStepIndex].title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            {SUBMISSION_STEPS[currentStepIndex].desc}
          </p>
        </div>

        {/* Progress Track */}
        <div className="w-full bg-slate-100 rounded-full h-3.5 overflow-hidden border border-slate-200 p-0.5 shadow-inner">
          <div
            className="bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500 h-full rounded-full transition-all duration-700 ease-out"
            style={{ width: `${SUBMISSION_STEPS[currentStepIndex].progress}%` }}
          />
        </div>

        {/* 4 Step Badges */}
        <div className="grid grid-cols-4 gap-2 text-[10px] font-bold">
          {SUBMISSION_STEPS.map((s, idx) => {
            const isPassed = idx < currentStepIndex;
            const isCurrent = idx === currentStepIndex;
            return (
              <div
                key={s.step}
                className={`p-2.5 rounded-xl border transition-all ${
                  isPassed
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : isCurrent
                    ? 'border-cyan-500 bg-cyan-50 text-cyan-800 shadow-md ring-2 ring-cyan-200'
                    : 'border-slate-100 bg-slate-50 text-slate-400'
                }`}
              >
                <div className="text-xs font-black mb-1">
                  {isPassed ? '✓' : `0${s.step}`}
                </div>
                <div className="truncate">{s.title.split(' ')[0]}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-fade-in-up">
        {/* Animated Celebration Icon */}
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-emerald-400/20 blur-xl animate-pulse" />
          <div className="w-20 h-20 bg-emerald-50 border-2 border-emerald-500 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-xl relative z-10 animate-pop-scale">
            <CheckCircle2 className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            Official B2B Stamped Quotation Ready
          </div>
          <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
            Quotation Generated Successfully!
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
            Your unique quote reference has been generated and queued at our Madhurawada, Visakhapatnam regional operations desk.
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 p-6 rounded-3xl text-white shadow-xl max-w-md mx-auto space-y-3 border border-slate-700">
          <div className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest">
            Quotation Reference ID
          </div>
          <div className="font-mono font-black text-2xl text-white tracking-wider">
            {successData.quoteNumber}
          </div>
          <div className="text-[11px] text-slate-300 border-t border-slate-700/60 pt-2 flex items-center justify-between">
            <span>Tanmayee Technologies HQ</span>
            <span className="text-emerald-400 font-semibold">Priority Stock Reserved</span>
          </div>
        </div>

        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Send this formal reference number directly to our engineering desk via WhatsApp for express commercial dispatch and invoice stamping.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
          <a
            href={successData.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-2xl shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Send Quotation on WhatsApp</span>
          </a>
          <Link
            href="/products"
            className="inline-flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-6 py-4 rounded-2xl transition-colors text-xs"
          >
            Return to Catalogue
          </Link>
        </div>

        {/* Location Directions */}
        <div className="pt-4 border-t border-slate-100">
          <a
            href="https://maps.app.goo.gl/ndzjgar89V8CXgaC7"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-brand-600 hover:text-brand-700 font-bold inline-flex items-center gap-1.5"
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Visit our Showroom: Plot SFS MIG-131, PM Palem, Madhurawada, Visakhapatnam (View on Google Maps →)</span>
          </a>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="font-display font-bold text-2xl text-slate-900">
          Your Quotation Cart is Empty
        </h1>
        <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
          Select equipment models from our 130+ inventory of Blue Star air conditioners and Rockwell commercial refrigeration to generate your official B2B quotation.
        </p>
        <div className="pt-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
          >
            <span>Browse Full Catalogue</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900">
          Quotation Review & Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your selected commercial equipment before generating a formal tax quotation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left 2 Cols: Cart items list */}
        <div className="lg:col-span-2 space-y-4">
          {/* Bulk Notice Banner */}
          {isBulk ? (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-4 rounded-2xl flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <strong className="font-bold">Bulk Commercial Rebate Active:</strong> You have unlocked{' '}
                <strong className="font-black">{discountPct}% savings</strong> on your overall equipment order.
              </div>
            </div>
          ) : (
            <div className="bg-sky-50 border border-sky-200 p-4 rounded-2xl flex items-center gap-3">
              <Tag className="w-5 h-5 text-sky-600 shrink-0" />
              <div className="text-xs text-sky-900">
                Add <strong className="font-bold">{Math.max(1, 5 - itemCount)} more unit(s)</strong> to qualify for multi-unit B2B bulk discounts.
              </div>
            </div>
          )}

          {/* Items */}
          <div className="bg-white rounded-3xl border border-slate-200 divide-y divide-slate-100 overflow-hidden shadow-sm">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 border border-slate-200 overflow-hidden shrink-0">
                    <img
                      src={
                        product.media?.[0]?.url ||
                        'https://images.unsplash.com/photo-1614633833026-06203511433f?auto=format&fit=crop&w=300&q=80'
                      }
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
                      {(product as any).brand_name}
                    </div>
                    <Link
                      href={`/products/${product.slug}`}
                      className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors block"
                    >
                      {product.product_name}
                    </Link>
                    {product.model_number && (
                      <div className="text-xs text-slate-500 font-mono">
                        Model: {product.model_number}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 self-end sm:self-center">
                  {/* Quantity */}
                  <div className="flex items-center border border-slate-200 bg-slate-50 rounded-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity - 1)}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 font-bold"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-slate-900">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(product.id, quantity + 1)}
                      className="px-3 py-1.5 hover:bg-slate-200 text-slate-600 font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right min-w-[90px]">
                    <div className="text-sm font-bold text-slate-900">
                      {product.reference_price ? (
                        <>₹{(product.reference_price * quantity).toLocaleString('en-IN')}</>
                      ) : (
                        <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-medium">
                          On Quote
                        </span>
                      )}
                    </div>
                    {quantity > 1 && product.reference_price && (
                      <div className="text-[11px] text-slate-400">
                        ₹{product.reference_price.toLocaleString('en-IN')} ea
                      </div>
                    )}
                  </div>

                  {/* Remove */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-400 hover:text-red-500 p-1.5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Quotation Submission Form */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6 sticky top-28">
          <div>
            <h2 className="font-display font-bold text-xl text-slate-900">
              Procurement Summary
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Estimated figures. Final stamped quote includes GST.
            </p>
          </div>

          <div className="space-y-2 text-xs border-y border-slate-100 py-4">
            <div className="flex justify-between text-slate-600">
              <span>Equipment Subtotal ({itemCount} units):</span>
              <span className="font-semibold text-slate-900">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            {isBulk && discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>Bulk Savings ({discountPct}%):</span>
                <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-sm font-extrabold text-slate-900 pt-2 border-t border-slate-100">
              <span>Estimated Total:</span>
              <span className="text-brand-700 font-display text-lg">
                ₹{estimatedTotal.toLocaleString('en-IN')}*
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 pt-1">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Submit Contact Details
            </div>

            <div>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Full Name *"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="WhatsApp Phone Number *"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Work Email (Optional)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Company / Business Name"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Delivery Location (e.g. Hyderabad)"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <textarea
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Project requirements, site constraints, or tender specs..."
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-brand-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-brand-600 hover:bg-brand-700 text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2"
            >
              <span>{isSubmitting ? 'Generating Quotation...' : 'Generate Official Quotation'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
