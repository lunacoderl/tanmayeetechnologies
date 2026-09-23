'use client';

// ============================================================================
// @tanmayee/web — Product Card Component (Enhanced with View Details & Share)
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  MessageSquare, 
  ArrowRight, 
  Share2, 
  Check, 
  Eye, 
  Zap, 
  Snowflake, 
  Tag, 
  ShieldCheck 
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { Product } from '@tanmayee/types';
import { COMPANY } from '@tanmayee/config';

interface ProductCardProps {
  product: Product & {
    brand_name?: string;
    category_name?: string;
    attributes?: { name: string; value: string; unit?: string | null }[];
    media?: { url: string; is_primary: boolean }[];
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openDrawer } = useCart();
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const brandName = product.brand_name || 'Brand';
  const isBlueStar = brandName.toLowerCase().includes('blue star');
  const imageUrl =
    product.media?.[0]?.url ||
    (isBlueStar
      ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
      : 'https://cdn.shopify.com/s/files/1/0701/1929/3028/files/SFR250.png?v=1763989056');

  // Key spec highlights
  const capacityAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('capacity')
  );
  const starAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('star')
  );
  const tempAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('temperature')
  );

  // Extract structural capacity & model number for prominent badges
  const capacityValue = capacityAttr?.value || '';
  const modelNumber = product.model_number || '';

  const whatsappPhone = COMPANY.WHATSAPP_NUMBER || '919390115553';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Tanmayee Technologies, I am interested in getting a quotation for: ${product.product_name} (Model: ${product.model_number || 'N/A'}). Please share commercial B2B rates.`
  )}`;

  const shareUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/products/${product.slug}`
    : `https://tanmayeetechnologies.com/products/${product.slug}`;

  const shareTitle = `${product.product_name} - Tanmayee Technologies (Authorized Dealer)`;
  const shareText = `Check out ${product.product_name} from Tanmayee Technologies Vizag:`;

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          copyToClipboard();
        }
      }
    } else {
      copyToClipboard();
    }
  };

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      try {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (err) {
        console.error('Failed to copy to clipboard', err);
      }
    }
  };

  const handleAddQuotation = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative interactive-card animate-fade-in-up">
      <div>
        {/* Image Container with Badges & Ambient Edge Fit */}
        <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-100 to-slate-200/60 overflow-hidden">
          {/* Ambient blurred edge backdrop so image fits perfectly without harsh crop */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-30"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Skeleton Placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-box z-0" />
          )}

          <img
            src={imageUrl}
            alt={product.product_name}
            className={`relative z-10 w-full h-full object-contain p-2 group-hover:scale-105 transition-all duration-500 ${
              imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
          />

          {/* Top Badges & Share Icon */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            {/* Brand Pill */}
            <span
              className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-md ${
                isBlueStar
                  ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white'
                  : 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white'
              }`}
            >
              {brandName}
            </span>

            <div className="flex items-center gap-1.5">
              {/* Bulk Badge */}
              {product.bulk_threshold && (
                <span className="text-[10px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                  <Tag className="w-3 h-3" /> Save {product.bulk_discount_pct || 10}%
                </span>
              )}

              {/* Quick Share Button on Image */}
              <button
                type="button"
                onClick={handleShare}
                className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-cyan-600 shadow-md backdrop-blur-md flex items-center justify-center transition-all hover:scale-110 active:scale-95 border border-slate-200/60"
                title="Share this product via Social Media, Bluetooth, or Copy Link"
                aria-label="Share product"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                ) : (
                  <Share2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* Toast Notification when Copied */}
          {copied && (
            <div className="absolute top-12 right-3 z-20 bg-slate-900/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-1">
              ✓ Link copied to clipboard!
            </div>
          )}

          {/* Toast Notification when Added to Quotation */}
          {added && (
            <div className="absolute top-12 left-3 right-3 z-20 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-emerald-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <span className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-white animate-bounce" /> Added to Quotation
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openDrawer();
                }}
                className="underline text-[10px] uppercase font-black hover:text-emerald-100"
              >
                View →
              </button>
            </div>
          )}

          {/* Bottom Capacity & Exact Model Number Pill */}
          {(capacityValue || modelNumber) && (
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center z-10 pointer-events-none">
              <span className="inline-flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                {capacityValue && (
                  <span className="text-cyan-300 font-black">{capacityValue}</span>
                )}
                {capacityValue && modelNumber && (
                  <span className="text-slate-400 font-normal">•</span>
                )}
                {modelNumber && (
                  <span className="text-slate-200 font-mono font-bold tracking-wide truncate max-w-[210px]">
                    {modelNumber}
                  </span>
                )}
              </span>
            </div>
          )}
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-3">
          {/* Spec Pills with Colorful Icons */}
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-semibold text-slate-600">
            {capacityAttr && (
              <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 px-2.5 py-0.5 rounded-lg border border-cyan-200/70">
                <Snowflake className="w-3 h-3 text-cyan-600" />
                {capacityAttr.value}
              </span>
            )}
            {starAttr && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-200/70 font-bold">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {starAttr.value} Star
              </span>
            )}
            {product.model_number && (
              <span className="bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded-md border border-slate-200/60">
                {product.model_number}
              </span>
            )}
            {((product as any).brand_name?.toLowerCase().includes('blue star') || product.slug.toLowerCase().includes('blue-star') || product.brand_id?.includes('blue-star')) ? (
              <span className="inline-flex items-center gap-1 text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80 font-bold ml-auto">
                <ShieldCheck className="w-3 h-3 text-blue-600" />
                Authorized Dealers
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80 font-bold ml-auto">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Authorized Distributors
              </span>
            )}
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            className="block group-hover:text-cyan-700 transition-colors"
          >
            <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-2 leading-snug">
              {product.product_name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Price display */}
          <div className="pt-2 border-t border-slate-100 flex items-baseline justify-between">
            {product.reference_price ? (
              <div>
                <span className="text-[11px] font-medium text-slate-400">Commercial Ind. Price:</span>
                <div className="font-display font-black text-lg text-slate-900 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 bg-clip-text text-transparent">
                  ₹{product.reference_price.toLocaleString('en-IN')}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[11px] font-medium text-slate-400">Pricing:</span>
                <div className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg mt-0.5 border border-cyan-200/60">
                  Quotation on Request
                </div>
              </div>
            )}
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/50">
              GST Invoice Available
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons: View Details, Quotation, WhatsApp & Share */}
      <div className="p-5 pt-0 space-y-2">
        {/* Main Action Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* View Details Button */}
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-200 border border-slate-200/80 group/btn"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-cyan-600" />
            <span>View Details</span>
          </Link>

          {/* Quotation Button */}
          <button
            type="button"
            onClick={handleAddQuotation}
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 hover:from-blue-600 hover:to-cyan-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 shadow-md shadow-slate-900/20 active:scale-95"
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400 animate-bounce" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <FileText className="w-3.5 h-3.5 text-cyan-300" />
                <span>Quotation</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Row: WhatsApp & Share */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 bg-emerald-50 hover:bg-emerald-100/90 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] py-1.5 px-2 rounded-lg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center justify-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 font-bold text-[11px] py-1.5 px-2 rounded-lg transition-colors"
          >
            <Share2 className="w-3.5 h-3.5 text-slate-500" />
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
