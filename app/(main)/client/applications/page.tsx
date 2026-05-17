'use client';

import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useConvexUser } from '@/hooks/use-convex-user';
import { PageHeader } from '@/components/layout/page-header';
import { MatchScoreRing } from '@/components/matching/match-score-ring';
import { Spinner } from '@/components/ui/spinner';
import { useState } from 'react';
import { Inbox, CheckCircle2, XCircle, Clock, ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import Link from 'next/link';

type TabType = 'proposed' | 'accepted' | 'rejected';

export default function ClientApplicationsPage() {
  const { isLoaded, clerkId } = useConvexUser();
  const [activeTab, setActiveTab] = useState<TabType>('proposed');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const matches = useQuery(
    api.functions.matches.getByClient,
    clerkId ? { clerkId } : 'skip',
  );

  const updateStatus = useMutation(api.functions.matches.updateStatus);

  if (!isLoaded || matches === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  // Filter out pending matches (which are invitations, not active proposals)
  const incomingApplications = (matches ?? []).filter((m: any) => m.status !== 'pending');

  const filteredApps = incomingApplications.filter((a: any) => a.status === activeTab);

  const handleAction = async (matchId: any, status: 'accepted' | 'rejected') => {
    setUpdatingId(matchId);
    try {
      await updateStatus({ matchId, status });
    } catch {
      // handle error
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Received Applications"
        description="Review proposals and portfolios submitted by matched agents and freelancers."
      />

      {/* Tabs Menu */}
      <div className="flex border-b border-neutral-200">
        {(['proposed', 'accepted', 'rejected'] as TabType[]).map((tab) => {
          const count = incomingApplications.filter((a: any) => a.status === tab).length;
          const label = tab === 'proposed' ? 'Needs Review' : tab === 'accepted' ? 'Hired / Accepted' : 'Declined';

          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 border-b-2 font-medium text-sm transition-colors duration-150 relative -mb-[2px]',
                activeTab === tab
                  ? 'border-indigo-600 text-indigo-600 font-semibold'
                  : 'border-transparent text-neutral-500 hover:text-neutral-700 hover:border-neutral-300'
              )}
            >
              {label}
              <span className={cn(
                'ml-1.5 px-1.5 py-0.5 text-[10px] rounded-full font-bold',
                activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'bg-neutral-100 text-neutral-500'
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filteredApps.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center max-w-md mx-auto space-y-4 mt-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
            <Inbox className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-neutral-800 text-base">No proposals in this section</h3>
            <p className="text-sm text-neutral-500">
              When matched freelancers submit a proposal pitch, it will show up here.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredApps.map((a: any) => {
            const initials = a.freelancerName
              .split(' ')
              .map((n: string) => n.charAt(0))
              .join('')
              .toUpperCase();

            return (
              <div key={a._id} className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-6 space-y-5 hover:shadow-md transition-shadow duration-200">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-5 border-b border-neutral-100">
                  {/* Left: Candidate overview */}
                  <div className="flex items-start gap-4">
                    {a.freelancerImage ? (
                      <img src={a.freelancerImage} alt={a.freelancerName} className="h-12 w-12 rounded-full object-cover border border-neutral-150" />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center border border-indigo-100 shrink-0">
                        {initials}
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-bold text-neutral-800 text-base leading-none">{a.freelancerName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-neutral-100 text-neutral-600 font-semibold capitalize border border-neutral-200/20">
                          {a.freelancerSeniority} SPECIALIST
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 font-medium">
                        Applied to: <span className="text-neutral-600 font-semibold">{a.job?.structuredScope?.title || a.job?.briefText}</span>
                      </p>
                      <p className="text-[11px] text-neutral-400 font-medium">
                        Submitted: {new Date(a._creationTime).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  {/* Right: AI Score ring */}
                  <div className="flex items-center gap-4 shrink-0">
                    <div className="bg-neutral-50 px-4 py-2.5 rounded-xl border border-neutral-100/60 flex items-center gap-3">
                      <MatchScoreRing score={a.score} size={38} />
                      <div className="text-xs">
                        <span className="font-bold text-neutral-800 block">{a.score}% Fit</span>
                        <span className="text-neutral-400 font-medium">AI Relevance</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Body: Proposal content */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400 uppercase tracking-wide">
                    <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[9px] font-bold">
                      {a.proposalTone || 'professional'}
                    </span>
                    <span>Proposal Cover Letter</span>
                  </div>
                  <div className="bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 text-sm text-neutral-700 leading-relaxed font-medium whitespace-pre-wrap">
                    {a.proposalText || 'No custom proposal text provided.'}
                  </div>
                </div>

                {/* Skills of candidate */}
                {a.freelancerSkills?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {a.freelancerSkills.slice(0, 8).map((skill: string, idx: number) => (
                      <span key={idx} className="inline-flex px-2 py-0.5 rounded text-xs bg-neutral-100 text-neutral-600 border border-neutral-200/20 font-medium">
                        {skill}
                      </span>
                    ))}
                    {a.freelancerSkills.length > 8 && (
                      <span className="inline-flex px-2 py-0.5 rounded text-xs bg-neutral-50 text-neutral-400 font-medium">
                        +{a.freelancerSkills.length - 8} more
                      </span>
                    )}
                  </div>
                )}

                {/* Actions bottom bar */}
                <div className="pt-5 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-4">
                  <Link
                    href={`/matches/${a._id}`}
                    className="inline-flex items-center gap-1.5 text-neutral-500 hover:text-neutral-700 text-xs font-semibold transition-colors"
                  >
                    View Match Analysis
                    <ExternalLink className="h-4 w-4" />
                  </Link>

                  {activeTab === 'proposed' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleAction(a._id, 'rejected')}
                        disabled={updatingId !== null}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-red-200 hover:border-red-300 hover:bg-red-50 text-red-700 text-xs font-semibold transition-colors duration-150 disabled:opacity-50"
                      >
                        <ThumbsDown className="h-4 w-4" />
                        Decline
                      </button>
                      <button
                        onClick={() => handleAction(a._id, 'accepted')}
                        disabled={updatingId !== null}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-colors duration-150 disabled:opacity-50"
                      >
                        <ThumbsUp className="h-4 w-4" />
                        Accept & Hire Candidate
                      </button>
                    </div>
                  )}

                  {activeTab === 'accepted' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-100">
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                      Candidate Hired
                    </span>
                  )}

                  {activeTab === 'rejected' && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-800 text-xs font-semibold border border-red-100">
                      <XCircle className="h-4 w-4 text-red-500" />
                      Candidate Declined
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
