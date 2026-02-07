import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/utils/session';

/**
 * GET /api/auth/me
 * Get current authenticated user
 */
export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Failed to get user', error },
      { status: 500 }
    );
  }
}
