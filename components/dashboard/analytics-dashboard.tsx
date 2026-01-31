'use client';

import { BarChart3, PieChart } from 'lucide-react';
import { Campaign, Branding } from '@/types';
import { fmtCurrency, safeNum } from '@/lib/utils';

interface AnalyticsDashboardProps {
  campaigns: Campaign[];
  branding: Branding;
}

export function AnalyticsDashboard({ campaigns, branding }: AnalyticsDashboardProps) {
  const totalActual = campaigns.reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
  const totalPlanned = campaigns.reduce((acc, c) => acc + safeNum(c.budgetPlanned), 0);
  const budgetUtilization = totalPlanned > 0 ? (totalActual / totalPlanned) * 100 : 0;

  const imageBudget = campaigns
    .filter((c) => c.type === 'image')
    .reduce((acc, c) => acc + safeNum(c.budgetActual), 0);
  const salesBudget = campaigns
    .filter((c) => c.type === 'sales')
    .reduce((acc, c) => acc + safeNum(c.budgetActual), 0);

  const totalType = imageBudget + salesBudget;
  const imagePercent = totalType > 0 ? (imageBudget / totalType) * 100 : 0;
  const salesPercent = totalType > 0 ? (salesBudget / totalType) * 100 : 0;

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
              {totalType > 0 && (
                <>
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={branding.imageColor}
                    strokeWidth="3.8"
                    strokeDasharray={`${imagePercent}, 100`}
                  />
                  <circle
                    cx="18"
                    cy="18"
                    r="15.915"
                    fill="none"
                    stroke={branding.salesColor}
                    strokeWidth="3.8"
                    strokeDasharray={`${salesPercent}, 100`}
                    strokeDashoffset={-imagePercent}
                  />
                </>
              )}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
