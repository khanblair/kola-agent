'use client';

import { useEffect, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';

/**
 * Ensures the signed-in Clerk user has a corresponding record in Convex.
 * Called on every sign-in so the user table stays in sync even when
 * the Clerk webhook can't reach localhost (dev scenario).
 */
export function ClerkSync() {
  const { isSignedIn, isLoaded, user } = useUser();
  const syncUser = useMutation(api.functions.users.syncUser);
  const synced = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || synced.current || !user) return;
    synced.current = true;

    const email = user.primaryEmailAddress?.emailAddress ?? '';
    const name = user.fullName ?? user.username ?? 'User';
    const imageUrl = user.imageUrl ?? undefined;
    const role = (user.publicMetadata?.role as any) ?? undefined;

    syncUser({ clerkId: user.id, email, name, imageUrl, role }).catch(() => {
      synced.current = false;
    });
  }, [isLoaded, isSignedIn, user, syncUser]);

  return null;
}
