'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { MatchScoreRing } from '@/components/matching/match-score-ring';
import { FitExplanation } from '@/components/matching/fit-explanation';
import { SkillGapList } from '@/components/matching/skill-gap-list';
import { RateSuggestionCard } from '@/components/matching/rate-suggestion-card';
import { ProposalPreview } from '@/components/proposals/proposal-preview';
import { ProposalActions } from '@/components/proposals/proposal-actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import type { CandidateRanking, MatchStatus } from '@/types/match';
import type { AdjustedRateRange } from '@/types/job';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.matchId as string;

  const match = useQuery(api.functions.matches.getById, { matchId: matchId as any });
  const proposal = useQuery(
    api.functions.proposals.getByMatch,
    match ? { matchId: matchId as any } : 'skip',
  );

  if (match === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (match === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-neutral-500">Match not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const m = match as any;

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader title="Match Detail">
        <Button variant="outline" size="sm" onClick={() => history.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <div className="flex items-center gap-3">
        <Badge variant={m.status === 'accepted' ? 'success' : m.status === 'rejected' ? 'error' : 'warning'}>
          {String(m.status ?? 'pending').charAt(0).toUpperCase() + String(m.status ?? 'pending').slice(1)}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Score + explanation */}
        <Section title="Match Score">
          <div className="flex items-center gap-4">
            <MatchScoreRing score={m.score ?? 0} size={72} />
            <div className="space-y-2 flex-1">
              <FitExplanation explanation={m.explanation ?? 'No explanation available'} />
              {m.skillGaps?.length > 0 && <SkillGapList gaps={m.skillGaps} />}
            </div>
          </div>
        </Section>

        {/* Rate suggestion */}
        {m.suggestedRate && (
          <RateSuggestionCard rate={m.suggestedRate as AdjustedRateRange} />
        )}
      </div>

      {/* Proposal */}
      {proposal && (proposal as any).content && (
        <Section title="Proposal">
          <ProposalPreview content={(proposal as any).content} tone={(proposal as any).tone} />
          <div className="mt-4">
            <ProposalActions
              content={(proposal as any).content}
              jobId={m.jobId}
              matchId={matchId}
            />
          </div>
        </Section>
      )}
    </div>
  );
}
