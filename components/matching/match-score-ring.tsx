'use client';

import { cn } from '@/lib/utils/cn';

interface MatchScoreRingProps {
  score: number;
  size?: number;
  className?: string;
}

export function MatchScoreRing({ score, size = 64, className }: MatchScoreRingProps) {
  const clamped = Math.min(100, Math.max(0, score));
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  const color =
    clamped >= 80 ? 'text-green-500' : clamped >= 60 ? 'text-amber-500' : 'text-red-500';

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-neutral-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn('transition-all duration-700', color)}
        />
      </svg>
      <span className={cn('absolute text-sm font-bold', color)}>{clamped}</span>
    </div>
  );
}
