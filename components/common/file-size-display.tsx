'use client';

interface FileSizeDisplayProps {
  bytes: number;
}

export function FileSizeDisplay({ bytes }: FileSizeDisplayProps) {
  const formatted = formatFileSize(bytes);
  return <span className="text-xs text-neutral-500">{formatted}</span>;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  const size = bytes / Math.pow(1024, i);
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
}
