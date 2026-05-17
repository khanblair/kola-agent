import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { clerkClient } from '@clerk/nextjs/server';
import * as mutations from '@/lib/convex/mutations';
import { logger } from '@/lib/utils/logger';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const headers = request.headers;

  const svixId = headers.get('svix-id');
  const svixTimestamp = headers.get('svix-timestamp');
  const svixSignature = headers.get('svix-signature');

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json(
      { error: 'Missing svix headers' },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    logger.error('CLERK_WEBHOOK_SECRET not set');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 },
    );
  }

  let payload: Record<string, unknown>;
  try {
    const wh = new Webhook(webhookSecret);
    payload = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 401 },
    );
  }

  const eventType = payload.type as string;
  const data = payload.data as Record<string, unknown>;

  if (eventType === 'user.created' || eventType === 'user.updated') {
    const clerkId = data.id as string;
    const emailAddresses = data.email_addresses as Array<{ email_address: string }>;
    const firstName = data.first_name as string;
    const lastName = data.last_name as string;
    const imageUrl = data.image_url as string;

    await mutations.getOrCreateUser({
      clerkId,
      email: emailAddresses?.[0]?.email_address ?? '',
      name: [firstName, lastName].filter(Boolean).join(' ') || 'User',
      imageUrl,
    });

    // On initial user creation, seed Clerk publicMetadata so the UI
    // shows a role badge immediately (navbar reads publicMetadata.role)
    if (eventType === 'user.created') {
      const clerk = await clerkClient();
      await clerk.users.updateUser(clerkId, {
        publicMetadata: { role: 'client' },
      });
    }

    logger.info('Clerk webhook processed', { eventType, clerkId });
  }

  return NextResponse.json({ success: true });
}
