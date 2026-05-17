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
- education: string[] (list of education degrees, certificates and institutions in format "Degree/Course, Institution (Years)" - extract UACE, UCE, and BSc details)
- workHistory: string[] (list of past job titles, companies, and timelines in format "Role, Company (Timeline)")
- certifications: string[] (list of licenses, courses, and certifications in format "Certification - Academy")
- volunteerExperience: string[] (list of leadership or volunteer experiences in format "Role - Description")
- referees: string[] (list of professional references with details in format "Name (Role, Organization) - Contact information")

Rules:
- Infer seniority: 0-2 years = junior, 3-5 years = mid, 6+ years = senior
- Calculate yearsOfExperience as the total active span between their earliest software engineering role, development project, or active coding activity and the present day (assume the current year is 2026). Do NOT simply sum isolated, non-overlapping months of employment. For example, if a candidate has projects or work starting in 2022 and the current year is 2026, return 4.
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
    education: Array.isArray(parsed.education) ? parsed.education : [],
    workHistory: Array.isArray(parsed.workHistory) ? parsed.workHistory : [],
    certifications: Array.isArray(parsed.certifications) ? parsed.certifications : [],
    volunteerExperience: Array.isArray(parsed.volunteerExperience) ? parsed.volunteerExperience : [],
    referees: Array.isArray(parsed.referees) ? parsed.referees : [],
  };
}

function validateSeniority(value: string): Seniority {
  if (value === 'junior' || value === 'mid' || value === 'senior') return value;
  return 'mid';
}
