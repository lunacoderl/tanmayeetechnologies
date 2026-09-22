import React from 'react';
import { Skeleton } from '../ui/skeleton';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm flex flex-col justify-between space-y-4">
      <div className="space-y-3">
        {/* Top Badges */}
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>

        {/* Product Image Skeleton */}
        <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-slate-50 flex items-center justify-center p-4">
          <Skeleton className="w-3/4 h-3/4 rounded-xl" />
        </div>

        {/* Brand & Model */}
        <div className="space-y-1.5 pt-1">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-5 w-full rounded" />
          <Skeleton className="h-4 w-4/5 rounded" />
        </div>

        {/* Technical Specs Pills */}
        <div className="grid grid-cols-2 gap-2 pt-2">
          <Skeleton className="h-10 rounded-xl" />
          <Skeleton className="h-10 rounded-xl" />
        </div>
      </div>

      {/* Price & Actions */}
      <div className="pt-3 border-t border-slate-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3 w-12" />
            <Skeleton className="h-6 w-24" />
          </div>
          <Skeleton className="h-8 w-20 rounded-xl" />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Skeleton className="h-9 rounded-xl" />
          <Skeleton className="h-9 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <ProductCardSkeleton key={idx} />
      ))}
    </div>
  );
}
