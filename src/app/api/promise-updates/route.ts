/**
 * Promise Updates API Route
 * Handles GET and POST requests for promise updates
 */

import { NextRequest, NextResponse } from 'next/server';
import { PromiseUpdateController } from '@/controllers/PromiseUpdateController';
import { getSession } from '@/utils/session';

/**
 * GET /api/promise-updates
 * Get updates for a specific promise
 */
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const promiseId = searchParams.get('promiseId');

  const controller = new PromiseUpdateController();

  try {
    if (promiseId) {
      // Get updates for specific promise
      const updates = await controller.getUpdatesByPromiseId(promiseId);
      return NextResponse.json(updates, { status: 200 });
    } else {
      // Get all updates (admin only)
      const session = await getSession();
      if (!session || session.user.role !== 'admin') {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }

      const updates = await controller.getAllUpdates();
      return NextResponse.json(updates, { status: 200 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch updates' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/promise-updates
 * Create a new promise update (admin only)
 */
export async function POST(request: NextRequest) {
  // Check authentication
  const session = await getSession();
  if (!session || session.user.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const controller = new PromiseUpdateController();
    const update = await controller.createUpdate(body);

    return NextResponse.json(update, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create update' },
      { status: 400 }
    );
  }
}
