'use client';

// ============================================================================
// @tanmayee/web — Dedicated Wishlist Page (/wishlist)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, FileText, ArrowRight, ShoppingBag, Snowflake } from 'lucide-react';
import { useUserStore } from '../../lib/user-store-context';
import { useCart } from '../../lib/cart-context';
import { ProductCard } from '../../components/product/product-card';
import { RecommendedProducts } from '../../components/product/recommended-products';

export default function WishlistPage() {
  const { wishlist, wishlistCount, removeFromWishlist } = useUserStore();
  const { addToCart, openDrawer } = useCart();

  const handleAddAllToQuote = () => {
    wishlist.forEach((product) => addToCart(product, 1));
    openDrawer();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold mb-2">
              <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
              <span>Saved Equipment ({wishlistCount})</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              My Saved Wishlist
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Keep track of commercial air conditioners and refrigeration units for upcoming project tenders.
            </p>
          </div>

          {wishlistCount > 0 && (
            <button
              type="button"
              onClick={handleAddAllToQuote}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 hover:from-blue-800 hover:to-cyan-700 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span>Add All to Quotation ({wishlistCount})</span>
            </button>
          )}
        </div>

        {/* Content */}
        {wishlistCount === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-rose-50 flex items-center justify-center mx-auto text-rose-400">
              <Heart className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">Your wishlist is empty</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Click the heart icon on any Blue Star AC or Rockwell freezer to bookmark models for your facility.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}

        {/* Products You May Like */}
        <div className="pt-8">
          <RecommendedProducts
            title="Products You May Like"
            subtitle="Based on your saved products and popular equipment choices"
            limit={4}
          />
        </div>
      </div>
    </div>
  );
}
