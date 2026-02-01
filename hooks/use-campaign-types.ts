'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { CampaignType, DEFAULT_CAMPAIGN_TYPES } from '@/types';
import { useAuth } from '@/contexts/auth-context';

const STORAGE_KEY = 'ca_campaign_types';

export function useCampaignTypes(projectId?: string) {
  const { db, isOffline, ready, role, currentProject } = useAuth();
  const [campaignTypes, setCampaignTypes] = useState<CampaignType[]>(DEFAULT_CAMPAIGN_TYPES);
  const [loading, setLoading] = useState(true);

  // Use provided projectId or fall back to current project
  const activeProjectId = projectId || currentProject?.id;

  // Load campaign types
  useEffect(() => {
    if (!ready || !role) return;

    if (isOffline) {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setCampaignTypes(parsed.length > 0 ? parsed : DEFAULT_CAMPAIGN_TYPES);
      }
      setLoading(false);
      return;
    }

    if (!db || !activeProjectId) {
      setCampaignTypes(DEFAULT_CAMPAIGN_TYPES);
      setLoading(false);
      return;
    }

    const ref = doc(db, 'projects', activeProjectId, 'settings', 'campaignTypes');
    const unsub = onSnapshot(ref, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        const types = data.types as CampaignType[];
        setCampaignTypes(types.length > 0 ? types : DEFAULT_CAMPAIGN_TYPES);
      } else {
        setCampaignTypes(DEFAULT_CAMPAIGN_TYPES);
      }
      setLoading(false);
    });

    return () => unsub();
  }, [db, isOffline, ready, role, activeProjectId]);

  // Save campaign types
  const saveCampaignTypes = useCallback(
    async (types: CampaignType[]) => {
      // Ensure at least one type exists
      const validTypes = types.length > 0 ? types : DEFAULT_CAMPAIGN_TYPES;

      if (isOffline) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(validTypes));
        setCampaignTypes(validTypes);
        return;
      }

      if (!db || !activeProjectId) return;

      const ref = doc(db, 'projects', activeProjectId, 'settings', 'campaignTypes');
      await setDoc(ref, { types: validTypes });
    },
    [db, isOffline, activeProjectId]
  );

  // Add a new campaign type
  const addCampaignType = useCallback(
    async (type: Omit<CampaignType, 'id'>) => {
      const newType: CampaignType = {
        ...type,
        id: `type_${Date.now()}`,
      };
      await saveCampaignTypes([...campaignTypes, newType]);
      return newType;
    },
    [campaignTypes, saveCampaignTypes]
  );

  // Update a campaign type
  const updateCampaignType = useCallback(
    async (id: string, updates: Partial<Omit<CampaignType, 'id'>>) => {
      const updated = campaignTypes.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      );
      await saveCampaignTypes(updated);
    },
    [campaignTypes, saveCampaignTypes]
  );

  // Delete a campaign type (only if more than one exists)
  const deleteCampaignType = useCallback(
    async (id: string) => {
      if (campaignTypes.length <= 1) {
        throw new Error('Mindestens ein Typ muss vorhanden sein');
      }
      const filtered = campaignTypes.filter((t) => t.id !== id);
      await saveCampaignTypes(filtered);
    },
    [campaignTypes, saveCampaignTypes]
  );

  // Get color for a type ID
  const getTypeColor = useCallback(
    (typeId: string): string => {
      const type = campaignTypes.find((t) => t.id === typeId);
      return type?.color || '#E5E7EB';
    },
    [campaignTypes]
  );

  // Get type by ID
  const getType = useCallback(
    (typeId: string): CampaignType | undefined => {
      return campaignTypes.find((t) => t.id === typeId);
    },
    [campaignTypes]
  );

  return {
    campaignTypes,
    loading,
    addCampaignType,
    updateCampaignType,
    deleteCampaignType,
    getTypeColor,
    getType,
  };
}
