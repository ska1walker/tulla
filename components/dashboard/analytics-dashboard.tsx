'use client';

import { BarChart3, PieChart } from 'lucide-react';
import { Campaign, CampaignType } from '@/types';
import { fmtCurrency, safeNum } from '@/lib/utils';

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  campaignTypes: CampaignType[];
}

export function AnalyticsDashboard({ campaigns, campaignTypes }: AnalyticsDashboardProps) {
  const totalActual = campaigns.reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
  const totalPlanned = campaigns.reduce((acc, c) => acc + safeNum(c.budgetPlanned), 0);
  const budgetUtilization = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

  // Calculate budget per type
  const typeStats = campaignTypes.map((type) => {
    const typeCampaigns = campaigns.filter((c) => c.typeId === type.id);
    const budget = typeCampaigns.reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
    return { type, budget };
  });

  const totalTypeBudget = typeStats.reduce((acc, s) => acc + s.budget, 0);

  return (
    <div className="space-y-8 p-2">
      {/* Budget Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            Plan-Budget
          </h3>
          <div className="text-2xl font-bold text-stone-900">{fmtCurrency(totalPlanned)}</div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-left">
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
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm text-left">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-stone-400 mb-2">
            Ausschöpfung
          </h3>
          <div
            className={`text-2xl font-bold ${
              budgetUtilization > 100 ? 'text-rose-600' : 'text-stone-900'
            }`}
          >
            {budgetUtilization.toFixed(1)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-center py-8">
        {/* Budget Analysis Placeholder */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center py-12">
          <BarChart3 className="w-12 h-12 text-stone-200 mb-4" />
          <p className="text-stone-400 font-bold uppercase tracking-widest text-[10px]">
            Budget-Analyse folgt...
          </p>
        </div>

        {/* Budget Mix Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm flex flex-col items-center justify-center">
          <h3 className="text-xs font-bold text-stone-400 uppercase tracking-widest mb-6">
            <PieChart className="w-3 h-3 inline mr-1" /> Mix
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
