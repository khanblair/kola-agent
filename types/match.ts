export type MatchStatus = 'pending' | 'proposed' | 'accepted' | 'rejected';

export interface MatchScore {
  overall: number;
  skillFit: number;
  experienceFit: number;
  projectRelevance: number;
}

export interface CandidateRanking {
  freelancerId: string;
  score: number;
  rank: number;
  explanation: string;
  skillGaps: string[];
}
