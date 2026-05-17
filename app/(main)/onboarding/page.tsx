'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { RoleSelector } from '@/components/onboarding/role-selector';
import { ContactSetup } from '@/components/onboarding/contact-setup';
import { OnboardingSteps } from '@/components/onboarding/onboarding-steps';
import { Button } from '@/components/ui/button';
import type { UserRole, NotificationPreference } from '@/types/user';
import { routes } from '@/lib/constants/routes';

const steps = [
  { id: 'role', label: 'Role' },
  { id: 'contact', label: 'Contact' },
  { id: 'done', label: 'Done' },
];

export default function OnboardingPage() {
  const { user } = useUser();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [role, setRole] = useState<UserRole | undefined>(
    (user?.publicMetadata?.role as UserRole) ?? undefined,
  );
  const [saving, setSaving] = useState(false);

  const handleRoleNext = async () => {
    if (!role) return;
    setSaving(true);
    try {
      await fetch('/api/user/role', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      setCurrentStep(1);
    } catch {
      // Continue anyway
      setCurrentStep(1);
    } finally {
      setSaving(false);
    }
  };

  const handleContactSubmit = async (data: {
    telegramChatId?: string;
    whatsappNumber?: string;
    preference: NotificationPreference;
  }) => {
    setSaving(true);
    try {
      await fetch('/api/user/notification-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch {
      // Continue anyway
    } finally {
      setSaving(false);
      setCurrentStep(2);
    }
  };

  const handleFinish = () => {
    router.push(routes.dashboard);
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-8 sm:py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-neutral-900">Welcome to KolaAgent</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Let&apos;s set up your account in a few quick steps.
        </p>
      </div>

      <div className="mb-8">
        <OnboardingSteps steps={steps} currentStep={currentStep} />
      </div>

      <div className="rounded-xl border border-neutral-200 bg-white p-5 sm:p-6 shadow-sm">
        {currentStep === 0 && (
          <div className="space-y-5">
            <RoleSelector value={role} onChange={setRole} />
            <Button
              onClick={handleRoleNext}
              disabled={!role}
              loading={saving}
              className="w-full"
            >
              Continue
            </Button>
          </div>
        )}

        {currentStep === 1 && (
          <ContactSetup onSubmit={handleContactSubmit} loading={saving} />
        )}

        {currentStep === 2 && (
          <div className="flex flex-col items-center gap-4 py-6 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-neutral-800">You&apos;re all set!</h2>
            <p className="text-sm text-neutral-500">
              Your account is configured. Let&apos;s get started.
            </p>
            <Button onClick={handleFinish} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
