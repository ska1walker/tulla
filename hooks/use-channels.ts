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
import { Channel } from '@/types';
import { useAuth } from '@/contexts/auth-context';
import { PROJECT_ID } from '@/lib/firebase/config';
import { STORAGE_KEYS } from '@/lib/constants';

export function useChannels() {
  const { db, isOffline, ready, role } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);

  // Load channels
  useEffect(() => {
    if (!ready || !role) return;

    if (isOffline) {
      const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS);
      const parsed = saved ? JSON.parse(saved) : [];
      setChannels(parsed.sort((a: Channel, b: Channel) => (a.order || 0) - (b.order || 0)));
      setLoading(false);
      return;
    }

    if (!db) return;

    const ref = collection(db, 'artifacts', PROJECT_ID, 'public', 'data', 'channels');
    const unsubscribe = onSnapshot(ref, (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Channel))
        .sort((a, b) => (a.order || 0) - (b.order || 0));
      setChannels(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [db, isOffline, ready, role]);

  // Save channel
  const saveChannel = useCallback(
    async (id: string | null, data: Partial<Channel>) => {
      if (isOffline) {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANNELS) || '[]');

        if (id) {
          // Update existing
          const updated = items.map((item: Channel) =>
            item.id === id ? { ...item, ...data } : item
          );
          localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(updated));
          setChannels(updated.sort((a: Channel, b: Channel) => (a.order || 0) - (b.order || 0)));
        } else {
          // Create new
          const newChannel = {
            ...data,
            id: Math.random().toString(36).substr(2, 9),
            order: items.length,
          };
          const updated = [...items, newChannel];
          localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(updated));
          setChannels(updated.sort((a: Channel, b: Channel) => (a.order || 0) - (b.order || 0)));
        }
        return;
      }

      if (!db) return;

      const ref = collection(db, 'artifacts', PROJECT_ID, 'public', 'data', 'channels');

      if (id) {
        await updateDoc(doc(ref, id), data);
      } else {
        await addDoc(ref, { ...data, order: channels.length });
      }
    },
    [db, isOffline, channels.length]
  );

  // Delete channel
  const deleteChannel = useCallback(
    async (id: string) => {
      if (isOffline) {
        const items = JSON.parse(localStorage.getItem(STORAGE_KEYS.CHANNELS) || '[]');
        const updated = items.filter((item: Channel) => item.id !== id);
        localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(updated));
        setChannels(updated);
        return;
      }

      if (!db) return;

      const ref = doc(db, 'artifacts', PROJECT_ID, 'public', 'data', 'channels', id);
      await deleteDoc(ref);
    },
    [db, isOffline]
  );

  return { channels, loading, saveChannel, deleteChannel };
}
