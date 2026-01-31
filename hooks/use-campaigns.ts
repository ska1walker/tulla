'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { Campaign, CampaignFormData } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { STORAGE_KEYS } from '@/lib/constants';

export function useCampaigns(projectId?: string) {
  const { db, isOffline, ready, role, currentProject } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);

  // Use provided projectId or fall back to current project
  const activeProjectId = projectId || currentProject?.id;

  // Load campaigns
  useEffect(() => {
    if (!ready || !role) return;

    if (isOffline) {
      const saved = localStorage.getItem(STORAGE_KEYS.CAMPAIGNS);
      setCampaigns(saved ? JSON.parse(saved) : []);
      setLoading(false);
      return;
    }

    if (!db || !activeProjectId) {
      setCampaigns([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, 'projects', activeProjectId, 'campaigns');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Campaign[];
      setCampaigns(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, isOffline, ready, role, activeProjectId]);

  // Save campaign
  const saveCampaign = useCallback(
    async (data: CampaignFormData) => {
      // Ensure budget fields are numbers
      const processedData = {
        ...data,
        budgetPlanned: data.budgetPlanned ? Number(data.budgetPlanned) : undefined,
        budgetActual: data.budgetActual ? Number(data.budgetActual) : undefined,
      };

      if (isOffline) {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');

        if (data.id) {
          // Update existing
          const updated = items.map((item: Campaign) =>
            item.id === data.id ? { ...item, ...processedData } : item
          );
          localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
          setCampaigns(updated);
        } else {
          // Create new
          const newCampaign = {
            ...processedData,
            id: Math.random().toString(36).substr(2, 9),
          };
          const updated = [...items, newCampaign];
          localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
          setCampaigns(updated);
        }
        return;
      }

      if (!db || !activeProjectId) return;

      const ref = collection(db, 'projects', activeProjectId, 'campaigns');

      if (data.id) {
        await updateDoc(doc(ref, data.id), processedData);
      } else {
        await addDoc(ref, processedData);
      }
    },
    [db, isOffline, activeProjectId]
  );

  // Delete campaign
  const deleteCampaign = useCallback(
    async (id: string) => {
      if (isOffline) {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');
        const updated = items.filter((item: Campaign) => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.CAMPAIGNS, JSON.stringify(updated));
        setCampaigns(updated);
        return;
      }

      if (!db || !activeProjectId) return;

      const ref = doc(db, 'projects', activeProjectId, 'campaigns', id);
      await deleteDoc(ref);
    },
    [db, isOffline, activeProjectId]
  );

  return { campaigns, loading, saveCampaign, deleteCampaign };
}
