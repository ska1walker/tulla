'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
import { STORAGE_KEYS } from '@/lib/constants';

// Default channel that will be created if none exist
const DEFAULT_CHANNEL = {
  name: 'Social Media',
  color: '#F43F5E',
  order: 0,
};

export function useChannels(projectId?: string) {
  const { db, isOffline, ready, role, currentProject } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const defaultChannelCreated = useRef(false);

  // Use provided projectId or fall back to current project
  const activeProjectId = projectId || currentProject?.id;

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

    if (!db || !activeProjectId) {
      setChannels([]);
      setLoading(false);
      return;
    }

    const ref = collection(db, 'projects', activeProjectId, 'channels');
    const unsubscribe = onSnapshot(ref, async (snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...doc.data(),
        } as Channel))
        .sort((a, b) => (a.order || 0) - (b.order || 0));

      // Auto-create default channel if none exist
      if (data.length === 0 && !defaultChannelCreated.current) {
        defaultChannelCreated.current = true;
        try {
          await addDoc(ref, DEFAULT_CHANNEL);
          // The onSnapshot will fire again with the new channel
        } catch (err) {
          console.error('Error creating default channel:', err);
          defaultChannelCreated.current = false;
        }
      } else {
        setChannels(data);
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      defaultChannelCreated.current = false;
    };
  }, [db, isOffline, ready, role, activeProjectId]);

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

      if (!db || !activeProjectId) {
        throw new Error('Keine Verbindung zur Datenbank.');
      }

      const ref = collection(db, 'projects', activeProjectId, 'channels');

      if (id) {
        await updateDoc(doc(ref, id), data);
      } else {
        await addDoc(ref, { ...data, order: channels.length });
      }
    },
    [db, isOffline, channels.length, activeProjectId]
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

      if (!db || !activeProjectId) {
        throw new Error('Keine Verbindung zur Datenbank.');
      }

      const ref = doc(db, 'projects', activeProjectId, 'channels', id);
      await deleteDoc(ref);
    },
    [db, isOffline, activeProjectId]
  );

  return { channels, loading, saveChannel, deleteChannel };
}
