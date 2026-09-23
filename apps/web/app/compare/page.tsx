'use client';

// ============================================================================
// @tanmayee/web — Dedicated Full-Page Side-by-Side Equipment Comparison (/compare)
// ============================================================================

import React from 'react';
import Link from 'next/link';
import { 
  Scale, 
  Trash2, 
  Plus, 
  FileText, 
  Check, 
  MessageSquare, 
  ArrowRight, 
  Snowflake, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';
import { useUserStore } from '../../lib/user-store-context';
import { useCart } from '../../lib/cart-context';
import { RecommendedProducts } from '../../components/product/recommended-products';
import { COMPANY } from '@tanmayee/config';

export default function ComparePage() {
  const { compareList, compareCount, removeFromCompare, clearCompare } = useUserStore();
  const { addToCart, openDrawer } = useCart();

  const handleAddQuotation = (product: any) => {
    addToCart(product, 1);
    openDrawer();
  };

  return (
    <div className="bg-slate-50 min-h-screen py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-800 text-xs font-bold mb-2">
              <Scale className="w-3.5 h-3.5 text-cyan-600" />
              <span>Side-by-Side Comparison ({compareCount}/4)</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl text-slate-900 tracking-tight">
              Compare Commercial Specifications
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Evaluate cooling capacities, energy star ratings, refrigerant types, and commercial B2B rates.
            </p>
          </div>

          {compareCount > 0 && (
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={clearCompare}
                className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear All</span>
              </button>

              <Link
                href="/products"
                className="inline-flex items-center gap-1.5 text-xs font-bold bg-white border border-slate-300 hover:border-cyan-500 px-4 py-2.5 rounded-xl text-slate-700 transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5 text-cyan-600" />
                <span>Add More Models</span>
              </Link>
            </div>
          )}
        </div>

        {/* Comparison Matrix */}
        {compareCount === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-cyan-50 flex items-center justify-center mx-auto text-cyan-500">
              <Scale className="w-8 h-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900">No equipment selected to compare</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Select &quot;Compare&quot; on any product card in our catalogue to view specifications, power consumption, and pricing side-by-side.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold text-xs px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              <span>Browse 155+ Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70">
                    <th className="p-4 sm:p-5 w-44 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      Equipment Model
                    </th>
                    {compareList.map((product) => {
                      const isBlueStar = product.brand_id?.includes('blue-star') || product.slug.includes('blue-star');
                      const imgUrl = (product as any).media?.[0]?.url || (isBlueStar
                        ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
                        : 'https://cdn.shopify.com/s/files/1/0701/1929/3028/files/SFR250.png?v=1763989056');

                      return (
                        <th key={product.id} className="p-4 sm:p-5 w-64 align-top border-l border-slate-100">
                          <div className="space-y-3 relative">
                            <button
                              type="button"
                              onClick={() => removeFromCompare(product.id)}
                              className="absolute -top-1 -right-1 p-1 rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                            <div className="aspect-[4/3] rounded-xl bg-slate-50 p-2 flex items-center justify-center border border-slate-200">
                              <img src={imgUrl} alt={product.product_name} className="w-full h-full object-contain" />
                            </div>

                            <div className="space-y-1">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                isBlueStar ? 'bg-blue-100 text-blue-800' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {(product as any).brand_name || (isBlueStar ? 'Blue Star' : 'Rockwell')}
                              </span>
                              <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2">
                                {product.product_name}
                              </h3>
                              {product.model_number && (
                                <p className="text-[10px] font-mono text-slate-400">
                                  Model: {product.model_number}
                                </p>
                              )}
                            </div>

                            <div className="space-y-2 pt-1">
                              <button
                                type="button"
                                onClick={() => handleAddQuotation(product)}
                                className="w-full py-2 px-3 rounded-xl bg-slate-900 hover:bg-cyan-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>+ Quotation</span>
                              </button>
                            </div>
                          </div>
                        </th>
                      );
                    })}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
                  {/* Row: Indicative Price */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Indicative Price</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 font-bold text-slate-900 border-l border-slate-100">
                        {product.reference_price ? `₹${product.reference_price.toLocaleString('en-IN')}` : 'Quotation on Request'}
                      </td>
                    ))}
                  </tr>

                  {/* Row: Capacity */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Capacity / Volume</td>
                    {compareList.map((product) => {
                      const attr = (product as any).attributes?.find((a: any) => a.name.toLowerCase().includes('capacity'));
                      return (
                        <td key={product.id} className="p-4 font-semibold text-cyan-800 border-l border-slate-100">
                          {attr?.value || 'Standard'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Energy Rating */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Energy Star / Efficiency</td>
                    {compareList.map((product) => {
                      const attr = (product as any).attributes?.find((a: any) => a.name.toLowerCase().includes('star'));
                      return (
                        <td key={product.id} className="p-4 border-l border-slate-100">
                          {attr?.value ? (
                            <span className="inline-flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md font-bold">
                              <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                              {attr.value} Star
                            </span>
                          ) : (
                            <span className="text-slate-400">Commercial Standard</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Temperature Range */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Operating Temperature</td>
                    {compareList.map((product) => {
                      const attr = (product as any).attributes?.find((a: any) => a.name.toLowerCase().includes('temperature'));
                      return (
                        <td key={product.id} className="p-4 border-l border-slate-100 font-mono text-[11px]">
                          {attr?.value || 'Tropicalized (up to 52°C ambient)'}
                        </td>
                      );
                    })}
                  </tr>

                  {/* Row: Condenser Coil */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Condenser Coil</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-l border-slate-100 font-medium text-emerald-700">
                        100% Grooved Copper
                      </td>
                    ))}
                  </tr>

                  {/* Row: Authorized Dealer Warranty */}
                  <tr className="hover:bg-slate-50/50">
                    <td className="p-4 font-bold text-slate-900 bg-slate-50/40">Warranty Assurance</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-4 border-l border-slate-100 text-[11px] text-slate-600">
                        <span className="flex items-center gap-1 font-semibold text-blue-700">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> OEM Factory Warranty
                        </span>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Recommended Products */}
        <div className="pt-8">
          <RecommendedProducts
            title="Products You May Like"
            subtitle="Explore complementary cooling and refrigeration equipment"
            limit={4}
          />
        </div>
      </div>
    </div>
  );
}
