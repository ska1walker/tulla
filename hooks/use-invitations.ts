'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  getDoc,
  query,
  where,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { useAuth } from '@/contexts/auth-context';
import { Invitation, InvitationData, CreateInvitationData, InvitationStatus, ProjectRole } from '@/types';
import { sendInvitationEmail } from '@/lib/firebase/auth';

// Invitation expires after 7 days
const INVITATION_EXPIRY_DAYS = 7;

export function useInvitations(projectId?: string) {
  const { user, userProfile, db, isOffline, currentProject } = useAuth();
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Use provided projectId or fall back to current project
  const activeProjectId = projectId || currentProject?.id;

  // Load invitations for the project
  useEffect(() => {
    if (!db || !activeProjectId || isOffline) {
      setInvitations([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    const invitationsRef = collection(db, 'invitations');
    const q = query(invitationsRef, where('projectId', '==', activeProjectId));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const loadedInvitations = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            projectId: data.projectId,
            email: data.email,
            role: data.role as ProjectRole,
            token: data.token,
            status: data.status as InvitationStatus,
            invitedBy: data.invitedBy,
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate()
              : new Date(data.createdAt),
            expiresAt: data.expiresAt instanceof Timestamp
              ? data.expiresAt.toDate()
              : new Date(data.expiresAt),
            acceptedAt: data.acceptedAt instanceof Timestamp
              ? data.acceptedAt.toDate()
              : data.acceptedAt
              ? new Date(data.acceptedAt)
              : undefined,
          } as Invitation;
        });

        // Sort by creation date (newest first)
        loadedInvitations.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

        setInvitations(loadedInvitations);
        setLoading(false);
      },
      (err) => {
        console.error('Error loading invitations:', err);
        setError('Fehler beim Laden der Einladungen.');
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, activeProjectId, isOffline]);

  // Create a new invitation
  const createInvitation = useCallback(
    async (data: CreateInvitationData): Promise<Invitation> => {
      if (!db || !user || !activeProjectId) {
        throw new Error('Nicht angemeldet.');
      }

      // Check if there's already a pending invitation for this email
      const existingInvitation = invitations.find(
        (inv) => inv.email.toLowerCase() === data.email.toLowerCase() && inv.status === 'pending'
      );

      if (existingInvitation) {
        throw new Error('Es existiert bereits eine ausstehende Einladung für diese E-Mail-Adresse.');
      }

      // Generate unique token
      const token = nanoid(32);

      // Calculate expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + INVITATION_EXPIRY_DAYS);

      const invitationData: InvitationData = {
        projectId: activeProjectId,
        email: data.email.toLowerCase(),
        role: data.role,
        token,
        status: 'pending',
        invitedBy: user.uid,
        createdAt: new Date(),
        expiresAt,
      };

      // Save to Firestore
      const docRef = await addDoc(collection(db, 'invitations'), {
        ...invitationData,
        createdAt: serverTimestamp(),
        expiresAt: Timestamp.fromDate(expiresAt),
      });

      // Send invitation email
      try {
        await sendInvitationEmail(data.email, token);
      } catch (err) {
        console.error('Error sending invitation email:', err);
        // Don't throw - invitation was created, email sending failed
      }

      return {
        id: docRef.id,
        ...invitationData,
        invitedByName: userProfile?.displayName || undefined,
      };
    },
    [db, user, userProfile, activeProjectId, invitations]
  );

  // Cancel an invitation
  const cancelInvitation = useCallback(
    async (invitationId: string): Promise<void> => {
      if (!db) {
        throw new Error('Nicht angemeldet.');
      }

      const invitationRef = doc(db, 'invitations', invitationId);
      await updateDoc(invitationRef, {
        status: 'cancelled',
      });
    },
    [db]
  );

  // Resend invitation email
  const resendInvitation = useCallback(
    async (invitationId: string): Promise<void> => {
      if (!db) {
        throw new Error('Nicht angemeldet.');
      }

      const invitation = invitations.find((inv) => inv.id === invitationId);
      if (!invitation) {
        throw new Error('Einladung nicht gefunden.');
      }

      if (invitation.status !== 'pending') {
        throw new Error('Diese Einladung kann nicht erneut gesendet werden.');
      }

      // Check if expired and update expiry
      const now = new Date();
      if (invitation.expiresAt < now) {
        const newExpiresAt = new Date();
        newExpiresAt.setDate(newExpiresAt.getDate() + INVITATION_EXPIRY_DAYS);

        const invitationRef = doc(db, 'invitations', invitationId);
        await updateDoc(invitationRef, {
          expiresAt: Timestamp.fromDate(newExpiresAt),
        });
      }

      await sendInvitationEmail(invitation.email, invitation.token);
    },
    [db, invitations]
  );

  return {
    invitations,
    loading,
    error,
    createInvitation,
    cancelInvitation,
    resendInvitation,
  };
}

// Hook for accepting invitations
export function useAcceptInvitation() {
  const { user, db } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const acceptInvitation = useCallback(
    async (token: string): Promise<{ projectId: string; role: ProjectRole } | null> => {
      if (!db || !user) {
        setError('Bitte melden Sie sich an, um die Einladung anzunehmen.');
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        // Find invitation by token
        const invitationsRef = collection(db, 'invitations');
        const q = query(invitationsRef, where('token', '==', token));

        // Get the invitation
        const { getDocs } = await import('firebase/firestore');
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
          setError('Einladung nicht gefunden oder abgelaufen.');
          return null;
        }

        const invitationDoc = snapshot.docs[0];
        const invitation = invitationDoc.data();

        // Check if already accepted
        if (invitation.status === 'accepted') {
          setError('Diese Einladung wurde bereits verwendet.');
          return null;
        }

        // Check if cancelled
        if (invitation.status === 'cancelled') {
          setError('Diese Einladung wurde zurückgezogen.');
          return null;
        }

        // Check if expired
        const expiresAt = invitation.expiresAt instanceof Timestamp
          ? invitation.expiresAt.toDate()
          : new Date(invitation.expiresAt);

        if (expiresAt < new Date()) {
          setError('Diese Einladung ist abgelaufen.');
          await updateDoc(doc(db, 'invitations', invitationDoc.id), {
            status: 'expired',
          });
          return null;
        }

        // Add user to project members
        const { setDoc, serverTimestamp } = await import('firebase/firestore');
        await setDoc(
          doc(db, 'projects', invitation.projectId, 'members', user.uid),
          {
            role: invitation.role,
            joinedAt: serverTimestamp(),
          }
        );

        // Mark invitation as accepted
        await updateDoc(doc(db, 'invitations', invitationDoc.id), {
          status: 'accepted',
          acceptedAt: serverTimestamp(),
        });

        return {
          projectId: invitation.projectId,
          role: invitation.role as ProjectRole,
        };
      } catch (err) {
        console.error('Error accepting invitation:', err);
        setError('Fehler beim Annehmen der Einladung.');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [db, user]
  );

  return {
    acceptInvitation,
    loading,
    error,
  };
}
