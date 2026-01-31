'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendPasswordReset } from '@/lib/firebase/auth';

export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim()) {
      setError('Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }

    setIsLoading(true);

    try {
      await sendPasswordReset(email.trim());
      setSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        switch (firebaseError.code) {
          case 'auth/user-not-found':
            setError('Kein Konto mit dieser E-Mail-Adresse gefunden.');
            break;
          case 'auth/invalid-email':
            setError('Ungültige E-Mail-Adresse.');
            break;
          default:
            setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle className="w-8 h-8 text-green-500" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">E-Mail gesendet</h2>
          <p className="text-stone-500">
            Wir haben Ihnen eine E-Mail mit Anweisungen zum Zurücksetzen Ihres Passworts gesendet.
          </p>
        </div>
        <p className="text-sm text-stone-400">
          Überprüfen Sie auch Ihren Spam-Ordner, falls Sie die E-Mail nicht finden.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-rose-500 hover:text-rose-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Anmeldung
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-stone-500 text-sm mb-6">
        Geben Sie Ihre E-Mail-Adresse ein und wir senden Ihnen einen Link zum Zurücksetzen Ihres Passworts.
      </p>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-stone-700 mb-2">
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          placeholder="name@beispiel.de"
          autoComplete="email"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-4 bg-stone-900 hover:bg-black text-white rounded-2xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Senden...
          </>
        ) : (
          'Link senden'
        )}
      </button>

      <p className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Anmeldung
        </Link>
      </p>
    </form>
  );
}
