'use client';

// ============================================================================
// @tanmayee/web — Wishlist Drawer Component
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { X, Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useUserStore } from '../../lib/user-store-context';
import { useCart } from '../../lib/cart-context';

export function WishlistDrawer() {
  const { wishlist, wishlistCount, isWishlistOpen, closeWishlist, removeFromWishlist } = useUserStore();
  const { addToCart, openDrawer } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={closeWishlist}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500">
                <Heart className="w-4 h-4 fill-rose-500" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-slate-900">
                  Your Wishlist
                </h3>
                <p className="text-[11px] text-slate-500 font-medium">
                  {wishlistCount} {wishlistCount === 1 ? 'saved product' : 'saved products'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeWishlist}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              aria-label="Close wishlist"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* List of items */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {wishlist.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto text-slate-300">
                  <Heart className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-800">Your wishlist is empty</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Click the heart icon on any Blue Star AC or Rockwell refrigeration product to save it here for later.
                  </p>
                </div>
                <Link
                  href="/products"
                  onClick={closeWishlist}
                  className="inline-flex items-center gap-1.5 bg-[#0284c7] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-sm"
                >
                  <span>Browse Products</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              wishlist.map((product) => {
                const prodAny = product as any;
                const imageUrl = prodAny.media?.[0]?.url || '/images/categories/air-conditioners.jpg';

                return (
                  <div
                    key={product.id}
                    className="flex gap-3.5 p-3 rounded-2xl border border-slate-200 bg-white hover:border-[#0284c7]/40 shadow-sm transition-all"
                  >
                    {/* Thumbnail */}
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeWishlist}
                      className="w-20 h-20 rounded-xl bg-slate-50 border border-slate-100 p-1.5 flex items-center justify-center shrink-0 overflow-hidden"
                    >
                      <img
                        src={imageUrl}
                        alt={product.product_name}
                        className="w-full h-full object-contain"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-black uppercase text-[#0284c7]">
                            {prodAny.brand_name || 'Commercial'}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeFromWishlist(product.id)}
                            className="text-slate-400 hover:text-rose-500 p-0.5 transition-colors"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <Link
                          href={`/products/${product.slug}`}
                          onClick={closeWishlist}
                          className="font-bold text-xs text-slate-800 hover:text-[#0284c7] transition-colors line-clamp-1 block"
                        >
                          {product.product_name}
                        </Link>

                        {product.model_number && (
                          <span className="text-[10px] font-mono text-slate-400 block mt-0.5">
                            Model: {product.model_number}
                          </span>
                        )}
                      </div>

                      {/* Action: Add to Quote */}
                      <div className="pt-2 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">
                          {product.reference_price
                            ? `₹${product.reference_price.toLocaleString('en-IN')}`
                            : 'Price on Quote'}
                        </span>

                        <button
                          type="button"
                          onClick={() => {
                            addToCart(product);
                            closeWishlist();
                            openDrawer();
                          }}
                          className="inline-flex items-center gap-1.5 bg-[#0b2847] hover:bg-[#0284c7] text-white text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                        >
                          <ShoppingBag className="w-3 h-3" />
                          <span>Add to Quote</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
