import { NextResponse } from 'next/server';
import { destroySession } from '@/utils/session';

/**
 * POST /api/auth/logout
 * Destroy current session
 */
export async function POST() {
  try {
    await destroySession();

    return NextResponse.json({
      success: true,
      message: 'Logout successful',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Logout failed', error },
      { status: 500 }
    );
  }
}
