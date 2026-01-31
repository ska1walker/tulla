'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { applyActionCode, verifyPasswordResetCode, confirmPasswordReset } from 'firebase/auth';
import { Loader2, CheckCircle, XCircle, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { getFirebaseAuth } from '@/lib/firebase/config';

function AuthActionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'reset-password' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [oobCode, setOobCode] = useState<string | null>(null);

  const mode = searchParams.get('mode');
  const actionCode = searchParams.get('oobCode');

  useEffect(() => {
    if (!actionCode) {
      setStatus('error');
      setErrorMessage('Ungültiger oder fehlender Aktionscode.');
      return;
    }

    setOobCode(actionCode);

    const handleAction = async () => {
      const auth = getFirebaseAuth();

      try {
        switch (mode) {
          case 'resetPassword':
            // Verify the password reset code is valid
            await verifyPasswordResetCode(auth, actionCode);
            setStatus('reset-password');
            break;

          case 'verifyEmail':
            // Apply the email verification code
            await applyActionCode(auth, actionCode);
            setStatus('success');
            setTimeout(() => router.push('/login'), 3000);
            break;

          case 'recoverEmail':
            // Apply the email recovery code
            await applyActionCode(auth, actionCode);
            setStatus('success');
            setTimeout(() => router.push('/login'), 3000);
            break;

          default:
            setStatus('error');
            setErrorMessage('Unbekannte Aktion.');
        }
      } catch (err: unknown) {
        setStatus('error');
        if (err && typeof err === 'object' && 'code' in err) {
          const firebaseError = err as { code: string };
          switch (firebaseError.code) {
            case 'auth/expired-action-code':
              setErrorMessage('Dieser Link ist abgelaufen. Bitte fordern Sie einen neuen an.');
              break;
            case 'auth/invalid-action-code':
              setErrorMessage('Dieser Link ist ungültig. Möglicherweise wurde er bereits verwendet.');
              break;
            default:
              setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
          }
        } else {
          setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      }
    };

    handleAction();
  }, [mode, actionCode, router]);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      setErrorMessage('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('Die Passwörter stimmen nicht überein.');
      return;
    }

    if (!oobCode) {
      setErrorMessage('Ungültiger Aktionscode.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const auth = getFirebaseAuth();
      await confirmPasswordReset(auth, oobCode, newPassword);
      setStatus('success');
      setTimeout(() => router.push('/login'), 3000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        switch (firebaseError.code) {
          case 'auth/expired-action-code':
            setErrorMessage('Dieser Link ist abgelaufen. Bitte fordern Sie einen neuen an.');
            break;
          case 'auth/weak-password':
            setErrorMessage('Das Passwort ist zu schwach.');
            break;
          default:
            setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      } else {
        setErrorMessage('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 text-stone-900 p-4 font-sans selection:bg-rose-100 text-sm">
      <div className="max-w-md w-full bg-white p-10 rounded-3xl border border-stone-200 shadow-xl">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-rose-500 rounded-3xl flex items-center justify-center shadow-lg shadow-rose-200 mx-auto mb-6">
            <TulipLogo className="w-10 h-10 text-white" />
          </div>
        </div>

        {status === 'loading' && (
          <div className="text-center space-y-4">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-rose-500" />
            <p className="text-stone-500">Wird verarbeitet...</p>
          </div>
        )}

        {status === 'reset-password' && (
          <div className="space-y-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-stone-900">Neues Passwort</h1>
              <p className="text-stone-500 mt-2">Geben Sie Ihr neues Passwort ein.</p>
            </div>

            {errorMessage && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-stone-700 mb-2">
                  Neues Passwort
                </label>
                <div className="relative">
                  <input
                    id="newPassword"
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                    placeholder="Mindestens 6 Zeichen"
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-stone-700 mb-2">
                  Passwort bestätigen
                </label>
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                  placeholder="Passwort wiederholen"
                  disabled={isSubmitting}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Speichern...
                  </>
                ) : (
                  'Passwort ändern'
                )}
              </button>
            </form>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">Erfolgreich</h2>
              <p className="text-stone-500">
                {mode === 'resetPassword'
                  ? 'Ihr Passwort wurde erfolgreich geändert.'
                  : mode === 'verifyEmail'
                  ? 'Ihre E-Mail-Adresse wurde bestätigt.'
                  : 'Die Aktion wurde erfolgreich ausgeführt.'}
              </p>
            </div>
            <p className="text-sm text-stone-400">
              Sie werden in Kürze weitergeleitet...
            </p>
            <Link
              href="/login"
              className="inline-block text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              Jetzt zur Anmeldung
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center space-y-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-stone-900 mb-2">Fehler</h2>
              <p className="text-stone-500">{errorMessage}</p>
            </div>
            <Link
              href="/login"
              className="inline-block text-rose-500 hover:text-rose-600 font-medium transition-colors"
            >
              Zurück zur Anmeldung
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-stone-50">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
        </div>
      }
    >
      <AuthActionContent />
    </Suspense>
  );
}
