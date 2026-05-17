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
  timestamp: number;
}

export interface ToolCall {
  id: string;
  name: AgentTool;
  arguments: Record<string, unknown>;
}

export interface ToolResult {
  toolCallId: string;
  output: string;
  success: boolean;
}

export interface AgentRunContext {
  jobId: string;
  clientId: string;
  briefText: string;
  region?: string;
}

export interface AgentRunResult {
  status: AgentStatus;
  steps: AgentStep[];
  jobId: string;
  matchIds: string[];
  error?: string;
}
