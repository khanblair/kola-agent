'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar } from '@/components/ui/avatar';
import { MatchScoreRing } from './match-score-ring';
import { SkillGapList } from './skill-gap-list';
import type { CandidateRanking } from '@/types/match';
import type { FreelancerProfile } from '@/types/freelancer';

interface MatchCardProps {
  ranking: CandidateRanking;
  profile?: FreelancerProfile;
  name?: string;
  selected?: boolean;
  onSelect?: () => void;
}

export function MatchCard({ ranking, profile, name, selected, onSelect }: MatchCardProps) {
  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? 'ring-2 ring-primary-500' : ''
      }`}
      onClick={onSelect}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <MatchScoreRing score={ranking.score} size={52} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h4 className="truncate text-sm font-semibold text-neutral-800">
                {name ?? `Candidate #${ranking.rank}`}
              </h4>
              <Badge variant="outline" className="shrink-0 text-xs">
                #{ranking.rank}
              </Badge>
            </div>
            {profile && (
              <div className="mt-1 flex flex-wrap gap-1">
                {profile.skills.slice(0, 4).map((s) => (
                  <Badge key={s} variant="default" className="text-xs">{s}</Badge>
                ))}
                {profile.skills.length > 4 && (
                  <span className="text-xs text-neutral-400">+{profile.skills.length - 4}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-neutral-600 line-clamp-3">{ranking.explanation}</p>
        <SkillGapList gaps={ranking.skillGaps} />
      </CardContent>
    </Card>
  );
}
