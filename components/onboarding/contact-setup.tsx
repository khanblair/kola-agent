'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { MessageCircle, Send } from 'lucide-react';
import type { NotificationPreference } from '@/types/user';

interface ContactSetupProps {
  onSubmit: (data: { telegramChatId?: string; whatsappNumber?: string; preference: NotificationPreference }) => void;
  loading?: boolean;
}

export function ContactSetup({ onSubmit, loading }: ContactSetupProps) {
  const [telegram, setTelegram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preference, setPreference] = useState<NotificationPreference>('telegram');

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-semibold text-neutral-800">Notification Setup</h3>
        <p className="mt-0.5 text-sm text-neutral-500">
          Choose how you want to receive agent notifications.
        </p>
      </div>

      <div className="space-y-3">
        <div className="space-y-1.5">
          <Label htmlFor="telegram">Telegram Chat ID</Label>
          <div className="relative">
            <MessageCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="telegram"
              placeholder="e.g. @yourusername or chat ID"
              value={telegram}
              onChange={(e) => setTelegram(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="whatsapp">WhatsApp Number</Label>
          <div className="relative">
            <Send className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <Input
              id="whatsapp"
              placeholder="+256 700 000 000"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Preferred channel</Label>
          <div className="flex gap-2">
            {(['telegram', 'whatsapp', 'both'] as const).map((ch) => (
              <button
                key={ch}
                type="button"
                onClick={() => setPreference(ch)}
                className={`rounded-lg border px-3 py-1.5 text-sm capitalize transition-colors ${
                  preference === ch
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      <Button
        onClick={() =>
          onSubmit({
            telegramChatId: telegram || undefined,
            whatsappNumber: whatsapp || undefined,
            preference,
          })
        }
        loading={loading}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}
