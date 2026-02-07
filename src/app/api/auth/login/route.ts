import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers';
import { createSession } from '@/utils/session';

/**
 * POST /api/auth/login
 * Authenticate user and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await AuthController.login(body);

    if (response.success && response.data) {
      // Create session
      await createSession(response.data);
      return NextResponse.json(response, { status: 200 });
    }

    return NextResponse.json(response, { status: 401 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
