import type { UserRole } from '@/types/user';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  roles: UserRole[];
}

export const sidebarNav: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'LayoutDashboard',
    roles: ['client', 'freelancer'],
  },
  {
    label: 'Post a Job',
    href: '/jobs/new',
    icon: 'PlusCircle',
    roles: ['client'],
  },
  {
    label: 'My Jobs',
    href: '/dashboard/jobs',
    icon: 'Briefcase',
    roles: ['client'],
  },
  {
    label: 'My Profile',
    href: '/freelancer/profile',
    icon: 'User',
    roles: ['freelancer'],
  },
  {
    label: 'Upload CV',
    href: '/freelancer/upload-cv',
    icon: 'FileUp',
    roles: ['freelancer'],
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
    roles: ['client', 'freelancer'],
  },
];

export const publicNav = [
  { label: 'Sign In', href: '/sign-in' },
  { label: 'Sign Up', href: '/sign-up' },
] as const;
