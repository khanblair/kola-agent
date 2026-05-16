'use client';

import { useState } from 'react';
import { Show, RedirectToSignIn } from '@clerk/nextjs';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <Show when="signed-in">
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
      </Show>

      <Show when="signed-out">
        <RedirectToSignIn />
      </Show>
    </>
  );
}
