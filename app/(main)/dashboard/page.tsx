'use client';

import { useUser } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import { FreelancerDashboard } from '@/components/dashboard/freelancer-dashboard';
import { PageHeader } from '@/components/layout/page-header';
import { Spinner } from '@/components/ui/spinner';
import type { UserRole } from '@/types/user';

export default function DashboardPage() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as UserRole) ?? 'client';

  // Live client-side fetches
  const clientJobs = useQuery(
    api.functions.jobs.listByClient,
    role === 'client' && user?.id ? { clerkId: user.id } : 'skip'
  );

  const clientMatches = useQuery(
    api.functions.matches.getByClient,
    role === 'client' && user?.id ? { clerkId: user.id } : 'skip'
  );

  // Live freelancer-side fetches
  const freelancerMatches = useQuery(
    api.functions.matches.getByFreelancer,
    role === 'freelancer' && user?.id ? { clerkId: user.id } : 'skip'
  );

  const isLoading = role === 'client'
    ? clientJobs === undefined || clientMatches === undefined
    : freelancerMatches === undefined;

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  // Calculate Client Metrics
  const clientStats = {
    totalJobs: clientJobs?.length ?? 0,
    activeMatches: clientMatches?.filter(m => m.status === 'pending').length ?? 0,
    proposalsSent: clientMatches?.filter(m => m.status === 'proposed' || m.status === 'accepted').length ?? 0,
    avgMatchScore: clientMatches && clientMatches.length > 0
      ? Math.round(clientMatches.reduce((acc, m) => acc + m.score, 0) / clientMatches.length)
      : 0
  };

  const clientActivities = (clientMatches ?? []).map((m: any) => {
    let description = '';
    if (m.status === 'pending') {
      description = `AI Matched candidate ${m.freelancerName} (${m.score}% fit) for: ${m.job?.structuredScope?.roleTitle ?? 'Job Brief'}`;
    } else if (m.status === 'proposed') {
      description = `New proposal submitted by ${m.freelancerName} for: ${m.job?.structuredScope?.roleTitle ?? 'Job Brief'}`;
    } else if (m.status === 'accepted') {
      description = `You hired ${m.freelancerName} for: ${m.job?.structuredScope?.roleTitle ?? 'Job Brief'}`;
    } else {
      description = `Declined candidate ${m.freelancerName} for: ${m.job?.structuredScope?.roleTitle ?? 'Job Brief'}`;
    }
    return {
      id: m._id,
      description,
      timestamp: new Date(m._creationTime).toLocaleDateString(),
      type: m.status === 'proposed' ? 'proposal' as const : m.status === 'accepted' ? 'job' as const : 'match' as const
    };
  }).slice(0, 5);

  // Calculate Freelancer Metrics
  const freelancerStats = {
    totalMatches: freelancerMatches?.length ?? 0,
    proposalsReceived: freelancerMatches?.filter(m => m.status === 'proposed' || m.status === 'accepted').length ?? 0,
    avgScore: freelancerMatches && freelancerMatches.length > 0
      ? Math.round(freelancerMatches.reduce((acc, m) => acc + m.score, 0) / freelancerMatches.length)
      : 0,
    profileViews: freelancerMatches?.filter(m => m.status === 'accepted').length ?? 0
  };

  const freelancerActivities = (freelancerMatches ?? []).map((m: any) => {
    let description = '';
    if (m.status === 'pending') {
      description = `New match invitation received: ${m.job?.structuredScope?.roleTitle ?? 'AI Scoped Job'} (${m.score}% match)`;
    } else if (m.status === 'proposed') {
      description = `Submitted bid and cover letter for: ${m.job?.structuredScope?.roleTitle ?? 'AI Scoped Job'}`;
    } else if (m.status === 'accepted') {
      description = `Congratulations! Hired for: ${m.job?.structuredScope?.roleTitle ?? 'AI Scoped Job'}!`;
    } else {
      description = `Bid declined for: ${m.job?.structuredScope?.roleTitle ?? 'AI Scoped Job'}`;
    }
    return {
      id: m._id,
      description,
      timestamp: new Date(m._creationTime).toLocaleDateString(),
      type: m.status === 'proposed' ? 'proposal' as const : m.status === 'accepted' ? 'job' as const : 'match' as const
    };
  }).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}`}
      />

      {role === 'freelancer' ? (
        <FreelancerDashboard stats={freelancerStats} activities={freelancerActivities} />
      ) : (
        <ClientDashboard stats={clientStats} activities={clientActivities} />
      )}
    </div>
  );
}
