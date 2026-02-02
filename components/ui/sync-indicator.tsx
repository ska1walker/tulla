'use client';

import { useState, useEffect } from 'react';
import { Cloud, CloudOff, RefreshCw, Check } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';

type SyncStatus = 'synced' | 'syncing' | 'offline' | 'error';

export function SyncIndicator() {
  const { isOffline } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [status, setStatus] = useState<SyncStatus>('synced');
  const [isOnline, setIsOnline] = useState(true);

  // Prevent hydration mismatch - only render on client
  useEffect(() => {
    setMounted(true);
  }, []);

  // Listen to browser online/offline events
  useEffect(() => {
    if (!mounted) return;

    const handleOnline = () => {
      setIsOnline(true);
      setStatus('syncing');
      // Show syncing briefly, then synced
      setTimeout(() => setStatus('synced'), 2000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setStatus('offline');
    };

    // Initial check
    setIsOnline(navigator.onLine);
    if (!navigator.onLine) {
      setStatus('offline');
    }

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [mounted]);

  // Also check auth context offline state
  useEffect(() => {
    if (isOffline && isOnline) {
      setStatus('error');
    }
  }, [isOffline, isOnline]);

  // Don't render on server or when synced
  if (!mounted || status === 'synced') {
    return null;
  }

  const config = {
    synced: {
      icon: <Check className="w-3.5 h-3.5" />,
      text: 'Gespeichert',
      className: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    syncing: {
      icon: <RefreshCw className="w-3.5 h-3.5 animate-spin" />,
      text: 'Synchronisiere...',
      className: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    offline: {
      icon: <CloudOff className="w-3.5 h-3.5" />,
      text: 'Offline',
      className: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    error: {
      icon: <Cloud className="w-3.5 h-3.5" />,
      text: 'Verbindungsproblem',
      className: 'text-red-600 bg-red-50 border-red-200',
    },
  };

  const current = config[status];

  return (
    <div
      className={`fixed bottom-4 left-4 z-[250] flex items-center gap-2 px-3 py-2 rounded-full border text-xs font-medium shadow-sm transition-all ${current.className}`}
    >
      {current.icon}
      <span>{current.text}</span>
    </div>
  );
}

// Hook for components to trigger sync status
export function useSyncStatus() {
  const [isSyncing, setIsSyncing] = useState(false);

  const startSync = () => setIsSyncing(true);
  const endSync = () => setIsSyncing(false);

  return { isSyncing, startSync, endSync };
}
