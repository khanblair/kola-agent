import { PDFGenerator } from './generator';
import type { StructuredScope, BudgetBreakdown } from '@/types/job';
import type { ExportOptions } from '@/types/pdf';

interface ScopeReportInput {
  title: string;
  briefText: string;
  scope?: StructuredScope;
  budget?: BudgetBreakdown;
  clientName?: string;
  createdAt?: number;
}

export function generateScopeReport(input: ScopeReportInput): string {
  const sections: ExportOptions['sections'] = [];

  sections.push({
    title: 'Project Overview',
    content: [
      `Project: ${input.scope?.title ?? input.title}`,
      input.scope?.description ?? input.briefText.slice(0, 500),
      input.clientName ? `Client: ${input.clientName}` : '',
      `Date: ${input.createdAt ? new Date(input.createdAt).toLocaleDateString() : new Date().toLocaleDateString()}`,
    ].filter(Boolean).join('\n'),
  });

  if (input.scope) {
    sections.push({
      title: `Scope Analysis (${input.scope.scopeClarityScore}% Clarity)`,
      content: [
        `Timeline: ${input.scope.timeline}`,
        `Required Skills: ${input.scope.requiredSkills.join(', ')}`,
      ].join('\n'),
    });

    if (input.scope.deliverables.length > 0) {
      sections.push({
        title: 'Deliverables',
        content: input.scope.deliverables.map((d, i) => `${i + 1}. ${d}`).join('\n'),
      });
    }

    if (input.scope.phases.length > 0) {
      sections.push({
        title: 'Project Phases',
        content: input.scope.phases
          .map((p) => `${p.name} (${p.duration})\n${p.tasks.map((t) => `  - ${t}`).join('\n')}`)
          .join('\n\n'),
      });
    }

    if (input.scope.redFlags.length > 0) {
      sections.push({
        title: 'Red Flags',
        content: input.scope.redFlags.map((f, i) => `⚠ ${i + 1}. ${f}`).join('\n'),
      });
    }
  }

  if (input.budget) {
    const lines = input.budget.lineItems.map(
      (item) => `${item.item}: ${item.hours}h × ${item.rate} = ${item.total} ${input.budget!.currency}`,
    );
    lines.push('');
    lines.push(`Subtotal: ${input.budget.subtotal} ${input.budget.currency}`);
    lines.push(`Contingency: ${input.budget.contingency} ${input.budget.currency}`);
    lines.push(`Total: ${input.budget.total} ${input.budget.currency}`);
    sections.push({ title: 'Budget Breakdown', content: lines.join('\n') });
  }

  sections.push({ title: 'Original Brief', content: input.briefText });

  const options: ExportOptions = {
    documentType: 'scope-report',
    title: `Scope Report — ${input.scope?.title ?? input.title}`,
    sections,
  };

  return new PDFGenerator().toHTML(options);
}
