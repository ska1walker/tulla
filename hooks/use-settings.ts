'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Phases, Branding } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { DEFAULT_PHASES, DEFAULT_BRANDING, STORAGE_KEYS } from '@/lib/constants';

export function useSettings(projectId?: string) {
  const { db, isOffline, ready, role, currentProject } = useAuth();
  const [phases, setPhases] = useState<Phases>(DEFAULT_PHASES);
  const [branding, setBranding] = useState<Branding>(DEFAULT_BRANDING);
  const [loading, setLoading] = useState(true);

  // Use provided projectId or fall back to current project
  const activeProjectId = projectId || currentProject?.id;

  // Load settings
  useEffect(() => {
    if (!ready || !role) return;

    if (isOffline) {
      const savedPhases = localStorage.getItem(STORAGE_KEYS.PHASES);
      if (savedPhases) setPhases(JSON.parse(savedPhases));

      const savedBranding = localStorage.getItem(STORAGE_KEYS.BRANDING);
      if (savedBranding) setBranding(JSON.parse(savedBranding));

      setLoading(false);
      return;
    }

    if (!db || !activeProjectId) {
      setPhases(DEFAULT_PHASES);
      setBranding(DEFAULT_BRANDING);
      setLoading(false);
      return;
    }

    // Subscribe to phases
    const phasesRef = doc(db, 'projects', activeProjectId, 'settings', 'phases');
    const unsubPhases = onSnapshot(phasesRef, (snapshot) => {
      if (snapshot.exists()) {
        setPhases((prev) => ({ ...prev, ...snapshot.data() }));
      }
    });

    // Subscribe to branding
    const brandingRef = doc(db, 'projects', activeProjectId, 'settings', 'branding');
    const unsubBranding = onSnapshot(brandingRef, (snapshot) => {
      if (snapshot.exists()) {
        setBranding(snapshot.data() as Branding);
      }
      setLoading(false);
    });

    return () => {
      unsubPhases();
      unsubBranding();
    };
  }, [db, isOffline, ready, role, activeProjectId]);

  // Save phases
  const savePhases = useCallback(
    async (newPhases: Phases) => {
      if (isOffline) {
        localStorage.setItem(STORAGE_KEYS.PHASES, JSON.stringify(newPhases));
        setPhases(newPhases);
        return;
      }

      if (!db || !activeProjectId) return;

      const ref = doc(db, 'projects', activeProjectId, 'settings', 'phases');
      await setDoc(ref, newPhases, { merge: true });
    },
    [db, isOffline, activeProjectId]
  );

  // Save branding
  const saveBranding = useCallback(
    async (newBranding: Branding) => {
      if (isOffline) {
        localStorage.setItem(STORAGE_KEYS.BRANDING, JSON.stringify(newBranding));
        setBranding(newBranding);
        return;
      }

      if (!db || !activeProjectId) return;

      const ref = doc(db, 'projects', activeProjectId, 'settings', 'branding');
      await setDoc(ref, newBranding, { merge: true });
    },
    [db, isOffline, activeProjectId]
  );

  return { phases, branding, loading, savePhases, saveBranding };
}
