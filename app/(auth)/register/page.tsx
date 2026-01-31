'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { RegisterForm } from '@/components/auth/register-form';
import { useAuth } from '@/contexts/auth-context';

export default function RegisterPage() {
  const router = useRouter();
  const { userProfile, ready, isOffline } = useAuth();

  useEffect(() => {
    if (ready && userProfile) {
      router.push('/projects');
    }
  }, [ready, userProfile, router]);

  const handleSuccess = () => {
    router.push('/projects');
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
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">Konto erstellen</h1>
          <p className="text-stone-500 mt-2 font-medium italic">Liebevolle Kampagnensteuerung</p>
        </div>

        <RegisterForm onSuccess={handleSuccess} />

        {isOffline && (
          <p className="mt-6 text-center text-stone-400 text-xs">
            Sie sind offline. Die Registrierung erfordert eine Internetverbindung.
          </p>
        )}
      </div>
    </div>
  );
}
