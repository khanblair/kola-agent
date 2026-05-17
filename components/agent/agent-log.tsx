'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { AgentLogItem } from './agent-log-item';
import { AgentStatusBadge } from './agent-status-badge';
import type { AgentStep, AgentStatus } from '@/types/agent';

interface AgentLogProps {
  steps: AgentStep[];
  status: AgentStatus;
}

export function AgentLog({ steps, status }: AgentLogProps) {
  if (steps.length === 0 && status === 'idle') {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-12 text-center">
        <p className="text-sm text-neutral-400">Submit a job brief to start the agent</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-neutral-700">Agent Progress</h3>
        <AgentStatusBadge status={status} />
      </div>

      <ScrollArea className="max-h-[420px]">
        <div className="space-y-2">
          {steps.map((step, i) => (
            <AgentLogItem key={`${step.tool}-${i}`} step={step} index={i} />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
