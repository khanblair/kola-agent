import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import { parseCV } from '@/lib/deepseek/parse-cv';
import { logger } from '@/lib/utils/logger';
import * as pdfModule from 'pdf-parse';
import * as mutations from '@/lib/convex/mutations';

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

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uint8Array = new Uint8Array(buffer);

    // Dynamically retrieve the constructor supporting ESM/CJS formats
    const PDFParserClass = (pdfModule as any).PDFParse || (pdfModule as any);
    const pdfInstance = new PDFParserClass(uint8Array);
    await pdfInstance.load();
    const cvTextResult = await pdfInstance.getText();
    await pdfInstance.destroy();

    const parseResult = await parseCV(cvTextResult.text);

    // Automatically persist the parsed profile fields immediately to Convex
    await mutations.createFreelancer({
      skills: parseResult.skills,
      yearsOfExperience: parseResult.yearsOfExperience,
      seniority: parseResult.seniority,
      notableProjects: parseResult.notableProjects,
      region: parseResult.region,
      cvText: cvTextResult.text,
      education: parseResult.education,
      workHistory: parseResult.workHistory,
      certifications: parseResult.certifications,
      volunteerExperience: parseResult.volunteerExperience,
      referees: parseResult.referees,
      userId: user.clerkId,
    });

    logger.info('CV parsed and saved to database', {
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
