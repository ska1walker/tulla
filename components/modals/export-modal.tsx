'use client';

import { useState, useRef, useCallback } from 'react';
import { Download, Image, BarChart3 } from 'lucide-react';
import { toPng } from 'html-to-image';
import { Campaign, Channel, Phases, CampaignType, ExportSettings } from '@/types';
import { ExportPreview } from '@/components/export/export-preview';
import { generateExportFilename } from '@/lib/export-utils';

interface ExportModalProps {
  onClose: () => void;
  campaigns: Campaign[];
  channels: Channel[];
  phases: Phases;
  campaignTypes: CampaignType[];
  currentYear: number;
  initialSettings?: ExportSettings;
  onSaveSettings?: (settings: ExportSettings) => void;
}

const DEFAULT_SETTINGS: ExportSettings = {
  primaryColor: '#3B82F6',
  accentColor: '#F43F5E',
};

export function ExportModal({
  onClose,
  campaigns,
  channels,
  phases,
  campaignTypes,
  currentYear,
  initialSettings,
  onSaveSettings,
}: ExportModalProps) {
  const [target, setTarget] = useState<'timeline' | 'analytics'>('timeline');
  const [primaryColor, setPrimaryColor] = useState(initialSettings?.primaryColor || DEFAULT_SETTINGS.primaryColor);
  const [accentColor, setAccentColor] = useState(initialSettings?.accentColor || DEFAULT_SETTINGS.accentColor);
  const [whitespace, setWhitespace] = useState(15);
  const [isExporting, setIsExporting] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleExport = useCallback(async () => {
    const node = previewRef.current;
    if (!node) return;

    setIsExporting(true);

    try {
      const dataUrl = await toPng(node, {
        width: 1920,
        height: 1080,
        backgroundColor: '#ffffff',
        pixelRatio: 1,
      });

      const link = document.createElement('a');
      link.download = generateExportFilename(target);
      link.href = dataUrl;
      link.click();

      // Save settings for this project
      if (onSaveSettings) {
        onSaveSettings({ primaryColor, accentColor });
      }
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  }, [target, primaryColor, accentColor, onSaveSettings]);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100 bg-stone-50/50">
          <h2 className="text-lg font-bold text-stone-800 tracking-tight">Export</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/50 flex items-center justify-center hover:bg-stone-200 text-stone-500 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Target Selection */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Was exportieren?
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setTarget('timeline')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  target === 'timeline'
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <Image className="w-4 h-4" />
                <span className="font-medium">Timeline</span>
              </button>
              <button
                onClick={() => setTarget('analytics')}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl border-2 transition-all ${
                  target === 'analytics'
                    ? 'border-rose-500 bg-rose-50 text-rose-600'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Analytics</span>
              </button>
            </div>
          </div>

          {/* Color Pickers */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Primärfarbe
              </label>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-mono text-stone-700 uppercase outline-none"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Akzentfarbe
              </label>
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-100">
                <input
                  type="color"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-10 h-10 rounded-lg cursor-pointer border-0"
                />
                <input
                  type="text"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="flex-1 bg-transparent text-sm font-mono text-stone-700 uppercase outline-none"
                />
              </div>
            </div>
          </div>

          {/* Whitespace Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
                Whitespace / Rand
              </label>
              <span className="text-sm font-bold text-stone-600">{whitespace}%</span>
            </div>
            <input
              type="range"
              min="5"
              max="25"
              value={whitespace}
              onChange={(e) => setWhitespace(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-rose-500"
            />
            <div className="flex justify-between text-[10px] text-stone-400">
              <span>5%</span>
              <span>25%</span>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-3">
            <label className="text-[10px] font-bold uppercase tracking-widest text-stone-400">
              Vorschau
            </label>
            <div className="border border-stone-200 rounded-xl overflow-hidden bg-stone-50 p-4">
              <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-white shadow-inner">
                <div className="absolute inset-0 overflow-hidden" style={{ transform: 'scale(0.25)', transformOrigin: 'top left' }}>
                  <ExportPreview
                    ref={previewRef}
                    target={target}
                    primaryColor={primaryColor}
                    accentColor={accentColor}
                    whitespace={whitespace}
                    campaigns={campaigns}
                    channels={channels}
                    phases={phases}
                    campaignTypes={campaignTypes}
                    currentYear={currentYear}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-6 py-4 border-t border-stone-100 bg-stone-50/50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-stone-600 hover:text-stone-800 font-medium transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting}
            className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-4 h-4" />
            {isExporting ? 'Exportiere...' : 'PNG herunterladen'}
          </button>
        </div>
      </div>
    </div>
  );
}
