'use client';

import { Button } from '@/components/ui/button';
import { FileDown } from 'lucide-react';
import { usePdfExport } from '@/hooks/use-pdf-export';

interface ExportButtonProps {
  jobId: string;
  matchId: string;
  label?: string;
}

export function ExportButton({ jobId, matchId, label = 'Export PDF' }: ExportButtonProps) {
  const { exportPdf, loading, error } = usePdfExport();

  return (
    <div className="inline-flex flex-col gap-1">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportPdf(jobId, matchId)}
        loading={loading}
      >
        <FileDown className="mr-1.5 h-4 w-4" />
        {label}
      </Button>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
