import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import { validateCV } from '@/lib/validation/cv';
import { parseCV } from '@/lib/deepseek/parse-cv';
import * as mutations from '@/lib/convex/mutations';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

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

    await mutations.createFreelancer({
      skills: parsed.skills,
      yearsOfExperience: parsed.yearsOfExperience,
      seniority: parsed.seniority,
      notableProjects: parsed.notableProjects,
      region: parsed.region,
      cvText,
      userId: user.clerkId,
    });

    return NextResponse.json({
      success: true,
      data: {
        parsed,
        message: 'CV processed and freelancer profile created',
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
      { success: false, error: 'Failed to process CV' },
      { status: 500 },
    );
  }
}
