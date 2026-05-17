'use client';

import { Badge } from '@/components/ui/badge';
import type { Seniority } from '@/types/freelancer';

const seniorityVariant: Record<Seniority, 'default' | 'info' | 'primary'> = {
  junior: 'default',
  mid: 'info',
  senior: 'primary',
};

interface ExperienceBadgeProps {
  years: number;
  seniority: Seniority;
}

export function ExperienceBadge({ years, seniority }: ExperienceBadgeProps) {
  return (
    <div className="flex items-center gap-2">
      <Badge variant={seniorityVariant[seniority]} className="capitalize">
        {seniority}
      </Badge>
      <span className="text-xs text-neutral-500">
        {years} {years === 1 ? 'year' : 'years'} experience
      </span>
    </div>
  );
}
