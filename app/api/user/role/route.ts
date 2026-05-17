import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';
import type { UserRole } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { role } = body as { role?: string };

    if (!role || !['client', 'freelancer'].includes(role)) {
      return NextResponse.json(
        { success: false, error: 'Role must be "client" or "freelancer"' },
        { status: 400 },
      );
    }

    await mutations.updateUserRole(user.convexId, role as UserRole);

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
