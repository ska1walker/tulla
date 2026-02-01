'use client';

import { useMemo } from 'react';
import {
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  differenceInDays,
  isValid,
  isBefore,
  isAfter,
  setYear,
  getDay,
} from 'date-fns';
import { Campaign, Channel, Phases, PhaseKey, CampaignType } from '@/types';
import { ViewMode, ZoomLevel, ZOOM_LEVELS } from '@/lib/constants';
import { toDate, fmtDate } from '@/lib/utils';

interface TimelineProps {
  campaigns: Campaign[];
  channels: Channel[];
  phases: Phases;
  campaignTypes: CampaignType[];
  viewMode: ViewMode;
  zoomLevel: ZoomLevel;
  currentYear: number;
  isAdmin: boolean;
  onEditCampaign: (campaign: Campaign) => void;
  onHoverCampaign: (campaign: Campaign | null) => void;
}

export function Timeline({
  campaigns,
  channels,
  phases,
  campaignTypes,
  viewMode,
  zoomLevel,
  currentYear,
  isAdmin,
  onEditCampaign,
  onHoverCampaign,
}: TimelineProps) {
  // Helper to get color for a campaign type
  const getTypeColor = (typeId: string): string => {
    const type = campaignTypes.find((t) => t.id === typeId);
    return type?.color || '#FECDD3';
  };
  // Calculate timeline range
  const timeline = useMemo(() => {
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 0, 1));
    let start = yearStart;
    let end = yearEnd;

    if (viewMode !== 'year' && viewMode !== 'analytics' && phases[viewMode as PhaseKey]) {
      const p = phases[viewMode as PhaseKey];
      let ps = toDate(p.start);
      let pe = toDate(p.end);

      if (ps && isValid(ps)) ps = setYear(ps, currentYear);
      if (pe && isValid(pe)) pe = setYear(pe, currentYear);

      if (ps && pe && isValid(ps) && isValid(pe) && !isBefore(pe, ps)) {
        start = ps;
        end = pe;
      }
    }

    const days = eachDayOfInterval({ start, end });
    return { start, end, days, totalDays: days.length };
  }, [currentYear, viewMode, phases]);

  // Calculate position style for a campaign
  const getPosStyle = (startDate: string | Date, endDate: string | Date) => {
    if (!timeline.totalDays || timeline.totalDays <= 0) return null;

    const s = toDate(startDate);
    const e = toDate(endDate);
    if (!s || !e) return null;

    const visStart = isBefore(s, timeline.start) ? timeline.start : s;
    const visEnd = isBefore(timeline.end, e) ? timeline.end : e;

    if (isAfter(visStart, visEnd)) return null;

    return {
      left: `${(differenceInDays(visStart, timeline.start) / timeline.totalDays) * 100}%`,
      width: `${((differenceInDays(visEnd, visStart) + 1) / timeline.totalDays) * 100}%`,
    };
  };

  // Render phase background
  const renderPhaseBackground = (key: string, p: { start: string; end: string; color: string }) => {
    if (!p?.start || !p?.end) return null;

    let ps = toDate(p.start);
    let pe = toDate(p.end);

    if (!ps || !pe || !isValid(ps) || !isValid(pe)) return null;

    ps = setYear(ps, currentYear);
    pe = setYear(pe, currentYear);

    const style = getPosStyle(ps, pe);
    return style ? (
      <div
        key={key}
        className={`absolute top-0 bottom-0 border-x border-stone-200/50 opacity-40 pointer-events-none ${p.color}`}
        style={style}
      />
    ) : null;
  };

  return (
    <div
      className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden"
      style={{ minWidth: `${100 * zoomLevel}%` }}
    >
      {/* Header with month labels */}
      <div className="flex border-b border-stone-100 bg-stone-50/30 h-12 text-center">
        <div className="w-64 p-4 font-bold text-stone-400 text-[10px] border-r sticky left-0 bg-white/95 backdrop-blur z-20 flex items-center uppercase tracking-widest">
          Medienkanal
        </div>
        <div className="flex-grow flex relative text-[9px] font-bold">
          {timeline.totalDays > 0 &&
            timeline.days.map((day, i) => {
              const isFirstOfMonth = day.getDate() === 1;
              const isMonday = getDay(day) === 1;
              const left = (i / timeline.totalDays) * 100;

              // Month labels (always show)
              if (isFirstOfMonth) {
                return (
                  <div
                    key={`month-${i}`}
                    className="absolute h-full border-l border-stone-200 flex items-center px-1.5"
                    style={{ left: `${left}%` }}
                  >
                    <span className="sticky left-64 bg-rose-50 px-1.5 py-0.5 rounded-md whitespace-nowrap text-rose-500">
                      {fmtDate(day, 'MMM')}
                    </span>
                  </div>
                );
              }

              // Week lines in header (only for zoomed views, skip if it's also first of month)
              if (zoomLevel > ZOOM_LEVELS.YEAR && isMonday) {
                return (
                  <div
                    key={`week-${i}`}
                    className="absolute h-full border-l border-stone-200/40 flex items-end px-1"
                    style={{ left: `${left}%` }}
                  >
                    <span className="text-[8px] text-stone-400 font-medium whitespace-nowrap mb-1">
                      {fmtDate(day, 'd')}
                    </span>
                  </div>
                );
              }

              return null;
            })}
        </div>
      </div>

      {/* Channel rows */}
      <div className="divide-y divide-stone-50 text-left">
        {channels.map((ch) => (
          <div key={ch.id} className="flex h-16 group hover:bg-stone-50/30 transition-colors">
            <div className="w-64 px-6 flex items-center font-bold text-stone-700 border-r sticky left-0 bg-white/95 backdrop-blur z-20 group-hover:bg-stone-50 transition-colors">
              {ch.name}
            </div>
            <div className="flex-grow relative h-full">
              {/* Phase backgrounds for year view */}
              {viewMode === 'year' &&
                Object.entries(phases).map(([k, p]) => renderPhaseBackground(k, p))}

              {/* Week lines for zoomed views (Q, M, W) */}
              {zoomLevel > ZOOM_LEVELS.YEAR && timeline.totalDays > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {timeline.days.map((day, i) => {
                    // Show line on Mondays (getDay returns 1 for Monday)
                    if (getDay(day) !== 1) return null;
                    const left = (i / timeline.totalDays) * 100;
                    return (
                      <div
                        key={i}
                        className="absolute top-0 bottom-0 w-px bg-stone-200/60"
                        style={{ left: `${left}%` }}
                      />
                    );
                  })}
                </div>
              )}

              {/* Campaign bars */}
              {campaigns
                .filter((c) => c.channelId === ch.id)
                .map((c) => {
                  const style = getPosStyle(c.startDate, c.endDate);
                  if (!style) return null;

                  return (
                    <div
                      key={c.id}
                      onClick={() => isAdmin && onEditCampaign(c)}
                      onMouseEnter={() => onHoverCampaign(c)}
                      onMouseLeave={() => onHoverCampaign(null)}
                      className="absolute top-1/2 -translate-y-1/2 h-8 rounded-lg shadow-sm border-stone-900/10 border-b-2 transition-all cursor-pointer z-10"
                      style={{
                        ...style,
                        background: getTypeColor(c.typeId),
                      }}
                    />
                  );
                })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
