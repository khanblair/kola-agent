import type { AgentTool } from '@/types/agent';

export const agentStepLabels: Record<AgentTool, string> = {
  search_market_rates: 'Searching Market Rates',
  structure_brief: 'Structuring Brief',
  fetch_matched_freelancers: 'Fetching Matched Freelancers',
  score_candidate: 'Scoring Candidate',
  write_proposal: 'Writing Proposal',
  notify_stakeholder: 'Sending Notification',
  export_pdf: 'Exporting PDF',
} as const;

export const agentStepOrder: AgentTool[] = [
  'search_market_rates',
  'structure_brief',
  'fetch_matched_freelancers',
  'score_candidate',
  'write_proposal',
  'notify_stakeholder',
  'export_pdf',
];
