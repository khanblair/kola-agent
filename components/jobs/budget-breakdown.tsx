'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import type { BudgetBreakdown } from '@/types/job';

interface BudgetBreakdownCardProps {
  breakdown: BudgetBreakdown;
}

export function BudgetBreakdownCard({ breakdown }: BudgetBreakdownCardProps) {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-sm font-semibold text-neutral-700">Budget Breakdown</h3>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {breakdown.lineItems.map((item, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-neutral-600">
                {item.item}{' '}
                <span className="text-neutral-400">({item.hours}h × {item.rate})</span>
              </span>
              <span className="font-medium text-neutral-800">
                {item.total.toLocaleString()} {breakdown.currency}
              </span>
            </div>
          ))}
          <div className="my-2 border-t border-neutral-200" />
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Subtotal</span>
            <span>{breakdown.subtotal.toLocaleString()} {breakdown.currency}</span>
          </div>
          <div className="flex justify-between text-sm text-neutral-500">
            <span>Contingency</span>
            <span>{breakdown.contingency.toLocaleString()} {breakdown.currency}</span>
          </div>
          <div className="flex justify-between text-sm font-semibold text-neutral-900">
            <span>Total</span>
            <span>{breakdown.total.toLocaleString()} {breakdown.currency}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
