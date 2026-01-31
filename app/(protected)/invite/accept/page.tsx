'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, CheckCircle, XCircle, Mail } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { useAuth } from '@/contexts/auth-context';
import { useAcceptInvitation } from '@/hooks/use-invitations';

function AcceptInvitationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { userProfile, ready } = useAuth();
  const { acceptInvitation, loading, error } = useAcceptInvitation();

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [projectId, setProjectId] = useState<string | null>(null);

  const token = searchParams.get('token');

  useEffect(() => {
    if (!ready) return;

    if (!token) {
      setStatus('error');
      return;
    }

    if (!userProfile) {
      // User needs to log in first
      // Store token in localStorage and redirect to login
      localStorage.setItem('pendingInvitationToken', token);
      router.push('/login');
      return;
    }

    // Accept the invitation
    const accept = async () => {
      const result = await acceptInvitation(token);

      if (result) {
        setProjectId(result.projectId);
        setStatus('success');

        // Clear any stored token
        localStorage.removeItem('pendingInvitationToken');

        // Redirect to project after 2 seconds
        setTimeout(() => {
          router.push(`/projects/${result.projectId}`);
        }, 2000);
      } else {
        setStatus('error');
      }
    };

    accept();
  }, [ready, token, userProfile, acceptInvitation, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-stone-200 shadow-xl text-center">
        <div className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200 mx-auto mb-8">
          <TulipLogo className="w-10 h-10 text-white" />
        </div>

        {status === 'loading' && (
          <div className="space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />
            <p className="text-stone-600">Einladung wird verarbeitet...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-2">
                Willkommen im Team!
              </h1>
              <p className="text-stone-500">
                Sie haben die Einladung erfolgreich angenommen.
              </p>
            </div>
            <p className="text-sm text-stone-400">
              Sie werden in Kürze weitergeleitet...
            </p>
            <Link
              href={`/projects/${projectId}`}
              className="inline-block text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              Jetzt zum Projekt
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 mb-2">
                Einladung fehlgeschlagen
              </h1>
              <p className="text-stone-500">
                {error || 'Die Einladung konnte nicht verarbeitet werden.'}
              </p>
            </div>
            <div className="space-y-3">
              <Link
                href="/projects"
                className="block w-full py-3 bg-stone-900 text-white rounded-xl font-bold hover:bg-black transition-colors"
              >
                Zu meinen Projekten
              </Link>
              <Link
                href="/login"
                className="block text-stone-500 hover:text-stone-700 transition-colors"
              >
                Erneut anmelden
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AcceptInvitationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      }
    >
      <AcceptInvitationContent />
    </Suspense>
  );
}
