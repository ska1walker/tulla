'use client';

import { FormEvent } from 'react';
import { Modal } from '@/components/ui/modal';
import { Phases, PhaseKey } from '@/types';

interface PhaseModalProps {
  phases: Phases;
  onClose: () => void;
  onSave: (phases: Phases) => void;
}

const phaseKeys: PhaseKey[] = ['phase1', 'phase2', 'phase3'];

export function PhaseModal({ phases, onClose, onSave }: PhaseModalProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const newPhases: Phases = { ...phases };
    phaseKeys.forEach((key) => {
      newPhases[key] = {
        ...newPhases[key],
        name: fd.get(`${key}_name`) as string,
        start: fd.get(`${key}_start`) as string,
        end: fd.get(`${key}_end`) as string,
      };
    });

    onSave(newPhases);
  };

  return (
    <Modal title="Phasen" onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4 text-xs font-bold text-left">
        {phaseKeys.map((pKey, idx) => (
          <div key={pKey} className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
            <div className="flex justify-between">
              <span className="text-[10px] font-black text-stone-400 uppercase">
                Abschnitt {idx + 1}
              </span>
              <input
                name={`${pKey}_name`}
                defaultValue={phases[pKey].name}
                className="bg-white border-none rounded px-2 text-rose-500 text-right outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="date"
                name={`${pKey}_start`}
                defaultValue={phases[pKey].start}
                className="border border-stone-200 rounded p-2 outline-none text-stone-700"
              />
              <input
                type="date"
                name={`${pKey}_end`}
                defaultValue={phases[pKey].end}
                className="border border-stone-200 rounded p-2 outline-none text-stone-700"
              />
            </div>
          </div>
        ))}
        <button className="w-full py-4 bg-stone-900 text-white rounded-xl font-bold shadow-lg">
          Speichern
        </button>
      </form>
    </Modal>
  );
}
