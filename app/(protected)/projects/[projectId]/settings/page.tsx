'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Trash2, Users, Settings, Save, Palette, Layers, Clock, TrendingUp, TrendingDown } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { UserMenu } from '@/components/ui/user-menu';
import { MemberList } from '@/components/projects/member-list';
import { InvitationList } from '@/components/projects/invitation-list';
import { InviteForm } from '@/components/projects/invite-form';
import { CampaignTypeManager } from '@/components/projects/campaign-type-manager';
import { ChannelManager } from '@/components/projects/channel-manager';
import { PhaseManager } from '@/components/projects/phase-manager';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { useProjects } from '@/hooks/use-projects';
import { useProjectMembers } from '@/hooks/use-project-members';
import { useInvitations } from '@/hooks/use-invitations';
import { usePermissions } from '@/hooks/use-permissions';
import { useCampaignTypes } from '@/hooks/use-campaign-types';
import { useChannels } from '@/hooks/use-channels';
import { useSettings } from '@/hooks/use-settings';
import { ProjectRole } from '@/types';
import { DEFAULT_BRANDING } from '@/lib/constants';

type TabKey = 'general' | 'channels' | 'phases' | 'types' | 'design' | 'members';

export default function ProjectSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { currentProject, setCurrentProject } = useAuth();
  const { showToast } = useToast();
  const { projects, loading: projectsLoading, updateProject, deleteProject } = useProjects();
  const { members, loading: membersLoading, updateMemberRole, removeMember } = useProjectMembers(projectId);
  const { invitations, loading: invitationsLoading, createInvitation, cancelInvitation, resendInvitation } = useInvitations(projectId);
  const { canEditProject, canDeleteProject, canInviteMembers } = usePermissions(projectId);
  const { campaignTypes, addCampaignType, updateCampaignType, deleteCampaignType } = useCampaignTypes(projectId);
  const { channels, saveChannel, deleteChannel } = useChannels(projectId);
  const { phases, branding, savePhases, saveBranding } = useSettings(projectId);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('general');
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
      showToast('Projekt gespeichert!', 'success');
    } catch (err) {
      console.error('Error updating project:', err);
      showToast('Fehler beim Speichern', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!canDeleteProject) return;

    setIsDeleting(true);
    try {
      await deleteProject(projectId);
      showToast('Projekt gelöscht', 'success');
      router.push('/projects');
    } catch (err) {
      console.error('Error deleting project:', err);
      showToast('Fehler beim Löschen', 'error');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleInvite = async (email: string, role: ProjectRole) => {
    try {
      await createInvitation({ email, role });
      showToast('Einladung gesendet!', 'success');
    } catch (err) {
      console.error('Error sending invitation:', err);
      showToast('Fehler beim Senden der Einladung', 'error');
    }
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

  const pendingInvitations = invitations.filter((inv) => inv.status === 'pending');
  const tabs: { key: TabKey; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'general', label: 'Allgemein', icon: <Settings className="w-4 h-4" /> },
    { key: 'channels', label: 'Kanäle', icon: <Layers className="w-4 h-4" />, count: channels.length },
    { key: 'phases', label: 'Phasen', icon: <Clock className="w-4 h-4" /> },
    { key: 'types', label: 'Typen', icon: <Palette className="w-4 h-4" />, count: campaignTypes.length },
    { key: 'design', label: 'Design', icon: <TrendingUp className="w-4 h-4" /> },
    { key: 'members', label: 'Team', icon: <Users className="w-4 h-4" />, count: members.length + pendingInvitations.length },
  ];

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <TulipLogo className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg tracking-tight">
              <span className="font-black text-stone-900">mai</span>
              <span className="font-light text-rose-500 italic">flow</span>
            </h1>
          </Link>
        </div>
        <UserMenu />
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-6">
        <Link
          href={`/projects/${projectId}`}
          className="inline-flex items-center gap-2 text-stone-500 hover:text-stone-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zum Projekt
        </Link>

        <div className="bg-white rounded-3xl border border-stone-200 shadow-xl overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-stone-200 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-[100px] px-4 py-4 font-medium transition-colors flex items-center justify-center gap-2 whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'text-rose-500 border-b-2 border-rose-500 bg-rose-50/50'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-xs bg-stone-100 px-1.5 py-0.5 rounded-full">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="p-8">
            {/* General Tab */}
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
                    <label htmlFor="name" className="block text-sm font-medium text-stone-700 mb-2">
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
                    <label htmlFor="description" className="block text-sm font-medium text-stone-700 mb-2">
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
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                    Speichern
                  </button>
                )}

                {/* Danger Zone */}
                {canDeleteProject && (
                  <div className="mt-12 pt-8 border-t border-red-100">
                    <h3 className="text-lg font-bold text-red-600 mb-2">Gefahrenzone</h3>
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
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
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

            {/* Channels Tab */}
            {activeTab === 'channels' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">Kanäle</h2>
                  <p className="text-stone-500">
                    Verwalten Sie die verfügbaren Kanäle für Ihre Kampagnen.
                  </p>
                </div>

                <ChannelManager
                  channels={channels}
                  onSave={saveChannel}
                  onDelete={deleteChannel}
                  disabled={!canEditProject}
                />
              </div>
            )}

            {/* Phases Tab */}
            {activeTab === 'phases' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">Planungsphasen</h2>
                  <p className="text-stone-500">
                    Definieren Sie die drei strategischen Phasen des Jahres.
                  </p>
                </div>

                <PhaseManager
                  phases={phases}
                  onSave={savePhases}
                  disabled={!canEditProject}
                />
              </div>
            )}

            {/* Types Tab */}
            {activeTab === 'types' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">Kampagnentypen</h2>
                  <p className="text-stone-500">
                    Verwalten Sie die verfügbaren Kampagnentypen und ihre Farben.
                  </p>
                </div>

                <CampaignTypeManager
                  types={campaignTypes}
                  onAdd={addCampaignType}
                  onUpdate={updateCampaignType}
                  onDelete={deleteCampaignType}
                  disabled={!canEditProject}
                />
              </div>
            )}

            {/* Design Tab */}
            {activeTab === 'design' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">Analyse-Design</h2>
                  <p className="text-stone-500">
                    Passen Sie die Farben für das Analytics-Dashboard an.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Positive Color */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: branding.positiveColor || DEFAULT_BRANDING.positiveColor }}>
                        <TrendingDown className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-900">Positiv / Unter Budget</h3>
                        <p className="text-xs text-stone-500">Wenn Ausgaben unter dem Plan liegen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={branding.positiveColor || DEFAULT_BRANDING.positiveColor}
                        onChange={(e) => saveBranding({ ...branding, positiveColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        disabled={!canEditProject}
                      />
                      <input
                        type="text"
                        value={branding.positiveColor || DEFAULT_BRANDING.positiveColor}
                        onChange={(e) => saveBranding({ ...branding, positiveColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-mono uppercase"
                        disabled={!canEditProject}
                      />
                    </div>
                  </div>

                  {/* Negative Color */}
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: branding.negativeColor || DEFAULT_BRANDING.negativeColor }}>
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium text-stone-900">Negativ / Über Budget</h3>
                        <p className="text-xs text-stone-500">Wenn Ausgaben über dem Plan liegen</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={branding.negativeColor || DEFAULT_BRANDING.negativeColor}
                        onChange={(e) => saveBranding({ ...branding, negativeColor: e.target.value })}
                        className="w-12 h-12 rounded-lg cursor-pointer border-0"
                        disabled={!canEditProject}
                      />
                      <input
                        type="text"
                        value={branding.negativeColor || DEFAULT_BRANDING.negativeColor}
                        onChange={(e) => saveBranding({ ...branding, negativeColor: e.target.value })}
                        className="flex-1 px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-mono uppercase"
                        disabled={!canEditProject}
                      />
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="p-4 bg-white rounded-xl border border-stone-200">
                  <h3 className="font-medium text-stone-900 mb-4">Vorschau</h3>
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-4 rounded" style={{ backgroundColor: branding.positiveColor || DEFAULT_BRANDING.positiveColor }} />
                      <TrendingDown className="w-4 h-4" style={{ color: branding.positiveColor || DEFAULT_BRANDING.positiveColor }} />
                      <span className="text-sm text-stone-600">Unter Budget</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-4 rounded" style={{ backgroundColor: branding.negativeColor || DEFAULT_BRANDING.negativeColor }} />
                      <TrendingUp className="w-4 h-4" style={{ color: branding.negativeColor || DEFAULT_BRANDING.negativeColor }} />
                      <span className="text-sm text-stone-600">Über Budget</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Members Tab */}
            {activeTab === 'members' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold text-stone-900 mb-1">Teammitglieder</h2>
                  <p className="text-stone-500">
                    Verwalten Sie, wer Zugriff auf dieses Projekt hat.
                  </p>
                </div>

                {canInviteMembers && (
                  <div className="p-4 bg-stone-50 rounded-xl border border-stone-200">
                    <h3 className="font-medium text-stone-900 mb-3">Neues Mitglied einladen</h3>
                    <InviteForm onInvite={handleInvite} />
                  </div>
                )}

                {/* Pending Invitations */}
                {invitations.length > 0 && (
                  <div>
                    <h3 className="font-medium text-stone-900 mb-3">Einladungen</h3>
                    <InvitationList
                      invitations={invitations}
                      loading={invitationsLoading}
                      onCancel={cancelInvitation}
                      onResend={resendInvitation}
                    />
                  </div>
                )}

                {/* Current Members */}
                <div>
                  <h3 className="font-medium text-stone-900 mb-3">Aktive Mitglieder</h3>
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
