'use client';

import { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { ProjectRole } from '@/types';

interface InviteFormProps {
  onInvite: (email: string, role: ProjectRole) => Promise<void>;
  disabled?: boolean;
}

export function InviteForm({ onInvite, disabled }: InviteFormProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<ProjectRole>('editor');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!email.trim()) {
      setError('Bitte geben Sie eine E-Mail-Adresse ein.');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Bitte geben Sie eine gültige E-Mail-Adresse ein.');
      return;
    }

    setIsLoading(true);

    try {
      await onInvite(email.trim(), role);
      setEmail('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Fehler beim Senden der Einladung.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl text-green-600 text-sm">
          Einladung wurde erfolgreich gesendet!
        </div>
      )}

      <div className="flex gap-3">
        <div className="flex-1">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="E-Mail-Adresse eingeben..."
            className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
            disabled={isLoading || disabled}
          />
        </div>

        <select
          value={role}
          onChange={(e) => setRole(e.target.value as ProjectRole)}
          className="px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
          disabled={isLoading || disabled}
        >
          <option value="editor">Editor</option>
          <option value="viewer">Betrachter</option>
        </select>

        <button
          type="submit"
          disabled={isLoading || disabled}
          className="px-5 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Send className="w-4 h-4" />
              Einladen
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-stone-500">
        Die eingeladene Person erhält eine E-Mail mit einem Link zur Registrierung.
      </p>
    </form>
  );
}
