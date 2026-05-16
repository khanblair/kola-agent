export type Seniority = 'junior' | 'mid' | 'senior';

export interface FreelancerProfile {
  skills: string[];
  yearsOfExperience: number;
  seniority: Seniority;
  notableProjects: string[];
  region: string;
  cvText: string;
  embedding?: number[];
  telegramChatId?: string;
  whatsappNumber?: string;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
}

export interface CVParseResult {
  name: string;
  skills: string[];
  yearsOfExperience: number;
  seniority: Seniority;
  notableProjects: string[];
  region: string;
}
