import { getDeepSeekClient } from '@/lib/deepseek/client';
import { convex, api } from '@/lib/convex/client';
import * as mutations from '@/lib/convex/mutations';

const PROPOSAL_PROMPT = `You are a proposal writer for the Kolaborate Africa freelance marketplace.

Write a tailored project proposal for the matched freelancer. The proposal will be sent to the client on the freelancer's behalf.

RULES:
- BANNED openers: "I am writing to express my interest", "I believe I am the perfect fit", "I am excited to apply", or any generic opener.
- Instead, open with a specific hook referencing the client's actual problem or a relevant insight from the brief.
- Reference the freelancer's SPECIFIC past projects by name/description.
- Address the EXACT deliverables listed in the scope.
- Keep it concise: 250-400 words.
- Include a clear call to action at the end.
- Mention the suggested rate range naturally.

Return a JSON object:
{
  "proposalText": "string — the full proposal text",
  "wordCount": number
}

Return ONLY valid JSON.`;

export async function writeProposalTool(
  matchId: string,
  tone: 'professional' | 'confident' | 'friendly' = 'professional',
): Promise<string> {
  const match = await convex.query(api.functions.matches.getById, {
    matchId: matchId as any,
  });

  if (!match) {
    return JSON.stringify({ error: `Match ${matchId} not found` });
  }

  const client = getDeepSeekClient();

  const context = `
**Match Score:** ${match.score}/100
**Match Explanation:** ${match.explanation}
**Skill Gaps:** ${match.skillGaps.join(', ') || 'None'}
**Suggested Rate:** $${match.suggestedRateMin}–$${match.suggestedRateMax}/hr

**Freelancer Profile:**
${match.freelancer ? `- Skills: ${match.freelancer.skills.join(', ')}
- Seniority: ${match.freelancer.seniority}
- Projects: ${match.freelancer.notableProjects.join('; ')}` : 'Profile unavailable'}

**Job:**
${match.job ? `- Brief: ${match.job.briefText}` : 'Job details unavailable'}

**Tone:** ${tone}
`.trim();

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: PROPOSAL_PROMPT },
      { role: 'user', content: context },
    ],
    temperature: 0.6,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from proposal generator');

  const parsed = JSON.parse(content);

  // Save the proposal to Convex
  await mutations.updateMatchProposal({
    matchId,
    proposalText: parsed.proposalText,
    proposalTone: tone,
  });

  return content;
}
