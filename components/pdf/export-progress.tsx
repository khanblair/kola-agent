'use client';

import { Progress } from '@/components/ui/progress';

interface ExportProgressProps {
  stage: 'preparing' | 'generating' | 'downloading' | 'done';
  progress: number;
}

const stageLabels: Record<ExportProgressProps['stage'], string> = {
  preparing: 'Preparing document...',
  generating: 'Generating PDF...',
  downloading: 'Downloading...',
  done: 'Export complete!',
};

export function ExportProgress({ stage, progress }: ExportProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="text-neutral-600">{stageLabels[stage]}</span>
        <span className="text-neutral-400">{Math.round(progress)}%</span>
      </div>
      <Progress value={progress} />
    </div>
  );
}
