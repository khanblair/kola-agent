'use client';

import { AlertTriangle } from 'lucide-react';
import { Alert } from '@/components/ui/alert';

interface RedFlagsPanelProps {
  redFlags: string[];
}

export function RedFlagsPanel({ redFlags }: RedFlagsPanelProps) {
  if (!redFlags.length) return null;

  return (
    <Alert variant="warning">
      <div className="space-y-1.5">
        <div className="flex items-center gap-2 font-medium">
          <AlertTriangle className="h-4 w-4" />
          <span>Red Flags ({redFlags.length})</span>
        </div>
        <ul className="ml-6 list-disc space-y-0.5">
          {redFlags.map((flag, i) => (
            <li key={i} className="text-sm">{flag}</li>
          ))}
        </ul>
      </div>
    </Alert>
  );
}
