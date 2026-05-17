import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import { convex, api } from '@/lib/convex/client';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    await requireUser();

    const body = await request.json();
    const { matchId, tone } = body as { matchId?: string; tone?: string };

    if (!matchId) {
      return NextResponse.json(
        { success: false, error: 'matchId is required' },
        { status: 400 },
      );
    }

    const match = await convex.query(api.functions.matches.getById, {
      matchId: matchId as any,
    });

    if (!match) {
      return NextResponse.json(
        { success: false, error: 'Match not found' },
        { status: 404 },
      );
    }

    const proposalText = (match as any).proposalText ?? 'Proposal generation pending.';

    logger.info('Proposal retrieved', { matchId });

    return NextResponse.json({
      success: true,
      data: { content: proposalText, tone: tone ?? 'professional' },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    logger.error('Proposal generation failed', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
