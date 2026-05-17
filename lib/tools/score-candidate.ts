import { getDeepSeekClient } from '@/lib/deepseek/client';
import { convex, api } from '@/lib/convex/client';

const SCORING_PROMPT = `You are a candidate scoring agent for the Kolaborate Africa freelance marketplace.

Score how well a freelancer matches a set of job requirements. Return a JSON object:

{
  "score": number from 0-100,
  "explanation": "string — 2-3 sentence explanation of why this freelancer fits or doesn't fit",
  "skillGaps": ["string — specific skills required by the job but missing from the freelancer's profile"],
  "suggestedRateMin": number,
  "suggestedRateMax": number,
  "rateJustification": "string — brief explanation of how the rate was determined"
}

Scoring criteria:
- 90-100: Perfect match — all skills present, relevant project experience, right seniority
- 70-89: Strong match — most skills present, some gaps that could be bridged
- 50-69: Moderate match — significant skill gaps but transferable experience
- Below 50: Weak match — fundamental misalignment

Rate suggestion must be grounded in the market rate data provided. Adjust for the freelancer's seniority level.
Be HONEST about skill gaps. Do not inflate scores.
Return ONLY valid JSON.`;

export async function scoreCandidateTool(
  freelancerId: string,
  jobRequirements: string,
  marketRateData?: string,
): Promise<string> {
  const freelancer = await convex.query(api.functions.freelancers.getById, {
    id: freelancerId as any,
  });

  if (!freelancer) {
    return JSON.stringify({ error: `Freelancer ${freelancerId} not found` });
  }

  const client = getDeepSeekClient();

  const userProfile = `
**Freelancer Profile:**
- Skills: ${freelancer.skills.join(', ')}
- Seniority: ${freelancer.seniority}
- Experience: ${freelancer.yearsOfExperience} years
- Region: ${freelancer.region}
- Notable Projects: ${freelancer.notableProjects.join('; ')}
${freelancer.hourlyRateMin ? `- Current Rate: $${freelancer.hourlyRateMin}–$${freelancer.hourlyRateMax}/hr` : ''}
`.trim();

  const jobContext = `
**Job Requirements:**
${jobRequirements}

**Market Rate Data:**
${marketRateData || 'No market rate data provided'}
`.trim();

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SCORING_PROMPT },
      { role: 'user', content: `${userProfile}\n\n${jobContext}` },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from scoring');

  return content;
}
