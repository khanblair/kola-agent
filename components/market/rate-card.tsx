'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { RateCardEntry } from '@/types/market';

interface RateCardProps {
  region: string;
  currency: string;
  rates: RateCardEntry[];
}

export function RateCard({ region, currency, rates }: RateCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold capitalize text-neutral-700">{region} Rates</h3>
          <Badge variant="outline">{currency}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-neutral-100">
          {rates.map((r) => (
            <div key={r.skill} className="flex items-center justify-between py-2.5 text-sm">
              <span className="text-neutral-700">{r.skill}</span>
              <div className="flex gap-3 text-xs text-neutral-500">
                <span>
                  Jr: {r.junior.min}–{r.junior.max}
                </span>
                <span>
                  Mid: {r.mid.min}–{r.mid.max}
                </span>
                <span>
                  Sr: {r.senior.min}–{r.senior.max}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
