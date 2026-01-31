'use client';

import { FormEvent } from 'react';
import { Euro } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Campaign, Channel } from '@/types';

interface CampaignModalProps {
  campaign: Partial<Campaign>;
  channels: Channel[];
  onClose: () => void;
  onSave: (data: Partial<Campaign>) => void;
  onDelete?: (id: string) => void;
}

export function CampaignModal({
  campaign,
  channels,
  onClose,
  onSave,
  onDelete,
}: CampaignModalProps) {
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = Object.fromEntries(fd.entries()) as Record<string, string>;

    // Set default name if empty
    if (!data.name) {
      data.name = channels.find((c) => c.id === data.channelId)?.name || 'Neu';
    }

    onSave({
      ...data,
      id: campaign.id,
      budgetPlanned: data.budgetPlanned ? Number(data.budgetPlanned) : undefined,
      budgetActual: data.budgetActual ? Number(data.budgetActual) : undefined,
    } as Partial<Campaign>);
  };

  return (
    <Modal title={campaign.id ? 'Kampagne bearbeiten' : 'Neue Kampagne'} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-5 text-left">
        {/* Title */}
        <div>
          <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1">
            Titel
          </label>
          <input
            name="name"
            defaultValue={campaign.name}
            placeholder="Optional: Kanalname"
            className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold outline-none focus:border-rose-500"
          />
        </div>

        {/* Budget Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1 flex items-center gap-1">
              <Euro className="w-3 h-3" /> Plan-Budget
            </label>
            <input
              type="number"
              name="budgetPlanned"
              defaultValue={campaign.budgetPlanned}
              className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold outline-none"
              placeholder="0"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1 flex items-center gap-1">
              <Euro className="w-3 h-3" /> Ist-Budget
            </label>
            <input
              type="number"
              name="budgetActual"
              defaultValue={campaign.budgetActual}
              className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold outline-none"
              placeholder="0"
            />
          </div>
        </div>

        {/* Channel and Type */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1 text-left">
              Kanal
            </label>
            <select
              name="channelId"
              defaultValue={campaign.channelId}
              className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold outline-none"
            >
              {channels.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1 text-left">
              Typ
            </label>
            <select
              name="type"
              defaultValue={campaign.type || 'image'}
              className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold outline-none"
            >
              <option value="image">Image</option>
              <option value="sales">Sales</option>
            </select>
          </div>
        </div>

        {/* Date Fields */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1 text-left">
              Start
            </label>
            <input
              type="date"
              name="startDate"
              defaultValue={campaign.startDate as string}
              className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-stone-400 uppercase block ml-1 mb-1 text-left">
              Ende
            </label>
            <input
              type="date"
              name="endDate"
              defaultValue={campaign.endDate as string}
              className="w-full p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button className="w-full py-4 bg-rose-500 text-white rounded-2xl font-bold shadow-lg shadow-rose-100 hover:bg-rose-600 transition-all active:scale-95">
          Kampagne speichern
        </button>

        {/* Delete Button */}
        {campaign.id && onDelete && (
          <button
            type="button"
            onClick={() => {
              if (confirm('Löschen?')) {
                onDelete(campaign.id!);
              }
            }}
            className="w-full py-2 text-rose-400 text-xs font-bold hover:text-rose-600 transition-colors uppercase tracking-widest mt-2"
          >
            Eintrag entfernen
          </button>
        )}
      </form>
    </Modal>
  );
}
