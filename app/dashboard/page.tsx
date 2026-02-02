'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
import { Campaign, ExportSettings } from '@/types';
import { ZOOM_LEVELS, ViewMode, ZoomLevel } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { role } = useAuth();
  const { showToast } = useToast();
  const { campaigns, saveCampaign, deleteCampaign } = useCampaigns();
  const { channels } = useChannels();
  const { phases, branding, saveBranding } = useSettings();
  const { campaignTypes } = useCampaignTypes();

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

  // Handle logout - redirect to login
  useEffect(() => {
    if (!role) {
      router.push('/login');
    }
  }, [role, router]);

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
