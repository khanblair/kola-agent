import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';
import { runAgentLoop } from '@/lib/agent/loop';
import { validateBrief } from '@/lib/validation/brief';
import { ApiError } from '@/lib/errors/api-error';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { briefText, region } = body as {
      briefText?: string;
      region?: string;
    };

    const validation = validateBrief(briefText ?? '');
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // Create job in Convex
    const jobId = await mutations.createJob({
      briefText: briefText!,
      region,
      clerkId: user.clerkId,
    });

    logger.info('Agent run started', {
      jobId,
      clientId: user.clerkId,
      region: region ?? 'default',
    });

    // Run the agent loop
    const { result, stream } = await runAgentLoop({
      jobId,
      clientId: user.clerkId,
      briefText: briefText!,
      region,
    });

    // Update job status based on result
    if (result.status === 'complete') {
      await mutations.updateJobStatus(jobId, 'matched');
    }

    logger.info('Agent run complete', {
      jobId,
      status: result.status,
      steps: result.steps.length,
    });

    // Return the SSE stream
    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        Connection: 'keep-alive',
        'X-Accel-Buffering': 'no',
      },
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: error.statusCode },
      );
    }

    if (
      error instanceof Error &&
      error.message === 'Not authenticated'
    ) {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    logger.error('Agent run failed', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 },
    );
  }
}
