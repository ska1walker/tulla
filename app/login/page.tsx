'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { useAuth, UserRole } from '@/contexts/auth-context';

export default function LoginPage() {
  const router = useRouter();
  const { role, isOffline, setRole } = useAuth();

  useEffect(() => {
    if (role) {
      router.push('/dashboard');
    }
  }, [role, router]);

  const handleLogin = (selectedRole: UserRole) => {
    setRole(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 p-4 font-sans selection:bg-rose-100 text-sm">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-stone-200 shadow-xl text-center">
        <div
          className={`w-20 h-20 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200 mx-auto mb-8 ${
            isOffline ? 'bg-stone-800' : 'bg-rose-500'
          }`}
        >
          <TulipLogo className="w-10 h-10 text-white" />
        </div>
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight text-stone-900">Willkommen</h1>
        <p className="text-stone-500 mb-8 font-medium italic">Liebevolle Kampagnensteuerung</p>
        <div className="space-y-4">
          <button
            onClick={() => handleLogin('admin')}
            className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98]"
          >
            {isOffline ? 'Offline Modus starten' : 'Anmelden'}
          </button>
          {!isOffline && (
            <button
              onClick={() => handleLogin('viewer')}
              className="w-full py-4 bg-white hover:bg-stone-50 text-stone-900 border border-stone-200 rounded-2xl font-bold transition-all"
            >
              Zuschauer-Modus
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
