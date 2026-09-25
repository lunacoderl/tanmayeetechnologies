'use client';

// ============================================================================
// @tanmayee/admin — Product Editor Form Component
// Handles both Create and Edit workflows with EAV specification tabs,
// key performance features, applications, bulk tiers, image galleries,
// and SEO metadata with persistent localStorage state.
// ============================================================================

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  CheckCircle2,
  Trash2,
  Plus,
  Layers,
  DollarSign,
  Image as ImageIcon,
  Sparkles,
  FileText,
  Check,
  ExternalLink,
} from 'lucide-react';
import { SEED_BRANDS, SEED_CATEGORIES } from '@tanmayee/database';
import { ProductStatus, PriceDisplay } from '@tanmayee/config';
import { MediaManager } from '../media/media-manager';

interface ProductFormProps {
  initialData?: any;
  isEdit?: boolean;
}

export function ProductForm({ initialData, isEdit = false }: ProductFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'general' | 'specs' | 'pricing' | 'media' | 'seo'>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Normalize attributes from initialData
  const normalizedAttributes = React.useMemo(() => {
    if (initialData?.attributes && Array.isArray(initialData.attributes) && initialData.attributes.length > 0) {
      return initialData.attributes.map((attr: any) => ({
        attribute_name: attr.attribute_name || attr.name || '',
        attribute_value: attr.attribute_value || attr.value || '',
        attribute_unit: attr.attribute_unit !== undefined ? attr.attribute_unit : (attr.unit || ''),
        is_highlight: attr.is_highlight || false,
      }));
    }
    return [
      { attribute_name: 'Capacity', attribute_value: '1.5 Ton', attribute_unit: 'Ton', is_highlight: true },
      { attribute_name: 'Star Rating', attribute_value: '5 Star', attribute_unit: '', is_highlight: true },
      { attribute_name: 'Technology', attribute_value: 'Inverter Rotary', attribute_unit: '', is_highlight: true },
      { attribute_name: 'Refrigerant', attribute_value: 'R32 Eco-Friendly', attribute_unit: '', is_highlight: false },
    ];
  }, [initialData]);

  // Normalize media from initialData
  const primaryImg =
    initialData?.primary_image_url ||
    initialData?.media?.find((m: any) => m.is_primary)?.url ||
    initialData?.media?.[0]?.url ||
    (initialData?.brand_name?.toLowerCase().includes('blue star')
      ? 'https://cdn.shopify.com/s/files/1/0888/8297/0937/files/ic518vnurav_gallery-images-01_2_4.png'
      : 'https://www.rockwell.co.in/cdn/shop/files/GFR250.png');

  const galleryImgs: string[] =
    initialData?.gallery_urls ||
    (Array.isArray(initialData?.media)
      ? initialData.media.slice(1).map((m: any) => (typeof m === 'string' ? m : m.url))
      : []);

  // Form State
  const [formData, setFormData] = useState<any>({
    id: initialData?.id || `p-custom-${Date.now()}`,
    product_name: initialData?.product_name || '',
    slug: initialData?.slug || '',
    model_number: initialData?.model_number || '',
    brand_id: initialData?.brand_id || SEED_BRANDS[0].id,
    category_id: initialData?.category_id || SEED_CATEGORIES[0].id,
    status: initialData?.status || ProductStatus.PUBLISHED,
    price_display: initialData?.price_display || PriceDisplay.SHOW,
    base_mrp: initialData?.base_mrp || initialData?.reference_price || 45000,
    dealer_price: initialData?.dealer_price || initialData?.price_range_min || initialData?.reference_price || 38000,
    short_description: initialData?.short_description || '',
    long_description: initialData?.long_description || initialData?.description || '',
    features: initialData?.features || [
      'Heavy-duty commercial cooling compressor',
      'Corrosion resistant tropicalized body',
      'High ambient performance tested up to 52°C',
      'Energy efficient copper condenser tubes',
    ],
    applications: initialData?.applications || [
      'Commercial Offices',
      'Restaurants & Hotels',
      'Retail Stores',
      'Healthcare Facilities',
    ],
    primary_image_url: primaryImg,
    gallery_urls: galleryImgs,
    brochure_url: initialData?.brochure_url || '',
    seo_title: initialData?.seo_title || '',
    seo_description: initialData?.seo_description || '',
    attributes: normalizedAttributes,
    bulk_tiers: initialData?.bulk_tiers || [
      { min_qty: 5, max_qty: 9, discount_percent: 5 },
      { min_qty: 10, max_qty: 24, discount_percent: 8 },
      { min_qty: 25, max_qty: null, discount_percent: 12 },
    ],
  });

  const [newGalleryInput, setNewGalleryInput] = useState('');
  const [newFeatureInput, setNewFeatureInput] = useState('');
  const [newAppInput, setNewAppInput] = useState('');

  // Draft Management State
  const [draftAvailable, setDraftAvailable] = useState<any | null>(null);
  const [draftSavedTime, setDraftSavedTime] = useState<string | null>(null);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | null>(null);
  const isInitialMount = React.useRef(true);

  // Check for unsaved draft on mount
  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && initialData?.id) {
        const draftKey = `tt_draft_${initialData.id}`;
        const savedDraft = localStorage.getItem(draftKey);
        if (savedDraft) {
          const parsed = JSON.parse(savedDraft);
          // Only show banner if draft has changes
          if (parsed && parsed.product_name) {
            setDraftAvailable(parsed);
          }
        }
      }
    } catch (e) {
      console.error('Error checking for draft:', e);
    }
  }, [initialData?.id]);

  // Debounced auto-save draft to localStorage whenever form changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (savedSuccess) return;

    const timer = setTimeout(() => {
      try {
        if (typeof window !== 'undefined' && formData.id) {
          const draftKey = `tt_draft_${formData.id}`;
          const draftData = {
            ...formData,
            _draftSavedAt: new Date().toISOString(),
          };
          localStorage.setItem(draftKey, JSON.stringify(draftData));
          setDraftSavedTime(new Date().toLocaleTimeString());
        }
      } catch (e) {
        console.error('Error auto-saving draft:', e);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [formData, savedSuccess]);

  const handleRestoreDraft = () => {
    if (draftAvailable) {
      setFormData(draftAvailable);
      setDraftSavedTime(new Date(draftAvailable._draftSavedAt || Date.now()).toLocaleTimeString());
      setDraftAvailable(null);
    }
  };

  const handleDiscardDraft = () => {
    if (typeof window !== 'undefined' && formData.id) {
      localStorage.removeItem(`tt_draft_${formData.id}`);
    }
    setDraftAvailable(null);
    setDraftSavedTime(null);
    // Reset to initialData
    if (initialData) {
      setFormData({
        id: initialData.id,
        product_name: initialData.product_name || '',
        slug: initialData.slug || '',
        model_number: initialData.model_number || '',
        brand_id: initialData.brand_id || SEED_BRANDS[0].id,
        category_id: initialData.category_id || SEED_CATEGORIES[0].id,
        status: initialData.status || ProductStatus.PUBLISHED,
        price_display: initialData.price_display || PriceDisplay.SHOW,
        base_mrp: initialData.base_mrp || initialData.reference_price || 45000,
        dealer_price: initialData.dealer_price || initialData.price_range_min || initialData.reference_price || 38000,
        short_description: initialData.short_description || '',
        long_description: initialData.long_description || initialData.description || '',
        features: initialData.features || [],
        applications: initialData.applications || [],
        primary_image_url: primaryImg,
        gallery_urls: galleryImgs,
        brochure_url: initialData.brochure_url || '',
        seo_title: initialData.seo_title || '',
        seo_description: initialData.seo_description || '',
        attributes: normalizedAttributes,
        bulk_tiers: initialData.bulk_tiers || [],
      });
    }
  };

  const handleTextChange = (field: string, value: any) => {
    setFormData((prev: any) => {
      const next = { ...prev, [field]: value };
      if (field === 'product_name' && !isEdit) {
        next.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, '');
        if (!next.seo_title) {
          next.seo_title = `${value} | Tanmayee Technologies Authorized Partner`;
        }
      }
      return next;
    });
  };

  // Attribute Handlers
  const handleAddAttribute = () => {
    setFormData((prev: any) => ({
      ...prev,
      attributes: [
        ...prev.attributes,
        { attribute_name: '', attribute_value: '', attribute_unit: '', is_highlight: false },
      ],
    }));
  };

  const handleUpdateAttribute = (index: number, field: string, value: any) => {
    setFormData((prev: any) => {
      const updated = [...prev.attributes];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, attributes: updated };
    });
  };

  const handleRemoveAttribute = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      attributes: prev.attributes.filter((_: any, i: number) => i !== index),
    }));
  };

  // Feature Handlers
  const handleAddFeature = () => {
    if (!newFeatureInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      features: [...prev.features, newFeatureInput.trim()],
    }));
    setNewFeatureInput('');
  };

  const handleRemoveFeature = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      features: prev.features.filter((_: any, i: number) => i !== idx),
    }));
  };

  // Application Handlers
  const handleAddApp = () => {
    if (!newAppInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      applications: [...prev.applications, newAppInput.trim()],
    }));
    setNewAppInput('');
  };

  const handleRemoveApp = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      applications: prev.applications.filter((_: any, i: number) => i !== idx),
    }));
  };

  // Gallery Handlers
  const handleAddGalleryImage = () => {
    if (!newGalleryInput.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      gallery_urls: [...prev.gallery_urls, newGalleryInput.trim()],
    }));
    setNewGalleryInput('');
  };

  const handleRemoveGalleryImage = (idx: number) => {
    setFormData((prev: any) => ({
      ...prev,
      gallery_urls: prev.gallery_urls.filter((_: any, i: number) => i !== idx),
    }));
  };

  // Bulk Tier Handlers
  const handleAddTier = () => {
    setFormData((prev: any) => ({
      ...prev,
      bulk_tiers: [
        ...prev.bulk_tiers,
        { min_qty: 50, max_qty: null, discount_percent: 15 },
      ],
    }));
  };

  const handleRemoveTier = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      bulk_tiers: prev.bulk_tiers.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSavedSuccess(false);
    setSaveErrorMessage(null);

    try {
      // Find Brand & Category Names
      const selectedBrand = SEED_BRANDS.find((b) => b.id === formData.brand_id) || SEED_BRANDS[0];
      const selectedCat = SEED_CATEGORIES.find((c) => c.id === formData.category_id) || SEED_CATEGORIES[0];

      const isVideoUrl = (u: string) =>
        /\.(mp4|webm|mov|ogg)($|\?)/i.test(u) || u.includes('youtube.com') || u.includes('youtu.be') || u.includes('vimeo.com');

      // Build consolidated product object
      const productPayload = {
        ...formData,
        id: formData.id || initialData?.id || `p-custom-${Date.now()}`,
        brand_name: selectedBrand.name,
        category_name: selectedCat.name,
        reference_price: formData.base_mrp,
        description: formData.long_description,
        media: [
          ...(formData.primary_image_url
            ? [
                {
                  url: formData.primary_image_url,
                  type: isVideoUrl(formData.primary_image_url) ? 'VIDEO' : 'MAIN_IMAGE',
                  is_primary: true,
                  alt: formData.product_name,
                },
              ]
            : []),
          ...formData.gallery_urls.map((url: string, i: number) => ({
            url,
            type: isVideoUrl(url) ? 'VIDEO' : 'GALLERY',
            is_primary: false,
            alt: `${formData.product_name} View ${i + 2}`,
          })),
        ],
        updated_at: new Date().toISOString(),
      };

      // 1. Call server API to persist to custom-products.json and sync to Supabase
      const res = await fetch('/api/products/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productPayload),
      });

      const result = await res.json();
      if (!result.success) {
        throw new Error(result.error || 'Failed to save product on server');
      }

      // 2. Save to localStorage for instant client reactivity across tabs
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tanmayee_custom_products');
        let customProducts: any[] = [];
        if (stored) {
          try {
            customProducts = JSON.parse(stored);
          } catch {
            customProducts = [];
          }
        }

        const existingIdx = customProducts.findIndex((p: any) => p.id === productPayload.id);
        if (existingIdx >= 0) {
          customProducts[existingIdx] = productPayload;
        } else {
          customProducts.unshift(productPayload);
        }
        localStorage.setItem('tanmayee_custom_products', JSON.stringify(customProducts));

        // 3. Clear draft since changes are successfully saved!
        localStorage.removeItem(`tt_draft_${productPayload.id}`);
      }

      setDraftAvailable(null);
      setDraftSavedTime(null);
      setIsSaving(false);
      setSavedSuccess(true);

      // Scroll to top to ensure success notification is seen
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Error saving product:', err);
      setSaveErrorMessage(err.message || 'An error occurred while saving product');
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-6xl pb-16">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="flex items-center gap-3">
          <Link
            href="/products"
            className="p-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-display font-extrabold text-2xl text-slate-900">
              {isEdit ? `Edit Product: ${formData.product_name || 'Item'}` : 'Create New Product'}
            </h1>
            <p className="text-xs text-slate-500">
              {isEdit ? `Model: ${formData.model_number || 'N/A'}` : 'Add a new commercial cooling or refrigeration model to catalogue'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {draftSavedTime && !savedSuccess && (
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Draft saved {draftSavedTime}
            </span>
          )}
          {savedSuccess && (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" /> Saved &amp; Synced!
            </span>
          )}
          <Link
            href="/products"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs py-2.5 px-5 rounded-xl shadow transition-all disabled:opacity-50 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'Saving & Syncing...' : isEdit ? 'Save Changes' : 'Publish Product'}</span>
          </button>
        </div>
      </div>

      {/* Draft Notification Banner */}
      {draftAvailable && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-800 shrink-0 mt-0.5">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-amber-950">
                Unsaved Draft Changes Found
              </h4>
              <p className="text-xs text-amber-800 mt-0.5">
                You have previously modified fields for this product (auto-saved on{' '}
                {new Date(draftAvailable._draftSavedAt || Date.now()).toLocaleTimeString()}{' '}
                {new Date(draftAvailable._draftSavedAt || Date.now()).toLocaleDateString()}).
                Would you like to resume from your draft or undo and discard it?
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleRestoreDraft}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm cursor-pointer"
            >
              Continue from Draft
            </button>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="bg-white hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Undo / Discard Draft
            </button>
          </div>
        </div>
      )}

      {/* Save Success Banner */}
      {savedSuccess && (
        <div className="bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm animate-in fade-in duration-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-xl text-emerald-800 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-emerald-950">
                Changes Saved Permanently!
              </h4>
              <p className="text-xs text-emerald-800 mt-0.5">
                Product details, specifications, and cropped images were saved to the database and synced across the platform.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href="/products"
              className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors shadow-sm"
            >
              Back to Products List
            </Link>
            {formData.slug && (
              <a
                href={`http://localhost:3000/products/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-white hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors inline-flex items-center gap-1.5"
              >
                <span>View on Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      )}

      {/* Error Banner */}
      {saveErrorMessage && (
        <div className="bg-rose-50 border-2 border-rose-300 rounded-2xl p-4 flex items-center justify-between gap-3 shadow-sm text-rose-900 text-xs font-semibold">
          <span>Failed to save changes: {saveErrorMessage}</span>
          <button
            type="button"
            onClick={() => setSaveErrorMessage(null)}
            className="text-rose-700 hover:text-rose-900 text-xs font-bold underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-px">
        {[
          { id: 'general', label: 'General Info', icon: FileText },
          { id: 'specs', label: 'Specifications & Features', icon: Layers },
          { id: 'pricing', label: 'Pricing & Bulk Tiers', icon: DollarSign },
          { id: 'media', label: 'Media & Gallery Images', icon: ImageIcon },
          { id: 'seo', label: 'Search & SEO', icon: Sparkles },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold border-b-2 whitespace-nowrap transition-colors ${
                isActive
                  ? 'border-brand-600 text-brand-600 bg-brand-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General Info */}
      {activeTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Primary Product Information
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Product Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.product_name}
                onChange={(e) => handleTextChange('product_name', e.target.value)}
                placeholder="e.g. Blue Star Inverter Split AC 1.5 Ton 5 Star"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Model / SKU Code <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.model_number}
                  onChange={(e) => handleTextChange('model_number', e.target.value)}
                  placeholder="e.g. IA518PKU or SFR500DGT"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  URL Slug <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.slug}
                  onChange={(e) => handleTextChange('slug', e.target.value)}
                  placeholder="e.g. blue-star-inverter-split-ac-1-5-ton"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-mono text-slate-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Short Description (Summary)
              </label>
              <textarea
                rows={2}
                value={formData.short_description}
                onChange={(e) => handleTextChange('short_description', e.target.value)}
                placeholder="High efficiency cooling engineered for Indian climatic extremes with 100% copper condenser."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Full Technical Overview & Description
              </label>
              <textarea
                rows={5}
                value={formData.long_description}
                onChange={(e) => handleTextChange('long_description', e.target.value)}
                placeholder="Comprehensive technical details, corporate installation specs, and warranty notes..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
                Classification & Brand Partnership
              </h3>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brand Principal</label>
                <select
                  value={formData.brand_id}
                  onChange={(e) => handleTextChange('brand_id', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                >
                  {SEED_BRANDS.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.name.toLowerCase().includes('blue star') ? 'Authorized Dealers' : 'Authorized Distributors'})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Category</label>
                <select
                  value={formData.category_id}
                  onChange={(e) => handleTextChange('category_id', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-medium"
                >
                  {SEED_CATEGORIES.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Lifecycle Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => handleTextChange('status', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500 font-semibold"
                >
                  <option value={ProductStatus.PUBLISHED}>Published (Live in Public Catalog)</option>
                  <option value={ProductStatus.DRAFT}>Draft (Internal Only)</option>
                  <option value={ProductStatus.ARCHIVED}>Archived (Hidden)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Specifications, Features & Applications */}
      {activeTab === 'specs' && (
        <div className="space-y-6">
          {/* EAV Technical Attributes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Technical Specifications & Dimensions (EAV Matrix)
                </h3>
                <p className="text-xs text-slate-500">
                  Detailed engineering parameters, dimensions, capacity, voltage, and highlight badges displayed on the public product card.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddAttribute}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5 text-brand-600" />
                <span>Add Specification</span>
              </button>
            </div>

            <div className="space-y-3">
              {formData.attributes.map((attr: any, idx: number) => (
                <div
                  key={idx}
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="w-full sm:w-1/3">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Specification Name</label>
                    <input
                      type="text"
                      value={attr.attribute_name}
                      onChange={(e) => handleUpdateAttribute(idx, 'attribute_name', e.target.value)}
                      placeholder="e.g. Capacity, Dimensions, Power"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="w-full sm:w-1/3">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Specification Value</label>
                    <input
                      type="text"
                      value={attr.attribute_value}
                      onChange={(e) => handleUpdateAttribute(idx, 'attribute_value', e.target.value)}
                      placeholder="e.g. 1.5 Ton, 500 L, 230V / 50Hz"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="w-full sm:w-1/6">
                    <label className="text-[10px] font-bold text-slate-500 block mb-0.5">Unit (Opt)</label>
                    <input
                      type="text"
                      value={attr.attribute_unit || ''}
                      onChange={(e) => handleUpdateAttribute(idx, 'attribute_unit', e.target.value)}
                      placeholder="Ton, L, Star, mm"
                      className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-brand-500"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-4 sm:pt-3">
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={attr.is_highlight || false}
                        onChange={(e) => handleUpdateAttribute(idx, 'is_highlight', e.target.checked)}
                        className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span>Highlight</span>
                    </label>

                    <button
                      type="button"
                      onClick={() => handleRemoveAttribute(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Specification"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Performance Features */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Key Performance Features
            </h3>
            <p className="text-xs text-slate-500">
              Bullet points highlighted on product details and commercial comparison tables.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newFeatureInput}
                onChange={(e) => setNewFeatureInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddFeature();
                  }
                }}
                placeholder="Add a new feature (e.g. 100% Copper Condenser, 10-Year Compressor Warranty)..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="bg-brand-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-brand-700 transition-colors"
              >
                Add Feature
              </button>
            </div>

            <div className="space-y-2 pt-2">
              {formData.features.map((feat: string, i: number) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-800">{feat}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFeature(i)}
                    className="text-slate-400 hover:text-rose-600 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Target Commercial Applications */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Target Commercial Applications & Ideal Sectors
            </h3>
            <p className="text-xs text-slate-500">
              Sectors and facility types where this equipment model is recommended.
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={newAppInput}
                onChange={(e) => setNewAppInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddApp();
                  }
                }}
                placeholder="Add an application (e.g. Supermarkets, Ice Cream Parlours, Hospitals)..."
                className="flex-1 px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddApp}
                className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Add Application
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.applications.map((app: string, i: number) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-xs font-semibold"
                >
                  <span>{app}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveApp(i)}
                    className="text-emerald-600 hover:text-rose-600"
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Pricing & Bulk Tiers */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
              Base Commercial Pricing & Quotation Visibility
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Base MRP / Reference Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.base_mrp}
                  onChange={(e) => handleTextChange('base_mrp', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Dealer / Special Quotation Price (₹)
                </label>
                <input
                  type="number"
                  value={formData.dealer_price}
                  onChange={(e) => handleTextChange('dealer_price', Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-emerald-700 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Public Price Display Policy
                </label>
                <select
                  value={formData.price_display}
                  onChange={(e) => handleTextChange('price_display', e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                >
                  <option value={PriceDisplay.SHOW}>Display Exact Base Price</option>
                  <option value={PriceDisplay.ON_REQUEST}>Price on Request (B2B RFQ Only)</option>
                  <option value={PriceDisplay.RANGE}>Display Price Range</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="font-bold text-sm text-slate-900">
                  Automated B2B Bulk Tier Discount Rules
                </h3>
                <p className="text-xs text-slate-500">
                  Tiers calculate instantaneous procurement discounts on public cart & quotation PDF generation.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddTier}
                className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-xl transition-colors"
              >
                <Plus className="w-3.5 h-3.5 text-brand-600" />
                <span>Add Tier</span>
              </button>
            </div>

            <div className="space-y-2">
              {formData.bulk_tiers.map((tier: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold"
                >
                  <span className="w-20 text-slate-500 font-mono">Tier {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <span>Min:</span>
                    <input
                      type="number"
                      value={tier.min_qty}
                      onChange={(e) => {
                        const updated = [...formData.bulk_tiers];
                        updated[index].min_qty = Number(e.target.value);
                        setFormData({ ...formData, bulk_tiers: updated });
                      }}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded font-bold text-center"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Max:</span>
                    <input
                      type="number"
                      placeholder="∞"
                      value={tier.max_qty || ''}
                      onChange={(e) => {
                        const updated = [...formData.bulk_tiers];
                        updated[index].max_qty = e.target.value ? Number(e.target.value) : null;
                        setFormData({ ...formData, bulk_tiers: updated });
                      }}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded font-bold text-center"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-700 font-bold">Discount:</span>
                    <input
                      type="number"
                      value={tier.discount_percent}
                      onChange={(e) => {
                        const updated = [...formData.bulk_tiers];
                        updated[index].discount_percent = Number(e.target.value);
                        setFormData({ ...formData, bulk_tiers: updated });
                      }}
                      className="w-16 px-2 py-1 bg-white border border-slate-200 rounded font-bold text-center text-emerald-700"
                    />
                    <span>%</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveTier(index)}
                    className="ml-auto p-1 text-rose-500 hover:text-rose-700 rounded transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Media & Gallery Images */}
      {activeTab === 'media' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
          <MediaManager
            primaryImageUrl={formData.primary_image_url}
            galleryUrls={formData.gallery_urls}
            onPrimaryImageChange={(url) => setFormData((prev: any) => ({ ...prev, primary_image_url: url }))}
            onGalleryUrlsChange={(urls) => setFormData((prev: any) => ({ ...prev, gallery_urls: urls }))}
          />

          {/* Brochure URL */}
          <div className="pt-3 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Official Manufacturer Specification Sheet / PDF Brochure URL
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.brochure_url}
                onChange={(e) => handleTextChange('brochure_url', e.target.value)}
                placeholder="https://storage.tanmayeetechnologies.com/brochures/model-spec.pdf"
                className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:bg-white focus:outline-none focus:border-brand-500"
              />
              {formData.brochure_url && (
                <a
                  href={formData.brochure_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 5: SEO Meta */}
      {activeTab === 'seo' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-sm text-slate-900 border-b border-slate-100 pb-2">
            Search Engine Optimization & Google Search Preview
          </h3>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Meta SEO Title</label>
            <input
              type="text"
              value={formData.seo_title}
              onChange={(e) => handleTextChange('seo_title', e.target.value)}
              placeholder="Product Name | Tanmayee Technologies"
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Recommended: 50-60 characters ({formData.seo_title.length} chars)
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Meta Description
            </label>
            <textarea
              rows={3}
              value={formData.seo_description}
              onChange={(e) => handleTextChange('seo_description', e.target.value)}
              placeholder="Authorized commercial dealer and distributor providing best wholesale rates, installation, and AMC on commercial cooling."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:border-brand-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              Recommended: 150-160 characters ({formData.seo_description.length} chars)
            </span>
          </div>
        </div>
      )}
    </form>
  );
}
