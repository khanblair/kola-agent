'use client';

import { Badge } from '@/components/ui/badge';
import type { AgentStatus } from '@/types/agent';

const statusConfig: Record<AgentStatus, { variant: 'default' | 'success' | 'warning' | 'error'; label: string }> = {
  idle: { variant: 'default', label: 'Ready' },
  running: { variant: 'warning', label: 'Running' },
  complete: { variant: 'success', label: 'Complete' },
  error: { variant: 'error', label: 'Error' },
};

interface AgentStatusBadgeProps {
  status: AgentStatus;
}

export function AgentStatusBadge({ status }: AgentStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <Badge variant={config.variant}>
      {status === 'running' && (
        <span className="mr-1.5 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
      )}
      {config.label}
    </Badge>
  );
}
