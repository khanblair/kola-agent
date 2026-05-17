import { getDeepSeekClient } from '@/lib/deepseek/client';

const STRUCTURE_PROMPT = `You are a project scope analyst for the Kolaborate Africa freelance marketplace.

Parse the raw job brief below into a structured scope document. Return a JSON object with these fields:

{
  "title": "string — concise project title",
  "description": "string — 2-3 sentence project summary",
  "deliverables": ["string — specific, measurable deliverables"],
  "phases": [
    {
      "name": "string — phase name",
      "duration": "string — e.g. '2 weeks'",
      "tasks": ["string — specific tasks in this phase"]
    }
  ],
  "timeline": "string — total estimated duration e.g. '8-12 weeks'",
  "requiredSkills": ["string — technical skills needed"],
  "scopeClarityScore": number from 0-100,
  "redFlags": ["string — vague requirements, unrealistic timelines, scope creep risks"]
}

Rules:
- scopeClarityScore: 80+ if the brief has clear deliverables, timeline, and tech requirements. 50-79 if some details are missing. Below 50 if very vague.
- Be specific with deliverables — not "build an app" but "iOS and Android mobile app with user registration, order placement, and payment integration"
- Always include at least 2 phases
- Flag unrealistic timelines honestly
- Return ONLY valid JSON, no markdown`;

export async function structureBriefTool(briefText: string): Promise<string> {
  const client = getDeepSeekClient();

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: STRUCTURE_PROMPT },
      { role: 'user', content: briefText },
    ],
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from scope structuring');

  return content;
}
