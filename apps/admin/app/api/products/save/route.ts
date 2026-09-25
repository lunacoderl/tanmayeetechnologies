import { NextRequest, NextResponse } from 'next/server';
import { saveCustomProduct } from '@tanmayee/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (!body || !body.product_name) {
      return NextResponse.json(
        { success: false, error: 'Product name and required fields are missing' },
        { status: 400 }
      );
    }

    const result = await saveCustomProduct(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to save product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      product: result.product,
      message: 'Product changes saved permanently and synced to database',
    });
  } catch (err: any) {
    console.error('API /api/products/save error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Internal server error while saving product' },
      { status: 500 }
    );
  }
}
