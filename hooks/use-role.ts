'use client';

import { useUser } from '@clerk/nextjs';
import type { UserRole } from '@/types/user';

export function useRole(): UserRole {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as UserRole | undefined;
  return role ?? 'client';
}
