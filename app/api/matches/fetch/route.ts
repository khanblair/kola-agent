import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as queries from '@/lib/convex/queries';

export async function POST(request: NextRequest) {
  try {
    await requireUser();

    const body = await request.json();
    const { jobId } = body as { jobId?: string };

    if (!jobId) {
      return NextResponse.json(
        { success: false, error: 'Job ID is required' },
        { status: 400 },
      );
    }

    const matches = await queries.getMatchesByJob(jobId);

    return NextResponse.json({ success: true, data: { matches } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to fetch matches' },
      { status: 500 },
    );
  }
}
