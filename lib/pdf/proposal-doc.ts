import { PDFGenerator } from './generator';
import type { ExportOptions } from '@/types/pdf';

interface ProposalDocInput {
  projectTitle: string;
  freelancerName: string;
  clientName?: string;
  content: string;
  tone?: string;
  score?: number;
  suggestedRateMin?: number;
  suggestedRateMax?: number;
  currency?: string;
  skillGaps?: string[];
}

export function generateProposalDoc(input: ProposalDocInput): string {
  const sections: ExportOptions['sections'] = [];

  sections.push({
    title: 'Proposal Overview',
    content: [
      `Project: ${input.projectTitle}`,
      `Freelancer: ${input.freelancerName}`,
      input.clientName ? `Client: ${input.clientName}` : '',
      input.score != null ? `Match Score: ${input.score}/100` : '',
      input.tone ? `Tone: ${input.tone}` : '',
    ].filter(Boolean).join('\n'),
  });

  if (input.suggestedRateMin != null && input.suggestedRateMax != null) {
    sections.push({
      title: 'Suggested Rate',
      content: `${input.suggestedRateMin}–${input.suggestedRateMax} ${input.currency ?? 'USD'}/hr`,
    });
  }

  if (input.skillGaps && input.skillGaps.length > 0) {
    sections.push({
      title: 'Identified Skill Gaps',
      content: input.skillGaps.map((g, i) => `${i + 1}. ${g}`).join('\n'),
    });
  }

  sections.push({ title: 'Proposal', content: input.content });

  const options: ExportOptions = {
    documentType: 'proposal',
    title: `Proposal — ${input.projectTitle}`,
    sections,
  };

  return new PDFGenerator().toHTML(options);
}
