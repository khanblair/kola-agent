'use client';

import { useState } from 'react';
import { MatchCard } from './match-card';
import type { CandidateRanking } from '@/types/match';
import type { FreelancerProfile } from '@/types/freelancer';

interface MatchResultsPanelProps {
  rankings: CandidateRanking[];
  profiles?: Record<string, FreelancerProfile>;
  names?: Record<string, string>;
  onSelectMatch?: (ranking: CandidateRanking) => void;
}

export function MatchResultsPanel({
  rankings,
  profiles,
  names,
  onSelectMatch,
}: MatchResultsPanelProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  if (!rankings.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-12 text-center">
        <p className="text-sm text-neutral-400">No matches found yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-neutral-700">
        Top Matches ({rankings.length})
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rankings.map((r) => (
          <MatchCard
            key={r.freelancerId}
            ranking={r}
            profile={profiles?.[r.freelancerId] ?? (r as any).freelancer}
            name={names?.[r.freelancerId] ?? (r as any).freelancerName}
            selected={selectedId === r.freelancerId}
            onSelect={() => {
              setSelectedId(r.freelancerId);
              onSelectMatch?.(r);
            }}
          />
        ))}
      </div>
    </div>
  );
}
