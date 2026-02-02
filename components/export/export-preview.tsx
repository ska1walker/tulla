'use client';

import { forwardRef, useMemo } from 'react';
import {
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  differenceInDays,
  isBefore,
  isAfter,
  setYear,
  isValid,
} from 'date-fns';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Campaign, Channel, Phases, CampaignType, PhaseKey } from '@/types';
import { toDate, fmtDate, fmtCurrency, safeNum } from '@/lib/utils';

interface ExportPreviewProps {
  target: 'timeline' | 'analytics';
  primaryColor: string;
  accentColor: string;
  whitespace: number;
  campaigns: Campaign[];
  channels: Channel[];
  phases: Phases;
  campaignTypes: CampaignType[];
  currentYear: number;
}

export const ExportPreview = forwardRef<HTMLDivElement, ExportPreviewProps>(
  function ExportPreview(
    {
      target,
      primaryColor,
      accentColor,
      whitespace,
      campaigns,
      channels,
      phases,
      campaignTypes,
      currentYear,
    },
    ref
  ) {
    const padding = (whitespace / 100) * 100;

    return (
      <div
        ref={ref}
        className="bg-white overflow-hidden"
        style={{
          width: '1920px',
          height: '1080px',
          padding: `${padding}px`,
          boxSizing: 'border-box',
        }}
      >
        <div className="w-full h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: primaryColor }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                <path d="M12 2C9.5 2 7 4 7 8c0 3 1.5 5 3 6.5V22l2-2 2 2v-7.5c1.5-1.5 3-3.5 3-6.5 0-4-2.5-6-5-6z" />
              </svg>
            </div>
            <div>
              <span className="text-xl font-black text-stone-900">mai</span>
              <span className="text-xl font-light italic" style={{ color: primaryColor }}>
                flow
              </span>
            </div>
            <div className="ml-auto text-sm text-stone-400">
              {new Date().getFullYear()}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            {target === 'timeline' ? (
              <TimelinePreview
                campaigns={campaigns}
                channels={channels}
                phases={phases}
                campaignTypes={campaignTypes}
                currentYear={currentYear}
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
            ) : (
              <AnalyticsPreview
                campaigns={campaigns}
                channels={channels}
                phases={phases}
                campaignTypes={campaignTypes}
                currentYear={currentYear}
                primaryColor={primaryColor}
                accentColor={accentColor}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
);

interface PreviewContentProps {
  campaigns: Campaign[];
  channels: Channel[];
  phases: Phases;
  campaignTypes: CampaignType[];
  currentYear: number;
  primaryColor: string;
  accentColor: string;
}

function TimelinePreview({
  campaigns,
  channels,
  phases,
  campaignTypes,
  currentYear,
  primaryColor,
  accentColor,
}: PreviewContentProps) {
  const timeline = useMemo(() => {
    const yearStart = startOfYear(new Date(currentYear, 0, 1));
    const yearEnd = endOfYear(new Date(currentYear, 0, 1));
    const days = eachDayOfInterval({ start: yearStart, end: yearEnd });
    return { start: yearStart, end: yearEnd, days, totalDays: days.length };
  }, [currentYear]);

  const getTypeColor = (typeId: string): string => {
    const type = campaignTypes.find((t) => t.id === typeId);
    return type?.color || '#FECDD3';
  };

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
        className="absolute top-0 bottom-0 border-x pointer-events-none opacity-40"
        style={{
          ...style,
          borderColor: accentColor,
          backgroundColor: `${accentColor}20`,
        }}
      />
    ) : null;
  };

  return (
    <div
      className="rounded-xl border overflow-hidden h-full"
      style={{ borderColor: accentColor }}
    >
      {/* Header */}
      <div
        className="flex border-b h-12 text-center"
        style={{ borderColor: accentColor, backgroundColor: `${accentColor}10` }}
      >
        <div
          className="w-48 p-4 font-bold text-[10px] border-r flex items-center uppercase tracking-widest"
          style={{ borderColor: accentColor, color: primaryColor }}
        >
          Kanal
        </div>
        <div className="flex-grow flex relative text-[9px] font-bold">
          {timeline.totalDays > 0 &&
            timeline.days.map((day, i) => {
              if (day.getDate() !== 1) return null;
              const left = (i / timeline.totalDays) * 100;
              return (
                <div
                  key={`month-${i}`}
                  className="absolute h-full border-l flex items-center px-1.5"
                  style={{ left: `${left}%`, borderColor: accentColor }}
                >
                  <span
                    className="px-1.5 py-0.5 rounded-md whitespace-nowrap"
                    style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}
                  >
                    {fmtDate(day, 'MMM')}
                  </span>
                </div>
              );
            })}
        </div>
      </div>

      {/* Channel rows */}
      <div className="divide-y text-left" style={{ borderColor: `${accentColor}50` }}>
        {channels.slice(0, 8).map((ch) => (
          <div key={ch.id} className="flex h-14">
            <div
              className="w-48 px-4 flex items-center font-bold text-stone-700 border-r text-sm"
              style={{ borderColor: accentColor }}
            >
              {ch.name}
            </div>
            <div className="flex-grow relative h-full">
              {Object.entries(phases).map(([k, p]) => renderPhaseBackground(k, p))}

              {campaigns
                .filter((c) => c.channelId === ch.id)
                .map((c) => {
                  const style = getPosStyle(c.startDate, c.endDate);
                  if (!style) return null;

                  return (
                    <div
                      key={c.id}
                      className="absolute top-1/2 -translate-y-1/2 h-7 rounded-lg shadow-sm"
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

function AnalyticsPreview({
  campaigns,
  channels,
  phases,
  campaignTypes,
  currentYear,
  primaryColor,
  accentColor,
}: PreviewContentProps) {
  const totalActual = campaigns.reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
  const totalPlanned = campaigns.reduce((acc, c) => acc + safeNum(c.budgetPlanned), 0);
  const difference = totalPlanned - totalActual;

  const channelBudgets = useMemo(() => {
    return channels
      .map((channel) => {
        const channelCampaigns = campaigns.filter((c) => c.channelId === channel.id);
        return {
          channelName: channel.name,
          planned: channelCampaigns.reduce((sum, c) => sum + safeNum(c.budgetPlanned), 0),
          actual: channelCampaigns.reduce((sum, c) => sum + safeNum(c.budgetActual), 0),
        };
      })
      .filter((b) => b.planned > 0 || b.actual > 0)
      .sort((a, b) => b.planned - a.planned)
      .slice(0, 6);
  }, [campaigns, channels]);

  const phaseBudgets = useMemo(() => {
    return (['phase1', 'phase2', 'phase3'] as PhaseKey[]).map((key) => {
      const phase = phases[key];
      const phaseStart = setYear(toDate(phase.start)!, currentYear);
      const phaseEnd = setYear(toDate(phase.end)!, currentYear);

      const phaseCampaigns = campaigns.filter((c) => {
        const start = toDate(c.startDate);
        const end = toDate(c.endDate);
        return start && end && !isAfter(start, phaseEnd) && !isBefore(end, phaseStart);
      });

      return {
        name: phase.name,
        planned: phaseCampaigns.reduce((sum, c) => sum + safeNum(c.budgetPlanned), 0),
        actual: phaseCampaigns.reduce((sum, c) => sum + safeNum(c.budgetActual), 0),
      };
    });
  }, [campaigns, phases, currentYear]);

  const axisFormatter = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Budget Cards */}
      <div className="grid grid-cols-3 gap-6">
        <div
          className="p-6 rounded-xl border"
          style={{ borderColor: accentColor }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accentColor }}
          >
            Plan-Budget
          </h3>
          <div className="text-3xl font-bold text-stone-900">{fmtCurrency(totalPlanned)}</div>
        </div>
        <div
          className="p-6 rounded-xl border"
          style={{ borderColor: accentColor }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accentColor }}
          >
            Ist-Ausgaben
          </h3>
          <div
            className="text-3xl font-bold"
            style={{ color: totalActual > totalPlanned ? '#dc2626' : '#16a34a' }}
          >
            {fmtCurrency(totalActual)}
          </div>
        </div>
        <div
          className="p-6 rounded-xl border"
          style={{ borderColor: accentColor }}
        >
          <h3
            className="text-[10px] font-bold uppercase tracking-widest mb-2"
            style={{ color: accentColor }}
          >
            Differenz
          </h3>
          <div
            className="text-3xl font-bold"
            style={{ color: difference < 0 ? '#dc2626' : '#16a34a' }}
          >
            {difference >= 0 ? '+' : ''}{fmtCurrency(difference)}
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="flex-1 grid grid-cols-2 gap-6">
        {/* Channel Budget Chart */}
        <div className="p-6 rounded-xl border" style={{ borderColor: accentColor }}>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: primaryColor }}
          >
            Budget pro Kanal
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={channelBudgets} layout="vertical" margin={{ left: 10, right: 20 }}>
              <XAxis
                type="number"
                tickFormatter={axisFormatter}
                tick={{ fontSize: 11, fill: '#78716c' }}
                axisLine={{ stroke: accentColor }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="channelName"
                width={90}
                tick={{ fontSize: 11, fill: '#44403c' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => fmtCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${accentColor}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="planned" name="Plan" fill={accentColor} radius={[0, 4, 4, 0]} />
              <Bar dataKey="actual" name="Ist" fill={primaryColor} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Phase Comparison Chart */}
        <div className="p-6 rounded-xl border" style={{ borderColor: accentColor }}>
          <h3
            className="text-xs font-bold uppercase tracking-widest mb-4"
            style={{ color: primaryColor }}
          >
            Phasen-Vergleich
          </h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={phaseBudgets} margin={{ left: 10, right: 20 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#44403c' }}
                axisLine={{ stroke: accentColor }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={axisFormatter}
                tick={{ fontSize: 11, fill: '#78716c' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={(value) => fmtCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'white',
                  border: `1px solid ${accentColor}`,
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px' }} />
              <Bar dataKey="planned" name="Plan" fill={accentColor} radius={[4, 4, 0, 0]} />
              <Bar dataKey="actual" name="Ist" fill={primaryColor} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
