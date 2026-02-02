'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { Header } from '@/components/dashboard/header';
import { Timeline } from '@/components/dashboard/timeline';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { CampaignTooltip } from '@/components/dashboard/campaign-tooltip';
import { CampaignModal, ExportModal } from '@/components/modals';
import { CelebrationOverlay } from '@/components/ui/celebration-overlay';
import { useAuth } from '@/contexts/auth-context';
import { useToast } from '@/contexts/toast-context';
import { useCampaigns } from '@/hooks/use-campaigns';
import { useChannels } from '@/hooks/use-channels';
import { useSettings } from '@/hooks/use-settings';
import { useCampaignTypes } from '@/hooks/use-campaign-types';
import { useProjects } from '@/hooks/use-projects';
import { Campaign, ExportSettings, Branding } from '@/types';
import { ZOOM_LEVELS, ViewMode, ZoomLevel } from '@/lib/constants';

export default function ProjectDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;

  const { role, currentProject, setCurrentProject } = useAuth();
  const { showToast } = useToast();
  const { projects, loading: projectsLoading } = useProjects();
  const { campaigns, saveCampaign, deleteCampaign } = useCampaigns(projectId);
  const { channels } = useChannels(projectId);
  const { phases, branding, saveBranding } = useSettings(projectId);
  const { campaignTypes } = useCampaignTypes(projectId);

  // View state
  const [currentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(ZOOM_LEVELS.YEAR);

  // Modal state
  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  // Hover state
  const [hoveredCampaign, setHoveredCampaign] = useState<Campaign | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Set current project when projectId changes
  useEffect(() => {
    if (!projectsLoading && projects.length > 0) {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        if (!currentProject || currentProject.id !== projectId) {
          setCurrentProject(project, project.role);
        }
      } else {
        // Project not found or no access - redirect to projects list
        router.push('/projects');
      }
    }
  }, [projectId, projects, projectsLoading, currentProject, setCurrentProject, router]);

  // Handle campaign save
  const handleSaveCampaign = async (data: Partial<Campaign>) => {
    const isNewCampaign = !data.id;
    try {
      await saveCampaign(data as Campaign);
      setEditingCampaign(null);
      showToast(isNewCampaign ? 'Kampagne erstellt!' : 'Kampagne gespeichert!', 'success');

      // Trigger celebration for new campaigns
      if (isNewCampaign) {
        setShowCelebration(true);
      }
    } catch (err) {
      console.error('Error saving campaign:', err);
      showToast('Fehler beim Speichern der Kampagne', 'error');
    }
  };

  // Handle campaign delete
  const handleDeleteCampaign = async (id: string) => {
    try {
      await deleteCampaign(id);
      setEditingCampaign(null);
      showToast('Kampagne gelöscht', 'success');
    } catch (err) {
      console.error('Error deleting campaign:', err);
      showToast('Fehler beim Löschen der Kampagne', 'error');
    }
  };

  // Handle export settings save
  const handleSaveExportSettings = (settings: ExportSettings) => {
    saveBranding({
      ...branding,
      exportPrimaryColor: settings.primaryColor,
      exportAccentColor: settings.accentColor,
    });
  };

  // Show loading while checking project access
  if (projectsLoading || !currentProject) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-stone-50 text-stone-900 font-sans text-sm selection:bg-rose-100"
      onMouseMove={(e) => setMousePos({ x: e.clientX, y: e.clientY })}
    >
      {/* Campaign Tooltip */}
      {hoveredCampaign && (
        <CampaignTooltip
          campaign={hoveredCampaign}
          campaignTypes={campaignTypes}
          mousePos={mousePos}
        />
      )}

      {/* Header */}
      <Header
        phases={phases}
        viewMode={viewMode}
        zoomLevel={zoomLevel}
        onViewModeChange={setViewMode}
        onZoomLevelChange={setZoomLevel}
        onNewCampaign={() => setEditingCampaign({})}
        onExport={() => setShowExportModal(true)}
      />

      {/* Main Content */}
      <main className="p-8 overflow-x-auto min-h-[calc(100vh-80px)] text-sm">
        {viewMode === 'analytics' ? (
          <AnalyticsDashboard
            campaigns={campaigns}
            campaignTypes={campaignTypes}
            channels={channels}
            phases={phases}
            currentYear={currentYear}
            branding={branding}
          />
        ) : (
          <Timeline
            campaigns={campaigns}
            channels={channels}
            phases={phases}
            campaignTypes={campaignTypes}
            viewMode={viewMode}
            zoomLevel={zoomLevel}
            currentYear={currentYear}
            isAdmin={role === 'admin'}
            onEditCampaign={setEditingCampaign}
            onHoverCampaign={setHoveredCampaign}
          />
        )}
      </main>

      {/* Modals */}
      {editingCampaign && (
        <CampaignModal
          campaign={editingCampaign}
          channels={channels}
          campaignTypes={campaignTypes}
          onClose={() => setEditingCampaign(null)}
          onSave={handleSaveCampaign}
          onDelete={editingCampaign.id ? handleDeleteCampaign : undefined}
        />
      )}

      {showExportModal && (
        <ExportModal
          onClose={() => setShowExportModal(false)}
          campaigns={campaigns}
          channels={channels}
          phases={phases}
          campaignTypes={campaignTypes}
          currentYear={currentYear}
          initialSettings={{
            primaryColor: branding.exportPrimaryColor || '#3B82F6',
            accentColor: branding.exportAccentColor || '#F43F5E',
          }}
          onSaveSettings={handleSaveExportSettings}
        />
      )}

      {/* Celebration Overlay */}
      <CelebrationOverlay
        isVisible={showCelebration}
        onComplete={() => setShowCelebration(false)}
      />
    </div>
  );
}
