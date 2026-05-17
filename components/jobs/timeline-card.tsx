'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Clock } from 'lucide-react';

interface TimelineCardProps {
  timeline: string;
  phases?: { name: string; duration: string }[];
}

export function TimelineCard({ timeline, phases }: TimelineCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-primary-600" />
          <h3 className="text-sm font-semibold text-neutral-700">Timeline</h3>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-medium text-neutral-800">{timeline}</p>
        {phases && phases.length > 0 && (
          <div className="mt-3 space-y-2">
            {phases.map((p, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-100 text-xs font-medium text-primary-700">
                  {i + 1}
                </span>
                <span className="text-neutral-700">{p.name}</span>
                <span className="ml-auto text-neutral-400">{p.duration}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
