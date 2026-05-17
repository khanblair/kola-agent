'use client';

interface TimestampProps {
  date: string | Date;
  relative?: boolean;
}

export function Timestamp({ date, relative }: TimestampProps) {
  const d = typeof date === 'string' ? new Date(date) : date;

  if (relative) {
    return (
      <time dateTime={d.toISOString()} className="text-xs text-neutral-400">
        {formatRelative(d)}
      </time>
    );
  }

  return (
    <time dateTime={d.toISOString()} className="text-xs text-neutral-400">
      {d.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })}
    </time>
  );
}

function formatRelative(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHr = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHr / 24);

  if (diffSec < 60) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;

  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}
