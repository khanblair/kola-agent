import { auth, clerkClient } from '@clerk/nextjs/server';
import { convex, api } from './client';

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  const user = await convex.query(api.functions.users.getUserByClerkId, {
    clerkId: userId,
  });

  return {
    clerkId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: clerkUser.fullName ?? clerkUser.username ?? 'User',
    imageUrl: clerkUser.imageUrl,
    role: (clerkUser.publicMetadata?.role as string) ?? user?.role ?? 'client',
    convexUser: user,
  };
}

export type AuthenticatedUser = Awaited<ReturnType<typeof requireUser>>;
