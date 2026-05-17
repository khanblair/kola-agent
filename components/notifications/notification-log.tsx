'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell } from 'lucide-react';

interface NotificationEntry {
  id: string;
  channel: string;
  recipientType: string;
  status: string;
  message: string;
  createdAt: string;
}

interface NotificationLogProps {
  notifications: NotificationEntry[];
}

export function NotificationLog({ notifications }: NotificationLogProps) {
  if (!notifications.length) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-neutral-300 py-8 text-center">
        <Bell className="mb-2 h-6 w-6 text-neutral-300" />
        <p className="text-sm text-neutral-400">No notifications sent yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-700">Notification Log</h3>
      <ScrollArea className="max-h-[300px]">
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-lg border border-neutral-200 px-3 py-2 text-sm"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-700 capitalize">
                  {n.recipientType} via {n.channel}
                </span>
                <span
                  className={`text-xs font-medium ${
                    n.status === 'sent' || n.status === 'delivered'
                      ? 'text-green-600'
                      : n.status === 'failed'
                        ? 'text-red-600'
                        : 'text-neutral-400'
                  }`}
                >
                  {n.status}
                </span>
              </div>
              <p className="mt-0.5 text-xs text-neutral-500 line-clamp-2">{n.message}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
