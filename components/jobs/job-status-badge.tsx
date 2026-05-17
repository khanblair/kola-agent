'use client';

import { Badge } from '@/components/ui/badge';
import type { JobStatus } from '@/types/job';

const config: Record<JobStatus, { variant: 'default' | 'success' | 'warning' | 'error'; label: string }> = {
  draft: { variant: 'default', label: 'Draft' },
  published: { variant: 'warning', label: 'Published' },
  matched: { variant: 'success', label: 'Matched' },
  closed: { variant: 'error', label: 'Closed' },
};

interface JobStatusBadgeProps {
  status: JobStatus;
}

export function JobStatusBadge({ status }: JobStatusBadgeProps) {
  const c = config[status];
  return <Badge variant={c.variant}>{c.label}</Badge>;
}
