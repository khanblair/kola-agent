'use client';

import { ScrollArea } from '@/components/ui/scroll-area';

interface ActivityEntry {
  id: string;
  description: string;
  timestamp: string;
  type: 'job' | 'match' | 'proposal' | 'notification';
}

interface RecentActivityProps {
  activities: ActivityEntry[];
}

const typeColors: Record<ActivityEntry['type'], string> = {
  job: 'bg-blue-100 text-blue-700',
  match: 'bg-green-100 text-green-700',
  proposal: 'bg-purple-100 text-purple-700',
  notification: 'bg-amber-100 text-amber-700',
};

export function RecentActivity({ activities }: RecentActivityProps) {
  if (!activities.length) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-neutral-400">No recent activity</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-700">Recent Activity</h3>
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-2">
          {activities.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-lg border border-neutral-200 px-3 py-2.5">
              <span className={`mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-xs font-medium capitalize ${typeColors[a.type]}`}>
                {a.type}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm text-neutral-700">{a.description}</p>
                <p className="text-xs text-neutral-400">
                  {new Date(a.timestamp).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
