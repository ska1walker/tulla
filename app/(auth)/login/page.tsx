'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { LoginForm } from '@/components/auth/login-form';
import { useAuth } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { userProfile, ready, isOffline } = useAuth();
  const [pendingInvitation, setPendingInvitation] = useState<string | null>(null);

  // Check for pending invitation token on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('pendingInvitationToken');
      if (token) {
        setPendingInvitation(token);
      }
    }
  }, []);

  useEffect(() => {
    if (ready && userProfile) {
      // Check if there's a pending invitation to accept
      if (pendingInvitation) {
        router.push(`/invite/accept?token=${pendingInvitation}`);
      } else {
        router.push('/projects');
      }
    }
  }, [ready, userProfile, pendingInvitation, router]);

  const handleSuccess = () => {
    // Check for pending invitation
    if (pendingInvitation) {
      router.push(`/invite/accept?token=${pendingInvitation}`);
    } else {
      router.push('/projects');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 p-4 font-sans selection:bg-rose-100 text-sm">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-stone-200 shadow-xl">
        <div className="text-center mb-8">
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200 mx-auto mb-6 ${
              isOffline ? 'bg-stone-800' : 'bg-rose-500'
            }`}
          >
            <TulipLogo className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Willkommen</h1>
          <p className="text-stone-500 mt-2 font-medium italic">Liebevolle Kampagnensteuerung</p>
        </div>

        {pendingInvitation && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-sm">
            Sie wurden zu einem Projekt eingeladen. Melden Sie sich an, um die Einladung anzunehmen.
          </div>
        )}

        <LoginForm onSuccess={handleSuccess} />

        {isOffline && (
          <p className="mt-6 text-center text-stone-400 text-xs">
            Sie sind offline. Bitte überprüfen Sie Ihre Internetverbindung.
          </p>
        )}
      </div>
    </div>
  );
}
