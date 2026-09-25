import { NextRequest, NextResponse } from 'next/server';
import { fetchProductVersions, restoreProductVersion } from '@tanmayee/database';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Product ID or slug is required' },
        { status: 400 }
      );
    }

    const versions = await fetchProductVersions(id);

    return NextResponse.json({
      success: true,
      versions,
      count: versions.length,
    });
  } catch (err: any) {
    console.error('API /api/products/[id]/versions GET error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to fetch version history' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const versionNumber = Number(body?.restore_version_number);

    if (!id || isNaN(versionNumber) || versionNumber < 1) {
      return NextResponse.json(
        { success: false, error: 'Valid version number is required to restore' },
        { status: 400 }
      );
    }

    const result = await restoreProductVersion(id, versionNumber);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Failed to restore product version' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Product successfully restored to Version ${versionNumber} snapshot`,
      product: result.product,
    });
  } catch (err: any) {
    console.error('API /api/products/[id]/versions POST error:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Failed to restore product version' },
      { status: 500 }
    );
  }
}
