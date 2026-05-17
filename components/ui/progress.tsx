import { cn } from '@/lib/utils/cn';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
}

export function Progress({ value, max = 100, className, indicatorClassName }: ProgressProps) {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('h-2 w-full rounded-full bg-neutral-200 overflow-hidden', className)}>
      <div
        className={cn('h-full rounded-full bg-primary-600 transition-all duration-500', indicatorClassName)}
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
