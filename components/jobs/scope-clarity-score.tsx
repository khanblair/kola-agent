'use client';

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/cn';

interface ScopeClarityScoreProps {
  score: number;
  className?: string;
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

function scoreLabel(score: number): string {
  if (score >= 80) return 'Clear';
  if (score >= 50) return 'Moderate';
  return 'Vague';
}

export function ScopeClarityScore({ score, className }: ScopeClarityScoreProps) {
  const clamped = Math.min(100, Math.max(0, score));

  return (
    <div className={cn('space-y-1.5', className)}>
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-600">Scope Clarity</span>
        <span className={cn('font-semibold', scoreColor(clamped))}>
          {clamped}% — {scoreLabel(clamped)}
        </span>
      </div>
      <Progress value={clamped} />
    </div>
  );
}
