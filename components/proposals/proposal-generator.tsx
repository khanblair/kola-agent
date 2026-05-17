'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ToneSelector } from './tone-selector';
import { ProposalPreview } from './proposal-preview';
import type { ProposalTone } from '@/types/proposal';

interface ProposalGeneratorProps {
  matchId: string;
  onGenerated?: (content: string) => void;
}

export function ProposalGenerator({ matchId, onGenerated }: ProposalGeneratorProps) {
  const [tone, setTone] = useState<ProposalTone>('professional');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/proposals/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ matchId, tone }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error((body as { error?: string }).error ?? 'Generation failed');
      }
      const data = (await res.json()) as { data?: { content: string } };
      const proposal = data.data?.content ?? '';
      setContent(proposal);
      onGenerated?.(proposal);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <ToneSelector value={tone} onChange={setTone} />

      <Button onClick={generate} loading={loading} disabled={!matchId}>
        Generate Proposal
      </Button>

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}

      <ProposalPreview content={content} tone={tone} />
    </div>
  );
}
