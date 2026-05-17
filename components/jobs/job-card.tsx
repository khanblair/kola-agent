'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { JobStatusBadge } from './job-status-badge';
import { Badge } from '@/components/ui/badge';
import type { JobStatus } from '@/types/job';

interface JobCardProps {
  title: string;
  status: JobStatus;
  region?: string;
  createdAt: string;
  skillsCount?: number;
  onClick?: () => void;
}

export function JobCard({ title, status, region, createdAt, skillsCount, onClick }: JobCardProps) {
  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md"
      onClick={onClick}
    >
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-neutral-800 line-clamp-2">{title}</h4>
          <JobStatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
          {region && <span>{region}</span>}
          {skillsCount != null && (
            <Badge variant="outline" className="text-xs">
              {skillsCount} skills
            </Badge>
          )}
          <span className="ml-auto">{new Date(createdAt).toLocaleDateString()}</span>
        </div>
      </CardContent>
    </Card>
  );
}
