'use client';

// ============================================================================
// @tanmayee/admin — Advanced Media Manager & Free-Form Cropper
// Features:
// 1. Drag & drop image and video uploader
// 2. Free-form (unconstrained) interactive canvas cropper
// 3. Exact container fit with ambient blurred edge or pure white backdrop
// 4. Edit, crop, replace, reorder, and delete existing/old images
// 5. Direct Supabase Storage bucket persistence
// ============================================================================

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Video,
  Crop,
  Trash2,
  Star,
  RefreshCw,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Check,
  X,
  Play,
  Film,
  Sparkles,
  Eye,
  Sliders,
  Maximize2,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export interface MediaItem {
  id?: string;
  url: string;
  type: 'image' | 'video';
  is_primary?: boolean;
  alt?: string;
}

interface MediaManagerProps {
  primaryImageUrl: string;
  galleryUrls: string[];
  onPrimaryImageChange: (url: string) => void;
  onGalleryUrlsChange: (urls: string[]) => void;
}

export function MediaManager({
  primaryImageUrl,
  galleryUrls,
  onPrimaryImageChange,
  onGalleryUrlsChange,
}: MediaManagerProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgressText, setUploadProgressText] = useState('');
  const [previewBackdrop, setPreviewBackdrop] = useState<'blur' | 'white'>('blur');

  // Cropper Modal State
  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  const [cropTarget, setCropTarget] = useState<'primary' | number | 'new'>('new');
  const [cropRatio, setCropRatio] = useState<'free' | '1:1' | '4:3' | '16:9'>('free');
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  // Drag-to-crop coordinates within natural image space (percentages or pixels)
  // Normalized 0 to 1 box
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 0.1,
    y: 0.1,
    width: 0.8,
    height: 0.8,
  });

  const [isDraggingCropBox, setIsDraggingCropBox] = useState(false);
  const [activeHandle, setActiveHandle] = useState<string | null>(null);
  const dragStartRef = useRef<{ mouseX: number; mouseY: number; box: typeof cropBox }>({
    mouseX: 0,
    mouseY: 0,
    box: { x: 0.1, y: 0.1, width: 0.8, height: 0.8 },
  });

  const cropperContainerRef = useRef<HTMLDivElement>(null);
  const cropperImageRef = useRef<HTMLImageElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // List of all media entries
  const allMedia: MediaItem[] = [
    ...(primaryImageUrl
      ? [{ url: primaryImageUrl, type: isVideo(primaryImageUrl) ? 'video' as const : 'image' as const, is_primary: true }]
      : []),
    ...galleryUrls.map((url) => ({
      url,
      type: isVideo(url) ? 'video' as const : 'image' as const,
      is_primary: false,
    })),
  ];

  function isVideo(url: string): boolean {
    return /\.(mp4|webm|mov|ogg)($|\?)/i.test(url);
  }

  // ── Drag & Drop Handlers ──────────────────────────────────────────
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      await processFiles(files);
      e.target.value = '';
    }
  };

  // ── Process Uploads to Supabase (Sequential Multi-Drop Safe) ───────
  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    let currentPrimary = primaryImageUrl;
    let accumulatedGallery = [...galleryUrls];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      setUploadProgressText(`Uploading ${file.name} (${i + 1}/${files.length}) to Supabase...`);

      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const data = await res.json();
        if (data.success && data.url) {
          if (!currentPrimary && accumulatedGallery.length === 0 && data.mediaType === 'image') {
            currentPrimary = data.url;
            onPrimaryImageChange(data.url);
          } else {
            accumulatedGallery.push(data.url);
            onGalleryUrlsChange([...accumulatedGallery]);
          }
        } else {
          alert(`Upload error for ${file.name}: ${data.error || 'Failed to upload to Supabase'}`);
        }
      } catch (err: any) {
        console.error('File upload error:', err);
        alert(`Failed to upload ${file.name}: ${err.message}`);
      }
    }

    // Ensure complete array of all dropped files is persisted to form state
    onGalleryUrlsChange([...accumulatedGallery]);
    setIsUploading(false);
    setUploadProgressText('');
  };

  // ── Open Crop Modal ─────────────────────────────────────────────────
  const openCropper = (imageUrl: string, target: 'primary' | number | 'new') => {
    setCropImageSrc(imageUrl);
    setCropTarget(target);
    setCropRatio('free');
    setZoom(1);
    setRotation(0);
    setCropBox({ x: 0.05, y: 0.05, width: 0.9, height: 0.9 });
    setCropModalOpen(true);
  };

  // ── Crop Preset Aspect Ratios ──────────────────────────────────────
  const handleRatioChange = (ratio: 'free' | '1:1' | '4:3' | '16:9') => {
    setCropRatio(ratio);
    if (ratio === 'free') {
      return;
    }

    let targetRatio = 1;
    if (ratio === '4:3') targetRatio = 4 / 3;
    if (ratio === '16:9') targetRatio = 16 / 9;

    setCropBox((prev) => {
      let newW = prev.width;
      let newH = newW / targetRatio;
      if (newH > 0.95) {
        newH = 0.9;
        newW = newH * targetRatio;
      }
      return {
        ...prev,
        width: Math.min(newW, 0.95),
        height: Math.min(newH, 0.95),
      };
    });
  };

  // ── Mouse & Touch Crop Box Dragging ────────────────────────────────
  const handleMouseDownOnBox = (e: React.MouseEvent, handle: string | null) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveHandle(handle);
    setIsDraggingCropBox(true);
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      box: { ...cropBox },
    };
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDraggingCropBox || !cropperContainerRef.current) return;

      const containerRect = cropperContainerRef.current.getBoundingClientRect();
      const deltaX = (e.clientX - dragStartRef.current.mouseX) / containerRect.width;
      const deltaY = (e.clientY - dragStartRef.current.mouseY) / containerRect.height;
      const initialBox = dragStartRef.current.box;

      if (!activeHandle) {
        // Moving the entire box
        const newX = Math.max(0, Math.min(initialBox.x + deltaX, 1 - initialBox.width));
        const newY = Math.max(0, Math.min(initialBox.y + deltaY, 1 - initialBox.height));
        setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
      } else {
        // Resizing via handles (free-form or fixed ratio)
        let { x, y, width, height } = initialBox;

        if (activeHandle.includes('e')) {
          width = Math.max(0.1, Math.min(initialBox.width + deltaX, 1 - initialBox.x));
        }
        if (activeHandle.includes('s')) {
          height = Math.max(0.1, Math.min(initialBox.height + deltaY, 1 - initialBox.y));
        }
        if (activeHandle.includes('w')) {
          const maxLeftMove = initialBox.x + initialBox.width - 0.1;
          const targetX = Math.max(0, Math.min(initialBox.x + deltaX, maxLeftMove));
          width = initialBox.width + (initialBox.x - targetX);
          x = targetX;
        }
        if (activeHandle.includes('n')) {
          const maxTopMove = initialBox.y + initialBox.height - 0.1;
          const targetY = Math.max(0, Math.min(initialBox.y + deltaY, maxTopMove));
          height = initialBox.height + (initialBox.y - targetY);
          y = targetY;
        }

        // Apply ratio constraint if not 'free'
        if (cropRatio !== 'free') {
          let ratio = 1;
          if (cropRatio === '4:3') ratio = 4 / 3;
          if (cropRatio === '16:9') ratio = 16 / 9;
          height = width / ratio;
        }

        setCropBox({
          x: Math.max(0, x),
          y: Math.max(0, y),
          width: Math.min(width, 1 - x),
          height: Math.min(height, 1 - y),
        });
      }
    },
    [isDraggingCropBox, activeHandle, cropRatio]
  );

  const handleMouseUp = useCallback(() => {
    setIsDraggingCropBox(false);
    setActiveHandle(null);
  }, []);

  useEffect(() => {
    if (isDraggingCropBox) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingCropBox, handleMouseMove, handleMouseUp]);

  // ── Render Cropped Image onto Canvas & Upload to Supabase ─────────
  const applyCropAndUpload = async () => {
    if (!cropImageSrc) return;

    try {
      setIsUploading(true);
      setUploadProgressText('Cropping and uploading to Supabase...');

      // Create an off-screen image to draw crop
      const img = new window.Image();
      img.crossOrigin = 'anonymous';
      img.src = cropImageSrc;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image for cropping'));
      });

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      const naturalW = img.naturalWidth;
      const naturalH = img.naturalHeight;

      // Pixel crop dimensions
      const cropPxX = Math.round(cropBox.x * naturalW);
      const cropPxY = Math.round(cropBox.y * naturalH);
      const cropPxW = Math.round(cropBox.width * naturalW);
      const cropPxH = Math.round(cropBox.height * naturalH);

      canvas.width = Math.max(cropPxW, 100);
      canvas.height = Math.max(cropPxH, 100);

      // Support optional rotation
      if (rotation !== 0) {
        ctx.save();
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(
          img,
          cropPxX,
          cropPxY,
          cropPxW,
          cropPxH,
          -canvas.width / 2,
          -canvas.height / 2,
          canvas.width,
          canvas.height
        );
        ctx.restore();
      } else {
        ctx.drawImage(
          img,
          cropPxX,
          cropPxY,
          cropPxW,
          cropPxH,
          0,
          0,
          canvas.width,
          canvas.height
        );
      }

      // Convert to high-quality base64
      const base64Data = canvas.toDataURL('image/png', 0.95);

      // Upload to Supabase
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          base64: base64Data,
          fileName: `cropped-${Date.now()}.png`,
        }),
      });

      const data = await res.json();
      if (!data.success || !data.url) {
        throw new Error(data.error || 'Failed to upload cropped image to Supabase');
      }

      const newUrl = data.url;

      // Update target
      if (cropTarget === 'primary') {
        onPrimaryImageChange(newUrl);
      } else if (typeof cropTarget === 'number') {
        const next = [...galleryUrls];
        next[cropTarget] = newUrl;
        onGalleryUrlsChange(next);
      } else {
        // new item
        onGalleryUrlsChange([...galleryUrls, newUrl]);
      }

      setCropModalOpen(false);
      setCropImageSrc(null);
    } catch (err: any) {
      console.error('Cropping error:', err);
      alert(`Error applying crop: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgressText('');
    }
  };

  // ── Gallery Actions ─────────────────────────────────────────────────
  const handleSetPrimary = (index: number) => {
    const selectedUrl = galleryUrls[index];
    const remainingGallery = galleryUrls.filter((_, i) => i !== index);
    if (primaryImageUrl) {
      remainingGallery.unshift(primaryImageUrl);
    }
    onPrimaryImageChange(selectedUrl);
    onGalleryUrlsChange(remainingGallery);
  };

  const handleDeleteImage = async (urlToDelete: string, isPrimary: boolean) => {
    if (!confirm('Are you sure you want to remove this media file?')) return;

    if (isPrimary) {
      if (galleryUrls.length > 0) {
        onPrimaryImageChange(galleryUrls[0]);
        onGalleryUrlsChange(galleryUrls.slice(1));
      } else {
        onPrimaryImageChange('');
      }
    } else {
      onGalleryUrlsChange(galleryUrls.filter((url) => url !== urlToDelete));
    }

    // Try deleting from Supabase
    fetch(`/api/upload?url=${encodeURIComponent(urlToDelete)}`, {
      method: 'DELETE',
    }).catch(() => {});
  };

  return (
    <div className="space-y-6">
      {/* Top Header / Backdrop Style Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-500" />
            <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
              Supabase Media Management & Free-Form Cropper
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">
            Drop images or videos here. Crop free-form or with fixed presets. All files save permanently in your Supabase bucket.
          </p>
        </div>

        {/* Presentation Backdrop Toggle */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white p-1 rounded-xl border border-slate-200 text-xs">
          <span className="text-[11px] font-semibold text-slate-500 px-2">Container Edge:</span>
          <button
            type="button"
            onClick={() => setPreviewBackdrop('blur')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              previewBackdrop === 'blur'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ambient Blur
          </button>
          <button
            type="button"
            onClick={() => setPreviewBackdrop('white')}
            className={`px-3 py-1 rounded-lg font-bold text-[11px] transition-colors ${
              previewBackdrop === 'white'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pure White
          </button>
        </div>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative cursor-pointer rounded-xl sm:rounded-3xl border-2 border-dashed p-4 sm:p-12 text-center transition-all ${
          isDragging
            ? 'border-cyan-500 bg-cyan-500/10 scale-[1.01] shadow-xl shadow-cyan-500/10'
            : 'border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50/50 shadow-sm'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-2 sm:space-y-3">
          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-cyan-50 border border-cyan-100 text-cyan-600 flex items-center justify-center mx-auto shadow-inner">
            {isUploading ? (
              <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-cyan-600" />
            ) : (
              <UploadCloud className="w-6 h-6 sm:w-8 sm:h-8 text-cyan-600" />
            )}
          </div>

          <div>
            <h4 className="font-display font-extrabold text-xs sm:text-base text-slate-800">
              {isUploading ? uploadProgressText : 'Drag & Drop Images or Video Here'}
            </h4>
            <p className="text-[10px] sm:text-xs text-slate-500 mt-0.5 sm:mt-1">
              Supports JPG, PNG, WebP, SVG images & MP4, WebM videos. Direct upload to Supabase bucket.
            </p>
          </div>

          <button
            type="button"
            disabled={isUploading}
            className="inline-flex items-center gap-1.5 sm:gap-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] sm:text-xs px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-lg sm:rounded-xl shadow transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Select Media Files</span>
          </button>
        </div>
      </div>

      {/* Primary Showcase Image Section */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-[11px] sm:text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            Primary Showcase Thumbnail (Hero Media)
          </label>
          <span className="text-[10px] sm:text-[11px] text-slate-400">
            Fitted in exact container with {previewBackdrop === 'blur' ? 'ambient edge blur' : 'white background'}
          </span>
        </div>

        {primaryImageUrl ? (
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-5 items-start bg-white p-3.5 sm:p-5 rounded-xl sm:rounded-2xl border border-slate-200 shadow-sm">
            {/* Exact Container Fitted Box */}
            <div className="relative w-36 h-36 sm:w-56 sm:h-56 mx-auto sm:mx-0 rounded-xl sm:rounded-2xl border-2 border-slate-200 overflow-hidden shrink-0 shadow-md">
              {/* Blurred Edge Backdrop or Pure White */}
              {previewBackdrop === 'blur' ? (
                <div
                  className="absolute inset-0 bg-cover bg-center filter blur-xl scale-125 opacity-35"
                  style={{ backgroundImage: `url(${primaryImageUrl})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-white" />
              )}

              {/* Exact Container Fitted Image */}
              {isVideo(primaryImageUrl) ? (
                <video
                  src={primaryImageUrl}
                  controls
                  className="relative z-10 w-full h-full object-contain"
                />
              ) : (
                <img
                  src={primaryImageUrl}
                  alt="Primary showcase"
                  className="relative z-10 w-full h-full object-contain p-2"
                />
              )}

              <span className="absolute top-2 left-2 z-20 bg-amber-500 text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md shadow">
                Primary
              </span>
            </div>

            <div className="flex-1 space-y-3">
              <div>
                <span className="text-xs font-mono text-slate-500 break-all select-all block bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  {primaryImageUrl}
                </span>
                <p className="text-[11px] text-slate-400 mt-1">
                  Stored in Supabase bucket <code className="text-cyan-700">product-media</code>. Displayed as catalogue hero thumbnail and RFQ summary header.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {!isVideo(primaryImageUrl) && (
                  <button
                    type="button"
                    onClick={() => openCropper(primaryImageUrl, 'primary')}
                    className="inline-flex items-center gap-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-800 text-xs font-bold px-3.5 py-2 rounded-xl border border-cyan-200 shadow-sm transition-colors"
                  >
                    <Crop className="w-3.5 h-3.5 text-cyan-600" />
                    <span>Free-Form Crop & Edit</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => handleDeleteImage(primaryImageUrl, true)}
                  className="inline-flex items-center gap-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold px-3.5 py-2 rounded-xl border border-rose-200 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>Remove Hero Image</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300 text-slate-400 text-xs">
            No primary hero image selected. Drop an image above or set one from the gallery below.
          </div>
        )}
      </div>

      {/* Additional Gallery Photos & Videos */}
      <div className="space-y-3 pt-4 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <Film className="w-4 h-4 text-cyan-600" />
            Product Gallery Media ({galleryUrls.length})
          </h4>
          <span className="text-[11px] text-slate-400">
            Hover to crop, set as hero, or delete old images
          </span>
        </div>

        {galleryUrls.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {galleryUrls.map((url, idx) => {
              const video = isVideo(url);
              return (
                <div
                  key={idx}
                  className="group relative rounded-2xl border border-slate-200 overflow-hidden aspect-square shadow-sm hover:shadow-lg transition-all"
                >
                  {/* Backdrop */}
                  {previewBackdrop === 'blur' ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center filter blur-lg scale-125 opacity-35"
                      style={{ backgroundImage: `url(${url})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-white" />
                  )}

                  {/* Media */}
                  {video ? (
                    <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-2 text-slate-600">
                      <Video className="w-8 h-8 text-cyan-600 mb-1" />
                      <span className="text-[10px] font-bold text-slate-700">Video Media</span>
                    </div>
                  ) : (
                    <img
                      src={url}
                      alt={`Gallery item ${idx + 1}`}
                      className="relative z-10 w-full h-full object-contain p-2"
                      onError={(e) => {
                        (e.target as any).src = 'https://placehold.co/200x200?text=Invalid+Media';
                      }}
                    />
                  )}

                  {/* Action Overlay */}
                  <div className="absolute inset-0 z-20 bg-slate-950/75 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2.5 backdrop-blur-[2px]">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-cyan-300 font-bold bg-slate-900/90 px-1.5 py-0.5 rounded">
                        #{idx + 1} {video ? 'VIDEO' : 'IMG'}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleDeleteImage(url, false)}
                        className="bg-rose-600 hover:bg-rose-700 text-white p-1 rounded-md transition-colors shadow"
                        title="Delete from gallery"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1.5">
                      {!video && (
                        <button
                          type="button"
                          onClick={() => openCropper(url, idx)}
                          className="w-full flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-500 text-white text-[11px] font-bold py-1.5 rounded-lg shadow transition-colors"
                        >
                          <Crop className="w-3 h-3" />
                          <span>Crop & Edit</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSetPrimary(idx)}
                        className="w-full flex items-center justify-center gap-1 bg-amber-500 hover:bg-amber-400 text-white text-[11px] font-bold py-1 rounded-lg shadow transition-colors"
                      >
                        <Star className="w-3 h-3 fill-white" />
                        <span>Make Primary</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-xs">
            No additional gallery items yet. Drag & drop files above to populate the media carousel.
          </div>
        )}
      </div>

      {/* ── Interactive Free-Form Cropper Modal ──────────────────────── */}
      {cropModalOpen && cropImageSrc && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl max-w-4xl w-full overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                  <Crop className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    Free-Form Product Image Cropper
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Freely drag the corners and edges to select any rectangular portion. Uploads directly to Supabase.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setCropModalOpen(false)}
                className="text-slate-400 hover:text-white p-2 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cropper Toolbar */}
            <div className="px-5 py-3 bg-slate-900/90 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
              {/* Aspect Ratio Presets */}
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-400 font-semibold">Aspect Ratio:</span>
                {(['free', '1:1', '4:3', '16:9'] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => handleRatioChange(r)}
                    className={`px-3 py-1 rounded-lg font-bold text-[11px] uppercase transition-colors ${
                      cropRatio === r
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-sm'
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {r === 'free' ? 'Free-Form (Any Shape)' : r}
                  </button>
                ))}
              </div>

              {/* Rotate and Reset */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-slate-200 transition-colors"
                  title="Rotate 90 degrees"
                >
                  <RotateCw className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Rotate</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setCropBox({ x: 0.05, y: 0.05, width: 0.9, height: 0.9 });
                    setRotation(0);
                    setCropRatio('free');
                  }}
                  className="inline-flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 px-3 py-1 rounded-lg text-slate-200 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                  <span>Reset Box</span>
                </button>
              </div>
            </div>

            {/* Interactive Canvas / Image Preview Area */}
            <div className="flex-1 overflow-auto p-6 bg-slate-950 flex items-center justify-center min-h-[380px] select-none">
              <div
                ref={cropperContainerRef}
                className="relative inline-block max-w-full max-h-[55vh] overflow-hidden rounded-xl border border-slate-800 shadow-2xl"
              >
                {/* Source Image */}
                <img
                  ref={cropperImageRef}
                  src={cropImageSrc}
                  alt="Crop Source"
                  crossOrigin="anonymous"
                  style={{
                    transform: `rotate(${rotation}deg)`,
                    maxHeight: '55vh',
                    objectFit: 'contain',
                    pointerEvents: 'none',
                    display: 'block',
                  }}
                />

                {/* Dark Mask Overlay Outside Crop Box */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    backgroundColor: 'rgba(0, 0, 0, 0.55)',
                    clipPath: `polygon(
                      0% 0%, 0% 100%, 100% 100%, 100% 0%, 0% 0%,
                      ${cropBox.x * 100}% ${cropBox.y * 100}%,
                      ${cropBox.x * 100}% ${(cropBox.y + cropBox.height) * 100}%,
                      ${(cropBox.x + cropBox.width) * 100}% ${(cropBox.y + cropBox.height) * 100}%,
                      ${(cropBox.x + cropBox.width) * 100}% ${cropBox.y * 100}%,
                      ${cropBox.x * 100}% ${cropBox.y * 100}%
                    )`,
                  }}
                />

                {/* Active Interactive Crop Box */}
                <div
                  onMouseDown={(e) => handleMouseDownOnBox(e, null)}
                  className="absolute cursor-move border-2 border-cyan-400 shadow-2xl"
                  style={{
                    left: `${cropBox.x * 100}%`,
                    top: `${cropBox.y * 100}%`,
                    width: `${cropBox.width * 100}%`,
                    height: `${cropBox.height * 100}%`,
                    boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.45)',
                  }}
                >
                  {/* Grid Lines inside crop box for rule-of-thirds */}
                  <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-30">
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-r border-b border-white" />
                    <div className="border-b border-white" />
                    <div className="border-r border-white" />
                    <div className="border-r border-white" />
                    <div />
                  </div>

                  {/* Free-form Handles: 4 Corners */}
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'nw')}
                    className="absolute -top-1.5 -left-1.5 w-4 h-4 bg-cyan-400 rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'ne')}
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-cyan-400 rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'se')}
                    className="absolute -bottom-1.5 -right-1.5 w-4 h-4 bg-cyan-400 rounded-full cursor-nwse-resize shadow-md hover:scale-125 transition-transform"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'sw')}
                    className="absolute -bottom-1.5 -left-1.5 w-4 h-4 bg-cyan-400 rounded-full cursor-nesw-resize shadow-md hover:scale-125 transition-transform"
                  />

                  {/* Free-form Edge Bars: 4 Sides */}
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'n')}
                    className="absolute -top-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-cyan-300 rounded cursor-ns-resize shadow"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 's')}
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-2 bg-cyan-300 rounded cursor-ns-resize shadow"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'w')}
                    className="absolute top-1/2 -translate-y-1/2 -left-1 h-8 w-2 bg-cyan-300 rounded cursor-ew-resize shadow"
                  />
                  <div
                    onMouseDown={(e) => handleMouseDownOnBox(e, 'e')}
                    className="absolute top-1/2 -translate-y-1/2 -right-1 h-8 w-2 bg-cyan-300 rounded cursor-ew-resize shadow"
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between shrink-0">
              <span className="text-xs text-slate-400">
                Selected: {Math.round(cropBox.width * 100)}% W &times; {Math.round(cropBox.height * 100)}% H
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setCropModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs px-4 py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={applyCropAndUpload}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg transition-all"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                      <span>Saving to Supabase...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 text-slate-950" />
                      <span>Apply & Save to Supabase</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
