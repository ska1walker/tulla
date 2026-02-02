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
      // Extract id and prepare data for Firestore (id should not be in the document)
      const { id, ...restData } = data;

      // Ensure budget fields are numbers and clean undefined values
      const processedData: Record<string, unknown> = {
        name: restData.name,
        channelId: restData.channelId,
        typeId: restData.typeId,
        startDate: restData.startDate,
        endDate: restData.endDate,
      };

      // Only add budget fields if they have values
      if (restData.budgetPlanned) {
        processedData.budgetPlanned = Number(restData.budgetPlanned);
      }
      if (restData.budgetActual) {
        processedData.budgetActual = Number(restData.budgetActual);
      }

      if (isOffline) {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CAMPAIGNS) || '[]');

        if (id) {
          // Update existing
          const updated = items.map((item: Campaign) =>
            item.id === id ? { ...item, ...processedData, id } : item
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

      if (!db || !activeProjectId) {
        throw new Error('Keine Verbindung zur Datenbank.');
      }

      const ref = collection(db, 'projects', activeProjectId, 'campaigns');

      if (id) {
        await updateDoc(doc(ref, id), processedData);
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

      if (!db || !activeProjectId) {
        throw new Error('Keine Verbindung zur Datenbank.');
      }

      const ref = doc(db, 'projects', activeProjectId, 'campaigns', id);
      await deleteDoc(ref);
    },
    [db, isOffline, activeProjectId]
  );

  return { campaigns, loading, saveCampaign, deleteCampaign };
}
