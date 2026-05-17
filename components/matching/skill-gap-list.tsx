'use client';

import { AlertTriangle } from 'lucide-react';

interface SkillGapListProps {
  gaps: string[];
}

export function SkillGapList({ gaps }: SkillGapListProps) {
  if (!gaps.length) {
    return (
      <p className="text-sm text-green-600">
        No significant skill gaps identified.
      </p>
    );
  }

  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5 text-sm font-medium text-amber-700">
        <AlertTriangle className="h-4 w-4" />
        <span>Skill Gaps ({gaps.length})</span>
      </div>
      <ul className="ml-6 list-disc space-y-0.5">
        {gaps.map((gap, i) => (
          <li key={i} className="text-sm text-neutral-600">{gap}</li>
        ))}
      </ul>
    </div>
  );
}
