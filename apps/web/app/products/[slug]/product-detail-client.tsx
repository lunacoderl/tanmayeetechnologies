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
  const activeMedia = mediaList[activeMediaIndex] || mediaList[0];
  const imageUrl = activeMedia?.url || defaultFallbackImage;

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
                    onClick={() => setActiveMediaIndex(idx)}
                    onMouseEnter={() => setActiveMediaIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden border-2 transition-all duration-200 shrink-0 group ${
                      activeMediaIndex === idx
                        ? 'border-cyan-500 shadow-md ring-2 ring-cyan-400/40 scale-105 bg-white'
                        : 'border-slate-200/90 hover:border-slate-400 opacity-75 hover:opacity-100 hover:scale-102 bg-white'
                    }`}
                    title={item.title}
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

            {/* Showcase Box: Large Active Image or Video Player */}
            <div className="flex-1 w-full">
              <div className="relative aspect-[4/3] bg-gradient-to-b from-slate-50 to-slate-200/70 rounded-3xl border border-slate-200/90 overflow-hidden shadow-lg group">
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

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span
                    className={`text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-md text-white ${
                      isBlueStar
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
                    onClick={handleShare}
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
                  <div className="absolute bottom-4 left-4 right-4 flex items-center z-10 pointer-events-none">
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

              <span className="text-xs text-emerald-800 bg-emerald-100/90 border border-emerald-300 font-extrabold px-3 py-1 rounded-full shadow-xs">
                In Stock & Ready
              </span>
            </div>

            <div className="text-xs text-slate-600 border-t border-slate-200/80 pt-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>
                <strong>Wholesale Volume Discount:</strong> Special institutional & project rates available for 3+ units on Quotation.
              </span>
            </div>
          </div>

          {/* Action Row: Quantity + Quotation + WhatsApp */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Selector */}
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

              {/* Add to Quotation Button */}
              <button
                type="button"
                onClick={handleAddQuotation}
                className="flex-1 h-12 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 hover:from-blue-600 hover:to-cyan-600 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-slate-950/20 flex items-center justify-center gap-2.5 transition-all duration-300 active:scale-98"
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

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                className={`h-12 px-3 rounded-2xl border transition-all flex items-center gap-1.5 font-bold text-xs ${
                  inWishlist
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
                  className={`border-b border-slate-100 hover:bg-slate-100/50 transition-colors ${
                    idx % 2 === 0 ? 'bg-slate-50/60' : 'bg-white'
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
    </div>
  );
}
