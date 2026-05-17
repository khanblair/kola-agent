'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useConvexUser } from '@/hooks/use-convex-user';
import { PageHeader } from '@/components/layout/page-header';
import { MatchScoreRing } from '@/components/matching/match-score-ring';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { Users, User, ArrowUpRight, DollarSign } from 'lucide-react';

export default function ClientInvitationsPage() {
  const { isLoaded, clerkId } = useConvexUser();

  const matches = useQuery(
    api.functions.matches.getByClient,
    clerkId ? { clerkId } : 'skip',
  );

  if (!isLoaded || matches === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Filter matches in 'pending' status (outgoing invitations waiting for proposals)
  const pendingInvitations = (matches ?? []).filter((m: any) => m.status === 'pending');

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Outgoing Invitations"
        description="Monitor highly compatible candidates matched by AI to your published projects who have been invited to apply."
      />

      {pendingInvitations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center max-w-md mx-auto space-y-4 mt-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
            <Users className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-neutral-800 text-base">No active invitations</h3>
            <p className="text-sm text-neutral-500">
              Post a job brief or publish matching tokens to generate matches.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {pendingInvitations.map((m: any) => {
            const initials = m.freelancerName
              .split(' ')
              .map((n: string) => n.charAt(0))
              .join('')
              .toUpperCase();

            return (
              <div key={m._id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 flex flex-col justify-between space-y-6 hover:shadow-md transition-shadow duration-200">
                <div className="space-y-4">
                  {/* Card Header: Avatar & Match Score */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {m.freelancerImage ? (
                        <img src={m.freelancerImage} alt={m.freelancerName} className="h-10 w-10 rounded-full object-cover border border-neutral-150" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center border border-indigo-100">
                          {initials}
                        </div>
                      )}
                      <div>
                        <h4 className="font-semibold text-neutral-800 text-sm">{m.freelancerName}</h4>
                        <p className="text-[11px] text-neutral-400 font-medium capitalize">{m.freelancerSeniority} Specialist</p>
                      </div>
                    </div>
                    <div className="shrink-0 bg-neutral-50/80 p-1.5 rounded-lg border border-neutral-100/50">
                      <MatchScoreRing score={m.score} size={36} />
                    </div>
                  </div>

                  {/* Target Job */}
                  <div className="text-xs bg-neutral-50 p-3 rounded-xl border border-neutral-100 space-y-1">
                    <p className="text-[9px] uppercase font-bold text-neutral-400 tracking-wider">For Job Posting</p>
                    <p className="text-neutral-700 font-medium truncate">
                      {m.job?.structuredScope?.title || m.job?.briefText}
                    </p>
                  </div>

                  {/* Skills badges */}
                  {m.freelancerSkills?.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {m.freelancerSkills.slice(0, 4).map((skill: string, idx: number) => (
                        <span key={idx} className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-neutral-100 text-neutral-600 font-medium border border-neutral-200/20">
                          {skill}
                        </span>
                      ))}
                      {m.freelancerSkills.length > 4 && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] bg-neutral-50 text-neutral-400 font-medium">
                          +{m.freelancerSkills.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Details Footer */}
                <div className="pt-4 border-t border-neutral-50 flex items-center justify-between gap-4 text-xs font-semibold">
                  <div className="text-neutral-500">
                    <span className="text-[10px] font-bold block text-neutral-400 uppercase tracking-wide">Suggested Pay</span>
                    {m.suggestedRateMin !== undefined ? (
                      <span className="text-neutral-700">${m.suggestedRateMin}-${m.suggestedRateMax}/hr</span>
                    ) : (
                      <span className="text-neutral-400 font-medium">TBD</span>
                    )}
                  </div>
                  <Link href={`/matches/${m._id}`} className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 transition-colors">
                    View Details
                    <ArrowUpRight className="h-4 w-4" />
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
