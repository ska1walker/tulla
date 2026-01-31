'use client';

import { Modal } from '@/components/ui/modal';
import { Branding } from '@/types';
import { PASTELL_PALETTE } from '@/lib/constants';

interface BrandingModalProps {
  branding: Branding;
  onClose: () => void;
  onSave: (branding: Branding) => void;
}

type CampaignType = 'image' | 'sales';

export function BrandingModal({ branding, onClose, onSave }: BrandingModalProps) {
  const handleColorSelect = (type: CampaignType, color: string) => {
    onSave({
      ...branding,
      [`${type}Color`]: color,
    });
  };

  const getColors = (type: CampaignType) => {
    const paletteKey = type === 'image' ? 'green' : 'red';
    return [...PASTELL_PALETTE[paletteKey], ...PASTELL_PALETTE.lilac];
  };

  return (
    <Modal title="Design & Farben" onClose={onClose}>
      <div className="space-y-8">
        {(['image', 'sales'] as CampaignType[]).map((t) => (
          <div key={t} className="space-y-4">
            <h4 className="font-black uppercase text-[10px] tracking-widest text-stone-400">
              {t === 'image' ? 'Image' : 'Sales'} Kampagnen
            </h4>
            <div className="grid grid-cols-4 gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-100">
              {getColors(t).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorSelect(t, color)}
                  className={`aspect-square rounded-xl border-2 transition-all ${
                    branding[`${t}Color` as keyof Branding] === color
                      ? 'ring-2 ring-stone-900 ring-offset-4 border-stone-900'
                      : 'border-transparent hover:scale-105'
                  }`}
                  style={{ background: color }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
}
