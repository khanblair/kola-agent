'use client';

import { cn } from '@/lib/utils/cn';
import { CheckCircle2, Loader2, XCircle } from 'lucide-react';

type Status = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

interface CvProcessingStatusProps {
  status: Status;
  fileName?: string;
  error?: string;
}

const steps: { key: Status; label: string }[] = [
  { key: 'uploading', label: 'Uploading file' },
  { key: 'processing', label: 'Parsing CV' },
  { key: 'complete', label: 'Profile extracted' },
];

function stepIndex(key: Status): number {
  return steps.findIndex((s) => s.key === key);
}

export function CvProcessingStatus({ status, fileName, error }: CvProcessingStatusProps) {
  if (status === 'idle') return null;

  const currentIdx = status === 'error' ? stepIndex('processing') : stepIndex(status);

  return (
    <div className="space-y-3">
      {fileName && (
        <p className="text-sm text-neutral-500">
          File: <span className="font-medium text-neutral-700">{fileName}</span>
        </p>
      )}

      <div className="space-y-2">
        {steps.map((step, i) => {
          const done = i < currentIdx;
          const active = i === currentIdx && status !== 'error';
          const failed = i === currentIdx && status === 'error';

          return (
            <div key={step.key} className="flex items-center gap-2 text-sm">
              {done && <CheckCircle2 className="h-4 w-4 text-green-500 shrink-0" />}
              {active && <Loader2 className="h-4 w-4 animate-spin text-primary-500 shrink-0" />}
              {failed && <XCircle className="h-4 w-4 text-red-500 shrink-0" />}
              <span className={cn(
                done && 'text-green-700',
                active && 'text-primary-700 font-medium',
                failed && 'text-red-700',
                !done && !active && !failed && 'text-neutral-400',
              )}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
    </div>
  );
}
