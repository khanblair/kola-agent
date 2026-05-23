'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useConvexUser } from '@/hooks/use-convex-user';
import { PageHeader } from '@/components/layout/page-header';
import { MatchScoreRing } from '@/components/matching/match-score-ring';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import Link from 'next/link';
import { useState } from 'react';
import { Send, FileText, CheckCircle2, XCircle, Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

type TabType = 'all' | 'proposed' | 'accepted' | 'rejected';

export default function MyProposalsPage() {
  const { isLoaded, clerkId } = useConvexUser();
  const [activeTab, setActiveTab] = useState<TabType>('all');

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

  // Filter out pending matches (which are invitations, not submitted proposals)
  const submittedProposals = (matches ?? []).filter((m: any) => m.status !== 'pending');

  const filteredProposals = submittedProposals.filter((p: any) => {
    if (activeTab === 'all') return true;
    return p.status === activeTab;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700">
            <CheckCircle2 className="h-3 w-3" />
            Accepted
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-50 text-red-700">
            <XCircle className="h-3 w-3" />
            Declined
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700">
            <Clock className="h-3 w-3" />
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="My Proposals"
        description="Track the status of your submitted job pitches and contracts."
      />

      {/* Tabs Menu */}
      <div className="flex border-b border-neutral-200">
        {(['all', 'proposed', 'accepted', 'rejected'] as TabType[]).map((tab) => {
          const count = tab === 'all' 
            ? submittedProposals.length 
            : submittedProposals.filter((p: any) => p.status === tab).length;

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
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
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

      {filteredProposals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm p-12 text-center max-w-md mx-auto space-y-4 mt-8">
          <div className="mx-auto h-12 w-12 rounded-full bg-neutral-50 flex items-center justify-center text-neutral-400">
            <Send className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-semibold text-neutral-800 text-base">No proposals found</h3>
            <p className="text-sm text-neutral-500">
              Go to &quot;Match Invitations&quot; to submit a pitch for matches.
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-neutral-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-neutral-150 bg-neutral-50/50 text-[11px] font-bold text-neutral-400 uppercase tracking-wider">
                  <th className="px-6 py-4">Job / Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">AI Score</th>
                  <th className="px-6 py-4">Suggested Rates</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-sm font-medium">
                {filteredProposals.map((p: any) => {
                  const scope = p.job?.structuredScope || {};
                  return (
                    <tr key={p._id} className="hover:bg-neutral-50/40 transition-colors duration-150">
                      <td className="px-6 py-5 space-y-1">
                        <p className="text-neutral-800 font-semibold truncate max-w-xs sm:max-w-md">
                          {scope.title || p.job?.briefText}
                        </p>
                        <p className="text-xs text-neutral-400 font-medium">
                          Client: {p.clientName} &bull; {new Date(p._creationTime).toLocaleDateString()}
                        </p>
                      </td>
                      <td className="px-6 py-5">{getStatusBadge(p.status)}</td>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <MatchScoreRing score={p.score} size={30} />
                          <span className="text-xs font-semibold text-neutral-700">{p.score}% Match</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-neutral-600 text-xs">
                        {p.suggestedRateMin !== undefined ? (
                          <span>${p.suggestedRateMin} - ${p.suggestedRateMax}/hr</span>
                        ) : 'Negotiable'}
                      </td>
                      <td className="px-6 py-5 text-right">
                        <Link
                          href={`/matches/${p._id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-neutral-200 hover:border-neutral-300 text-neutral-700 hover:bg-neutral-50 text-xs transition-colors duration-150"
                        >
                          View Detail
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
