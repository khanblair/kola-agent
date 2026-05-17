'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScopeClarityScore } from './scope-clarity-score';
import { DeliverablesList } from './deliverables-list';
import { RedFlagsPanel } from './red-flags-panel';
import type { StructuredScope } from '@/types/job';

interface ScopeCardProps {
  scope: StructuredScope;
}

export function ScopeCard({ scope }: ScopeCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-neutral-800">{scope.title}</h3>
            <p className="mt-1 text-sm text-neutral-500">{scope.description}</p>
          </div>
          <ScopeClarityScore score={scope.scopeClarityScore} className="w-40 shrink-0" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap gap-1.5">
          {scope.requiredSkills.map((skill) => (
            <Badge key={skill} variant="outline">{skill}</Badge>
          ))}
        </div>

        <DeliverablesList deliverables={scope.deliverables} />

        <div className="text-sm text-neutral-500">
          <span className="font-medium text-neutral-700">Timeline:</span> {scope.timeline}
        </div>

        {scope.phases.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-neutral-600">Phases</h4>
            {scope.phases.map((phase, i) => (
              <div key={i} className="rounded-md border border-neutral-200 px-3 py-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-neutral-700">{phase.name}</span>
                  <span className="text-neutral-400">{phase.duration}</span>
                </div>
                <ul className="mt-1 ml-4 list-disc text-xs text-neutral-500">
                  {phase.tasks.map((t, j) => (
                    <li key={j}>{t}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        <RedFlagsPanel redFlags={scope.redFlags} />
      </CardContent>
    </Card>
  );
}
