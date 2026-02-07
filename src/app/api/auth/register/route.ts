import { NextRequest, NextResponse } from 'next/server';
import { AuthController } from '@/controllers';
import { createSession } from '@/utils/session';

/**
 * POST /api/auth/register
 * Register new user and create session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const response = await AuthController.register(body);

    if (response.success && response.data) {
      // Create session for newly registered user
      await createSession(response.data);
      return NextResponse.json(response, { status: 201 });
    }

    return NextResponse.json(response, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}
