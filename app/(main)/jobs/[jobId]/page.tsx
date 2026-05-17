'use client';

import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { ScopeCard } from '@/components/jobs/scope-card';
import { BudgetBreakdownCard } from '@/components/jobs/budget-breakdown';
import { TimelineCard } from '@/components/jobs/timeline-card';
import { JobStatusBadge } from '@/components/jobs/job-status-badge';
import { MatchResultsPanel } from '@/components/matching/match-results-panel';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import type { StructuredScope, BudgetBreakdown } from '@/types/job';
import type { CandidateRanking } from '@/types/match';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = params.jobId as string;

  const job = useQuery(api.functions.jobs.getById, { jobId: jobId as any });
  const matches = useQuery(api.functions.matches.getByJob, { jobId: jobId as any });

  if (job === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (job === null) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12 text-center">
        <p className="text-neutral-500">Job not found.</p>
        <Button variant="outline" className="mt-4" onClick={() => history.back()}>
          Go Back
        </Button>
      </div>
    );
  }

  const scope = (job as any).structuredScope as StructuredScope | undefined;
  const budget = (job as any).budgetBreakdown as BudgetBreakdown | undefined;
  const rankings = (matches ?? []) as unknown as CandidateRanking[];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader title={(job as any).briefText?.slice(0, 60) ?? 'Job Detail'}>
        <Button variant="outline" size="sm" onClick={() => history.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <JobStatusBadge status={(job as any).status ?? 'draft'} />
        {scope && (
          <span className="text-sm text-neutral-500">
            {scope.scopeClarityScore}% clarity
          </span>
        )}
      </div>

      {scope && (
        <ScopeCard scope={scope} />
      )}

      {budget && (
        <BudgetBreakdownCard breakdown={budget} />
      )}

      {scope?.phases && (
        <TimelineCard timeline={scope.timeline} phases={scope.phases} />
      )}

      {rankings.length > 0 && (
        <Section title="Matched Candidates">
          <MatchResultsPanel rankings={rankings} />
        </Section>
      )}
    </div>
  );
}
