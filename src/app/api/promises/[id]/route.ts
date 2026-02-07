/**
 * API Route: /api/promises/[id]
 * Handles GET (single promise), PUT (update), and DELETE requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { PromiseController } from '@/controllers/PromiseController';

const controller = new PromiseController();

/**
 * GET /api/promises/[id]
 * Returns a single promise by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const promise = await controller.getPromiseById(id);
    
    if (!promise) {
      return NextResponse.json(
        { success: false, error: 'Promise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: promise });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/promises/[id]
 * Updates a promise
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const promise = await controller.updatePromise(id, body);
    
    if (!promise) {
      return NextResponse.json(
        { success: false, error: 'Promise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: promise });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/promises/[id]
 * Deletes a promise
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await controller.deletePromise(id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Promise not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Promise deleted' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
