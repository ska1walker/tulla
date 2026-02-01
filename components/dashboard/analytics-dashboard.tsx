'use client';

import { useMemo, useState } from 'react';
import { PieChart } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Campaign, CampaignType, Channel, Phases, PhaseKey } from '@/types';
import { fmtCurrency, safeNum } from '@/lib/utils';
import { toDate, setYear, isAfter, isBefore } from 'date-fns';

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  campaignTypes: CampaignType[];
  channels: Channel[];
  phases: Phases;
  currentYear: number;
}

interface ChannelBudget {
  channel: Channel;
  channelName: string;
  planned: number;
  actual: number;
  campaigns: number;
}

interface PhaseBudget {
  key: PhaseKey;
  name: string;
  planned: number;
  actual: number;
  color: string;
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

// Calculate budget per channel
function calculateChannelBudgets(
  campaigns: Campaign[],
  channels: Channel[]
): ChannelBudget[] {
  return channels
    .map((channel) => {
      const channelCampaigns = campaigns.filter((c) => c.channelId === channel.id);
      return {
        channel,
        channelName: channel.name,
        planned: channelCampaigns.reduce((sum, c) => sum + safeNum(c.budgetPlanned), 0),
        actual: channelCampaigns.reduce((sum, c) => sum + safeNum(c.budgetActual), 0),
        campaigns: channelCampaigns.length,
      };
    })
    .filter((b) => b.planned > 0 || b.actual > 0)
    .sort((a, b) => b.planned - a.planned);
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
    return {
      key,
      name: phase.name,
      planned: phaseCampaigns.reduce((sum, c) => sum + safeNum(c.budgetPlanned), 0),
      actual: phaseCampaigns.reduce((sum, c) => sum + safeNum(c.budgetActual), 0),
      color: phase.color,
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

export function AnalyticsDashboard({
  campaigns,
  campaignTypes,
  channels,
  phases,
  currentYear,
}: AnalyticsDashboardProps) {
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
                ? 'bg-rose-500 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-rose-300'
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
          <div
            className={`text-2xl font-bold ${
              totalActual > totalPlanned ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {fmtCurrency(totalActual)}
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            Differenz
          </h3>
          <div
            className={`text-2xl font-bold ${
              difference < 0 ? 'text-rose-600' : 'text-emerald-600'
            }`}
          >
            {difference >= 0 ? '+' : ''}{fmtCurrency(difference)}
          </div>
        </div>
      </div>

      {/* Budget per Channel - Horizontal Bar Chart */}
      {channelBudgets.length > 0 && (
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
            Budget pro Kanal
          </h3>
          <ResponsiveContainer width="100%" height={channelBudgets.length * 60 + 40}>
            <BarChart data={channelBudgets} layout="vertical" margin={{ left: 20, right: 30 }}>
              <XAxis
                type="number"
                tickFormatter={axisFormatter}
                tick={{ fontSize: 11, fill: '#78716c' }}
                axisLine={{ stroke: '#e7e5e4' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="channelName"
                width={100}
                tick={{ fontSize: 12, fill: '#44403c' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e7e5e4',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }}
              />
              <Bar
                dataKey="planned"
                name="Plan"
                fill="#e5e7eb"
                radius={[0, 4, 4, 0]}
              />
              <Bar
                dataKey="actual"
                name="Ist"
                fill="#f43f5e"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Bottom Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Phase Comparison - Grouped Bar Chart */}
        <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-sm">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
            Phasen-Vergleich
          </h3>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={phaseBudgets} margin={{ left: 10, right: 10 }}>
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: '#44403c' }}
                axisLine={{ stroke: '#e7e5e4' }}
                tickLine={false}
              />
              <YAxis
                tickFormatter={axisFormatter}
                tick={{ fontSize: 11, fill: '#78716c' }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                formatter={tooltipFormatter}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e7e5e4',
                  borderRadius: '8px',
                  fontSize: '12px',
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar
                dataKey="planned"
                name="Plan"
                fill="#e5e7eb"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="actual"
                name="Ist"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
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
