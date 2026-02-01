'use client';

import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { Phases, PhaseKey } from '@/types';

interface PhaseManagerProps {
  phases: Phases;
  onSave: (phases: Phases) => Promise<void>;
  disabled?: boolean;
}

const phaseKeys: PhaseKey[] = ['phase1', 'phase2', 'phase3'];

export function PhaseManager({ phases, onSave, disabled = false }: PhaseManagerProps) {
  const [localPhases, setLocalPhases] = useState<Phases>(phases);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleChange = (key: PhaseKey, field: 'name' | 'start' | 'end', value: string) => {
    setLocalPhases((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    if (isSaving || !hasChanges) return;

    setIsSaving(true);
    try {
      await onSave(localPhases);
      setHasChanges(false);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {phaseKeys.map((key, index) => (
        <div
          key={key}
          className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400 uppercase tracking-wide">
              Phase {index + 1}
            </span>
            <input
              type="text"
              value={localPhases[key].name}
              onChange={(e) => handleChange(key, 'name', e.target.value)}
              className="px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-sm font-medium text-rose-500 text-right focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
              placeholder="Name der Phase"
              disabled={disabled}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Startdatum
              </label>
              <input
                type="date"
                value={localPhases[key].start}
                onChange={(e) => handleChange(key, 'start', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
                disabled={disabled}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1">
                Enddatum
              </label>
              <input
                type="date"
                value={localPhases[key].end}
                onChange={(e) => handleChange(key, 'end', e.target.value)}
                className="w-full px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:opacity-50"
                disabled={disabled}
              />
            </div>
          </div>
        </div>
      ))}

      {!disabled && (
        <button
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
          className="inline-flex items-center gap-2 px-5 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Phasen speichern
        </button>
      )}
    </div>
  );
}
