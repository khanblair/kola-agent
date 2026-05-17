'use client';

import { Badge } from '@/components/ui/badge';

interface RateSourceBadgeProps {
  source: 'tavily' | 'fallback';
}

export function RateSourceBadge({ source }: RateSourceBadgeProps) {
  return (
    <Badge variant={source === 'tavily' ? 'info' : 'default'}>
      {source === 'tavily' ? 'Live (Tavily)' : 'Fallback'}
    </Badge>
  );
}
