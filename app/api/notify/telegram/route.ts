import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { message, chatId } = body as {
      message?: string;
      chatId?: string;
    };

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 },
      );
    }

    const token = process.env.TELEGRAM_BOT_TOKEN;
    const targetChatId = chatId || process.env.TELEGRAM_TEST_CHAT_ID;

    if (!token || !targetChatId) {
      return NextResponse.json(
        { success: false, error: 'Telegram not configured' },
        { status: 503 },
      );
    }

    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: targetChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    const delivered = response.ok;

    if (user.convexUser) {
      await mutations.logNotification({
        userId: user.convexUser._id,
        channel: 'telegram',
        message,
        delivered,
      });
    }

    return NextResponse.json({ success: true, data: { delivered } });
  } catch (error) {
    if (error instanceof Error && error.message === 'Not authenticated') {
      return NextResponse.json(
        { success: false, error: 'Authentication required' },
        { status: 401 },
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to send notification' },
      { status: 500 },
    );
  }
}
