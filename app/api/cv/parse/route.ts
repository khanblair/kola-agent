import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import { validateCV } from '@/lib/validation/cv';
import { parseCV } from '@/lib/deepseek/parse-cv';

export async function POST(request: NextRequest) {
  try {
    await requireUser();

    const formData = await request.formData();
    const file = formData.get('cv') as File | null;

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No CV file provided' },
        { status: 400 },
      );
    }

    const validation = validateCV(file);
    if (!validation.valid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const cvText = buffer.toString('utf-8').slice(0, 10000);

    const parsed = await parseCV(cvText);

    return NextResponse.json({ success: true, data: { parsed } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to parse CV' },
      { status: 500 },
    );
  }
}
