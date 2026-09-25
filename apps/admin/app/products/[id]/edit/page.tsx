'use client';

// ============================================================================
// @tanmayee/admin — Product Edit Page (/products/[id]/edit)
// ============================================================================

import React, { use, useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getMergedProducts } from '@tanmayee/database';
import { ProductForm } from '../../../../components/product/product-form';

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default function EditProductPage({ params }: EditProductPageProps) {
  const { id } = use(params);

  // Match by id or fallback to first product
  const allMerged = getMergedProducts();
  const baseProduct = allMerged.find((p) => p.id === id || p.slug === id) || allMerged[0];
  const [product, setProduct] = useState<any>(baseProduct);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('tanmayee_custom_products');
        if (stored) {
          const list = JSON.parse(stored);
          const found = list.find((p: any) => p.id === id || p.slug === id);
          if (found) {
            setProduct(found);
          }
        }
      }
    } catch (e) {
      console.error('Failed to load custom product from localStorage', e);
    } finally {
      setIsLoaded(true);
    }
  }, [id]);

  if (!product) {
    notFound();
  }

  // Use dynamic key to force fresh form state once custom data is loaded from storage/database
  const formKey = `${product.id}-${product.updated_at || 'initial'}-${product.primary_image_url || 'noimg'}`;

  return <ProductForm key={formKey} initialData={product} isEdit={true} />;
}
