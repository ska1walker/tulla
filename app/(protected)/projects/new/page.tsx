'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { UserMenu } from '@/components/ui/user-menu';
import { useProjects } from '@/hooks/use-projects';

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useProjects();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError('Bitte geben Sie einen Projektnamen ein.');
      return;
    }

    setIsLoading(true);

    try {
      const project = await createProject({
        name: name.trim(),
        description: description.trim() || undefined,
      });
      router.push(`/projects/${project.id}`);
    } catch (err) {
      console.error('Error creating project:', err);
      setError('Fehler beim Erstellen des Projekts. Bitte versuchen Sie es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg">
            <TulipLogo className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg tracking-tight"><span className="font-black text-stone-900">mai</span><span className="font-light text-rose-500 italic">flow</span></h1>
        </div>
        <UserMenu />
      </header>

      {/* Main Content */}
      <main className="max-w-xl mx-auto p-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu Projekten
        </Link>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl p-8">
          <h1 className="text-2xl font-bold text-stone-900 mb-2">Neues Projekt</h1>
          <p className="text-stone-500 mb-8">
            Erstellen Sie ein neues Projekt für Ihre Kampagnenplanung.
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Projektname *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                placeholder="z.B. Marketing 2026"
                disabled={isLoading}
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-stone-700 mb-2"
              >
                Beschreibung{' '}
                <span className="text-stone-400">(optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none"
                placeholder="Kurze Beschreibung des Projekts..."
                disabled={isLoading}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Link
                href="/projects"
                className="flex-1 py-3 px-4 border border-stone-200 rounded-xl font-medium text-stone-600 hover:bg-stone-50 transition-colors text-center"
              >
                Abbrechen
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 py-3 px-4 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Erstellen...
                  </>
                ) : (
                  'Projekt erstellen'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
