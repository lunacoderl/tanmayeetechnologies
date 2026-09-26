'use client';

// ============================================================================
// @tanmayee/web — Ultra-Premium Product Card Component
// Features:
// - Wishlist toggle with instant reactive heart animation & user store persistence
// - Behavioral tracking on view/click (tracks product, category, and brand)
// - Ambient edge image fit with zero harsh crop & skeleton loader
// - Distinct model number & capacity badge pills
// - 1-Click Quotation Drawer & WhatsApp B2B Enquiry
// ============================================================================

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  MessageSquare, 
  Share2, 
  Check, 
  Eye, 
  Zap, 
  Snowflake, 
  Tag, 
  ShieldCheck,
  Heart,
  Star,
  Bell,
  Clock,
  X,
  Loader2,
} from 'lucide-react';
import { useCart } from '../../lib/cart-context';
import { useUserStore } from '../../lib/user-store-context';
import { Product } from '@tanmayee/types';
import { COMPANY } from '@tanmayee/config';

interface ProductCardProps {
  product: Product & {
    brand_name?: string;
    category_name?: string;
    attributes?: { name: string; value: string; unit?: string | null }[];
    media?: { url: string; is_primary: boolean }[];
    is_available?: boolean;
    in_stock?: boolean;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, openDrawer } = useCart();
  const { 
    isInWishlist, 
    toggleWishlist, 
    trackProductView, 
    trackCategoryClick 
  } = useUserStore();

  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Availability detection (checking flags and availability attributes)
  const isAvailable =
    product.is_available !== false &&
    product.in_stock !== false &&
    !(product.attributes || []).some(
      (a: any) =>
        (a.name || a.attribute_name || '').toLowerCase() === 'availability' &&
        (a.value === 'CURRENTLY_NOT_AVAILABLE' || a.attribute_value === 'CURRENTLY_NOT_AVAILABLE' || a.value === 'OUT_OF_STOCK')
    );

  // Notify Me Modal State
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifyPhone, setNotifyPhone] = useState('');
  const [notifyName, setNotifyName] = useState('');
  const [notifySubmitting, setNotifySubmitting] = useState(false);
  const [notifySuccess, setNotifySuccess] = useState(false);
  const [notifyError, setNotifyError] = useState('');

  const inWishlist = isInWishlist(product.id);

  const brandName = product.brand_name || (product.product_name?.toLowerCase().includes('blue star') ? 'Blue Star' : 'Rockwell');
  const isBlueStar = brandName.toLowerCase().includes('blue star') || (product.slug || '').toLowerCase().includes('blue-star');
  
  const mediaList = Array.isArray(product.media) ? product.media : [];
  const primaryMediaObj = mediaList.find((m: any) => typeof m === 'object' && (m.is_primary || m.type === 'MAIN_IMAGE'));
  const primaryMediaUrl = primaryMediaObj ? (typeof primaryMediaObj === 'string' ? primaryMediaObj : primaryMediaObj.url) : null;
  
  const rawPrimaryField = (product as any).primary_image_url;
  const isPrimaryFieldInMedia = mediaList.length === 0 || mediaList.some((m: any) => (typeof m === 'string' ? m : m.url) === rawPrimaryField);
  const validatedPrimaryField = isPrimaryFieldInMedia ? rawPrimaryField : null;

  const firstMediaUrl = mediaList.length > 0 ? (typeof mediaList[0] === 'string' ? mediaList[0] : mediaList[0].url) : null;
  const firstGalleryUrl = Array.isArray((product as any).gallery_urls) && (product as any).gallery_urls.length > 0 ? (product as any).gallery_urls[0] : null;

  const imageUrl =
    primaryMediaUrl ||
    validatedPrimaryField ||
    firstMediaUrl ||
    firstGalleryUrl ||
    rawPrimaryField ||
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

  const handleInteraction = () => {
    trackProductView(product);
    if (product.category_id) {
      trackCategoryClick(product.category_id);
    }
  };

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleInteraction();

    if (typeof navigator !== 'undefined' && navigator.share) {
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
    handleInteraction();
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleInteraction();
    toggleWishlist(product);
  };

  return (
    <div 
      className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:shadow-2xl hover:border-cyan-400/80 transition-all duration-300 flex flex-col justify-between overflow-hidden group relative interactive-card animate-fade-in-up"
    >
      <div>
        {/* Image Container with Badges, Actions & Ambient Edge Fit */}
        <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-100 to-slate-200/60 overflow-hidden">
          {/* Ambient blurred edge backdrop so image fits perfectly without harsh crop */}
          <div
            className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-30 pointer-events-none"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Skeleton Placeholder while loading */}
          {!imageLoaded && (
            <div className="absolute inset-0 skeleton-box z-0" />
          )}

          <Link
            href={`/products/${product.slug}`}
            onClick={handleInteraction}
            className="block w-full h-full relative z-10"
          >
            <img
              src={imageUrl}
              alt={product.product_name}
              className={`w-full h-full object-contain p-3 group-hover:scale-105 transition-all duration-500 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </Link>

          {/* Watermark Overlay when Product is Not Available */}
          {!isAvailable && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-slate-950/65 backdrop-blur-[2px] p-3 text-center pointer-events-none">
              <div className="border-2 border-amber-400/90 rounded-2xl px-4 py-2.5 bg-slate-900/90 shadow-2xl transform -rotate-3">
                <span className="flex items-center justify-center gap-1.5 text-amber-300 font-display font-black text-xs uppercase tracking-wider">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  Currently Not Available
                </span>
                <span className="text-[10px] text-slate-300 font-medium block mt-0.5">
                  Temporarily Out of Stock
                </span>
              </div>
            </div>
          )}

          {/* Top Row: Brand Badge + Action Icons (Wishlist, Share) */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
            {/* Brand Pill */}
            <div className="flex flex-col gap-1">
              <span
                className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md ${
                  isBlueStar
                    ? 'bg-gradient-to-r from-blue-700 to-cyan-700 text-white'
                    : 'bg-gradient-to-r from-emerald-700 to-teal-700 text-white'
                }`}
              >
                {brandName}
              </span>
              {product.bulk_threshold && (
                <span className="text-[9px] font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white px-2 py-0.5 rounded-full shadow-md flex items-center gap-1 w-fit">
                  <Tag className="w-2.5 h-2.5" /> Save {product.bulk_discount_pct || 10}%
                </span>
              )}
            </div>

            {/* Quick Action Floating Bar */}
            <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1 rounded-full shadow-lg border border-slate-200/80">
              {/* Wishlist Heart Toggle */}
              <button
                type="button"
                onClick={handleWishlistToggle}
                className={`w-7 h-7 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95 ${
                  inWishlist
                    ? 'bg-rose-50 text-rose-500 shadow-sm border border-rose-200'
                    : 'text-slate-500 hover:text-rose-500 hover:bg-rose-50/50'
                }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                aria-label="Wishlist"
              >
                <Heart
                  className={`w-3.5 h-3.5 transition-transform ${
                    inWishlist ? 'fill-rose-500 text-rose-500 scale-110' : ''
                  }`}
                />
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="w-7 h-7 rounded-full flex items-center justify-center text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition-all hover:scale-110 active:scale-95"
                title="Share product link"
                aria-label="Share"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600 animate-bounce" />
                ) : (
                  <Share2 className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          </div>

          {/* Toast Notification when Copied */}
          {copied && (
            <div className="absolute top-14 right-3 z-30 bg-slate-900/95 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-xl border border-slate-700 animate-in fade-in slide-in-from-top-1">
              ✓ Link copied to clipboard!
            </div>
          )}

          {/* Toast Notification when Added to Quotation */}
          {added && (
            <div className="absolute top-14 left-3 right-3 z-30 bg-gradient-to-r from-emerald-600 to-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-xl shadow-2xl border border-emerald-400 flex items-center justify-between animate-in fade-in slide-in-from-top-2">
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
              <span className="inline-flex items-center gap-1.5 bg-slate-950/85 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-xl border border-white/20 shadow-lg">
                {capacityValue && (
                  <span className="text-cyan-300 font-extrabold tracking-wide">{capacityValue}</span>
                )}
                {capacityValue && modelNumber && (
                  <span className="text-slate-400 font-normal">•</span>
                )}
                {modelNumber && (
                  <span className="text-slate-200 font-mono font-bold tracking-wide truncate max-w-[200px]">
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
              <span className="inline-flex items-center gap-1 bg-cyan-50 text-cyan-800 px-2.5 py-0.5 rounded-lg border border-cyan-200/70 text-[10px] font-bold">
                <Snowflake className="w-3 h-3 text-cyan-600" />
                {capacityAttr.value}
              </span>
            )}
            {starAttr && (
              <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-900 px-2.5 py-0.5 rounded-lg border border-amber-200/70 font-bold text-[10px]">
                <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                {starAttr.value} Star
              </span>
            )}
            
            {/* Rating Stars */}
            <span className="inline-flex items-center gap-0.5 text-amber-600 bg-amber-50/70 px-2 py-0.5 rounded-md border border-amber-200/50 text-[10px] font-bold">
              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
              4.9
            </span>

            {/* Authorized Distributor / Dealer Badge */}
            <span className="inline-flex items-center gap-1 text-[9px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80 font-bold ml-auto">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              {isBlueStar ? 'Blue Star Partner' : 'Rockwell Partner'}
            </span>
          </div>

          {/* Title */}
          <Link
            href={`/products/${product.slug}`}
            onClick={handleInteraction}
            className="block group-hover:text-cyan-700 transition-colors"
          >
            <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-2 leading-snug tracking-tight hover:underline">
              {product.product_name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
            {product.short_description || product.description}
          </p>

          {/* Price display */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            {product.reference_price ? (
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Ind. Price (excl. GST):</span>
                <div className="font-display font-black text-lg text-slate-900 bg-gradient-to-r from-slate-900 via-slate-800 to-cyan-900 bg-clip-text text-transparent">
                  ₹{product.reference_price.toLocaleString('en-IN')}
                </div>
              </div>
            ) : (
              <div>
                <span className="text-[10px] font-medium text-slate-400 block">Wholesale Rate:</span>
                <div className="text-xs font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-lg mt-0.5 border border-cyan-200/60 inline-block">
                  Quotation on Request
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: View Details, Quotation / Notify, WhatsApp */}
      <div className="p-5 pt-0 space-y-2">
        {/* Main Action Grid */}
        <div className="grid grid-cols-2 gap-2">
          {/* View Details Button */}
          <Link
            href={`/products/${product.slug}`}
            onClick={handleInteraction}
            className="flex items-center justify-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-200 border border-slate-200/80 group/btn"
          >
            <Eye className="w-3.5 h-3.5 text-slate-600 group-hover/btn:text-cyan-600" />
            <span>Details</span>
          </Link>

          {/* Quotation / Notify Button */}
          {!isAvailable ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsNotifyOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs py-2.5 px-3 rounded-xl transition-all duration-300 shadow-md shadow-amber-900/20 active:scale-95"
            >
              <Bell className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              <span>Notify Me</span>
            </button>
          ) : (
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
          )}
        </div>

        {/* WhatsApp Commercial Rate Enquiry */}
        <div>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleInteraction}
            className="flex items-center justify-center gap-1.5 w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200/80 font-bold text-[11px] py-1.5 px-2 rounded-lg transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enquire on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* ── Interactive Modal: Notify When Available ───────────────────── */}
      {isNotifyOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            e.stopPropagation();
            setIsNotifyOpen(false);
          }}
        >
          <div 
            className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-200 relative text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              type="button"
              onClick={() => setIsNotifyOpen(false)}
              className="absolute right-4 top-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Bell className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <h3 className="font-display font-black text-base text-slate-900 leading-tight">
                  Notify Me When Available
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Get an instant call or WhatsApp message as soon as stock arrives.
                </p>
              </div>
            </div>

            {/* Product Summary Box */}
            <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 p-1 flex items-center justify-center shrink-0">
                <img src={imageUrl} alt={product.product_name} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="font-bold text-xs text-slate-900 truncate">
                  {product.product_name}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  Model: {product.model_number || 'N/A'} • {brandName}
                </div>
              </div>
            </div>

            {notifySuccess ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-2 animate-in fade-in">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-sm text-emerald-900">
                  Notification Registered!
                </h4>
                <p className="text-xs text-emerald-700">
                  Our sales engineers will contact you at <span className="font-bold">{notifyPhone}</span> as soon as this equipment is back in stock.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setIsNotifyOpen(false);
                    setNotifySuccess(false);
                    setNotifyPhone('');
                  }}
                  className="mt-2 w-full py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700"
                >
                  Done
                </button>
              </div>
            ) : (
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!notifyPhone.trim() || notifyPhone.trim().length < 10) {
                    setNotifyError('Please enter a valid 10-digit mobile number');
                    return;
                  }
                  setNotifySubmitting(true);
                  setNotifyError('');

                  try {
                    await fetch('/api/stock-notifications', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        product_id: product.id,
                        product_name: product.product_name,
                        model_number: product.model_number || 'N/A',
                        customer_phone: notifyPhone.trim(),
                        customer_name: notifyName.trim() || 'Interested Customer',
                      }),
                    });

                    // Save locally for instant reactivity in Admin
                    try {
                      const localKey = 'tanmayee_stock_notifications';
                      const existing = JSON.parse(localStorage.getItem(localKey) || '[]');
                      existing.unshift({
                        id: `sn-${Date.now()}`,
                        product_id: product.id,
                        product_name: product.product_name,
                        model_number: product.model_number || 'N/A',
                        customer_phone: notifyPhone.trim(),
                        customer_name: notifyName.trim() || 'Customer',
                        created_at: new Date().toISOString(),
                      });
                      localStorage.setItem(localKey, JSON.stringify(existing));
                    } catch {}

                    setNotifySuccess(true);
                  } catch (err: any) {
                    setNotifyError(err.message || 'Failed to register notification. Please try again.');
                  } finally {
                    setNotifySubmitting(false);
                  }
                }}
                className="space-y-3"
              >
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Mobile Number <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={notifyPhone}
                    onChange={(e) => setNotifyPhone(e.target.value)}
                    placeholder="e.g. 9390115553"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={notifyName}
                    onChange={(e) => setNotifyName(e.target.value)}
                    placeholder="e.g. Ramesh Varma"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-amber-500 bg-slate-50 focus:bg-white transition-colors"
                  />
                </div>

                {notifyError && (
                  <div className="text-[11px] text-rose-600 font-bold bg-rose-50 p-2 rounded-lg">
                    {notifyError}
                  </div>
                )}

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsNotifyOpen(false)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={notifySubmitting}
                    className="flex-1 py-2.5 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-md"
                  >
                    {notifySubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Registering...</span>
                      </>
                    ) : (
                      <>
                        <Bell className="w-3.5 h-3.5" />
                        <span>Notify Me When Ready</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
