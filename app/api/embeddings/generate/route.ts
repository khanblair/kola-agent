import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import { generateEmbedding } from '@/lib/deepseek/embeddings';
import * as mutations from '@/lib/convex/mutations';

export async function POST(request: NextRequest) {
  try {
    await requireUser();

    const body = await request.json();
    const { text, target, targetId } = body as {
      text?: string;
      target?: 'job' | 'freelancer';
      targetId?: string;
    };

    if (!text || !target || !targetId) {
      return NextResponse.json(
        { success: false, error: 'text, target, and targetId are required' },
        { status: 400 },
      );
    }

    const embedding = await generateEmbedding(text);

    if (target === 'job') {
      await mutations.updateJobScope({
        jobId: targetId,
        structuredScope: {},
        embedding,
      });
    }

    return NextResponse.json({
      success: true,
      data: { dimensions: embedding.length },
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to generate embedding' },
      { status: 500 },
    );
  }
}
