'use client';

import {
  Search,
  FileText,
  Users,
  BarChart3,
  PenTool,
  Bell,
  FileDown,
} from 'lucide-react';
import type { AgentTool } from '@/types/agent';

const toolConfig: Record<AgentTool, { icon: typeof Search; label: string }> = {
  search_market_rates: { icon: Search, label: 'Market Search' },
  structure_brief: { icon: FileText, label: 'Brief Analysis' },
  fetch_matched_freelancers: { icon: Users, label: 'Matching' },
  score_candidate: { icon: BarChart3, label: 'Scoring' },
  write_proposal: { icon: PenTool, label: 'Proposal' },
  notify_stakeholder: { icon: Bell, label: 'Notification' },
  export_pdf: { icon: FileDown, label: 'PDF Export' },
};

interface AgentToolIconProps {
  tool: AgentTool;
  className?: string;
  showLabel?: boolean;
}

export function AgentToolIcon({ tool, className, showLabel }: AgentToolIconProps) {
  const config = toolConfig[tool];
  const Icon = config.icon;

  return (
    <span className="inline-flex items-center gap-1.5">
      <Icon className={className ?? 'h-4 w-4'} />
      {showLabel && (
        <span className="text-xs font-medium text-neutral-500">{config.label}</span>
      )}
    </span>
  );
}
