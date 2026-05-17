import { auth, clerkClient } from '@clerk/nextjs/server';
import { convex, api } from './client';

export async function requireUser() {
  const { userId } = await auth();
  if (!userId) throw new Error('Not authenticated');

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);

  // getOrCreateUser ensures the Convex record always exists.
  // This handles the race where ClerkSync hasn't finished yet.
  const user = (await convex.mutation(api.functions.users.getOrCreateUser, {
    clerkId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: clerkUser.fullName ?? clerkUser.username ?? 'User',
    imageUrl: clerkUser.imageUrl,
  })) as { _id: string; role: string };

  return {
    clerkId: userId,
    email: clerkUser.emailAddresses[0]?.emailAddress ?? '',
    name: clerkUser.fullName ?? clerkUser.username ?? 'User',
    imageUrl: clerkUser.imageUrl,
    role: (clerkUser.publicMetadata?.role as string) ?? user.role ?? 'client',
    convexUser: user,
  };
}

export type AuthenticatedUser = Awaited<ReturnType<typeof requireUser>>;
