'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { useConvexUser } from '@/hooks/use-convex-user';
import { api } from '@/convex/_generated/api';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/layout/section';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import {
  Bell,
  MessageCircle,
  Send,
  User,
  Shield,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import type { NotificationPreference } from '@/types/user';

export default function SettingsPage() {
  const { user: clerkUser } = useUser();
  const { convexUser, isLoaded } = useConvexUser();

  const [telegram, setTelegram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [preference, setPreference] = useState<NotificationPreference>('telegram');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingTelegram, setTestingTelegram] = useState(false);
  const [testingWhatsapp, setTestingWhatsapp] = useState(false);
  const [testResult, setTestResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Sync state when convex user loaded
  useEffect(() => {
    if (convexUser) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTelegram(convexUser.telegramChatId ?? '');
      setWhatsapp(convexUser.whatsappNumber ?? '');
      setPreference((convexUser.notificationPreference as NotificationPreference) ?? 'telegram');
    }
  }, [convexUser]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);
    setTestResult(null);

    try {
      const res = await fetch('/api/user/notification-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          preference,
          telegramChatId: telegram || undefined,
          whatsappNumber: whatsapp || undefined,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to update settings');
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch {
      setTestResult({
        type: 'error',
        message: 'Could not update notification settings. Please try again.',
      });
    } finally {
      setSaving(false);
    }
  };

  const testTelegram = async () => {
    if (!telegram) {
      setTestResult({
        type: 'error',
        message: 'Please save a Telegram Chat ID first to run a test.',
      });
      return;
    }

    setTestingTelegram(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/notify/telegram', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chatId: telegram,
          message: '🔔 *KolaAgent Notification Test*\n\nYour Telegram integration is working perfectly!',
        }),
      });

      const body = await res.json();
      if (res.ok && body.data?.delivered) {
        setTestResult({
          type: 'success',
          message: 'Telegram test message sent successfully! Check your Telegram app.',
        });
      } else {
        setTestResult({
          type: 'error',
          message: body.error || 'Telegram delivery failed. Ensure you started the bot @KolaAgentBot.',
        });
      }
    } catch {
      setTestResult({
        type: 'error',
        message: 'Failed to trigger Telegram test request.',
      });
    } finally {
      setTestingTelegram(false);
    }
  };

  const testWhatsapp = async () => {
    if (!whatsapp) {
      setTestResult({
        type: 'error',
        message: 'Please save a WhatsApp Number first to run a test.',
      });
      return;
    }

    setTestingWhatsapp(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/notify/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipient: whatsapp,
          message: '🔔 *KolaAgent Notification Test*\n\nYour WhatsApp integration is working perfectly!',
        }),
      });

      const body = await res.json();
      if (res.ok && body.data?.delivered) {
        setTestResult({
          type: 'success',
          message: 'WhatsApp test message sent successfully! Check your phone.',
        });
      } else {
        setTestResult({
          type: 'error',
          message: body.error || 'WhatsApp delivery failed. Verify the recipient number structure.',
        });
      }
    } catch {
      setTestResult({
        type: 'error',
        message: 'Failed to trigger WhatsApp test request.',
      });
    } finally {
      setTestingWhatsapp(false);
    }
  };

  if (!clerkUser || !isLoaded || !convexUser) {
    return (
      <div className="flex items-center justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  const role = convexUser?.role ?? 'client';

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account info, credentials, and notification channels."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Account Profile card */}
        <div className="space-y-6">
          <Section title="Account Profile" description="Your authenticated identity.">
            <div className="flex flex-col items-center text-center p-4">
              <div className="relative h-20 w-20 rounded-full border border-neutral-100 shadow-sm overflow-hidden bg-neutral-50 mb-4">
                {clerkUser.imageUrl ? (
                  <img
                    src={clerkUser.imageUrl}
                    alt={clerkUser.fullName ?? 'User'}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <User className="h-10 w-10 text-neutral-400 absolute inset-0 m-auto" />
                )}
              </div>
              <h3 className="text-base font-bold text-foreground">
                {clerkUser.fullName ?? 'Kola User'}
              </h3>
              <p className="text-sm text-foreground-muted">
                {clerkUser.primaryEmailAddress?.emailAddress}
              </p>

              <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold uppercase tracking-wider">
                <Shield className="w-3.5 h-3.5" />
                {role} Account
              </div>
            </div>
          </Section>
        </div>

        {/* Right Column: Settings configuration form */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave}>
            <Section
              title="Notification Settings"
              description="Configure how you receive notifications about matching freelancers, jobs, and proposals."
            >
              {saveSuccess && (
                <div className="rounded-xl border border-green-200 bg-green-50/50 p-4 mb-4 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-green-800">Settings Saved</h4>
                    <p className="text-sm text-green-700 mt-0.5">
                      Your notification credentials and preferences were updated successfully in the database.
                    </p>
                  </div>
                </div>
              )}

              {testResult && (
                <div
                  className={`rounded-xl border p-4 mb-4 flex items-start gap-3 ${
                    testResult.type === 'success'
                      ? 'border-green-200 bg-green-50/50 text-green-800'
                      : 'border-red-200 bg-red-50/50 text-red-800'
                  }`}
                >
                  {testResult.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <h4 className="text-sm font-semibold">
                      {testResult.type === 'success' ? 'Test Succeeded' : 'Test Failed'}
                    </h4>
                    <p className="text-sm mt-0.5">{testResult.message}</p>
                  </div>
                </div>
              )}

              <div className="space-y-5">
                {/* Telegram input */}
                <div className="space-y-1.5">
                  <Label htmlFor="telegram" className="text-neutral-700">
                    Telegram Chat ID
                  </Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="telegram"
                      placeholder="e.g. @yourusername or chat ID"
                      value={telegram}
                      onChange={(e) => setTelegram(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                  <p className="text-xs text-neutral-400">
                    To receive Telegram alerts, search for <strong>@KolaAgentBot</strong> in Telegram, start a chat, and enter your Chat ID or username here.
                  </p>
                </div>

                {/* WhatsApp input */}
                <div className="space-y-1.5">
                  <Label htmlFor="whatsapp" className="text-neutral-700">
                    WhatsApp Number
                  </Label>
                  <div className="relative">
                    <Send className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <Input
                      id="whatsapp"
                      placeholder="+256 700 000 000"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="pl-10 text-sm"
                    />
                  </div>
                  <p className="text-xs text-neutral-400">
                    Input your WhatsApp number in international format, e.g. <code>+256 700 000 000</code>.
                  </p>
                </div>

                {/* Preference radio buttons */}
                <div className="space-y-2">
                  <Label className="text-neutral-700">Preferred Channel</Label>
                  <div className="flex flex-wrap gap-2">
                    {(['telegram', 'whatsapp', 'both'] as const).map((ch) => (
                      <button
                        key={ch}
                        type="button"
                        onClick={() => setPreference(ch)}
                        className={`rounded-xl border px-4 py-2 text-sm capitalize font-medium transition-all ${
                          preference === ch
                            ? 'border-primary-600 bg-primary-50 text-primary-700 shadow-sm shadow-primary-100'
                            : 'border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:bg-neutral-50'
                        }`}
                      >
                        {ch === 'both' ? 'Both Channels' : ch}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button and test actions */}
                <div className="border-t border-border pt-4 mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <Button type="submit" loading={saving} className="px-6">
                    Save Changes
                  </Button>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={testTelegram}
                      disabled={testingTelegram || !telegram}
                      loading={testingTelegram}
                      className="text-xs"
                    >
                      Test Telegram
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={testWhatsapp}
                      disabled={testingWhatsapp || !whatsapp}
                      loading={testingWhatsapp}
                      className="text-xs"
                    >
                      Test WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </Section>
          </form>
        </div>
      </div>
    </div>
  );
}
