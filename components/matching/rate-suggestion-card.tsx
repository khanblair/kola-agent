'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { DollarSign } from 'lucide-react';
import type { AdjustedRateRange } from '@/types/job';

interface RateSuggestionCardProps {
  rate: AdjustedRateRange;
}

export function RateSuggestionCard({ rate }: RateSuggestionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700">Suggested Rate</h3>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-neutral-900">
            {rate.min}–{rate.max}
          </span>
          <span className="text-sm text-neutral-500">{rate.currency}/hr</span>
        </div>
        {rate.adjustmentNote && (
          <p className="mt-2 text-xs text-neutral-400">{rate.adjustmentNote}</p>
        )}
      </CardContent>
    </Card>
  );
}
