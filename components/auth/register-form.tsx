'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

interface RegisterFormProps {
  onSuccess?: () => void;
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { register, isLoading, error, clearError } = useAuth();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError(null);

    if (!email.trim()) {
      setLocalError('Bitte geben Sie Ihre E-Mail-Adresse ein.');
      return;
    }

    if (!password) {
      setLocalError('Bitte geben Sie ein Passwort ein.');
      return;
    }

    if (password.length < 6) {
      setLocalError('Das Passwort muss mindestens 6 Zeichen lang sein.');
      return;
    }

    if (password !== confirmPassword) {
      setLocalError('Die Passwörter stimmen nicht überein.');
      return;
    }

    try {
      await register({
        email: email.trim(),
        password,
        displayName: displayName.trim() || undefined,
      });
      onSuccess?.();
    } catch {
      // Error is handled by context
    }
  };

  const displayError = localError || error;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {displayError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {displayError}
        </div>
      )}

      <div>
        <label htmlFor="displayName" className="block text-sm font-medium text-stone-700 mb-2">
          Name <span className="text-stone-400">(optional)</span>
        </label>
        <input
          id="displayName"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          placeholder="Max Mustermann"
          autoComplete="name"
          disabled={isLoading}
        />
      </div>

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

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-stone-700 mb-2">
          Passwort
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 pr-12 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            placeholder="Mindestens 6 Zeichen"
            autoComplete="new-password"
            disabled={isLoading}
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
          autoComplete="new-password"
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
            Registrieren...
          </>
        ) : (
          'Konto erstellen'
        )}
      </button>

      <p className="text-center text-stone-500 text-sm">
        Bereits ein Konto?{' '}
        <Link href="/login" className="text-rose-500 hover:text-rose-600 font-medium transition-colors">
          Anmelden
        </Link>
      </p>
    </form>
  );
}
