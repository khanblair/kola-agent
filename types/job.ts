export type JobStatus = 'draft' | 'published' | 'matched' | 'closed';

export interface ProjectPhase {
  name: string;
  duration: string;
  tasks: string[];
}

export interface StructuredScope {
  title: string;
  description: string;
  deliverables: string[];
  phases: ProjectPhase[];
  timeline: string;
  requiredSkills: string[];
  scopeClarityScore: number;
  redFlags: string[];
}

export interface MarketRateResult {
  source: string;
  rateRange: string;
  region: string;
  retrievedAt: string;
}

export interface AdjustedRateRange {
  min: number;
  max: number;
  currency: string;
  adjustmentNote?: string;
}

export interface MarketRateData {
  searchResults: MarketRateResult[];
  adjustedRateRange: AdjustedRateRange;
}

export interface BudgetBreakdown {
  lineItems: { item: string; hours: number; rate: number; total: number }[];
  subtotal: number;
  contingency: number;
  total: number;
  currency: string;
}
