import { convex, api } from './client';

export async function getOrCreateUser(args: {
  clerkId: string;
  email: string;
  name: string;
  imageUrl?: string;
}) {
  return convex.mutation(api.functions.users.getOrCreateUser, args);
}

export async function updateUserRole(clerkId: string, role: 'client' | 'freelancer') {
  return convex.mutation(api.functions.users.updateRole, { role, clerkId });
}

export async function createJob(args: { briefText: string; region?: string }) {
  return convex.mutation(api.functions.jobs.create, args);
}

export async function updateJobScope(args: {
  jobId: string;
  structuredScope: unknown;
  marketRateData?: unknown;
  embedding?: number[];
}) {
  return convex.mutation(api.functions.jobs.updateScope, {
    jobId: args.jobId as any,
    structuredScope: args.structuredScope,
    marketRateData: args.marketRateData,
    embedding: args.embedding,
  });
}

export async function publishJob(jobId: string) {
  return convex.mutation(api.functions.jobs.publish, { jobId: jobId as any });
}

export async function updateJobStatus(
  jobId: string,
  status: 'draft' | 'published' | 'matched' | 'closed',
) {
  return convex.mutation(api.functions.jobs.updateStatus, {
    jobId: jobId as any,
    status,
  });
}

export async function createMatch(args: {
  jobId: string;
  freelancerId: string;
  score: number;
  explanation: string;
  skillGaps: string[];
  suggestedRateMin: number;
  suggestedRateMax: number;
}) {
  return convex.mutation(api.functions.matches.create, {
    jobId: args.jobId as any,
    freelancerId: args.freelancerId as any,
    score: args.score,
    explanation: args.explanation,
    skillGaps: args.skillGaps,
    suggestedRateMin: args.suggestedRateMin,
    suggestedRateMax: args.suggestedRateMax,
  });
}

export async function updateMatchProposal(args: {
  matchId: string;
  proposalText: string;
  proposalTone: 'professional' | 'confident' | 'friendly';
}) {
  return convex.mutation(api.functions.matches.updateProposal, {
    matchId: args.matchId as any,
    proposalText: args.proposalText,
    proposalTone: args.proposalTone,
  });
}

export async function createFreelancer(args: {
  skills: string[];
  yearsOfExperience: number;
  seniority: 'junior' | 'mid' | 'senior';
  notableProjects: string[];
  region: string;
  cvText: string;
  education?: string[];
  workHistory?: string[];
  certifications?: string[];
  volunteerExperience?: string[];
  referees?: string[];
  embedding?: number[];
  telegramChatId?: string;
  whatsappNumber?: string;
  hourlyRateMin?: number;
  hourlyRateMax?: number;
  userId?: string;
}) {
  return convex.mutation(api.functions.freelancers.create, args);
}

export async function logNotification(args: {
  userId: string;
  channel: 'telegram' | 'whatsapp';
  message: string;
  delivered: boolean;
  relatedJobId?: string;
  relatedMatchId?: string;
}) {
  return convex.mutation(api.functions.notifications.log, {
    userId: args.userId as any,
    channel: args.channel,
    message: args.message,
    delivered: args.delivered,
    relatedJobId: args.relatedJobId as any,
    relatedMatchId: args.relatedMatchId as any,
  });
}

export async function updateNotificationPreference(
  clerkId: string,
  preference: 'telegram' | 'whatsapp' | 'both',
  telegramChatId?: string,
  whatsappNumber?: string,
) {
  return convex.mutation(api.functions.users.updateNotificationPreference, {
    preference,
    clerkId,
    telegramChatId,
    whatsappNumber,
  });
}

export async function updateFreelancerProfile(
  _userId: string,
  data: {
    skills: string[];
    yearsOfExperience: number;
    seniority: string;
    notableProjects: string[];
    region: string;
    education?: string[];
    workHistory?: string[];
    certifications?: string[];
    volunteerExperience?: string[];
    referees?: string[];
    hourlyRateMin?: number;
    hourlyRateMax?: number;
  },
) {
  return convex.mutation(api.functions.freelancers.updateProfile, {
    skills: data.skills,
    yearsOfExperience: data.yearsOfExperience,
    seniority: data.seniority as 'junior' | 'mid' | 'senior',
    notableProjects: data.notableProjects,
    region: data.region,
    education: data.education,
    workHistory: data.workHistory,
    certifications: data.certifications,
    volunteerExperience: data.volunteerExperience,
    referees: data.referees,
    hourlyRateMin: data.hourlyRateMin,
    hourlyRateMax: data.hourlyRateMax,
  });
}
