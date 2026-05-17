import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as queries from '@/lib/convex/queries';

export async function POST(request: NextRequest) {
  try {
    await requireUser();

    const body = await request.json();
    const { jobId, matchId } = body as { jobId?: string; matchId?: string };

    if (!jobId || !matchId) {
      return NextResponse.json(
        { success: false, error: 'Job ID and Match ID are required' },
        { status: 400 },
      );
    }

    const job = await queries.getJobById(jobId);
    const matchResult = await queries.getMatchesByJob(jobId);
    const match = matchResult.find((m: any) => m._id === matchId);

    if (!job) {
      return NextResponse.json(
        { success: false, error: 'Job not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        scopeReport: {
          title: (job.structuredScope as any)?.title ?? 'Scope Report',
          brief: job.briefText,
          scope: job.structuredScope,
          marketRateData: job.marketRateData,
          clientName: (job as any).clientName ?? 'Client',
        },
        proposalPackage: match
          ? {
              proposalText: match.proposalText,
              proposalTone: match.proposalTone,
              score: match.score,
              explanation: match.explanation,
              skillGaps: match.skillGaps,
              suggestedRateMin: match.suggestedRateMin,
              suggestedRateMax: match.suggestedRateMax,
              freelancerName: (match as any).freelancerName ?? 'Freelancer',
            }
          : null,
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to export PDF data' },
      { status: 500 },
    );
  }
}
