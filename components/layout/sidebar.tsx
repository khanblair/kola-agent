'use client';

import { usePathname } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  User,
  FileUp,
  Settings,
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { UserRole } from '@/types/user';

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    roles: ['client', 'freelancer'],
  },
  {
    label: 'Post a Job',
    href: '/jobs/new',
    icon: <PlusCircle className="w-5 h-5" />,
    roles: ['client'],
  },
  {
    label: 'My Jobs',
    href: '/dashboard/jobs',
    icon: <Briefcase className="w-5 h-5" />,
    roles: ['client'],
  },
  {
    label: 'My Profile',
    href: '/freelancer/profile',
    icon: <User className="w-5 h-5" />,
    roles: ['freelancer'],
  },
  {
    label: 'Upload CV',
    href: '/freelancer/upload-cv',
    icon: <FileUp className="w-5 h-5" />,
    roles: ['freelancer'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Settings className="w-5 h-5" />,
    roles: ['client', 'freelancer'],
  },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useUser();
  const role = user?.publicMetadata?.role as UserRole | undefined;

  const filteredItems = navItems.filter(
    (item) => !role || item.roles.includes(role),
  );

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-background border-r border-border transition-transform duration-200 ease-in-out lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <nav className="flex flex-col h-full px-3 py-4">
          <ul className="space-y-1 flex-1">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href + '/'));
              return (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors focus-ring',
                      isActive
                        ? 'bg-primary-50 text-primary-700'
                        : 'text-foreground-muted hover:bg-neutral-100 hover:text-foreground',
                    )}
                  >
                    <span
                      className={cn(
                        isActive ? 'text-primary-600' : 'text-foreground-muted',
                      )}
                    >
                      {item.icon}
                    </span>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Bottom section */}
          <div className="border-t border-border pt-3 mt-3">
            <div className="px-3 py-2">
              <p className="text-xs text-foreground-muted">
                Kolaborate Agent Economy
              </p>
              <p className="text-xs text-foreground-muted mt-0.5">
                Hackathon 2026
              </p>
            </div>
          </div>
        </nav>
      </aside>
    </>
  );
}
