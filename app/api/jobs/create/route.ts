import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';
import { validateBrief } from '@/lib/validation/brief';

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

    const jobId = await mutations.createJob({
      briefText: briefText!,
      region,
    });

    return NextResponse.json({ success: true, data: { jobId } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create job' },
      { status: 500 },
    );
  }
}
