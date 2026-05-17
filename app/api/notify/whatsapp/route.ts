import { NextRequest, NextResponse } from 'next/server';
import { requireUser } from '@/lib/convex/auth';
import * as mutations from '@/lib/convex/mutations';

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser();

    const body = await request.json();
    const { message, phoneNumber } = body as {
      message?: string;
      phoneNumber?: string;
    };

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 },
      );
    }

    const wppPort = process.env.WPPCONNECT_PORT || '3001';
    const wppUrl = `http://localhost:${wppPort}/send`;

    let delivered = false;
    try {
      const response = await fetch(wppUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phoneNumber, message }),
      });
      delivered = response.ok;
    } catch {
      delivered = false;
    }

    if (user.convexUser) {
      await mutations.logNotification({
        userId: user.convexUser._id,
        channel: 'whatsapp',
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
      { success: false, error: 'Failed to send WhatsApp notification' },
      { status: 500 },
    );
  }
}
