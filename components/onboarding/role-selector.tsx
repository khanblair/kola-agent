'use client';

import { cn } from '@/lib/utils/cn';
import { Briefcase, Code } from 'lucide-react';
import type { UserRole } from '@/types/user';

interface RoleSelectorProps {
  value?: UserRole;
  onChange: (role: UserRole) => void;
}

const roles: { value: UserRole; label: string; description: string; icon: typeof Briefcase }[] = [
  {
    value: 'client',
    label: 'Client',
    description: 'Post project briefs, review proposals, and get matched autonomously with elite African freelancers.',
    icon: Briefcase,
  },
  {
    value: 'freelancer',
    label: 'Freelancer',
    description: 'Showcase your expertise, optimize your local rates, and get connected directly to matching projects.',
    icon: Code,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wider text-neutral-400">
        Choose your role to get started
      </label>
      <div className="flex flex-col gap-4">
        {roles.map((r) => {
          const Icon = r.icon;
          const isSelected = value === r.value;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => onChange(r.value)}
              className={cn(
                'flex items-start gap-4 rounded-2xl border p-5 text-left transition-all duration-300 focus-ring',
                isSelected
                  ? 'border-primary-500 bg-primary-50/40 shadow-sm ring-2 ring-primary-500/10 scale-[1.01]'
                  : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50/30'
              )}
            >
              <div
                className={cn(
                  'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-all duration-300',
                  isSelected
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-500'
                )}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1 min-w-0">
                <span className="block font-bold text-neutral-800 text-base leading-tight">
                  {r.label}
                </span>
                <span className="block mt-1.5 text-sm text-neutral-500 leading-normal">
                  {r.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

