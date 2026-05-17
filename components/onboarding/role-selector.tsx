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
    description: 'Post jobs, get matched with freelancers',
    icon: Briefcase,
  },
  {
    value: 'freelancer',
    label: 'Freelancer',
    description: 'Showcase skills, get matched to projects',
    icon: Code,
  },
];

export function RoleSelector({ value, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-neutral-700">
        I am a...
      </label>
      <div className="grid grid-cols-2 gap-3">
        {roles.map((r) => {
          const Icon = r.icon;
          return (
            <button
              key={r.value}
              type="button"
              onClick={() => onChange(r.value)}
              className={cn(
                'flex flex-col items-center gap-2 rounded-xl border-2 p-5 transition-colors',
                value === r.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-neutral-200 bg-white hover:border-neutral-300',
              )}
            >
              <Icon
                className={cn(
                  'h-8 w-8',
                  value === r.value ? 'text-primary-600' : 'text-neutral-400',
                )}
              />
              <span className="font-medium text-neutral-800">{r.label}</span>
              <span className="text-xs text-neutral-500">{r.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
