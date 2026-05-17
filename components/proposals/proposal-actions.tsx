'use client';

import { Button } from '@/components/ui/button';
import { useClipboard } from '@/hooks/use-clipboard';
import { usePdfExport } from '@/hooks/use-pdf-export';

interface ProposalActionsProps {
  content: string;
  jobId: string;
  matchId: string;
}

export function ProposalActions({ content, jobId, matchId }: ProposalActionsProps) {
  const { copied, copy } = useClipboard();
  const { exportPdf, loading: exporting } = usePdfExport();

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => copy(content)}
        disabled={!content}
      >
        {copied ? 'Copied!' : 'Copy'}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportPdf(jobId, matchId)}
        loading={exporting}
        disabled={!content}
      >
        Export PDF
      </Button>
    </div>
  );
}
