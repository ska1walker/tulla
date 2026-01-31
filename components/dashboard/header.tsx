'use client';

import Link from 'next/link';
import { Plus, Settings, Clock, Palette, LogOut, LayoutDashboard } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { useAuth } from '@/contexts/auth-context';
import { Phases, PhaseKey } from '@/types';
import { ZOOM_LEVELS, ViewMode, ZoomLevel } from '@/lib/constants';

interface HeaderProps {
  phases: Phases;
  viewMode: ViewMode;
  zoomLevel: ZoomLevel;
  onViewModeChange: (mode: ViewMode) => void;
  onZoomLevelChange: (level: ZoomLevel) => void;
  onOpenBranding: () => void;
  onOpenPhases: () => void;
  onOpenChannels: () => void;
  onNewCampaign: () => void;
}

export function Header({
  phases,
  viewMode,
  zoomLevel,
  onViewModeChange,
  onZoomLevelChange,
  onOpenBranding,
  onOpenPhases,
  onOpenChannels,
  onNewCampaign,
}: HeaderProps) {
  const { role, logout } = useAuth();

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'year', label: 'Gesamt' },
    { key: 'phase1', label: phases.phase1?.name || 'Phase 1' },
    { key: 'phase2', label: phases.phase2?.name || 'Phase 2' },
    { key: 'phase3', label: phases.phase3?.name || 'Phase 3' },
  ];

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <TulipLogo className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg font-bold tracking-tight">TULLA</h1>
        </Link>

        {/* View Mode Selector */}
        <div className="flex bg-stone-100 p-1 rounded-xl">
          {viewModes.map((mode) => (
            <button
              key={mode.key}
              onClick={() => onViewModeChange(mode.key)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === mode.key
                  ? 'bg-white shadow-sm text-rose-500'
                  : 'text-stone-500 hover:text-stone-700'
              }`}
            >
              {mode.label}
            </button>
          ))}
          <div className="w-px bg-stone-300 mx-1 my-1" />
          <button
            onClick={() => onZoomLevelChange(ZOOM_LEVELS.QUARTER)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
              zoomLevel === ZOOM_LEVELS.QUARTER
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-stone-400'
            }`}
          >
            Q
          </button>
          <button
            onClick={() => onZoomLevelChange(ZOOM_LEVELS.MONTH)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
              zoomLevel === ZOOM_LEVELS.MONTH
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-stone-400'
            }`}
          >
            M
          </button>
          <button
            onClick={() => onZoomLevelChange(ZOOM_LEVELS.WEEK)}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${
              zoomLevel === ZOOM_LEVELS.WEEK
                ? 'bg-white text-rose-500 shadow-sm'
                : 'text-stone-400'
            }`}
          >
            W
          </button>
        </div>

        {/* Analytics Toggle */}
        <button
          onClick={() => onViewModeChange(viewMode === 'analytics' ? 'year' : 'analytics')}
          className={`px-4 py-1.5 border border-stone-200 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            viewMode === 'analytics'
              ? 'bg-stone-800 text-white border-stone-800'
              : 'bg-white text-stone-500 hover:bg-stone-50'
          }`}
        >
          <LayoutDashboard className="w-4 h-4" /> Analyse
        </button>
      </div>

      <div className="flex gap-2">
        {role === 'admin' && (
          <>
            <button
              onClick={onOpenBranding}
              className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-500 hover:text-rose-500 transition-colors"
              title="Design"
            >
              <Palette className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenPhases}
              className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-500 hover:text-rose-500 transition-colors"
              title="Phasen"
            >
              <Clock className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenChannels}
              className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-500 hover:text-rose-500 transition-colors"
              title="Kanäle"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onNewCampaign}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> NEU
            </button>
          </>
        )}
        <button
          onClick={logout}
          className="ml-4 text-stone-300 hover:text-rose-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
