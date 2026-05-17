interface TemplateData {
  freelancerName?: string;
  clientName?: string;
  projectTitle?: string;
  matchScore?: number;
  proposalId?: string;
  jobId?: string;
}

export function newMatchNotification(data: TemplateData): string {
  return [
    `🔔 *New Match Found!*`,
    ``,
    `*Project:* ${data.projectTitle ?? 'New Project'}`,
    `*Freelancer:* ${data.freelancerName ?? 'A freelancer'}`,
    data.matchScore != null ? `*Match Score:* ${data.matchScore}/100` : '',
    ``,
    `A tailored proposal has been generated and is ready for your review.`,
    data.jobId ? `\nView details: ${process.env.NEXT_PUBLIC_APP_URL ?? 'https://kolaagent.vercel.app'}/jobs/${data.jobId}` : '',
  ].filter(Boolean).join('\n');
}

export function proposalReadyNotification(data: TemplateData): string {
  return [
    `📝 *Proposal Ready*`,
    ``,
    `*Project:* ${data.projectTitle ?? 'Project'}`,
    `*For:* ${data.freelancerName ?? 'Freelancer'}`,
    data.matchScore != null ? `*Score:* ${data.matchScore}/100` : '',
    ``,
    `Your personalized proposal has been generated and is ready to review.`,
  ].filter(Boolean).join('\n');
}

export function jobMatchedNotification(data: TemplateData): string {
  return [
    `✅ *Job Matched!*`,
    ``,
    `*Project:* ${data.projectTitle ?? 'Your Project'}`,
    `*Matched with:* ${data.freelancerName ?? 'A freelancer'}`,
    data.matchScore != null ? `*Match Score:* ${data.matchScore}/100` : '',
    ``,
    `The agent has found a great match and generated a proposal.`,
    data.jobId ? `\nCheck it out: ${process.env.NEXT_PUBLIC_APP_URL ?? 'https://kolaagent.vercel.app'}/jobs/${data.jobId}` : '',
  ].filter(Boolean).join('\n');
}

export function agentCompleteNotification(data: TemplateData): string {
  return [
    `🤖 *KolaAgent Run Complete*`,
    ``,
    `*Project:* ${data.projectTitle ?? 'Project'}`,
    `The agent has finished processing your job brief.`,
    `Scope report, matches, and proposal are all ready.`,
    data.jobId ? `\nView results: ${process.env.NEXT_PUBLIC_APP_URL ?? 'https://kolaagent.vercel.app'}/jobs/${data.jobId}` : '',
  ].filter(Boolean).join('\n');
}
