'use client';

import { useMemo, useState } from 'react';
import { PieChart, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Campaign, CampaignType, Channel, Phases, PhaseKey, Branding } from '@/types';
import { fmtCurrency, safeNum } from '@/lib/utils';
import { toDate, setYear, isAfter, isBefore } from 'date-fns';
import { DEFAULT_BRANDING } from '@/lib/constants';

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  campaignTypes: CampaignType[];
  channels: Channel[];
  phases: Phases;
  currentYear: number;
  branding?: Branding;
}

interface ChannelBudget {
  channel: Channel;
  channelName: string;
  planned: number;
  actual: number;
  campaigns: number;
  trend: 'positive' | 'negative' | 'neutral';
}

interface PhaseBudget {
  key: PhaseKey;
  name: string;
  planned: number;
  actual: number;
  color: string;
  trend: 'positive' | 'negative' | 'neutral';
}

// Filter campaigns by phase based on date overlap
function filterCampaignsByPhase(
  campaigns: Campaign[],
  phases: Phases,
  filter: 'all' | PhaseKey,
  currentYear: number
): Campaign[] {
  if (filter === 'all') {
    return campaigns;
  }

  const phase = phases[filter];
  const phaseStart = setYear(toDate(phase.start), currentYear);
  const phaseEnd = setYear(toDate(phase.end), currentYear);

  return campaigns.filter((c) => {
    const start = toDate(c.startDate);
    const end = toDate(c.endDate);
    // Campaign overlaps with phase
    return start && end && !isAfter(start, phaseEnd) && !isBefore(end, phaseStart);
  });
}

// Calculate trend based on actual vs planned
function getTrend(planned: number, actual: number): 'positive' | 'negative' | 'neutral' {
  if (actual < planned) return 'positive';
  if (actual > planned) return 'negative';
  return 'neutral';
}

// Calculate budget per channel
function calculateChannelBudgets(
  campaigns: Campaign[],
  channels: Channel[]
): ChannelBudget[] {
  return channels
    .map((channel) => {
      const channelCampaigns = campaigns.filter((c) => c.channelId === channel.id);
      const planned = channelCampaigns.reduce((sum, c) => sum + safeNum(c.budgetPlanned), 0);
      const actual = channelCampaigns.reduce((sum, c) => sum + safeNum(c.budgetActual), 0);
      return {
        channel,
        channelName: channel.name,
        planned,
        actual,
        campaigns: channelCampaigns.length,
        trend: getTrend(planned, actual),
      };
    })
    // Show all channels, sort by planned budget (channels with budget first, then alphabetically)
    .sort((a, b) => {
      if (b.planned !== a.planned) return b.planned - a.planned;
      return a.channelName.localeCompare(b.channelName);
    });
}

// Calculate budget per phase
function calculatePhaseBudgets(
  campaigns: Campaign[],
  phases: Phases,
  currentYear: number
): PhaseBudget[] {
  return (['phase1', 'phase2', 'phase3'] as PhaseKey[]).map((key) => {
    const phase = phases[key];
    const phaseCampaigns = filterCampaignsByPhase(campaigns, phases, key, currentYear);
    const planned = phaseCampaigns.reduce((sum, c) => sum + safeNum(c.budgetPlanned), 0);
    const actual = phaseCampaigns.reduce((sum, c) => sum + safeNum(c.budgetActual), 0);
    return {
      key,
      name: phase.name,
      planned,
      actual,
      color: phase.color,
      trend: getTrend(planned, actual),
    };
  });
}

// Phase filter tabs for analytics view
const PHASE_TABS: { key: 'all' | 'phase1' | 'phase2' | 'phase3'; label: string }[] = [
  { key: 'all', label: 'Gesamt' },
  { key: 'phase1', label: 'Phase 1' },
  { key: 'phase2', label: 'Phase 2' },
  { key: 'phase3', label: 'Phase 3' },
];

// Internal filter type for analytics (not affecting main view)
type AnalyticsFilter = 'all' | 'phase1' | 'phase2' | 'phase3';

// Trend icon component
function TrendIcon({ trend, positiveColor, negativeColor }: {
  trend: 'positive' | 'negative' | 'neutral';
  positiveColor: string;
  negativeColor: string;
}) {
  if (trend === 'positive') {
    return <TrendingDown className="w-4 h-4" style={{ color: positiveColor }} />;
  }
  if (trend === 'negative') {
    return <TrendingUp className="w-4 h-4" style={{ color: negativeColor }} />;
  }
  return <Minus className="w-4 h-4 text-stone-400" />;
}

export function AnalyticsDashboard({
  campaigns,
  campaignTypes,
  channels,
  phases,
  currentYear,
  branding,
}: AnalyticsDashboardProps) {
  // Get colors from branding or defaults
  const positiveColor = branding?.positiveColor || DEFAULT_BRANDING.positiveColor!;
  const negativeColor = branding?.negativeColor || DEFAULT_BRANDING.negativeColor!;

  // Local state for phase filtering (doesn't affect main navigation)
  const [activeFilter, setActiveFilter] = useState<AnalyticsFilter>('all');
  // Filter campaigns by current phase selection
  const filteredCampaigns = useMemo(
    () => filterCampaignsByPhase(campaigns, phases, activeFilter, currentYear),
    [campaigns, phases, activeFilter, currentYear]
  );

  // Calculate totals for filtered campaigns
  const totalActual = filteredCampaigns.reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
  const totalPlanned = filteredCampaigns.reduce((acc, c) => acc + safeNum(c.budgetPlanned), 0);
  const difference = totalPlanned - totalActual;
  const totalTrend = getTrend(totalPlanned, totalActual);

  // Channel budgets for filtered campaigns
  const channelBudgets = useMemo(
    () => calculateChannelBudgets(filteredCampaigns, channels),
    [filteredCampaigns, channels]
  );

  // Phase budgets (always for all campaigns)
  const phaseBudgets = useMemo(
    () => calculatePhaseBudgets(campaigns, phases, currentYear),
    [campaigns, phases, currentYear]
  );

  // Calculate budget per type for donut chart
  const typeStats = campaignTypes.map((type) => {
    const typeCampaigns = filteredCampaigns.filter((c) => c.typeId === type.id);
    const budget = typeCampaigns.reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
    return { type, budget };
  });
  const totalTypeBudget = typeStats.reduce((acc, s) => acc + s.budget, 0);

  // Custom tooltip formatter for charts
  const tooltipFormatter = (value: number | undefined) => fmtCurrency(value ?? 0);
  const axisFormatter = (value: number) => {
    if (value >= 1000) return `${(value / 1000).toFixed(0)}k`;
    return value.toString();
  };

  // Custom legend with icons
  const renderLegend = () => (
    <div className="flex items-center justify-center gap-6 pt-4 text-xs">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-stone-300" />
        <span className="text-stone-600 font-medium">Plan</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-sm bg-stone-500" />
        <span className="text-stone-600 font-medium">Ist</span>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 p-2">
      {/* Phase Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {PHASE_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeFilter === tab.key
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            Plan-Budget
          </h3>
          <div className="text-2xl font-bold text-stone-900">{fmtCurrency(totalPlanned)}</div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            Ist-Ausgaben
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold"
              style={{ color: totalTrend === 'negative' ? negativeColor : totalTrend === 'positive' ? positiveColor : undefined }}
            >
              {fmtCurrency(totalActual)}
            </span>
            <TrendIcon trend={totalTrend} positiveColor={positiveColor} negativeColor={negativeColor} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            Differenz
          </h3>
          <div className="flex items-center gap-2">
            <span
              className="text-2xl font-bold"
              style={{ color: difference < 0 ? negativeColor : positiveColor }}
            >
              {difference >= 0 ? '+' : ''}{fmtCurrency(difference)}
            </span>
            <TrendIcon trend={difference >= 0 ? 'positive' : 'negative'} positiveColor={positiveColor} negativeColor={negativeColor} />
          </div>
        </div>
      </div>

      {/* Budget per Channel - Horizontal Bar Chart */}
      {channels.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
            Budget pro Kanal
          </h3>
          <div className="space-y-4">
            {channelBudgets.map((item) => {
              const maxValue = Math.max(...channelBudgets.map(b => Math.max(b.planned, b.actual)));
              const plannedWidth = maxValue > 0 ? (item.planned / maxValue) * 100 : 0;
              const actualWidth = maxValue > 0 ? (item.actual / maxValue) * 100 : 0;

              const hasNoBudget = item.planned === 0 && item.actual === 0;

              return (
                <div key={item.channel.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-sm"
                        style={{ backgroundColor: item.channel.color || '#71717a' }}
                      />
                      <span className="text-sm font-medium text-stone-700">{item.channelName}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      {hasNoBudget ? (
                        <span className="text-stone-400 italic">Kein Budget</span>
                      ) : (
                        <>
                          <span className="text-stone-400">Plan: {fmtCurrency(item.planned)}</span>
                          <span className="text-stone-600 font-medium">Ist: {fmtCurrency(item.actual)}</span>
                          <TrendIcon trend={item.trend} positiveColor={positiveColor} negativeColor={negativeColor} />
                        </>
                      )}
                    </div>
                  </div>
                  <div className="relative h-6 bg-stone-100 rounded-lg overflow-hidden">
                    {hasNoBudget ? (
                      <div className="absolute inset-0 flex items-center justify-center text-[10px] text-stone-400">
                        Noch keine Kampagnen
                      </div>
                    ) : (
                      <>
                        {/* Plan bar (background) */}
                        <div
                          className="absolute top-0 left-0 h-full bg-stone-300 rounded-lg transition-all"
                          style={{ width: `${plannedWidth}%` }}
                        />
                        {/* Actual bar (foreground) */}
                        <div
                          className="absolute top-0 left-0 h-full rounded-lg transition-all"
                          style={{
                            width: `${actualWidth}%`,
                            backgroundColor: item.trend === 'negative' ? negativeColor : item.trend === 'positive' ? positiveColor : '#71717a'
                          }}
                        />
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-6 text-xs border-t border-stone-100 mt-6">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-stone-300" />
              <span className="text-stone-500">Plan</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: positiveColor }} />
              <span className="text-stone-500">Unter Budget</span>
              <TrendingDown className="w-3 h-3" style={{ color: positiveColor }} />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: negativeColor }} />
              <span className="text-stone-500">Über Budget</span>
              <TrendingUp className="w-3 h-3" style={{ color: negativeColor }} />
            </div>
          </div>
        </div>
      )}

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phase Comparison - Custom Bars with Trends */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
            Phasen-Vergleich
          </h3>
          <div className="space-y-6">
            {phaseBudgets.map((phase) => {
              const maxValue = Math.max(...phaseBudgets.map(p => Math.max(p.planned, p.actual)));
              const plannedWidth = maxValue > 0 ? (phase.planned / maxValue) * 100 : 0;
              const actualWidth = maxValue > 0 ? (phase.actual / maxValue) * 100 : 0;

              return (
                <div key={phase.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-stone-700">{phase.name}</span>
                    <div className="flex items-center gap-2">
                      <TrendIcon trend={phase.trend} positiveColor={positiveColor} negativeColor={negativeColor} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    {/* Plan bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 w-8">Plan</span>
                      <div className="flex-1 h-4 bg-stone-100 rounded overflow-hidden">
                        <div
                          className="h-full bg-stone-300 rounded transition-all"
                          style={{ width: `${plannedWidth}%` }}
                        />
                      </div>
                      <span className="text-xs text-stone-500 w-20 text-right">{fmtCurrency(phase.planned)}</span>
                    </div>
                    {/* Actual bar */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-stone-400 w-8">Ist</span>
                      <div className="flex-1 h-4 bg-stone-100 rounded overflow-hidden">
                        <div
                          className="h-full rounded transition-all"
                          style={{
                            width: `${actualWidth}%`,
                            backgroundColor: phase.trend === 'negative' ? negativeColor : phase.trend === 'positive' ? positiveColor : '#71717a'
                          }}
                        />
                      </div>
                      <span className="text-xs font-medium w-20 text-right" style={{
                        color: phase.trend === 'negative' ? negativeColor : phase.trend === 'positive' ? positiveColor : undefined
                      }}>
                        {fmtCurrency(phase.actual)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Campaign Mix - Donut Chart */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
            <PieChart className="w-3 h-3 inline mr-1" /> Kampagnen-Mix
          </h3>
          <div className="relative w-32 h-32">
            <svg viewBox="0 0 36 36" className="w-full h-full rotate-[-90deg]">
              <circle
                cx="18"
                cy="18"
                r="15.915"
                fill="none"
                stroke="#e7e5e4"
                strokeWidth="3.8"
              />
              {totalTypeBudget > 0 &&
                (() => {
                  let offset = 0;
                  return typeStats.map(({ type, budget }) => {
                    const percent = (budget / totalTypeBudget) * 100;
                    const circle = (
                      <circle
                        key={type.id}
                        cx="18"
                        cy="18"
                        r="15.915"
                        fill="none"
                        stroke={type.color}
                        strokeWidth="3.8"
                        strokeDasharray={`${percent}, 100`}
                        strokeDashoffset={-offset}
                      />
                    );
                    offset += percent;
                    return circle;
                  });
                })()}
            </svg>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-1">
            {typeStats
              .filter((s) => s.budget > 0)
              .map(({ type, budget }) => (
                <div key={type.id} className="flex items-center gap-2 text-xs">
                  <div
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: type.color }}
                  />
                  <span className="text-stone-600 font-medium">{type.name}</span>
                  <span className="text-stone-400">
                    ({((budget / totalTypeBudget) * 100).toFixed(0)}%)
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
