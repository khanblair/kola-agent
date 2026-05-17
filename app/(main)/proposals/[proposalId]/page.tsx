'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { ProposalEditor } from '@/components/proposals/proposal-editor';
import { ProposalActions } from '@/components/proposals/proposal-actions';
import { ToneSelector } from '@/components/proposals/tone-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ArrowLeft } from 'lucide-react';
import type { ProposalTone } from '@/types/proposal';

export default function ProposalDetailPage() {
  const params = useParams();
  const proposalId = params.proposalId as string;

  // In a full implementation this would use Convex useQuery
  // For now, show the editor UI
  const [content, setContent] = useState('');
  const [tone, setTone] = useState<ProposalTone>('professional');

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
      <PageHeader title="Proposal">
        <Button variant="outline" size="sm" onClick={() => history.back()}>
          <ArrowLeft className="mr-1.5 h-4 w-4" />
          Back
        </Button>
      </PageHeader>

      <div className="flex items-center gap-2">
        <Badge variant="info">Draft</Badge>
      </div>

      <Section title="Tone">
        <ToneSelector value={tone} onChange={setTone} />
      </Section>

      <Section>
        <ProposalEditor
          initialContent={content}
          tone={tone}
          onSave={(c) => setContent(c)}
        />
      </Section>
    </div>
  );
}
