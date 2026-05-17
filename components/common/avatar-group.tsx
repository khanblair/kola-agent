'use client';

import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';

interface AvatarGroupProps {
  names: string[];
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarGroup({ names, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const visible = names.slice(0, max);
  const remaining = names.length - max;

  return (
    <div className={cn('flex -space-x-2', className)}>
      {visible.map((name) => (
        <Avatar key={name} fallback={name} size={size} className="ring-2 ring-white" />
      ))}
      {remaining > 0 && (
        <span className="flex h-full items-center justify-center rounded-full bg-neutral-100 px-2 text-xs font-medium text-neutral-500 ring-2 ring-white">
          +{remaining}
        </span>
      )}
    </div>
  );
}
