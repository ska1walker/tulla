'use client';

import { Campaign, CampaignType } from '@/types';
import { fmtDate } from '@/lib/utils';

interface CampaignTooltipProps {
  campaign: Campaign;
  campaignTypes: CampaignType[];
  mousePos: { x: number; y: number };
}

export function CampaignTooltip({ campaign, campaignTypes, mousePos }: CampaignTooltipProps) {
  const type = campaignTypes.find((t) => t.id === campaign.typeId);
  const color = type?.color || '#FECDD3';

  return (
    <div
      className="fixed pointer-events-none z-[1000] animate-in fade-in zoom-in-95 duration-200"
      style={{ left: mousePos.x + 20, top: mousePos.y - 40 }}
    >
      <div className="bg-white/90 backdrop-blur-xl border border-stone-200 shadow-2xl rounded-2xl overflow-hidden min-w-[240px]">
        <div className="h-1.5 w-full" style={{ background: color }} />
        <div className="p-4 text-left">
          <h4 className="font-black text-stone-800 text-sm leading-tight">{campaign.name}</h4>
          {type && (
            <div className="mt-1 text-[10px] font-bold text-stone-400 uppercase tracking-wide">
              {type.name}
            </div>
          )}
          <div className="mt-3 text-xs font-bold text-stone-700 space-y-1">
            <div>
              {fmtDate(campaign.startDate, 'EEEE, dd.MM.')} —{' '}
              {fmtDate(campaign.endDate, 'EEEE, dd.MM.')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
