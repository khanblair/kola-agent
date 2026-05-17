'use client';

import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  steps: { id: string; label: string }[];
  currentStep: number;
  className?: string;
}

export function StepIndicator({ steps, currentStep, className }: StepIndicatorProps) {
  return (
    <ol className={cn('flex items-center', className)}>
      {steps.map((step, i) => (
        <li key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                i < currentStep
                  ? 'bg-primary-600 text-white'
                  : i === currentStep
                    ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                    : 'bg-neutral-100 text-neutral-400',
              )}
            >
              {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span
              className={cn(
                'mt-1 text-xs',
                i <= currentStep ? 'text-neutral-700 font-medium' : 'text-neutral-400',
              )}
            >
              {step.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'mx-2 h-0.5 w-6 sm:w-10',
                i < currentStep ? 'bg-primary-500' : 'bg-neutral-200',
              )}
            />
          )}
        </li>
      ))}
    </ol>
  );
}
