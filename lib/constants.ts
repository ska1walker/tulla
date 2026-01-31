import { Phases, Branding } from '@/types';

// Design Tokens - Color Palettes
export const PASTELL_PALETTE = {
  green: ['#A7F3D0', '#99F6E4', '#BBF7D0', '#D9F99D'],
  red: ['#FECACA', '#FEE2E2', '#FCE7F3', '#FFEDD5'],
  lilac: ['#EDE9FE', '#DDD6FE', '#C4B5FD', '#A5B4FC'],
};

export const CHANNEL_COLORS = [
  '#3b82f6', '#f97316', '#8b5cf6', '#eab308',
  '#ec4899', '#06b6d4', '#84cc16'
];

// Zoom Levels for Timeline
export const ZOOM_LEVELS = {
  YEAR: 1,
  QUARTER: 4,
  MONTH: 12,
  WEEK: 52,
} as const;

export type ZoomLevel = typeof ZOOM_LEVELS[keyof typeof ZOOM_LEVELS];

// Default Phase Configuration
export const DEFAULT_PHASES: Phases = {
  phase1: {
    name: 'Phase 1',
    start: '2026-01-01',
    end: '2026-03-31',
    color: 'bg-stone-100'
  },
  phase2: {
    name: 'Phase 2',
    start: '2026-04-01',
    end: '2026-07-31',
    color: 'bg-rose-50/50'
  },
  phase3: {
    name: 'Phase 3',
    start: '2026-08-01',
    end: '2026-12-31',
    color: 'bg-stone-100'
  },
};

// Default Branding Colors
export const DEFAULT_BRANDING: Branding = {
  imageColor: '#A7F3D0',
  salesColor: '#FECACA',
};

// LocalStorage Keys
export const STORAGE_KEYS = {
  CAMPAIGNS: 'ca_campaigns',
  CHANNELS: 'ca_channels',
  PHASES: 'ca_phases',
  BRANDING: 'ca_branding',
} as const;

// View Modes
export type ViewMode = 'year' | 'phase1' | 'phase2' | 'phase3' | 'analytics';
