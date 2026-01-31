'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { userProfile, ready, isLoading } = useAuth();

  useEffect(() => {
    if (ready && !userProfile && !isLoading) {
      router.push('/login');
    }
  }, [ready, userProfile, isLoading, router]);

  // Show loading state while checking auth
  if (!ready || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Redirect if not authenticated
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return <>{children}</>;
}
