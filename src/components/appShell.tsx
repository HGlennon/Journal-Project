// components/AppShell.tsx
'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/components/sidebar/sidebar';
import SidebarNavigation from '@/components/sidebar/sidebarNavigation';
import LoadingScreen from '@/components/loadingScreen';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { status } = useSession();
  const hasResolvedOnce = useRef(false);

  useEffect(() => {
    if (status !== 'loading') hasResolvedOnce.current = true;
  }, [status]);

  if (status === 'loading' && !hasResolvedOnce.current) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex h-screen w-full">
      <Sidebar>
        <SidebarNavigation />
      </Sidebar>
      <main className="flex-1 overflow-auto px-4 py-8 bg-main-background">
        {children}
      </main>
    </div>
  );
}
