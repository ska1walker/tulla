'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import { deleteUserAccount } from '@/lib/firebase/auth';
import { useAuth } from '@/contexts/auth-context';

interface DeleteAccountModalProps {
  onClose: () => void;
}

export function DeleteAccountModal({ onClose }: DeleteAccountModalProps) {
  const router = useRouter();
  const { userProfile } = useAuth();
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expectedConfirmation = 'LÖSCHEN';
  const isConfirmed = confirmation === expectedConfirmation;

  const handleDelete = async () => {
    if (!isConfirmed) return;

    setIsDeleting(true);
    setError(null);

    try {
      await deleteUserAccount();
      // Redirect to landing page after deletion
      router.push('/?deleted=true');
    } catch (err: unknown) {
      console.error('Error deleting account:', err);

      // Check for specific Firebase errors
      if (err && typeof err === 'object' && 'code' in err) {
        const firebaseError = err as { code: string };
        switch (firebaseError.code) {
          case 'auth/requires-recent-login':
            setError(
              'Aus Sicherheitsgründen müssen Sie sich erneut anmelden, bevor Sie Ihr Konto löschen können. Bitte melden Sie sich ab und wieder an.'
            );
            break;
          default:
            setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
        }
      } else {
        setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.');
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="bg-red-50 border-b border-red-100 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-red-900">Konto löschen</h2>
              <p className="text-sm text-red-700 mt-1">
                Diese Aktion kann nicht rückgängig gemacht werden.
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="p-2 text-red-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-sm text-stone-600 space-y-3">
            <p>
              Wenn Sie Ihr Konto löschen, werden <strong>unwiderruflich</strong> gelöscht:
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-500">
              <li>Ihr Benutzerprofil und alle persönlichen Daten</li>
              <li>Alle Projekte, die Sie erstellt haben</li>
              <li>Alle Kampagnen, Kanäle und Einstellungen dieser Projekte</li>
              <li>Ihre Mitgliedschaften in anderen Projekten</li>
            </ul>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <div className="pt-2">
            <label className="block text-sm font-medium text-stone-700 mb-2">
              Zur Bestätigung tippen Sie <span className="font-mono font-bold text-red-600">LÖSCHEN</span>
            </label>
            <input
              type="text"
              value={confirmation}
              onChange={(e) => setConfirmation(e.target.value.toUpperCase())}
              placeholder="LÖSCHEN"
              disabled={isDeleting}
              className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all font-mono uppercase tracking-widest disabled:opacity-50"
              autoComplete="off"
            />
          </div>

          {userProfile && (
            <p className="text-xs text-stone-400 text-center">
              Konto: {userProfile.email}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-stone-100 p-4 flex gap-3">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="flex-1 px-4 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium rounded-xl transition-colors disabled:opacity-50"
          >
            Abbrechen
          </button>
          <button
            onClick={handleDelete}
            disabled={!isConfirmed || isDeleting}
            className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Löschen...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Endgültig löschen
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
