'use client';

import Link from 'next/link';
import { Plus, Settings, LayoutDashboard, RotateCcw, Download } from 'lucide-react';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { ProjectSwitcher } from '@/components/ui/project-switcher';
import { UserMenu } from '@/components/ui/user-menu';
import { useAuth } from '@/contexts/auth-context';
import { Phases } from '@/types';
import { ZOOM_LEVELS, ViewMode, ZoomLevel } from '@/lib/constants';

interface HeaderProps {
  phases: Phases;
  viewMode: ViewMode;
  zoomLevel: ZoomLevel;
  onViewModeChange: (mode: ViewMode) => void;
  onZoomLevelChange: (level: ZoomLevel) => void;
  onNewCampaign: () => void;
  onExport?: () => void;
}

export function Header({
  phases,
  viewMode,
  zoomLevel,
  onViewModeChange,
  onZoomLevelChange,
  onNewCampaign,
  onExport,
}: HeaderProps) {
  const { role, currentProject } = useAuth();

  const viewModes: { key: ViewMode; label: string }[] = [
    { key: 'year', label: 'Gesamt' },
    { key: 'phase1', label: phases.phase1?.name || 'Phase 1' },
    { key: 'phase2', label: phases.phase2?.name || 'Phase 2' },
    { key: 'phase3', label: phases.phase3?.name || 'Phase 3' },
  ];

  return (
    <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <Link href="/projects" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
            <TulipLogo className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg tracking-tight">
            <span className="font-black text-stone-900">mai</span>
            <span className="font-light text-rose-500 italic">flow</span>
          </h1>
        </Link>
        <Link
          href="/credits"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-400 hover:text-rose-500 transition-all hover:scale-110"
          title="Credits"
        >
          <span className="text-sm">🎮</span>
        </Link>

        {/* Project Switcher */}
        <ProjectSwitcher />

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
        </div>

        {/* Zoom Level Selector - only show for timeline views */}
        {viewMode !== 'analytics' && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-medium text-stone-400 uppercase tracking-wide">Zoom</span>
            <div className="flex bg-stone-100 p-1 rounded-lg">
              <button
                onClick={() => onZoomLevelChange(ZOOM_LEVELS.QUARTER)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  zoomLevel === ZOOM_LEVELS.QUARTER
                    ? 'bg-white text-rose-500 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="Quartalsansicht"
              >
                Q
              </button>
              <button
                onClick={() => onZoomLevelChange(ZOOM_LEVELS.MONTH)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  zoomLevel === ZOOM_LEVELS.MONTH
                    ? 'bg-white text-rose-500 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="Monatsansicht"
              >
                M
              </button>
              <button
                onClick={() => onZoomLevelChange(ZOOM_LEVELS.WEEK)}
                className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${
                  zoomLevel === ZOOM_LEVELS.WEEK
                    ? 'bg-white text-rose-500 shadow-sm'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
                title="Wochenansicht"
              >
                W
              </button>
              {zoomLevel !== ZOOM_LEVELS.YEAR && (
                <button
                  onClick={() => onZoomLevelChange(ZOOM_LEVELS.YEAR)}
                  className="ml-1 px-2 py-1.5 rounded-md text-[10px] font-bold text-stone-400 hover:text-rose-500 hover:bg-white transition-all"
                  title="Zoom zurücksetzen"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}

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

      <div className="flex items-center gap-2">
        {onExport && (
          <button
            onClick={onExport}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-stone-600 hover:text-rose-500 transition-colors"
            title="Als PNG exportieren"
          >
            <Download className="w-4 h-4" />
            <span className="text-xs font-medium">Export</span>
          </button>
        )}
        {role === 'admin' && (
          <>
            {currentProject && (
              <Link
                href={`/projects/${currentProject.id}/settings`}
                className="p-2.5 bg-white border border-stone-200 rounded-xl text-stone-500 hover:text-rose-500 transition-colors"
                title="Projekteinstellungen"
              >
                <Settings className="w-4 h-4" />
              </Link>
            )}
            <button
              onClick={onNewCampaign}
              className="flex items-center gap-2 px-5 py-2.5 bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" /> NEU
            </button>
          </>
        )}

        {/* User Menu */}
        <div className="ml-4">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}
