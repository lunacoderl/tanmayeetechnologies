import { NextResponse } from 'next/server';
import { fetchLiveProductsFromSupabase } from '@tanmayee/database';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await fetchLiveProductsFromSupabase();
    return NextResponse.json(
      {
        success: true,
        products,
        data: products,
        pagination: {
          page: 1,
          limit: products.length,
          total: products.length,
          totalPages: 1,
        },
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch products' },
      {
        status: 500,
        headers: {
          'Cache-Control': 'no-store',
        },
      }
    );
  }
}
