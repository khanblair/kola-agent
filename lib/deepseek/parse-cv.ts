import { getDeepSeekClient } from './client';
import type { CVParseResult, Seniority } from '@/types/freelancer';

const SYSTEM_PROMPT = `You are a CV parser for the Kolaborate Africa freelance marketplace. Extract structured data from the raw CV text provided.

Return a JSON object with exactly these fields:
- name: string (the person's full name)
- skills: string[] (list of technical/professional skills detected)
- yearsOfExperience: number (estimated total years of professional experience)
- seniority: "junior" | "mid" | "senior" (based on years and complexity of work)
- notableProjects: string[] (1-3 sentence descriptions of the most impressive projects)
- region: string (detected country or "east-africa" as default)

Rules:
- Infer seniority: 0-2 years = junior, 3-5 years = mid, 6+ years = senior
- If region is ambiguous, use "uganda" as default
- Extract only real, verifiable skills mentioned in the CV
- Project descriptions should be concise (one sentence each)
- Return ONLY valid JSON, no markdown fences or explanation`;

export async function parseCV(cvText: string): Promise<CVParseResult> {
  const client = getDeepSeekClient();

  const response = await client.chat.completions.create({
    model: 'deepseek-chat',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: cvText },
    ],
    temperature: 0.1,
    response_format: { type: 'json_object' },
  });

  const content = response.choices[0]?.message?.content;
  if (!content) throw new Error('No response from DeepSeek CV parser');

  const parsed = JSON.parse(content);

  return {
    name: parsed.name ?? 'Unknown',
    skills: Array.isArray(parsed.skills) ? parsed.skills : [],
    yearsOfExperience: Number(parsed.yearsOfExperience) || 0,
    seniority: validateSeniority(parsed.seniority),
    notableProjects: Array.isArray(parsed.notableProjects)
      ? parsed.notableProjects
      : [],
    region: parsed.region ?? 'uganda',
  };
}

function validateSeniority(value: string): Seniority {
  if (value === 'junior' || value === 'mid' || value === 'senior') return value;
  return 'mid';
}
