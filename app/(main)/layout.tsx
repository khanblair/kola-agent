'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Show, RedirectToSignIn, useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { ClerkSync } from '@/components/clerk-sync';

function OnboardingGuard() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;
    // Don't redirect if already on onboarding or auth pages
    if (pathname === '/onboarding') return;
    // If the user has no role metadata set, they haven't onboarded yet
    if (!user?.publicMetadata?.role) {
      router.replace('/onboarding');
    }
  }, [isLoaded, isSignedIn, user, router, pathname]);

  return null;
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      <Show when="signed-in">
        <ClerkSync />
        <OnboardingGuard />
        {pathname === '/onboarding' ? (
          <main className="relative min-h-screen bg-neutral-50 flex items-center justify-center p-4 overflow-hidden">
            {/* Ambient background glows */}
            <div className="absolute -left-1/4 -top-1/4 w-[500px] h-[500px] rounded-full bg-primary-100/40 blur-3xl opacity-70 pointer-events-none" />
            <div className="absolute -right-1/4 -bottom-1/4 w-[500px] h-[500px] rounded-full bg-accent-100/30 blur-3xl opacity-60 pointer-events-none" />
            
            <div className="relative w-full z-10">{children}</div>
          </main>
        ) : (
          <>
            <Navbar
              onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
              sidebarOpen={sidebarOpen}
            />
            <Sidebar
              open={sidebarOpen}
              onClose={() => setSidebarOpen(false)}
            />
            <main className="lg:pl-64 min-h-[calc(100vh-4rem)]">
              <div className="py-6">{children}</div>
            </main>
          </>
        )}
      </Show>

      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
