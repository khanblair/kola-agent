'use client';

import { useState } from 'react';
import { SignOutButton, UserButton, useUser } from '@clerk/nextjs';

import { Menu, X, LogOut, Bell } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { routes } from '@/lib/constants/routes';

export function Navbar({
  onToggleSidebar,
  sidebarOpen,
}: {
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
}) {
  const { user } = useUser();
  const role = user?.publicMetadata?.role as string | undefined;

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        {/* Left — hamburger + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors focus-ring"
            aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 text-foreground" />
            )}
          </button>

          <a href={routes.dashboard} className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-lg font-semibold text-foreground tracking-tight hidden sm:inline">
              KolaAgent
            </span>
          </a>
        </div>

        {/* Right — notifications + user */}
        <div className="flex items-center gap-2">
          {role && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-50 text-primary-700 capitalize">
              {role}
            </span>
          )}

          <button
            className="relative p-2 rounded-lg hover:bg-neutral-100 transition-colors focus-ring"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5 text-foreground-muted" />
          </button>

          <div className="ml-1">
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-9 h-9 rounded-full',
                },
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
