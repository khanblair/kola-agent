'use client';

import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { ProfileEditor } from '@/components/freelancer/profile-editor';
import { ProfileCard } from '@/components/freelancer/profile-card';
import { useConvexUser } from '@/hooks/use-convex-user';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Spinner } from '@/components/ui/spinner';
import type { FreelancerProfile } from '@/types/freelancer';
import { useState } from 'react';

export default function FreelancerProfilePage() {
  const { convexUser, isLoaded } = useConvexUser();
  const [saving, setSaving] = useState(false);

  const freelancerProfile = useQuery(
    api.functions.freelancers.getByUserId,
    convexUser ? {} : 'skip',
  );

  const handleSave = async (data: FreelancerProfile) => {
    setSaving(true);
    try {
      await fetch('/api/freelancers/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // handle error
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded || freelancerProfile === undefined) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const profile = freelancerProfile as any;

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="My Profile"
        description="Keep your skills and experience up to date for better matching."
      />

      {profile && (
        <ProfileCard
          name={convexUser ? (convexUser as any).name ?? 'Freelancer' : 'Freelancer'}
          profile={{
            skills: profile.skills ?? [],
            yearsOfExperience: profile.yearsOfExperience ?? 0,
            seniority: profile.seniority ?? 'mid',
            notableProjects: profile.notableProjects ?? [],
            region: profile.region ?? 'uganda',
            cvText: profile.cvText ?? '',
            hourlyRateMin: profile.hourlyRateMin,
            hourlyRateMax: profile.hourlyRateMax,
          }}
        />
      )}

      <Section title="Edit Profile">
        <ProfileEditor
          initial={profile ? {
            skills: profile.skills,
            yearsOfExperience: profile.yearsOfExperience,
            seniority: profile.seniority,
            notableProjects: profile.notableProjects,
            region: profile.region,
            hourlyRateMin: profile.hourlyRateMin,
            hourlyRateMax: profile.hourlyRateMax,
          } : undefined}
          onSave={handleSave}
          loading={saving}
        />
      </Section>
    </div>
  );
}
