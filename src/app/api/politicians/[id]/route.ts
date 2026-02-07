/**
 * API Route: /api/politicians/[id]
 * Handles GET (single politician with promises), PUT (update), and DELETE requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { PoliticianController } from '@/controllers/PoliticianController';

const controller = new PoliticianController();

/**
 * GET /api/politicians/[id]
 * Returns a single politician with all their promises
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await controller.getWithPromises(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'error' in result ? result.error : 'Unknown error' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/politicians/[id]
 * Updates a politician
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const result = await controller.update(id, body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'error' in result ? result.error : 'Unknown error' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: result.data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}

/**
 * DELETE /api/politicians/[id]
 * Deletes a politician
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const result = await controller.delete(id);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'error' in result ? result.error : 'Unknown error' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'message' in result ? result.message : 'Deleted successfully' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
