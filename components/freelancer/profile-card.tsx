'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { SkillsList } from './skills-list';
import { ExperienceBadge } from './experience-badge';
import { RateRangeDisplay } from './rate-range-display';
import type { FreelancerProfile } from '@/types/freelancer';

interface ProfileCardProps {
  name: string;
  profile: FreelancerProfile;
  onClick?: () => void;
}

export function ProfileCard({ name, profile, onClick }: ProfileCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <Avatar fallback={name} size="lg" />
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-neutral-800">{name}</h4>
            <ExperienceBadge years={profile.yearsOfExperience} seniority={profile.seniority} />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <SkillsList skills={profile.skills} />
        <div className="flex items-center justify-between">
          <RateRangeDisplay
            min={profile.hourlyRateMin}
            max={profile.hourlyRateMax}
          />
          <span className="text-xs capitalize text-neutral-400">{profile.region}</span>
        </div>
        {profile.notableProjects.length > 0 && (
          <div className="text-xs text-neutral-500">
            <span className="font-medium text-neutral-600">Notable:</span>{' '}
            {profile.notableProjects.slice(0, 2).join(', ')}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
