'use client';

import { Alert } from '@/components/ui/alert';
import { Bell } from 'lucide-react';
import type { NotificationStatus } from '@/types/notification';

interface NotificationBannerProps {
  channel: string;
  status: NotificationStatus;
  recipientType: 'freelancer' | 'client';
  message?: string;
}

const statusLabels: Record<NotificationStatus, 'info' | 'success' | 'warning' | 'error'> = {
  pending: 'info',
  sent: 'success',
  delivered: 'success',
  failed: 'error',
};

export function NotificationBanner({
  channel,
  status,
  recipientType,
  message,
}: NotificationBannerProps) {
  return (
    <Alert variant={statusLabels[status]}>
      <div className="flex items-center gap-2">
        <Bell className="h-4 w-4 shrink-0" />
        <div>
          <p className="font-medium">
            {channel} notification to {recipientType}
          </p>
          <p className="text-xs capitalize opacity-80">Status: {status}</p>
          {message && <p className="mt-1 text-xs opacity-70">{message}</p>}
        </div>
      </div>
    </Alert>
  );
}
