'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useConvexUser } from '@/hooks/use-convex-user';
import { PageHeader } from '@/components/layout/page-header';
import { MatchScoreRing } from '@/components/matching/match-score-ring';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Mail, Sparkles, MapPin, DollarSign, Calendar, ArrowRight } from 'lucide-react';

export default function MatchInvitationsPage() {
  const { isLoaded, clerkId } = useConvexUser();

  const matches = useQuery(
    api.functions.matches.getByFreelancer,
    clerkId ? { clerkId } : 'skip',
  );

  if (!isLoaded || matches === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Filter pending invitations
  const pendingMatches = (matches ?? []).filter((m: any) => m.status === 'pending');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Match Invitations"
        description="Review high-probability freelance jobs curated by our AI matching engine based on your profile."
      />

      {pendingMatches.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center max-w-md mx-auto space-y-4 mt-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
            <Mail className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-neutral-800 text-base">No pending matches</h3>
            <p className="text-sm text-neutral-500">
              Upload a detailed CV or update your profile skills to trigger our matching algorithm.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {pendingMatches.map((m: any) => {
            const scope = m.job?.structuredScope || {};
            const skills = scope.requiredSkills || [];

            return (
              <div key={m._id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6 flex flex-col justify-between space-y-6 relative overflow-hidden">
                {/* Decorative matches top accent */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-indigo-500/10" />

                <div className="space-y-4">
                  {/* Top: Score & Client Details */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                        <Sparkles className="h-3 w-3" />
                        AI Matched
                      </span>
                      <h3 className="font-semibold text-neutral-800 text-lg leading-snug truncate">
                        {scope.title || m.job?.briefText}
                      </h3>
                      <p className="text-xs text-neutral-400 font-medium">
                        Posted by {m.clientName || 'Collaborator'}
                      </p>
                    </div>

                    <div className="shrink-0 bg-neutral-50 p-2 rounded-xl border border-neutral-100/50">
                      <MatchScoreRing score={m.score || 0} size={50} />
                    </div>
                  </div>

                  {/* Summary / Metadata */}
                  <div className="flex flex-wrap gap-4 text-xs font-medium text-neutral-500">
                    {m.job?.region && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-neutral-400" />
                        {m.job.region.charAt(0).toUpperCase() + m.job.region.slice(1)}
                      </span>
                    )}
                    {m.suggestedRateMin !== undefined && (
                      <span className="flex items-center gap-0.5">
                        <DollarSign className="h-3.5 w-3.5 text-emerald-500" />
                        {m.suggestedRateMin} - {m.suggestedRateMax}/hr
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                      {new Date(m._creationTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {/* Fit Explanation */}
                  <p className="text-sm text-neutral-600 line-clamp-3 leading-relaxed bg-neutral-50/50 p-3 rounded-xl border border-neutral-100/30">
                    {m.explanation || 'Excellent technical match for your software expertise.'}
                  </p>

                  {/* Badges / Skills */}
                  {skills.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Required Skills</p>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.slice(0, 5).map((skill: string, idx: number) => (
                          <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-100 text-neutral-600 border border-neutral-200/30">
                            {skill}
                          </span>
                        ))}
                        {skills.length > 5 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-neutral-50 text-neutral-400">
                            +{skills.length - 5} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Action */}
                <div className="pt-4 border-t border-neutral-50">
                  <Link href={`/proposals/${m._id}`} className="w-full inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors duration-150">
                    View & Apply
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
