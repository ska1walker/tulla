'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { userProfile, currentProject, ready } = useAuth();

  useEffect(() => {
    if (ready) {
      if (!userProfile) {
        // Not logged in - redirect to login
        router.push('/login');
      } else if (currentProject) {
        // Has current project - redirect to project dashboard
        router.push(`/projects/${currentProject.id}`);
      } else {
        // No current project - redirect to project list
        router.push('/projects');
      }
    }
  }, [ready, userProfile, currentProject, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50">
      <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
    </div>
  );
}
