'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/dashboard/header';
import { Timeline } from '@/components/dashboard/timeline';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { CampaignTooltip } from '@/components/dashboard/campaign-tooltip';
import { CampaignModal, ChannelModal, PhaseModal, BrandingModal } from '@/components/modals';
import { useAuth } from '@/contexts/auth-context';
import { useCampaigns } from '@/hooks/use-campaigns';
import { useChannels } from '@/hooks/use-channels';
import { useSettings } from '@/hooks/use-settings';
import { Campaign } from '@/types';
import { ZOOM_LEVELS, ViewMode, ZoomLevel } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { role } = useAuth();
  const { campaigns, saveCampaign, deleteCampaign } = useCampaigns();
  const { channels, saveChannel, deleteChannel } = useChannels();
  const { phases, branding, savePhases, saveBranding } = useSettings();

  // View state
  const [currentYear] = useState(new Date().getFullYear());
  const [viewMode, setViewMode] = useState<ViewMode>('year');
  const [zoomLevel, setZoomLevel] = useState<ZoomLevel>(ZOOM_LEVELS.YEAR);

  // Modal state
  const [editingCampaign, setEditingCampaign] = useState<Partial<Campaign> | null>(null);
  const [isManagingChannels, setIsManagingChannels] = useState(false);
  const [isSettingPhases, setIsSettingPhases] = useState(false);
  const [isSettingBranding, setIsSettingBranding] = useState(false);

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
    await saveCampaign(data as Campaign);
    setEditingCampaign(null);
  };

  // Handle campaign delete
  const handleDeleteCampaign = async (id: string) => {
    await deleteCampaign(id);
    setEditingCampaign(null);
  };

  // Handle phase save
  const handleSavePhases = async (newPhases: typeof phases) => {
    await savePhases(newPhases);
    setIsSettingPhases(false);
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
          branding={branding}
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
        onOpenBranding={() => setIsSettingBranding(true)}
        onOpenPhases={() => setIsSettingPhases(true)}
        onOpenChannels={() => setIsManagingChannels(true)}
        onNewCampaign={() => setEditingCampaign({})}
      />

      {/* Main Content */}
      <main className="p-8 overflow-x-auto min-h-[calc(100vh-80px)] text-sm">
        {viewMode === 'analytics' ? (
          <AnalyticsDashboard campaigns={campaigns} branding={branding} />
        ) : (
          <Timeline
            campaigns={campaigns}
            channels={channels}
            phases={phases}
            branding={branding}
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
      {isSettingBranding && (
        <BrandingModal
          branding={branding}
          onClose={() => setIsSettingBranding(false)}
          onSave={saveBranding}
        />
      )}

      {editingCampaign && (
        <CampaignModal
          campaign={editingCampaign}
          channels={channels}
          onClose={() => setEditingCampaign(null)}
          onSave={handleSaveCampaign}
          onDelete={editingCampaign.id ? handleDeleteCampaign : undefined}
        />
      )}

      {isManagingChannels && (
        <ChannelModal
          channels={channels}
          onClose={() => setIsManagingChannels(false)}
          onSave={saveChannel}
          onDelete={deleteChannel}
        />
      )}

      {isSettingPhases && (
        <PhaseModal
          phases={phases}
          onClose={() => setIsSettingPhases(false)}
          onSave={handleSavePhases}
        />
      )}
    </div>
  );
}
