'use client';

import { useState, useEffect, useCallback } from 'react';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { useAuth } from '@/contexts/auth-context';

interface UpdateProfileData {
  displayName?: string;
}

export function useUser() {
  const { user, userProfile, db, isOffline } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update user profile
  const updateUserProfile = useCallback(
    async (data: UpdateProfileData) => {
      if (!user || !db || isOffline) {
        setError('Nicht angemeldet oder offline.');
        return;
      }

      setIsUpdating(true);
      setError(null);

      try {
        // Update Firebase Auth profile
        if (data.displayName !== undefined) {
          await updateProfile(user, { displayName: data.displayName });
        }

        // Update Firestore profile
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          ...data,
          updatedAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('Error updating profile:', err);
        setError('Fehler beim Aktualisieren des Profils.');
        throw err;
      } finally {
        setIsUpdating(false);
      }
    },
    [user, db, isOffline]
  );

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    userProfile,
    isUpdating,
    error,
    updateUserProfile,
    clearError,
  };
}
