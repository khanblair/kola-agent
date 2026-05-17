import { convex, api } from '@/lib/convex/client';

export async function fetchMatchedFreelancersTool(
  jobDescription: string,
  region?: string,
  seniority?: 'junior' | 'mid' | 'senior',
): Promise<string> {
  const allFreelancers = await convex.query(api.functions.freelancers.list, {});

  if (allFreelancers.length === 0) {
    return 'No freelancer profiles found in the database. Seed demo profiles first.';
  }

  let filtered = allFreelancers;

  if (region) {
    filtered = filtered.filter((f) => f.region === region);
  }

  if (seniority) {
    filtered = filtered.filter((f) => f.seniority === seniority);
  }

  // Simple keyword + semantic text matching fallback
  // (Vector search is used when embeddings are available via the action)
  const jobLower = jobDescription.toLowerCase();
  const jobKeywords = extractKeywords(jobLower);

  const scored = filtered.map((f) => {
    const profileText =
      `${f.skills.join(' ')} ${f.notableProjects.join(' ')} ${f.cvText}`.toLowerCase();
    let score = 0;

    for (const keyword of jobKeywords) {
      if (profileText.includes(keyword)) score += 10;
    }

    // Bonus for skill overlap
    const skillOverlap = f.skills.filter((s) =>
      jobKeywords.some((k) => s.toLowerCase().includes(k)),
    ).length;
    score += skillOverlap * 15;

    return { ...f, matchScore: score };
  });

  const topMatches = scored
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 3);

  let response = `## Top ${topMatches.length} Matched Freelancers\n\n`;

  for (let i = 0; i < topMatches.length; i++) {
    const f = topMatches[i];
    response += `### ${i + 1}. ${f._id} (Score: ${f.matchScore})\n`;
    response += `- **Seniority:** ${f.seniority}\n`;
    response += `- **Region:** ${f.region}\n`;
    response += `- **Experience:** ${f.yearsOfExperience} years\n`;
    response += `- **Skills:** ${f.skills.join(', ')}\n`;
    response += `- **Notable Projects:**\n`;
    for (const project of f.notableProjects) {
      response += `  - ${project}\n`;
    }
    if (f.hourlyRateMin && f.hourlyRateMax) {
      response += `- **Rate Range:** $${f.hourlyRateMin}–$${f.hourlyRateMax}/hr\n`;
    }
    response += `\n`;
  }

  return response;
}

function extractKeywords(text: string): string[] {
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have',
    'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should',
    'may', 'might', 'can', 'this', 'that', 'these', 'those', 'we', 'need',
    'our', 'it', 'its', 'all', 'not', 'no', 'so', 'if', 'as', 'from',
  ]);

  return text
    .split(/[\s,;.!?]+/)
    .filter((word) => word.length > 2 && !stopWords.has(word))
    .slice(0, 30);
}
