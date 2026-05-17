'use client';

import { useUser } from '@clerk/nextjs';
import { ClientDashboard } from '@/components/dashboard/client-dashboard';
import { FreelancerDashboard } from '@/components/dashboard/freelancer-dashboard';
import { PageHeader } from '@/components/layout/page-header';
import type { UserRole } from '@/types/user';

export default function DashboardPage() {
  const { user } = useUser();
  const role = (user?.publicMetadata?.role as UserRole) ?? 'client';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back${user?.firstName ? `, ${user.firstName}` : ''}`}
      />

      {role === 'freelancer' ? <FreelancerDashboard /> : <ClientDashboard />}
    </div>
  );
}
