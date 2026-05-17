'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ProposalPreviewProps {
  content: string;
  tone?: string;
}

export function ProposalPreview({ content, tone }: ProposalPreviewProps) {
  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-12 text-center">
        <p className="text-sm text-neutral-400">Proposal will appear here once generated</p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">Proposal Preview</h3>
          {tone && (
            <span className="text-xs capitalize text-neutral-400">{tone} tone</span>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="max-h-[400px]">
          <div className="prose prose-sm max-w-none whitespace-pre-wrap text-neutral-700">
            {content}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
