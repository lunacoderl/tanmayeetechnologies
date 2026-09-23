'use client';

// ============================================================================
// @tanmayee/web — Product Comparison Modal & Floating Bar
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { X, Scale, ShoppingBag, ArrowRight, Trash2, CheckCircle2 } from 'lucide-react';
import { useUserStore } from '../../lib/user-store-context';
import { useCart } from '../../lib/cart-context';

export function CompareBar() {
  const { compareList, compareCount, isCompareOpen, openCompare, closeCompare, removeFromCompare, clearCompare } =
    useUserStore();
  const { addToCart, openDrawer } = useCart();

  return (
    <>
      {/* Floating Bottom Bar (visible when at least 1 item is in compare) */}
      {compareCount > 0 && !isCompareOpen && (
        <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-40 bg-[#0b2847]/95 backdrop-blur-md text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center gap-4 animate-pop-scale max-w-lg w-[92%] sm:w-auto">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
              <Scale className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold leading-tight">
                Compare Products ({compareCount}/4)
              </div>
              <div className="text-[10px] text-slate-300">
                Side-by-side technical specs
              </div>
            </div>
          </div>

          {/* Quick thumbnails */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            {compareList.map((p) => (
              <div
                key={p.id}
                className="relative w-8 h-8 rounded-lg bg-white p-0.5 border border-white/30 shrink-0"
              >
                <img
                  src={p.media?.[0]?.url || '/images/categories/air-conditioners.jpg'}
                  alt={p.product_name}
                  className="w-full h-full object-contain"
                />
                <button
                  type="button"
                  onClick={() => removeFromCompare(p.id)}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-rose-600 text-white rounded-full flex items-center justify-center text-[8px]"
                  title="Remove"
                >
                  ×
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={openCompare}
              className="bg-[#0284c7] hover:bg-[#0369a1] text-white font-bold text-xs px-3.5 py-1.5 rounded-xl transition-colors whitespace-nowrap"
            >
              Compare Now
            </button>
            <button
              type="button"
              onClick={clearCompare}
              className="text-slate-400 hover:text-white p-1 text-xs"
              title="Clear all"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Full Screen Comparison Modal */}
      {isCompareOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm p-4 sm:p-6 lg:p-10 flex items-center justify-center animate-fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[90vh] flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-5 sm:p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-[#0284c7]">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-display font-black text-lg text-slate-900">
                    Product Specifications Comparison
                  </h3>
                  <p className="text-xs text-slate-500">
                    Compare technical parameters, capacities, warranties, and models
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Clear All
                </button>
                <button
                  type="button"
                  onClick={closeCompare}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  aria-label="Close compare"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Comparison Matrix */}
            <div className="flex-1 overflow-x-auto p-5 sm:p-6">
              {compareList.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-sm text-slate-500">No products selected for comparison.</p>
                </div>
              ) : (
                <div className="min-w-[600px] grid grid-cols-5 gap-4 divide-x divide-slate-100">
                  {/* Left Parameter Labels Column */}
                  <div className="space-y-6 pt-28 text-xs font-bold text-slate-500 uppercase tracking-wider pr-2">
                    <div className="h-10 flex items-center">Brand</div>
                    <div className="h-10 flex items-center">Model Number</div>
                    <div className="h-10 flex items-center">Category</div>
                    <div className="h-10 flex items-center">Capacity</div>
                    <div className="h-10 flex items-center">Warranty</div>
                    <div className="h-10 flex items-center">Price / RFQ</div>
                    <div className="h-12 flex items-center">Procurement</div>
                  </div>

                  {/* Product Columns (up to 4) */}
                  {compareList.map((product) => {
                    const prodAny = product as any;
                    const capacityAttr = prodAny.attributes?.find((a: any) =>
                      a.name.toLowerCase().includes('capacity')
                    );
                    const warrantyAttr = prodAny.warranty || '1 Year Comprehensive';

                    return (
                      <div key={product.id} className="pl-4 space-y-6 flex flex-col justify-between">
                        {/* Top Card Box */}
                        <div className="relative space-y-2">
                          <button
                            type="button"
                            onClick={() => removeFromCompare(product.id)}
                            className="absolute -top-1 -right-1 text-slate-400 hover:text-rose-500 p-1"
                            title="Remove"
                          >
                            <X className="w-4 h-4" />
                          </button>

                          <div className="w-full h-24 rounded-2xl bg-slate-50 border border-slate-100 p-2 flex items-center justify-center">
                            <img
                              src={prodAny.media?.[0]?.url || '/images/categories/air-conditioners.jpg'}
                              alt={product.product_name}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <h4 className="font-bold text-xs text-slate-900 line-clamp-2 h-8">
                            {product.product_name}
                          </h4>
                        </div>

                        {/* Specs Rows */}
                        <div className="space-y-6 text-xs text-slate-700">
                          <div className="h-10 flex items-center font-bold text-[#0284c7]">
                            {prodAny.brand_name || 'Blue Star / Rockwell'}
                          </div>
                          <div className="h-10 flex items-center font-mono font-bold text-slate-900 truncate">
                            {product.model_number || 'N/A'}
                          </div>
                          <div className="h-10 flex items-center text-slate-600 truncate">
                            {prodAny.category_name || 'Commercial Cooling'}
                          </div>
                          <div className="h-10 flex items-center font-extrabold text-slate-900">
                            {capacityAttr?.value || 'Standard'}
                          </div>
                          <div className="h-10 flex items-center text-slate-600">
                            {warrantyAttr}
                          </div>
                          <div className="h-10 flex items-center font-black text-slate-900">
                            {product.reference_price
                              ? `₹${product.reference_price.toLocaleString('en-IN')}`
                              : 'Price on Quote'}
                          </div>
                          <div className="h-12 flex items-center">
                            <button
                              type="button"
                              onClick={() => {
                                addToCart(product);
                                closeCompare();
                                openDrawer();
                              }}
                              className="w-full bg-[#0b2847] hover:bg-[#0284c7] text-white text-[11px] font-bold py-2 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                            >
                              <ShoppingBag className="w-3.5 h-3.5" />
                              <span>Add to Quote</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
