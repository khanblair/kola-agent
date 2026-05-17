'use client';

import { DollarSign } from 'lucide-react';

interface RateRangeDisplayProps {
  min?: number;
  max?: number;
  currency?: string;
}

export function RateRangeDisplay({ min, max, currency = 'USD' }: RateRangeDisplayProps) {
  if (min == null && max == null) {
    return <span className="text-xs text-neutral-400">Rate not set</span>;
  }

  return (
    <div className="flex items-center gap-1.5 text-sm text-neutral-700">
      <DollarSign className="h-3.5 w-3.5 text-neutral-400" />
      <span className="font-medium">
        {min ?? '—'}–{max ?? '—'}
      </span>
      <span className="text-xs text-neutral-400">{currency}/hr</span>
    </div>
  );
}
