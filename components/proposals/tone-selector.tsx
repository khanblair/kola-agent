'use client';

import { cn } from '@/lib/utils/cn';
import type { ProposalTone } from '@/types/proposal';

const tones: { value: ProposalTone; label: string; description: string }[] = [
  { value: 'professional', label: 'Professional', description: 'Formal and structured' },
  { value: 'confident', label: 'Confident', description: 'Bold and persuasive' },
  { value: 'friendly', label: 'Friendly', description: 'Warm and approachable' },
];

interface ToneSelectorProps {
  value: ProposalTone;
  onChange: (tone: ProposalTone) => void;
}

export function ToneSelector({ value, onChange }: ToneSelectorProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-neutral-700">Proposal Tone</label>
      <div className="flex flex-wrap gap-2">
        {tones.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => onChange(t.value)}
            className={cn(
              'rounded-lg border px-3 py-2 text-left text-sm transition-colors',
              value === t.value
                ? 'border-primary-500 bg-primary-50 text-primary-800'
                : 'border-neutral-200 bg-white text-neutral-600 hover:border-neutral-300',
            )}
          >
            <span className="font-medium">{t.label}</span>
            <span className="ml-1.5 text-xs opacity-70">{t.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
