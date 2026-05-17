import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import { parseCV } from '@/lib/deepseek/parse-cv';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file uploaded' },
        { status: 400 },
      );
    }

    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File too large (max 5MB)' },
        { status: 400 },
      );
    }

    const cvText = await file.text();
    const parseResult = await parseCV(cvText);

    logger.info('CV parsed', {
      name: parseResult.name,
      skills: parseResult.skills.length,
      userId: user.clerkId,
    });

    return NextResponse.json({
      success: true,
      data: parseResult,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    logger.error('CV upload failed', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
