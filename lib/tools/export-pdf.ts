import { convex, api } from '@/lib/convex/client';

export async function exportPdfTool(
  jobId: string,
  matchId: string,
): Promise<string> {
  const job = await convex.query(api.functions.jobs.getById, {
    jobId: jobId as any,
  });
  const match = await convex.query(api.functions.matches.getById, {
    matchId: matchId as any,
  });

  if (!job) {
    return JSON.stringify({ error: `Job ${jobId} not found` });
  }
  if (!match) {
    return JSON.stringify({ error: `Match ${matchId} not found` });
  }

  // PDF generation happens client-side via jsPDF
  // This tool confirms the data is ready and returns it for the frontend to render
  return JSON.stringify({
    scopeReport: {
      title: job.structuredScope?.title ?? 'Scope Report',
      brief: job.briefText,
      scope: job.structuredScope,
      marketRateData: job.marketRateData,
      clientName: job.clientName,
      createdAt: job._creationTime,
    },
    proposalPackage: {
      proposalText: match.proposalText,
      proposalTone: match.proposalTone,
      score: match.score,
      explanation: match.explanation,
      skillGaps: match.skillGaps,
      suggestedRateMin: match.suggestedRateMin,
      suggestedRateMax: match.suggestedRateMax,
      freelancerName: match.freelancerName,
    },
    exportedAt: Date.now(),
    message: 'PDF data ready for client-side generation',
  });
}
