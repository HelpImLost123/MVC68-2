/**
 * API Route: /api/politicians
 * Handles GET (all politicians) and POST (create politician) requests
 */

import { NextRequest, NextResponse } from 'next/server';
import { PoliticianController } from '@/controllers/PoliticianController';

const controller = new PoliticianController();

/**
 * GET /api/politicians
 * Returns all politicians
 */
export async function GET() {
  try {
    const result = await controller.getAll();
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'error' in result ? result.error : 'Unknown error' },
        { status: 500 }
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
 * POST /api/politicians
 * Creates a new politician
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = await controller.create(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: 'error' in result ? result.error : 'Unknown error' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 400 }
    );
  }
}
