export type AgentStatus = 'idle' | 'running' | 'complete' | 'error';

export type AgentTool =
  | 'search_market_rates'
  | 'structure_brief'
  | 'fetch_matched_freelancers'
  | 'score_candidate'
  | 'write_proposal'
  | 'notify_stakeholder'
  | 'export_pdf';

export interface AgentStep {
  tool: AgentTool;
  status: 'running' | 'complete' | 'error';
  summary: string;
  duration?: number;
  error?: string;
}

export interface AgentResult {
  status: AgentStatus;
  steps: AgentStep[];
  jobId?: string;
  matchId?: string;
  error?: string;
}
