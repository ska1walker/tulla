'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  setDoc,
  deleteDoc,
  getDoc,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { ProjectMember, ProjectRole, UserProfile } from '@/types';

export function useProjectMembers(projectId?: string) {
  const { db, isOffline, currentProject } = useAuth();
  const [members, setMembers] = useState<ProjectMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use provided projectId or fall back to current project
  const activeProjectId = projectId || currentProject?.id;

  // Load project members
  useEffect(() => {
    if (!db || !activeProjectId || isOffline) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const membersRef = collection(db, 'projects', activeProjectId, 'members');
    const unsubscribe = onSnapshot(
      membersRef,
      async (snapshot) => {
        const memberPromises = snapshot.docs.map(async (memberDoc) => {
          const memberData = memberDoc.data();
          let userProfile: Partial<UserProfile> = {};

          // Fetch user profile for each member
          try {
            const userDoc = await getDoc(doc(db, 'users', memberDoc.id));
            if (userDoc.exists()) {
              const userData = userDoc.data();
              userProfile = {
                email: userData.email,
                displayName: userData.displayName,
              };
            }
          } catch (err) {
            console.error('Error fetching user profile:', err);
          }

          return {
            userId: memberDoc.id,
            role: memberData.role as ProjectRole,
            joinedAt: memberData.joinedAt instanceof Timestamp
              ? memberData.joinedAt.toDate()
              : new Date(memberData.joinedAt),
            email: userProfile.email,
            displayName: userProfile.displayName || undefined,
          };
        });

        const loadedMembers = await Promise.all(memberPromises);

        // Sort: owner first, then editors, then viewers
        const roleOrder: Record<ProjectRole, number> = { owner: 0, editor: 1, viewer: 2 };
        loadedMembers.sort((a, b) => roleOrder[a.role] - roleOrder[b.role]);

        setMembers(loadedMembers);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading project members:', err);
        setError('Fehler beim Laden der Mitglieder.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, activeProjectId, isOffline]);

  // Add a member to the project
  const addMember = useCallback(
    async (userId: string, role: ProjectRole): Promise<void> => {
      if (!db || !activeProjectId) {
        throw new Error('Nicht angemeldet.');
      }

      const memberRef = doc(db, 'projects', activeProjectId, 'members', userId);
      await setDoc(memberRef, {
        role,
        joinedAt: serverTimestamp(),
      });
    },
    [db, activeProjectId]
  );

  // Update a member's role
  const updateMemberRole = useCallback(
    async (userId: string, newRole: ProjectRole): Promise<void> => {
      if (!db || !activeProjectId) {
        throw new Error('Nicht angemeldet.');
      }

      // Prevent changing owner role
      const member = members.find((m) => m.userId === userId);
      if (member?.role === 'owner') {
        throw new Error('Die Rolle des Eigentümers kann nicht geändert werden.');
      }

      const memberRef = doc(db, 'projects', activeProjectId, 'members', userId);
      await setDoc(memberRef, { role: newRole }, { merge: true });
    },
    [db, activeProjectId, members]
  );

  // Remove a member from the project
  const removeMember = useCallback(
    async (userId: string): Promise<void> => {
      if (!db || !activeProjectId) {
        throw new Error('Nicht angemeldet.');
      }

      // Prevent removing owner
      const member = members.find((m) => m.userId === userId);
      if (member?.role === 'owner') {
        throw new Error('Der Eigentümer kann nicht entfernt werden.');
      }

      const memberRef = doc(db, 'projects', activeProjectId, 'members', userId);
      await deleteDoc(memberRef);
    },
    [db, activeProjectId, members]
  );

  // Transfer ownership
  const transferOwnership = useCallback(
    async (newOwnerId: string): Promise<void> => {
      if (!db || !activeProjectId) {
        throw new Error('Nicht angemeldet.');
      }

      const currentOwner = members.find((m) => m.role === 'owner');
      if (!currentOwner) {
        throw new Error('Kein aktueller Eigentümer gefunden.');
      }

      // Update new owner
      const newOwnerRef = doc(db, 'projects', activeProjectId, 'members', newOwnerId);
      await setDoc(newOwnerRef, { role: 'owner' }, { merge: true });

      // Demote old owner to editor
      const oldOwnerRef = doc(db, 'projects', activeProjectId, 'members', currentOwner.userId);
      await setDoc(oldOwnerRef, { role: 'editor' }, { merge: true });

      // Update project document
      const projectRef = doc(db, 'projects', activeProjectId);
      await setDoc(projectRef, { ownerId: newOwnerId }, { merge: true });
    },
    [db, activeProjectId, members]
  );

  return {
    members,
    loading,
    error,
    addMember,
    updateMemberRole,
    removeMember,
    transferOwnership,
  };
}
