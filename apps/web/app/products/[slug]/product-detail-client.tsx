'use client';

// ============================================================================
// @tanmayee/web — Product Detail Client Component
// Complete B2B specs, rich icons, share features, and buyer decision sections
// ============================================================================

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FileText,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  Tag,
  ArrowRight,
  PhoneCall,
  Wrench,
  Clock,
  Sparkles,
  ChevronRight,
  Building,
  Share2,
  Check,
  Zap,
  Snowflake,
  Thermometer,
  Layers,
  Cpu,
  Shield,
  Droplets,
  Box,
  DoorClosed,
  Gauge,
  Award,
  Leaf,
  Truck,
  HeartHandshake,
  CheckCheck,
  Heart,
  Play,
  Maximize2,
  ChevronLeft,
  X,
  Bell,
  Loader2,
  AlertCircle,
  Phone,
} from 'lucide-react';
import { Product } from '@tanmayee/types';
import { COMPANY } from '@tanmayee/config';
import { useCart } from '../../../lib/cart-context';
import { ProductCard } from '../../../components/product/product-card';
import { useUserStore } from '../../../lib/user-store-context';
import { RecommendedProducts } from '../../../components/product/recommended-products';

interface ProductDetailClientProps {
  product: Product & {
    brand_name?: string;
    category_name?: string;
    attributes?: { name: string; value: string; unit?: string | null; numeric?: number | null }[];
    media?: { url: string; type?: string; is_primary: boolean; alt?: string }[];
    features?: string[] | null;
    applications?: string[] | null;
    is_available?: boolean;
    in_stock?: boolean;
  };
  brand?: { id: string; name: string; slug: string };
  category?: { id: string; name: string; slug: string };
  similarProducts: any[];
}

export function ProductDetailClient({
  product,
  brand,
  category,
  similarProducts,
}: ProductDetailClientProps) {
  const { addToCart, openCart } = useCart();
  const {
    isInWishlist,
    toggleWishlist,
    trackProductView,
    trackCategoryClick,
  } = useUserStore();

  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [added, setAdded] = useState(false);

  // Availability detection
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

  const handleNotifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifyPhone.trim() || notifyPhone.replace(/[^0-9]/g, '').length < 10) {
      setNotifyError('Please enter a valid 10-digit mobile number');
      return;
    }
    setNotifySubmitting(true);
    setNotifyError('');
    try {
      const res = await fetch('/api/stock-notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: product.id,
          product_name: product.product_name,
          model_number: product.model_number || 'N/A',
          customer_phone: notifyPhone.trim(),
          customer_name: notifyName.trim() || 'Prospective Buyer',
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit notification request');
      }
      setNotifySuccess(true);
    } catch (err: any) {
      setNotifyError(err.message || 'Submission failed. Please try again.');
    } finally {
      setNotifySubmitting(false);
    }
  };

  const inWishlist = isInWishlist(product.id);

  React.useEffect(() => {
    trackProductView(product);
    if (product.category_id) {
      trackCategoryClick(product.category_id);
    }
  }, [product.id, product.category_id, trackProductView, trackCategoryClick]);

  const brandName = brand?.name || product.brand_name || 'Manufacturer';
  const isBlueStar = brandName.toLowerCase().includes('blue star');

  const isVideoUrl = (u: string) =>
    /\.(mp4|webm|mov|ogg)($|\?)/i.test(u) || u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com');

  const defaultFallbackImage = isBlueStar
    ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
    : 'https://cdn.shopify.com/s/files/1/0701/1929/3028/files/SFR250.png?v=1763989056';

  const mediaList = useMemo(() => {
    const list: Array<{ url: string; type: 'IMAGE' | 'VIDEO'; alt: string; title: string }> = [];
    const seen = new Set<string>();

    const addMedia = (url: string, type?: string, alt?: string, title?: string) => {
      if (!url || seen.has(url)) return;
      seen.add(url);
      const isVid = type === 'VIDEO' || isVideoUrl(url);
      list.push({
        url,
        type: isVid ? 'VIDEO' : 'IMAGE',
        alt: alt || `${product.product_name} - ${brandName} Model ${product.model_number || ''} Commercial View ${list.length + 1}`,
        title: title || `${product.product_name} View ${list.length + 1}`,
      });
    };

    // Primary image first
    const primaryImg = (product as any).primary_image_url;
    if (primaryImg) {
      addMedia(
        primaryImg,
        isVideoUrl(primaryImg) ? 'VIDEO' : 'IMAGE',
        `${product.product_name} - Authorized ${brandName} Partner Visakhapatnam`,
        `${product.product_name} Main Showcase`
      );
    }

    // Media array from DB/payload
    if (Array.isArray(product.media) && product.media.length > 0) {
      product.media.forEach((m: any, idx: number) => {
        const u = typeof m === 'string' ? m : m.url;
        const t = typeof m === 'object' ? m.type : undefined;
        const a = typeof m === 'object' ? m.alt || m.alt_text : undefined;
        addMedia(u, t, a);
      });
    }

    // Gallery URLs array
    if (Array.isArray((product as any).gallery_urls) && (product as any).gallery_urls.length > 0) {
      (product as any).gallery_urls.forEach((u: string) => addMedia(u));
    }

    if (list.length === 0) {
      addMedia(defaultFallbackImage, 'IMAGE', `${product.product_name} - ${brandName}`, `${product.product_name} Product Photo`);
    }

    return list;
  }, [product, isBlueStar, brandName]);

  const [activeMediaIndex, setActiveMediaIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];
  const imageUrl = activeMedia?.url || defaultFallbackImage;

  // Keyboard navigation & body scroll lock for Lightbox
  React.useEffect(() => {
    if (!isLightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
      if (e.key === 'ArrowLeft') {
        setLightboxIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1));
      }
      if (e.key === 'ArrowRight') {
        setLightboxIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen, mediaList.length]);

  const openLightbox = (index: number) => {
    setActiveMediaIndex(index);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  // Key spec highlights
  const capacityAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('capacity')
  );
  const configAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('physical configuration') ||
    a.name.toLowerCase().includes('door type')
  );
  const tempAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('temperature')
  );
  const refrigerantAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('refrigerant')
  );
  const coilAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('condenser') || a.name.toLowerCase().includes('copper')
  );
  const powerAttr = product.attributes?.find((a) =>
    a.name.toLowerCase().includes('energy') || a.name.toLowerCase().includes('power')
  );

  const whatsappPhone = COMPANY.WHATSAPP_NUMBER || '919390115553';
  const whatsappUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hello Tanmayee Technologies, I am inquiring about: ${product.product_name} (Model: ${product.model_number || 'N/A'}, Quantity: ${quantity}). Please provide best commercial B2B quotation and delivery lead time.`
  )}`;

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : `https://www.tanmayeetechnologies.com/products/${product.slug}`;
    const shareData = {
      title: product.product_name,
      text: `${product.product_name} (Model: ${product.model_number || ''}) from Tanmayee Technologies — Authorized Partner in Visakhapatnam.`,
      url: shareUrl,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user closed dialog
      }
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2400);
      } catch (err) {
        console.error('Failed to copy', err);
      }
    }
  };

  const handleAddQuotation = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  // Helper to map attribute names to colorful icons
  const getAttributeIcon = (attrName: string) => {
    const name = attrName.toLowerCase();
    if (name.includes('capacity')) return <Layers className="w-4 h-4 text-cyan-500" />;
    if (name.includes('temp')) return <Thermometer className="w-4 h-4 text-rose-500" />;
    if (name.includes('refrigerant')) return <Snowflake className="w-4 h-4 text-sky-500" />;
    if (name.includes('coil') || name.includes('copper')) return <Zap className="w-4 h-4 text-amber-500" />;
    if (name.includes('voltage') || name.includes('power') || name.includes('energy')) return <Zap className="w-4 h-4 text-yellow-500" />;
    if (name.includes('insulation') || name.includes('puf')) return <Box className="w-4 h-4 text-emerald-500" />;
    if (name.includes('door') || name.includes('lid')) return <DoorClosed className="w-4 h-4 text-indigo-500" />;
    if (name.includes('defrost') || name.includes('drain')) return <Droplets className="w-4 h-4 text-blue-500" />;
    if (name.includes('outer') || name.includes('liner') || name.includes('body')) return <Shield className="w-4 h-4 text-purple-500" />;
    if (name.includes('compressor')) return <Cpu className="w-4 h-4 text-orange-500" />;
    if (name.includes('thermostat')) return <Gauge className="w-4 h-4 text-teal-500" />;
    return <Award className="w-4 h-4 text-slate-500" />;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 font-medium overflow-x-auto whitespace-nowrap">
        <Link href="/" className="hover:text-cyan-600 transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/products" className="hover:text-cyan-600 transition-colors">
          Products
        </Link>
        {category && (
          <>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link
              href={`/categories/${category.slug}`}
              className="hover:text-cyan-600 transition-colors"
            >
              {category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">
          {product.product_name}
        </span>
      </nav>

      {/* Main Product Hero Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left: Product Media Gallery (Vertical Thumbnails on Left + Showcase on Right) */}
        <div className="space-y-4">
          <div className="flex flex-col-reverse md:flex-row gap-3.5 items-start">
            {/* Left Side: Vertically Aligned Thumbnails List */}
            {mediaList.length > 1 && (
              <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto md:max-h-[480px] w-full md:w-20 shrink-0 p-1 scrollbar-thin">
                {mediaList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => openLightbox(idx)}
                    onMouseEnter={() => setActiveMediaIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 group cursor-pointer ${activeMediaIndex === idx
                        ? 'border-cyan-500 shadow-md ring-2 ring-cyan-400/40 scale-105 bg-white'
                        : 'border-slate-200/90 hover:border-slate-400 opacity-75 hover:opacity-100 hover:scale-102 bg-white'
                      }`}
                    title={`Click to open photos box • ${item.title}`}
                    aria-label={`View ${product.product_name} image ${idx + 1}`}
                  >
                    {item.type === 'VIDEO' ? (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
                        <Play className="w-5 h-5 fill-white text-white opacity-90 group-hover:scale-110 transition-transform" />
                        <span className="text-[8px] font-bold mt-0.5 tracking-wider uppercase text-cyan-300">Video</span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.alt}
                        title={item.title}
                        className="w-full h-full object-contain p-1"
                        loading="lazy"
                      />
                    )}
                    {activeMediaIndex === idx && (
                      <span className="absolute bottom-1 right-1 w-2.5 h-2.5 rounded-full bg-cyan-500 ring-2 ring-white shadow" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Showcase Box: Large Active Image or Video Player (Clickable to open high-res lightbox) */}
            <div className="flex-1 w-full">
              <div
                onClick={() => openLightbox(activeMediaIndex)}
                className="cursor-zoom-in relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-200/70 rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg group"
                title="Click image to expand full-screen photos box"
              >
                {activeMedia.type === 'VIDEO' ? (
                  <video
                    src={activeMedia.url}
                    controls
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-contain bg-slate-950"
                  />
                ) : (
                  <img
                    src={activeMedia.url}
                    alt={activeMedia.alt}
                    title={activeMedia.title}
                    className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
                    loading="eager"
                  />
                )}

                {/* Out of Stock Watermark Overlay */}
                {!isAvailable && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-20 pointer-events-none">
                    <div className="bg-rose-950/90 border-2 border-rose-400 text-rose-100 font-black text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2 tracking-wide uppercase">
                      <AlertCircle className="w-4 h-4 text-rose-300" />
                      <span>Currently Not Available</span>
                    </div>
                  </div>
                )}

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span
                    className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md text-white ${isBlueStar
                        ? 'bg-gradient-to-r from-blue-600 to-cyan-600'
                        : 'bg-gradient-to-r from-emerald-600 to-teal-600'
                      }`}
                  >
                    {brandName}
                  </span>
                  {activeMedia.type === 'VIDEO' && (
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider bg-slate-950/80 text-cyan-300 border border-cyan-500/30">
                      Product Video
                    </span>
                  )}
                </div>

                {/* Quick Share Button & Notification */}
                <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare();
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 hover:bg-white text-slate-700 hover:text-cyan-600 text-xs font-bold shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95 border border-slate-200"
                    title="Share this product via WhatsApp, Bluetooth, Social Media or Copy Link"
                    aria-label="Share product"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-700 font-extrabold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5" />
                        <span>Share</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Bottom Capacity & Exact Model Number Pill */}
                {(capacityAttr || product.model_number) && (
                  <div className="absolute bottom-4 left-4 flex items-center z-10 pointer-events-none">
                    <span className="inline-flex items-center gap-2 bg-slate-950/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-2 rounded-2xl border border-white/20 shadow-xl">
                      {capacityAttr && (
                        <span className="text-cyan-300 font-black">{capacityAttr.value}</span>
                      )}
                      {capacityAttr && product.model_number && <span className="text-slate-400 font-normal">•</span>}
                      {product.model_number && (
                        <span className="text-slate-200 font-mono font-bold tracking-wide">{product.model_number}</span>
                      )}
                    </span>
                  </div>
                )}

                {/* Fullscreen Lightbox Trigger Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(activeMediaIndex);
                  }}
                  className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-950/85 hover:bg-slate-950 text-white text-xs font-bold backdrop-blur-md transition-all shadow-xl hover:scale-105 border border-white/20 group-hover:border-cyan-400/50"
                  title="Click to view all photos in high-resolution lightbox box"
                >
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Photos ({mediaList.length})</span>
                </button>
              </div>
            </div>
          </div>

          {/* Guarantee Badges */}
          <div className="grid grid-cols-3 gap-3 pt-2 text-center text-xs">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50/50 border border-blue-200/80 p-3.5 rounded-2xl shadow-sm">
              <ShieldCheck className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <div className="font-extrabold text-slate-800">100% Genuine</div>
              <div className="text-[10px] text-slate-500 font-medium">Brand Direct Warranty</div>
            </div>
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80 p-3.5 rounded-2xl shadow-sm">
              <Wrench className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="font-extrabold text-slate-800">Turnkey Install</div>
              <div className="text-[10px] text-slate-500 font-medium">Certified Technicians</div>
            </div>
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80 p-3.5 rounded-2xl shadow-sm">
              <Clock className="w-5 h-5 text-amber-600 mx-auto mb-1" />
              <div className="font-extrabold text-slate-800">Prompt AMC</div>
              <div className="text-[10px] text-slate-500 font-medium">Local Spares in Vizag</div>
            </div>
          </div>
        </div>

        {/* Right: Product Details, Pricing, & Action Box */}
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {isBlueStar ? (
                <span className="text-xs font-black text-blue-800 bg-blue-50 px-2.5 py-0.5 rounded-md border border-blue-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  Blue Star Authorized Dealers
                </span>
              ) : (
                <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Rockwell Authorized Distributors
                </span>
              )}
              {product.model_number && (
                <span className="text-xs bg-slate-100 text-slate-700 font-mono px-2.5 py-0.5 rounded-md font-bold border border-slate-200">
                  Model: {product.model_number}
                </span>
              )}
            </div>

            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
              {product.product_name}
            </h1>

            <p className="text-sm text-slate-600 leading-relaxed pt-1">
              {product.description || product.short_description}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="bg-gradient-to-br from-slate-50 via-slate-100/80 to-cyan-50/30 rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 block">
                  Indicative Commercial Base Price:
                </span>
                {product.reference_price ? (
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="font-display font-black text-3xl sm:text-4xl text-slate-900 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 bg-clip-text text-transparent">
                      ₹{product.reference_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-slate-500 font-bold">/ unit + GST</span>
                  </div>
                ) : (
                  <div className="text-base font-bold text-cyan-800 bg-cyan-100/70 px-3.5 py-1.5 rounded-xl inline-block mt-1">
                    Quotation Available on Request
                  </div>
                )}
              </div>

              {isAvailable ? (
                <span className="text-xs text-emerald-800 bg-emerald-100/90 border border-emerald-300 font-extrabold px-3 py-1 rounded-full shadow-xs">
                  In Stock & Ready
                </span>
              ) : (
                <span className="text-xs text-rose-800 bg-rose-100 border border-rose-300 font-extrabold px-3 py-1 rounded-full shadow-xs">
                  Currently Not Available
                </span>
              )}
            </div>

            <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                <strong>Wholesale Volume Discount:</strong> Special institutional & project rates available for 3+ units on Quotation.
              </span>
            </div>
          </div>

          {/* Action Row: Quantity + Quotation / Notify + WhatsApp */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
              {isAvailable && (
                <div className="flex items-center border border-slate-300 bg-white rounded-2xl overflow-hidden h-12 shadow-xs">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3.5 text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-extrabold text-slate-900">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-3.5 text-slate-600 hover:bg-slate-100 font-bold text-base transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              )}

              {/* Add to Quotation or Notify Button */}
              {isAvailable ? (
                <button
                  type="button"
                  onClick={handleAddQuotation}
                  className="flex-1 h-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-slate-950/20 flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400 animate-bounce" />
                      <span>Added to Quotation!</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4 text-cyan-300" />
                      <span>Request Quotation</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsNotifyOpen(true)}
                  className="flex-1 h-12 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-orange-950/20 flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98 cursor-pointer"
                >
                  <Bell className="w-4 h-4 text-amber-200" />
                  <span>Notify Me When Available</span>
                </button>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`h-12 px-3 rounded-2xl border transition-all flex items-center gap-1.5 font-bold text-xs ${inWishlist
                    ? 'bg-rose-50 border-rose-300 text-rose-600 shadow-sm'
                    : 'border-slate-300 hover:border-rose-300 bg-white hover:bg-rose-50/50 text-slate-700'
                  }`}
                title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : 'text-slate-500'}`} />
                <span className="hidden sm:inline">{inWishlist ? 'Saved' : 'Wishlist'}</span>
              </button>

              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="h-12 px-4 rounded-2xl border border-slate-300 hover:border-cyan-400 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition-all shadow-xs"
                title="Share product link"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>

            {/* Direct WhatsApp Quotation Button */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-12 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-extrabold text-sm rounded-2xl shadow-md shadow-green-600/20 flex items-center justify-center gap-2.5 transition-all duration-300"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Instant WhatsApp Quotation ({COMPANY.PHONE_DISPLAY})</span>
            </a>
          </div>

          {/* Key Performance Features Bullet Grid */}
          {product.features && product.features.length > 0 && (
            <div className="pt-4 space-y-3">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-600" />
                Key Performance Features
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {product.features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-cyan-300 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-cyan-600 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-slate-800 leading-snug">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Technical Specifications & Dimensions Matrix with Colorful Icons ── */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 space-y-6 shadow-sm">
        <div className="border-b border-slate-100 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 flex items-center gap-2.5">
              <Gauge className="w-6 h-6 text-cyan-600" />
              Technical Specifications & Dimensions
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Verified manufacturer engineering parameters conforming to Bureau of Energy Efficiency (BEE) & ISO standards.
            </p>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 self-start sm:self-auto">
            100% Certified Data
          </span>
        </div>

        {/* Highlight Quick Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {capacityAttr && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-50/50 border border-cyan-200/80">
              <div className="flex items-center gap-2 text-cyan-700 text-xs font-bold mb-1">
                <Layers className="w-4 h-4" /> Capacity
              </div>
              <div className="font-extrabold text-base text-slate-900">{capacityAttr.value}</div>
            </div>
          )}
          {tempAttr && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-50/50 border border-rose-200/80">
              <div className="flex items-center gap-2 text-rose-700 text-xs font-bold mb-1">
                <Thermometer className="w-4 h-4" /> Temp Range
              </div>
              <div className="font-extrabold text-xs text-slate-900">{tempAttr.value}</div>
            </div>
          )}
          {refrigerantAttr && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/80">
              <div className="flex items-center gap-2 text-emerald-700 text-xs font-bold mb-1">
                <Leaf className="w-4 h-4" /> Eco Gas
              </div>
              <div className="font-extrabold text-xs text-slate-900">{refrigerantAttr.value}</div>
            </div>
          )}
          {coilAttr && (
            <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50/50 border border-amber-200/80">
              <div className="flex items-center gap-2 text-amber-700 text-xs font-bold mb-1">
                <Zap className="w-4 h-4" /> Coil Type
              </div>
              <div className="font-extrabold text-xs text-slate-900">{coilAttr.value}</div>
            </div>
          )}
        </div>

        {/* Detailed Spec Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200/80">
          <table className="w-full text-xs text-left border-collapse">
            <tbody>
              {product.attributes?.map((attr, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 hover:bg-slate-100/50 transition-colors ${idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
                    }`}
                >
                  <td className="py-3 px-4 font-bold text-slate-700 w-1/3 flex items-center gap-2.5">
                    {getAttributeIcon(attr.name)}
                    <span>{attr.name}</span>
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-900">
                    {attr.value} {attr.unit || ''}
                  </td>
                </tr>
              ))}
              <tr className="border-b border-slate-100 bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-700 flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-blue-500" />
                  <span>Authorized Brand</span>
                </td>
                <td className="py-3 px-4 font-bold text-slate-900">{brandName}</td>
              </tr>
              {product.model_number && (
                <tr className="border-b border-slate-100 bg-white">
                  <td className="py-3 px-4 font-bold text-slate-700 flex items-center gap-2.5">
                    <Tag className="w-4 h-4 text-purple-500" />
                    <span>Official Model SKU</span>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {product.model_number}
                  </td>
                </tr>
              )}
              <tr className="bg-slate-50/60">
                <td className="py-3 px-4 font-bold text-slate-700 flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Manufacturer Warranty</span>
                </td>
                <td className="py-3 px-4 font-semibold text-slate-900">
                  {(product as any).warranty || '1 Year Comprehensive Warranty + 4/5 Years Compressor Warranty'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Deep Buyer Decision Sections (SEO, Purpose, Performance, Qualities) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Section A: Purpose & Target Use Cases */}
        <div className="bg-gradient-to-br from-white to-blue-50/40 rounded-3xl p-6 sm:p-8 border border-blue-100 shadow-sm space-y-4">
          <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2.5">
            <Building className="w-5 h-5 text-blue-600" />
            <span>Target Applications & Commercial Use Cases</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Engineered specifically for heavy duty commercial use. Ideal for high-turnover establishments requiring reliable temperature retention:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {(product.applications && product.applications.length > 0
              ? product.applications
              : [
                'Supermarkets & Grocery Chains',
                'Ice Cream Parlors & Dairies',
                'Bakeries & Confectioneries',
                'Cloud Kitchens & Fine Dining',
                'Hotels & Banquet Centers',
                'Pharmaceutical & Biotech Labs'
              ]
            ).map((app, i) => (
              <div
                key={i}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-blue-200/60 shadow-2xs text-xs font-bold text-slate-800"
              >
                <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>{app}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section B: Engineering Qualities & Performance Highlights */}
        <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-3xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-4">
          <h3 className="font-display font-extrabold text-lg text-slate-900 flex items-center gap-2.5">
            <Zap className="w-5 h-5 text-emerald-600" />
            <span>Engineering Qualities & Performance</span>
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Key factors that ensure this unit outperforms generic market cooling equipment:
          </p>
          <ul className="space-y-2.5 pt-1 text-xs text-slate-700">
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Tropicalized for 43°C Ambient:</strong> Maintains optimal sub-zero or chilling temperature even during peak coastal Andhra and Telangana heatwaves.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>100% Inner Groove Copper:</strong> Maximum thermodynamic efficiency, faster pull-down time, and complete resistance against corrosion.
              </span>
            </li>
            <li className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Up to 53% Lower Energy Consumption:</strong> Equipped with energy-saving compressors and cyclopentane high-density PUF insulation to reduce monthly power costs.
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* ── Why Buy from Tanmayee Technologies (Uniqueness & Authorized Dealer Guarantee) ── */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-cyan-400 text-xs font-extrabold uppercase tracking-widest bg-cyan-950/60 px-3 py-1 rounded-full border border-cyan-800/60">
            <Award className="w-3.5 h-3.5" /> The Tanmayee Advantage
          </div>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white">
            Why Buy {product.product_name} From Tanmayee Technologies?
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            As Visakhapatnam's premier authorized sales & service distributor for Blue Star and Rockwell, Tanmayee Technologies gives you institutional pricing, factory warranty validation, and rapid local technical service.
          </p>
        </div>

        <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <ShieldCheck className="w-6 h-6 text-cyan-400" />
            <div className="font-bold text-sm text-white">100% Brand Direct</div>
            <div className="text-xs text-slate-400">Direct factory dispatch with genuine serialized manufacturer warranty.</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <FileText className="w-6 h-6 text-emerald-400" />
            <div className="font-bold text-sm text-white">GST Input Tax Credit</div>
            <div className="text-xs text-slate-400">Standard 18% / 28% commercial GST invoices for corporate tax deductions.</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <Truck className="w-6 h-6 text-amber-400" />
            <div className="font-bold text-sm text-white">Direct Delivery & Setup</div>
            <div className="text-xs text-slate-400">Safe handling, doorstep unloading, and professional turnkey installation.</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1.5">
            <HeartHandshake className="w-6 h-6 text-rose-400" />
            <div className="font-bold text-sm text-white">Lifetime Service & AMC</div>
            <div className="text-xs text-slate-400">Prompt on-site support by factory-certified HVAC and refrigeration engineers.</div>
          </div>
        </div>

        {/* Background glow accents */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* ── Similar & Recommended Products ──────────────────────────── */}
      {similarProducts.length > 0 && (
        <div className="space-y-6 pt-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-bold text-2xl text-slate-900">
              Similar Commercial Equipment
            </h2>
            <Link
              href={`/categories/${category?.slug}`}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 transition-colors"
            >
              <span>View All in {category?.name}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* ── Behavior-Driven Recommendations: Products You May Like ── */}
      <div className="pt-4 border-t border-slate-200">
        <RecommendedProducts
          excludeId={product.id}
          limit={4}
          title="Products You May Like"
          subtitle="Smart equipment recommendations matched to your requirements and cooling load"
        />
      </div>

      {/* ── High-End Full-Screen Images Box (Lightbox) ── */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex flex-col justify-between bg-slate-950/95 backdrop-blur-2xl text-white select-none animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          {/* Top Bar */}
          <div
            className="flex items-center justify-between px-6 py-4 border-b border-white/10 shrink-0 z-10 bg-slate-950/60 backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span
                className={`text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shrink-0 shadow ${isBlueStar
                    ? 'bg-blue-600 text-white'
                    : 'bg-emerald-600 text-white'
                  }`}
              >
                {brandName}
              </span>
              <h2 className="text-sm md:text-base font-bold text-slate-100 truncate">
                {product.product_name}
              </h2>
              {product.model_number && (
                <span className="hidden sm:inline-block font-mono text-xs text-slate-400 bg-white/10 px-2 py-0.5 rounded shrink-0">
                  {product.model_number}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-xs font-semibold text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                Photo {lightboxIndex + 1} of {mediaList.length}
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white hover:text-rose-400 transition-colors cursor-pointer"
                title="Close (Esc)"
                aria-label="Close image viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage: Viewport with Prev / Next Buttons */}
          <div
            className="relative flex-1 flex items-center justify-center p-4 md:p-8 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Prev Button */}
            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev > 0 ? prev - 1 : mediaList.length - 1))}
                className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-600 text-white border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md cursor-pointer"
                title="Previous Image (Left Arrow)"
                aria-label="Previous photo"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Main Stage Media */}
            <div className="relative max-w-4xl max-h-[64vh] w-full h-full flex items-center justify-center">
              {mediaList[lightboxIndex]?.type === 'VIDEO' ? (
                <video
                  src={mediaList[lightboxIndex].url}
                  controls
                  autoPlay
                  playsInline
                  className="max-h-[64vh] max-w-full rounded-2xl object-contain shadow-2xl bg-black"
                />
              ) : (
                <img
                  src={mediaList[lightboxIndex]?.url}
                  alt={mediaList[lightboxIndex]?.alt || product.product_name}
                  className="max-h-[64vh] max-w-full rounded-2xl object-contain shadow-2xl transition-all duration-300"
                />
              )}
            </div>

            {/* Next Button */}
            {mediaList.length > 1 && (
              <button
                type="button"
                onClick={() => setLightboxIndex((prev) => (prev < mediaList.length - 1 ? prev + 1 : 0))}
                className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-slate-900/80 hover:bg-cyan-600 text-white border border-white/20 transition-all hover:scale-110 active:scale-95 shadow-2xl backdrop-blur-md cursor-pointer"
                title="Next Image (Right Arrow)"
                aria-label="Next photo"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          {/* Bottom Horizontal Scrollable Carousel Strip */}
          <div
            className="w-full bg-slate-950/90 border-t border-white/10 px-4 py-3 shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="max-w-4xl mx-auto">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 px-1">
                <span className="font-semibold text-slate-300">All Available Views — Scroll Horizontally</span>
                <span className="text-[11px] text-slate-500 hidden sm:inline">Use Left/Right arrow keys to navigate</span>
              </div>
              <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/20">
                {mediaList.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setLightboxIndex(idx);
                      setActiveMediaIndex(idx);
                    }}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-200 bg-white cursor-pointer ${lightboxIndex === idx
                        ? 'border-cyan-400 ring-2 ring-cyan-400/50 scale-105 shadow-lg shadow-cyan-500/30'
                        : 'border-white/20 opacity-60 hover:opacity-100 hover:border-white/50'
                      }`}
                    title={item.title}
                  >
                    {item.type === 'VIDEO' ? (
                      <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white">
                        <Play className="w-4 h-4 fill-white text-white" />
                        <span className="text-[7px] font-bold uppercase text-cyan-300">Video</span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={item.alt}
                        className="w-full h-full object-contain p-1"
                      />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Notify Me When Available Modal */}
      {isNotifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl relative animate-scale-up border border-slate-100">
            <button
              type="button"
              onClick={() => {
                setIsNotifyOpen(false);
                setNotifySuccess(false);
                setNotifyError('');
              }}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 shrink-0">
                <Bell className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Notify Me When Available
                </h3>
                <p className="text-xs text-slate-500">
                  {product.product_name}
                </p>
              </div>
            </div>

            {notifySuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl space-y-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-900">Request Received!</h4>
                <p className="text-xs text-emerald-700">
                  Thank you! Our B2B sales team at Tanmayee Technologies will contact you directly at <span className="font-bold">{notifyPhone}</span> as soon as this equipment is ready for dispatch.
                </p>
                <button
                  type="button"
                  onClick={() => setIsNotifyOpen(false)}
                  className="mt-2 w-full py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleNotifySubmit} className="space-y-4">
                <p className="text-xs text-slate-600 leading-relaxed">
                  This model is temporarily out of stock. Leave your mobile number and our technical team will call or WhatsApp you the moment stock arrives with wholesale quotation rates.
                </p>

                {notifyError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
                    {notifyError}
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Your Name / Business Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={notifyName}
                      onChange={(e) => setNotifyName(e.target.value)}
                      placeholder="e.g. Ramesh Reddy / Hotel Grand"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Mobile Number <span className="text-rose-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={notifyPhone}
                        onChange={(e) => setNotifyPhone(e.target.value)}
                        placeholder="e.g. 9876543210"
                        className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-mono font-bold"
                      />
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={notifySubmitting}
                  className="w-full py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-orange-950/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {notifySubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Submitting Request...</span>
                    </>
                  ) : (
                    <>
                      <Bell className="w-4 h-4" />
                      <span>Alert Me When In Stock</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
