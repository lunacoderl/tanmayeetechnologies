// ============================================================================
// @tanmayee/admin — Server-Side Authentication Route Handler
// Validates credentials strictly against environment variables (ADMIN_EMAIL & ADMIN_PASSWORD)
// ============================================================================

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Securely retrieve configured credentials from environment
    const envEmail = process.env.ADMIN_EMAIL;
    const envPassword = process.env.ADMIN_PASSWORD;

    if (!envEmail || !envPassword) {
      console.warn('⚠️ [Auth API] ADMIN_EMAIL or ADMIN_PASSWORD is not set in the environment variables.');
    }

    const inputEmail = (email || '').trim().toLowerCase();
    const targetEmail = (envEmail || '').trim().toLowerCase();

    // Verify against environment variables
    const isEmailMatch = Boolean(targetEmail && inputEmail === targetEmail);
    const isPasswordMatch = Boolean(envPassword && password === envPassword);

    if (isEmailMatch && isPasswordMatch) {
      // Issue session token
      const sessionToken = `tanmayee_admin_session_${Buffer.from(inputEmail).toString('base64')}_${Date.now()}`;

      return NextResponse.json({
        success: true,
        data: {
          token: sessionToken,
          user: {
            email: envEmail,
            role: 'SUPER_ADMIN',
            fullName: 'Tanmayee Administrator',
          },
        },
      });
    }

    // Invalid credentials
    return NextResponse.json(
      {
        success: false,
        error: {
          message: 'Invalid email or password. Please enter the authorized administrator credentials.',
        },
      },
      { status: 401 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || 'Authentication processing error',
        },
      },
      { status: 500 }
    );
  }
}
