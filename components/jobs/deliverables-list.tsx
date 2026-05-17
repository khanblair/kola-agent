'use client';

import { CheckCircle2 } from 'lucide-react';

interface DeliverablesListProps {
  deliverables: string[];
}

export function DeliverablesList({ deliverables }: DeliverablesListProps) {
  if (!deliverables.length) return null;

  return (
    <div className="space-y-1.5">
      <h4 className="text-sm font-medium text-neutral-600">Deliverables</h4>
      <ul className="space-y-1">
        {deliverables.map((d, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-neutral-700">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary-500" />
            <span>{d}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
