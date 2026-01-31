'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { role, ready } = useAuth();

  useEffect(() => {
    if (ready && !role) {
      router.push('/login');
    }
  }, [role, ready, router]);

  if (!ready) {
    return (
      <div className="h-screen flex items-center justify-center text-stone-300 font-bold uppercase tracking-widest text-[10px]">
        Lade TULLA Architektur...
      </div>
    );
  }

  if (!role) {
    return null;
  }

  return <>{children}</>;
}
