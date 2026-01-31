'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Users, Folder, Shield, Loader2 } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { UserMenu } from '@/components/ui/user-menu';
import { UserTable } from '@/components/admin/user-table';
import { ProjectTable } from '@/components/admin/project-table';
import { useAuth } from '@/contexts/auth-context';
import { useAdmin } from '@/hooks/use-admin';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { userProfile, user, ready } = useAuth();
  const {
    users,
    projects,
    loadingUsers,
    loadingProjects,
    isAdmin,
    toggleUserBan,
    toggleUserAdmin,
    deleteUser,
    deleteProject,
  } = useAdmin();

  const [activeTab, setActiveTab] = useState<'users' | 'projects'>('users');

  // Redirect non-admins
  useEffect(() => {
    if (ready && userProfile && !userProfile.isAdmin) {
      router.push('/projects');
    }
  }, [ready, userProfile, router]);

  // Show loading while checking admin status
  if (!ready || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  // Non-admin users
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="text-center">
          <Shield className="w-12 h-12 text-stone-300 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-stone-900 mb-2">Zugriff verweigert</h1>
          <p className="text-stone-500 mb-6">
            Sie haben keine Berechtigung, auf diese Seite zuzugreifen.
          </p>
          <Link
            href="/projects"
            className="inline-block px-6 py-3 bg-rose-500 text-white rounded-xl font-bold hover:bg-rose-600 transition-colors"
          >
            Zurück zu Projekten
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <TulipLogo className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">TULLA</h1>
          </Link>
          <span className="px-2 py-1 bg-rose-100 text-rose-700 rounded-lg text-xs font-bold">
            ADMIN
          </span>
        </div>
        <UserMenu />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-6">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zu Projekten
        </Link>

        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Admin Dashboard</h1>
          <p className="text-stone-500 mt-1">
            Verwalten Sie alle Benutzer und Projekte.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{users.length}</p>
                <p className="text-stone-500 text-sm">Registrierte Benutzer</p>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-600">
                <Folder className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-stone-900">{projects.length}</p>
                <p className="text-stone-500 text-sm">Projekte</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'users'
                  ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Benutzer ({users.length})
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'projects'
                  ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Folder className="w-4 h-4" />
              Projekte ({projects.length})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'users' && (
              <UserTable
                users={users}
                loading={loadingUsers}
                currentUserId={user?.uid}
                onToggleBan={toggleUserBan}
                onToggleAdmin={toggleUserAdmin}
                onDelete={deleteUser}
              />
            )}

            {activeTab === 'projects' && (
              <ProjectTable
                projects={projects}
                loading={loadingProjects}
                onDelete={deleteProject}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
