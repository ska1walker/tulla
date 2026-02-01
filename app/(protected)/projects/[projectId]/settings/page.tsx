'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2, Users, Settings, Save } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { UserMenu } from '@/components/ui/user-menu';
import { MemberList } from '@/components/projects/member-list';
import { InviteForm } from '@/components/projects/invite-form';
import { useAuth } from '@/contexts/auth-context';
import { useProjects } from '@/hooks/use-projects';
import { useProjectMembers } from '@/hooks/use-project-members';
import { useInvitations } from '@/hooks/use-invitations';
import { usePermissions } from '@/hooks/use-permissions';
import { ProjectRole } from '@/types';

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { currentProject, setCurrentProject } = useAuth();
  const { projects, loading: projectsLoading, updateProject, deleteProject } = useProjects();
  const { members, loading: membersLoading, updateMemberRole, removeMember } = useProjectMembers(projectId);
  const { createInvitation } = useInvitations(projectId);
  const { canEditProject, canDeleteProject, canManageMembers, canInviteMembers } = usePermissions(projectId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'members'>('general');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Load project data
  useEffect(() => {
    if (!projectsLoading && projects.length > 0) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setName(project.name);
        setDescription(project.description || '');
        if (!currentProject || currentProject.id !== projectId) {
          setCurrentProject(project, project.role);
        }
      } else {
        router.push('/projects');
      }
    }
  }, [projectId, projects, projectsLoading, currentProject, setCurrentProject, router]);

  const handleSave = async () => {
    if (!canEditProject) return;

    setIsSaving(true);
    try {
      await updateProject(projectId, {
        name: name.trim(),
        description: description.trim() || undefined,
      });
    } catch (err) {
      console.error('Error updating project:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canDeleteProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      router.push('/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInvite = async (email: string, role: ProjectRole) => {
    await createInvitation({ email, role });
  };

  const handleUpdateRole = async (userId: string, role: ProjectRole) => {
    await updateMemberRole(userId, role);
  };

  const handleRemoveMember = async (userId: string) => {
    await removeMember(userId);
  };

  if (projectsLoading || !currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
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
            <h1 className="text-lg font-bold tracking-tight">maiflo</h1>
          </Link>
        </div>
        <UserMenu />
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Projekt
        </Link>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-stone-200">
            <button
              onClick={() => setActiveTab('general')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'general'
                  ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              Allgemein
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`flex-1 px-6 py-4 font-medium transition-colors flex items-center justify-center gap-2 ${
                activeTab === 'members'
                  ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50'
                  : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
              }`}
            >
              <Users className="w-4 h-4" />
              Mitglieder ({members.length})
            </button>
          </div>

          <div className="p-8">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">
                    Projekteinstellungen
                  </h2>
                  <p className="text-stone-500">
                    Bearbeiten Sie die grundlegenden Informationen des Projekts.
                  </p>
                </div>

                <div className="space-y-4">
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
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all disabled:opacity-50"
                      disabled={!canEditProject || isSaving}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-stone-700 mb-2"
                    >
                      Beschreibung
                    </label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all resize-none disabled:opacity-50"
                      disabled={!canEditProject || isSaving}
                    />
                  </div>
                </div>

                {canEditProject && (
                  <button
                    onClick={handleSave}
                    disabled={isSaving || !name.trim()}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSaving ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Save className="w-5 h-5" />
                    )}
                    Speichern
                  </button>
                )}

                {/* Danger Zone */}
                {canDeleteProject && (
                  <div className="mt-12 pt-8 border-t border-red-100">
                    <h3 className="text-lg font-bold text-red-600 mb-2">
                      Gefahrenzone
                    </h3>
                    <p className="text-stone-500 mb-4">
                      Das Löschen eines Projekts ist dauerhaft und kann nicht rückgängig gemacht werden.
                    </p>

                    {showDeleteConfirm ? (
                      <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                        <p className="text-red-700 font-medium mb-4">
                          Sind Sie sicher? Alle Kampagnen und Einstellungen werden gelöscht.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="px-4 py-2 border border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors"
                            disabled={isDeleting}
                          >
                            Abbrechen
                          </button>
                          <button
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="px-4 py-2 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                            Endgültig löschen
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowDeleteConfirm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Projekt löschen
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'members' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">
                    Teammitglieder
                  </h2>
                  <p className="text-stone-500">
                    Verwalten Sie, wer Zugriff auf dieses Projekt hat.
                  </p>
                </div>

                {canInviteMembers && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <h3 className="font-medium text-stone-900 mb-3">
                      Neues Mitglied einladen
                    </h3>
                    <InviteForm onInvite={handleInvite} />
                  </div>
                )}

                <div>
                  <h3 className="font-medium text-stone-900 mb-3">
                    Aktuelle Mitglieder
                  </h3>
                  <MemberList
                    members={members}
                    loading={membersLoading}
                    onUpdateRole={handleUpdateRole}
                    onRemoveMember={handleRemoveMember}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
