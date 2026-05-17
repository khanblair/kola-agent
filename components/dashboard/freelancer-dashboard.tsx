'use client';

import { StatsCard } from './stats-card';
import { QuickActions } from './quick-actions';
import { RecentActivity } from './recent-activity';
import { FileText, Users, Star, DollarSign } from 'lucide-react';

interface FreelancerDashboardProps {
  stats?: {
    totalMatches: number;
    proposalsReceived: number;
    avgScore: number;
    profileViews: number;
  };
  activities?: {
    id: string;
    description: string;
    timestamp: string;
    type: 'job' | 'match' | 'proposal' | 'notification';
  }[];
}

export function FreelancerDashboard({ stats, activities }: FreelancerDashboardProps) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          label="Total Matches"
          value={stats?.totalMatches ?? 0}
          icon={Users}
        />
        <StatsCard
          label="Proposals Received"
          value={stats?.proposalsReceived ?? 0}
          icon={FileText}
        />
        <StatsCard
          label="Avg Score"
          value={stats?.avgScore ?? 0}
          icon={Star}
        />
        <StatsCard
          label="Profile Views"
          value={stats?.profileViews ?? 0}
          icon={DollarSign}
        />
      </div>

      <QuickActions role="freelancer" />

      <RecentActivity activities={activities ?? []} />
    </div>
  );
}
