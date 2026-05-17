'use client';

import { Button } from '@/components/ui/button';
import { Briefcase, FileText, Upload, Bell } from 'lucide-react';
import Link from 'next/link';

interface QuickAction {
  label: string;
  href: string;
  icon: typeof Briefcase;
}

const clientActions: QuickAction[] = [
  { label: 'New Job', href: '/jobs/new', icon: Briefcase },
  { label: 'My Jobs', href: '/dashboard/jobs', icon: FileText },
];

const freelancerActions: QuickAction[] = [
  { label: 'Upload CV', href: '/freelancer/upload-cv', icon: Upload },
  { label: 'My Profile', href: '/freelancer/profile', icon: FileText },
];

interface QuickActionsProps {
  role: 'client' | 'freelancer';
}

export function QuickActions({ role }: QuickActionsProps) {
  const actions = role === 'client' ? clientActions : freelancerActions;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-neutral-700">Quick Actions</h3>
      <div className="flex flex-wrap gap-2">
        {actions.map((a) => {
          const Icon = a.icon;
          return (
            <Link key={a.href} href={a.href}>
              <Button variant="outline" size="sm">
                <Icon className="mr-1.5 h-4 w-4" />
                {a.label}
              </Button>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
