/**
 * API Route: /api/promises
 * Handles GET (all promises) and POST (create promise) requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { PromiseController } from '@/controllers/PromiseController';

const controller = new PromiseController();

/**
 * GET /api/promises
 * Returns all promises with politician information
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const sortBy = (searchParams.get('sortBy') as 'createdAt' | 'updatedAt' | 'promiseDate') || 'createdAt';
    const order = (searchParams.get('order') as 'asc' | 'desc') || 'desc';

    const promises = await controller.getAllPromises(sortBy, order);
    return NextResponse.json({ success: true, data: promises });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * POST /api/promises
 * Creates a new promise
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const promise = await controller.createPromise(body);
    return NextResponse.json({ success: true, data: promise }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
