'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { UserProfile, Project } from '@/types';

interface AdminUser extends UserProfile {
  projectCount?: number;
}

interface AdminProject extends Project {
  ownerEmail?: string;
  memberCount?: number;
}

export function useAdmin() {
  const { userProfile, db, isOffline } = useAuth();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isAdmin = userProfile?.isAdmin || false;

  // Load all users (admin only)
  useEffect(() => {
    if (!db || !isAdmin || isOffline) {
      setUsers([]);
      setLoadingUsers(false);
      return;
    }

    setLoadingUsers(true);

    const usersRef = collection(db, 'users');
    const q = query(usersRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedUsers = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            email: data.email,
            displayName: data.displayName,
            isAdmin: data.isAdmin || false,
            isBanned: data.isBanned || false,
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp
              ? data.updatedAt.toDate()
              : undefined,
          } as AdminUser;
        });

        setUsers(loadedUsers);
        setLoadingUsers(false);
      },
      (err) => {
        console.error('Error loading users:', err);
        setError('Fehler beim Laden der Benutzer.');
        setLoadingUsers(false);
      }
    );

    return () => unsubscribe();
  }, [db, isAdmin, isOffline]);

  // Load all projects (admin only)
  useEffect(() => {
    if (!db || !isAdmin || isOffline) {
      setProjects([]);
      setLoadingProjects(false);
      return;
    }

    setLoadingProjects(true);

    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      async (snapshot) => {
        const loadedProjects = await Promise.all(
          snapshot.docs.map(async (projectDoc) => {
            const data = projectDoc.data();

            // Get owner email
            let ownerEmail: string | undefined;
            const owner = users.find((u) => u.id === data.ownerId);
            if (owner) {
              ownerEmail = owner.email;
            }

            return {
              id: projectDoc.id,
              name: data.name,
              description: data.description,
              ownerId: data.ownerId,
              createdAt: data.createdAt instanceof Timestamp
                ? data.createdAt.toDate()
                : new Date(data.createdAt),
              updatedAt: data.updatedAt instanceof Timestamp
                ? data.updatedAt.toDate()
                : undefined,
              ownerEmail,
            } as AdminProject;
          })
        );

        setProjects(loadedProjects);
        setLoadingProjects(false);
      },
      (err) => {
        console.error('Error loading projects:', err);
        setError('Fehler beim Laden der Projekte.');
        setLoadingProjects(false);
      }
    );

    return () => unsubscribe();
  }, [db, isAdmin, isOffline, users]);

  // Ban/unban a user
  const toggleUserBan = useCallback(
    async (userId: string, banned: boolean): Promise<void> => {
      if (!db || !isAdmin) {
        throw new Error('Keine Berechtigung.');
      }

      // Prevent self-ban
      if (userId === userProfile?.id) {
        throw new Error('Sie können sich nicht selbst sperren.');
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isBanned: banned,
      });
    },
    [db, isAdmin, userProfile]
  );

  // Toggle admin status
  const toggleUserAdmin = useCallback(
    async (userId: string, isAdmin: boolean): Promise<void> => {
      if (!db || !userProfile?.isAdmin) {
        throw new Error('Keine Berechtigung.');
      }

      // Prevent self-demotion
      if (userId === userProfile.id && !isAdmin) {
        throw new Error('Sie können sich nicht selbst als Admin entfernen.');
      }

      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        isAdmin: isAdmin,
      });
    },
    [db, userProfile]
  );

  // Delete a user
  const deleteUser = useCallback(
    async (userId: string): Promise<void> => {
      if (!db || !isAdmin) {
        throw new Error('Keine Berechtigung.');
      }

      // Prevent self-deletion
      if (userId === userProfile?.id) {
        throw new Error('Sie können sich nicht selbst löschen.');
      }

      // Note: This only deletes the Firestore document
      // The Firebase Auth user would need to be deleted via Admin SDK
      const userRef = doc(db, 'users', userId);
      await deleteDoc(userRef);
    },
    [db, isAdmin, userProfile]
  );

  // Delete a project (admin override)
  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      if (!db || !isAdmin) {
        throw new Error('Keine Berechtigung.');
      }

      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);
    },
    [db, isAdmin]
  );

  return {
    users,
    projects,
    loadingUsers,
    loadingProjects,
    error,
    isAdmin,
    toggleUserBan,
    toggleUserAdmin,
    deleteUser,
    deleteProject,
  };
}
