'use client';

// ============================================================================
// @tanmayee/admin — Categories & Technical Attributes Manager (/categories)
// ============================================================================

import React, { useState } from 'react';
import {
  FolderTree,
  SlidersHorizontal,
  ChevronRight,
} from 'lucide-react';
import {
  SEED_CATEGORIES,
  SEED_CATEGORY_ATTRIBUTES,
  SEED_PRODUCTS,
} from '@tanmayee/database';

export default function AdminCategoriesPage() {
  const [categories] = useState(SEED_CATEGORIES);
  const [attributes] = useState(SEED_CATEGORY_ATTRIBUTES);
  const [selectedCategory, setSelectedCategory] = useState(SEED_CATEGORIES[0]);

  const getCategoryCount = (cat: (typeof SEED_CATEGORIES)[0]) => {
    return SEED_PRODUCTS.filter(
      (p) =>
        p.category_id === cat.id ||
        p.subcategory_id === cat.id ||
        (p.category_name || '').toLowerCase().includes(cat.name.toLowerCase())
    ).length;
  };

  const parentCategories = categories.filter((c) => !c.parent_id);
  const subCategories = categories.filter((c) => c.parent_id === selectedCategory.id);

  const categoryAttrs = attributes.filter(
    (a) => a.category_id === selectedCategory.id
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display font-black text-2xl sm:text-3xl text-slate-900">
            Categories & EAV Attributes
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize catalog hierarchy and define dynamic technical specification schemas.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Category Hierarchy */}
        <div className="lg:col-span-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <FolderTree className="w-4 h-4 text-brand-600" />
              <span>Primary Categories</span>
            </h2>
            <span className="text-[11px] font-bold text-slate-400">
              {parentCategories.length} Categories
            </span>
          </div>

          <div className="space-y-2">
            {parentCategories.map((cat) => {
              const isSelected = selectedCategory.id === cat.id;
              return (
                <div
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-brand-50 border-brand-500 text-brand-900 font-bold shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-black ${
                        isSelected ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {cat.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-bold">{cat.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">/{cat.slug}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {getCategoryCount(cat)}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Category Details & Dynamic EAV Specs */}
        <div className="lg:col-span-8 space-y-6">
          {/* Category Overview Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {selectedCategory.name}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Slug: /{selectedCategory.slug} • {getCategoryCount(selectedCategory)} Products Live
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {selectedCategory.description}
            </p>

            {/* Subcategories list */}
            {subCategories.length > 0 && (
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                  Subcategories
                </div>
                <div className="flex flex-wrap gap-2">
                  {subCategories.map((sc) => (
                    <span
                      key={sc.id}
                      className="text-xs bg-slate-100 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-xl font-semibold"
                    >
                      {sc.name} ({sc.product_count})
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Dynamic Category Attributes Matrix */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-brand-600" />
                  <span>Specification Schema & Filters for {selectedCategory.name}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Attributes used by the faceted search filter sidebar on the public website.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {categoryAttrs.map((attr) => (
                <div
                  key={attr.id}
                  className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 flex items-center gap-2">
                      <span>{attr.attribute_name}</span>
                      {attr.attribute_unit && (
                        <span className="text-[10px] font-mono text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded border border-brand-100">
                          Unit: {attr.attribute_unit}
                        </span>
                      )}
                    </div>
                    {attr.possible_values && (
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {attr.possible_values.map((v, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-200 text-[10px] text-slate-600 font-semibold px-2 py-0.5 rounded-md"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        attr.is_filterable
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {attr.is_filterable ? 'Filterable' : 'Static'}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-md font-bold ${
                        attr.is_comparable
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {attr.is_comparable ? 'Comparable' : 'Standard'}
                    </span>
                  </div>
                </div>
              ))}

              {categoryAttrs.length === 0 && (
                <div className="p-6 text-center text-xs text-slate-400 bg-slate-50 rounded-xl">
                  No custom attributes defined for this category.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
