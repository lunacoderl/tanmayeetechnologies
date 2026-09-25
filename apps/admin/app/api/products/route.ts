import { NextResponse } from 'next/server';
import { fetchLiveProductsFromSupabase } from '@tanmayee/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchLiveProductsFromSupabase();
    return NextResponse.json({
      success: true,
      products,
      data: products,
      pagination: {
        page: 1,
        limit: products.length,
        total: products.length,
        totalPages: 1,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
