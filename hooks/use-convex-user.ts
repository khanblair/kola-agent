'use client';

import { useQuery } from 'convex/react';
import { useUser } from '@clerk/nextjs';
import { api } from '@/convex/_generated/api';

export function useConvexUser() {
  const { user: clerkUser, isLoaded } = useUser();
  const clerkId = clerkUser?.id;

  const convexUser = useQuery(
    api.functions.users.getUserByClerkId,
    clerkId ? { clerkId } : 'skip',
  );

  return {
    convexUser,
    isLoaded: isLoaded && convexUser !== undefined,
    clerkId,
  };
}
