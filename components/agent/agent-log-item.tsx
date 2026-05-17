'use client';

import { cn } from '@/lib/utils/cn';
import { AgentToolIcon } from './agent-tool-icon';
import type { AgentStep } from '@/types/agent';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface AgentLogItemProps {
  step: AgentStep;
  index: number;
}

export function AgentLogItem({ step, index }: AgentLogItemProps) {
  return (
    <div
      className={cn(
        'flex items-start gap-3 rounded-lg border px-3 py-2.5 text-sm transition-colors',
        step.status === 'running' && 'border-amber-200 bg-amber-50/50',
        step.status === 'complete' && 'border-green-200 bg-green-50/30',
        step.status === 'error' && 'border-red-200 bg-red-50/30',
      )}
    >
      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-medium text-neutral-500">
        {index + 1}
      </span>

      <AgentToolIcon tool={step.tool} className="mt-0.5 h-4 w-4 shrink-0 text-neutral-600" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-neutral-700">{step.summary}</p>
        {step.error && (
          <p className="mt-0.5 text-xs text-red-600">{step.error}</p>
        )}
        {step.duration != null && step.status === 'complete' && (
          <p className="mt-0.5 text-xs text-neutral-400">{step.duration}ms</p>
        )}
      </div>

      <span className="shrink-0">
        {step.status === 'running' && (
          <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
        )}
        {step.status === 'complete' && (
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        )}
        {step.status === 'error' && (
          <XCircle className="h-4 w-4 text-red-500" />
        )}
      </span>
    </div>
  );
}
