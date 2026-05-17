'use client';

import { cn } from '@/lib/utils/cn';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
}

interface OnboardingStepsProps {
  steps: Step[];
  currentStep: number;
}

export function OnboardingSteps({ steps, currentStep }: OnboardingStepsProps) {
  return (
    <div className="flex items-center justify-center gap-1">
      {steps.map((step, i) => (
        <div key={step.id} className="flex items-center">
          <div
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-colors',
              i < currentStep
                ? 'bg-primary-600 text-white'
                : i === currentStep
                  ? 'bg-primary-100 text-primary-700 ring-2 ring-primary-500'
                  : 'bg-neutral-100 text-neutral-400',
            )}
          >
            {i < currentStep ? <Check className="h-4 w-4" /> : i + 1}
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                'mx-1 h-0.5 w-8 sm:w-12',
                i < currentStep ? 'bg-primary-500' : 'bg-neutral-200',
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
