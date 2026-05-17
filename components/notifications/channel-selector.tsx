'use client';

import { cn } from '@/lib/utils/cn';
import { MessageCircle, Send } from 'lucide-react';
import type { NotificationChannel } from '@/types/notification';

interface ChannelSelectorProps {
  value: NotificationChannel;
  onChange: (channel: NotificationChannel) => void;
}

const channels: { value: NotificationChannel; label: string; icon: typeof MessageCircle }[] = [
  { value: 'telegram', label: 'Telegram', icon: MessageCircle },
  { value: 'whatsapp', label: 'WhatsApp', icon: Send },
];

export function ChannelSelector({ value, onChange }: ChannelSelectorProps) {
  return (
    <div className="flex gap-2">
      {channels.map((ch) => {
        const Icon = ch.icon;
        return (
          <button
            key={ch.value}
            type="button"
            onClick={() => onChange(ch.value)}
            className={cn(
              'flex items-center gap-2 rounded-lg border px-4 py-2 text-sm transition-colors',
              value === ch.value
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-neutral-200 text-neutral-600 hover:border-neutral-300',
            )}
          >
            <Icon className="h-4 w-4" />
            {ch.label}
          </button>
        );
      })}
    </div>
  );
}
