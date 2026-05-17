import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';
import type { NotificationPreference } from '@/types/user';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { preference, telegramChatId, whatsappNumber } = body as {
      preference?: string;
      telegramChatId?: string;
      whatsappNumber?: string;
    };

    if (!preference || !['telegram', 'whatsapp', 'both'].includes(preference)) {
      return NextResponse.json(
        { success: false, error: 'Preference must be "telegram", "whatsapp", or "both"' },
        { status: 400 },
      );
    }

    await mutations.updateNotificationPreference(
      user.convexId,
      preference as NotificationPreference,
      telegramChatId,
      whatsappNumber,
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json({ success: false, error: 'Authentication required' }, { status: 401 });
    }
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
