'use client';

// ============================================================================
// @tanmayee/web — Cart Drawer Component
// ============================================================================

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { useCart } from '../../lib/cart-context';

export function CartDrawer() {
  const {
    items,
    itemCount,
    subtotal,
    isBulk,
    discountPct,
    discountAmount,
    estimatedTotal,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    openQuoteModal,
  } = useCart();

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in"
        onClick={closeDrawer}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-brand-600" />
              <h2 className="font-display font-bold text-lg text-slate-900">
                Quotation Cart
              </h2>
              <span className="text-xs bg-brand-100 text-brand-800 font-bold px-2 py-0.5 rounded-full">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </div>
            <button
              type="button"
              onClick={closeDrawer}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Bulk Threshold Banner */}
          {isBulk ? (
            <div className="bg-gradient-to-r from-frost-50 to-emerald-50 border-y border-emerald-100 px-6 py-3 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-emerald-600 shrink-0" />
              <div className="text-xs text-emerald-900">
                <span className="font-bold">Bulk Discount Applied!</span> You unlocked an estimated{' '}
                <span className="font-extrabold">{discountPct}% B2B commercial rebate</span>.
              </div>
            </div>
          ) : (
            <div className="bg-sky-50/70 border-y border-sky-100 px-6 py-2.5 flex items-center gap-2 text-xs text-sky-900">
              <Tag className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                Add {Math.max(1, 5 - itemCount)} more unit(s) to unlock tiered bulk B2B pricing!
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-slate-700 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs max-w-xs mb-6 text-slate-500">
                  Add air conditioners, freezers, or commercial cooling equipment to generate your instant B2B quotation.
                </p>
                <button
                  type="button"
                  onClick={closeDrawer}
                  className="bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-5 py-2.5 rounded-xl shadow-md transition-colors"
                >
                  Browse Catalogue
                </button>
              </div>
            ) : (
              items.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex gap-4 p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl relative group"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 bg-white rounded-xl border border-slate-200 overflow-hidden relative shrink-0">
                    <img
                      src={product.media?.[0]?.url || 'https://images.unsplash.com/photo-1614633833026-06203511433f?auto=format&fit=crop&w=300&q=80'}
                      alt={product.product_name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold text-brand-700 uppercase tracking-wider">
                      {(product as any).brand_name}
                    </div>
                    <h4 className="text-xs font-semibold text-slate-900 truncate">
                      {product.product_name}
                    </h4>
                    {product.model_number && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        Model: {product.model_number}
                      </div>
                    )}

                    <div className="mt-2 flex items-center justify-between">
                      {/* Price / Quote indicator */}
                      <div className="text-xs font-bold text-slate-900">
                        {product.reference_price ? (
                          <>₹{(product.reference_price * quantity).toLocaleString('en-IN')}</>
                        ) : (
                          <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px]">
                            Custom Quote
                          </span>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center border border-slate-200 bg-white rounded-lg overflow-hidden shadow-sm">
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-slate-800">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="p-1 hover:bg-slate-100 text-slate-600"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="text-slate-400 hover:text-red-500 p-1 self-start transition-colors"
                    title="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Summary & Proceed */}
          {items.length > 0 && (
            <div className="border-t border-slate-200 p-6 bg-slate-50/50 space-y-4">
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal ({itemCount} units):</span>
                  <span className="font-semibold text-slate-900">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                {isBulk && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Bulk Savings ({discountPct}%):</span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-200">
                  <span>Estimated Total:</span>
                  <span className="text-brand-700 text-base">
                    ₹{estimatedTotal.toLocaleString('en-IN')}*
                  </span>
                </div>
                <p className="text-[10px] text-slate-500 italic pt-1">
                  *Indicative estimate. Official stamped quote includes applicable GST, logistics, and installation terms.
                </p>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    closeDrawer();
                    openQuoteModal();
                  }}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-600 to-brand-700 hover:from-brand-700 hover:to-brand-800 text-white py-3.5 px-4 rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:scale-[1.01]"
                >
                  <span>Generate Official Quotatio</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <Link
                  href="/cart"
                  onClick={closeDrawer}
                  className="block text-center text-xs font-semibold text-slate-600 hover:text-slate-900 py-2"
                >
                  View Complete Cart Page
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
