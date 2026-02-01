'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { AnalyticsDashboard } from '@/components/dashboard/analytics-dashboard';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { useCampaigns } from '@/hooks/use-campaigns';
import { useSettings } from '@/hooks/use-settings';

export default function AnalyticsPage() {
  const { campaigns } = useCampaigns();
  const { branding } = useSettings();

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans text-sm selection:bg-rose-100">
      {/* Header */}
      <header className="h-20 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-3 cursor-pointer group">
            <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
              <TulipLogo className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight">maiflo</h1>
          </Link>
          <div className="h-6 w-px bg-stone-200" />
          <h2 className="text-stone-500 font-medium">Analytics Dashboard</h2>
        </div>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 px-4 py-2 text-stone-500 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Zurück zur Timeline
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-8">
        <AnalyticsDashboard campaigns={campaigns} branding={branding} />
      </main>
    </div>
  );
}
