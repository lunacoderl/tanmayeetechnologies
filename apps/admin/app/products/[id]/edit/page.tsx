'use client';

// ============================================================================
// @tanmayee/admin — Product Edit Page (/products/[id]/edit)
// Cloud-first data loading directly from Supabase via dedicated /api/products/[id]
// ============================================================================

import React, { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { ProductForm } from '../../../../components/product/product-form';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);

  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProduct() {
      setIsLoading(true);
      setLoadError(null);

      try {
        // 1. Fetch single product directly from dedicated cloud API endpoint
        const res = await fetch(`/api/products/${encodeURIComponent(id)}`);
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.product && isMounted) {
            setProduct(json.product);
            setIsLoading(false);
            return;
          }
        }

        // 2. Fallback: try searching in all products API
        const allRes = await fetch('/api/products');
        if (allRes.ok) {
          const allJson = await allRes.json();
          if (allJson.products && Array.isArray(allJson.products)) {
            const found = allJson.products.find(
              (p: any) =>
                p.id === id ||
                p.slug === id ||
                (p.model_number && p.model_number.toLowerCase() === id.toLowerCase())
            );
            if (found && isMounted) {
              setProduct(found);
              setIsLoading(false);
              return;
            }
          }
        }

        // 3. Fallback: localStorage
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('tanmayee_custom_products');
          if (stored) {
            const list = JSON.parse(stored);
            const found = list.find((p: any) => p.id === id || p.slug === id);
            if (found && isMounted) {
              setProduct(found);
              setIsLoading(false);
              return;
            }
          }
        }

        if (isMounted) {
          setLoadError(`Product not found for ID: ${id}`);
          setIsLoading(false);
        }
      } catch (err: any) {
        console.error('Error loading product for edit:', err);
        if (isMounted) {
          setLoadError(err.message || 'Failed to load product');
          setIsLoading(false);
        }
      }
    }

    loadProduct();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-8 h-8 text-brand-600 animate-spin" />
        <div className="text-center">
          <p className="text-sm font-bold text-slate-800">Loading Product From Cloud Database...</p>
          <p className="text-xs text-slate-500 mt-1">Retrieving latest specifications, gallery, and version state</p>
        </div>
      </div>
    );
  }

  if (loadError || !product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-4">
        <div className="bg-red-50 text-red-700 p-6 rounded-2xl border border-red-200 text-center max-w-md">
          <p className="font-bold text-base">Product Not Found</p>
          <p className="text-xs text-red-600 mt-1">
            Could not find commercial product matching identifier &quot;{id}&quot; in the database.
          </p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Product Manager</span>
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic key ensures fresh form state whenever product changes or is restored
  const formKey = `${product.id}-${product.current_version || 1}-${product.updated_at || 'fresh'}`;

  return <ProductForm key={formKey} initialData={product} isEdit={true} />;
}
