'use client';

import { StatsCard } from './stats-card';
import { QuickActions } from './quick-actions';
import { RecentActivity } from './recent-activity';
import { Briefcase, Users, FileText, TrendingUp } from 'lucide-react';

interface ClientDashboardProps {
  stats?: {
    totalJobs: number;
    activeMatches: number;
    proposalsSent: number;
    avgMatchScore: number;
  };
  activities?: {
    id: string;
    description: string;
    timestamp: string;
    type: 'job' | 'match' | 'proposal' | 'notification';
  }[];
}

export function ClientDashboard({ stats, activities }: ClientDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Jobs"
          value={stats?.totalJobs ?? 0}
          icon={Briefcase}
        />
        <StatsCard
          label="Active Matches"
          value={stats?.activeMatches ?? 0}
          icon={Users}
        />
        <StatsCard
          label="Proposals Sent"
          value={stats?.proposalsSent ?? 0}
          icon={FileText}
        />
        <StatsCard
          label="Avg Match Score"
          value={stats?.avgMatchScore ?? 0}
          icon={TrendingUp}
        />
      </div>

      <QuickActions role="client" />

      <RecentActivity activities={activities ?? []} />
    </div>
  );
}
