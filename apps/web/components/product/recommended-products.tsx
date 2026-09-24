'use client';

// ============================================================================
// @tanmayee/web — Intelligent Recommended Products Component
// Dynamically driven by user interactions: viewed products, searched queries,
// and preferred categories (localStorage behavior tracking).
// ============================================================================

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, Plus, Check } from 'lucide-react';
import { useUserStore } from '../../lib/user-store-context';
import { useCart } from '../../lib/cart-context';
import { ProductCard } from './product-card';
import { Product } from '@tanmayee/types';

interface RecommendedProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  excludeId?: string;
  variant?: 'grid' | 'compact' | 'drawer';
}

export function RecommendedProducts({
  title = 'Products You May Like',
  subtitle = 'Curated based on your browsing interests, capacity requirements & recent searches',
  limit = 4,
  excludeId,
  variant = 'grid',
}: RecommendedProductsProps) {
  const { getRecommendedProducts } = useUserStore();
  const { addToCart } = useCart();
  const [recommended, setRecommended] = useState<Product[]>([]);
  const [addedIds, setAddedIds] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const products = getRecommendedProducts(limit, excludeId ? [excludeId] : []);
    setRecommended(products);
  }, [limit, excludeId, getRecommendedProducts]);

  if (recommended.length === 0) return null;

  const handleAddMini = (e: React.MouseEvent, product: Product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedIds((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedIds((prev) => ({ ...prev, [product.id]: false }));
    }, 2500);
  };

  // Compact variant for Cart Drawer or Quote Modal
  if (variant === 'drawer' || variant === 'compact') {
    return (
      <div className="space-y-3 pt-4 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-cyan-600 animate-pulse" />
            <h4 className="text-xs font-bold text-slate-900 tracking-tight">{title}</h4>
          </div>
          <span className="text-[10px] text-slate-400 font-medium">Smart Suggestions</span>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {recommended.map((product) => {
            const isBlueStar = product.brand_id?.includes('blue-star') || product.slug.includes('blue-star');
            const imgUrl = (product as any).media?.[0]?.url || (isBlueStar
              ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
              : 'https://cdn.shopify.com/s/files/1/0701/1929/3028/files/SFR250.png?v=1763989056');
            const isAdded = addedIds[product.id];

            return (
              <div
                key={product.id}
                className="flex items-center gap-3 p-2 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200/70 transition-all text-left group"
              >
                <Link href={`/products/${product.slug}`} className="w-12 h-12 flex-shrink-0 bg-white rounded-lg p-1 border border-slate-200 overflow-hidden">
                  <img src={imgUrl} alt={product.product_name} className="w-full h-full object-contain group-hover:scale-105 transition-transform" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${product.slug}`} className="block">
                    <p className="text-[11px] font-bold text-slate-900 truncate group-hover:text-cyan-700">
                      {product.product_name}
                    </p>
                  </Link>
                  <p className="text-[10px] text-slate-500 font-mono">
                    {product.model_number || (product.reference_price ? `₹${product.reference_price.toLocaleString('en-IN')}` : 'Quotation')}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => handleAddMini(e, product)}
                  className={`text-[10px] font-bold px-2 py-1.5 rounded-lg flex items-center gap-1 transition-all flex-shrink-0 ${
                    isAdded
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-white hover:bg-cyan-50 text-cyan-800 border border-slate-200/80 shadow-xs'
                  }`}
                  title="Add to quotation"
                >
                  {isAdded ? (
                    <>
                      <Check className="w-3 h-3 text-white" />
                      <span>Added</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3 h-3 text-cyan-600" />
                      <span>+ Quote</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Full Grid variant for Pages (Home, Products, Product Detail)
  return (
    <section className="my-14 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200/70 text-cyan-800 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-600" />
            <span>AI & Behavior Matched</span>
          </div>
          <h2 className="font-display font-black text-2xl md:text-3xl text-slate-900 tracking-tight">
            {title}
          </h2>
          <p className="text-sm text-slate-500 max-w-2xl mt-1">
            {subtitle}
          </p>
        </div>
        <Link
          href="/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-700 hover:text-cyan-900 group"
        >
          <span>Explore All 155+ Products</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommended.map((product) => (
          <ProductCard key={product.id} product={product as any} />
        ))}
      </div>
    </section>
  );
}
