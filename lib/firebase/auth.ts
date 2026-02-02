'use client';

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
  signOut,
  updateProfile,
  deleteUser,
  User,
  ActionCodeSettings,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
  writeBatch,
} from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from './config';
import { UserProfileData } from '@/types';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

// Action code settings for email links
const getActionCodeSettings = (continueUrl: string): ActionCodeSettings => ({
  url: continueUrl,
  handleCodeInApp: true,
});

// Register a new user with email and password
export async function registerUser(
  email: string,
  password: string,
  displayName?: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();

  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // Update display name if provided
  if (displayName) {
    await updateProfile(user, { displayName });
  }

  // Create user profile in Firestore
  const userProfile: UserProfileData = {
    email: user.email!,
    displayName: displayName || null,
    isAdmin: false,
    isBanned: false,
    createdAt: new Date(),
  };

  await setDoc(doc(db, 'users', user.uid), {
    ...userProfile,
    createdAt: serverTimestamp(),
  });

  return user;
}

// Login with email and password
export async function loginUser(email: string, password: string): Promise<User> {
  const auth = getFirebaseAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Logout
export async function logoutUser(): Promise<void> {
  const auth = getFirebaseAuth();
  await signOut(auth);
}

// Send password reset email
export async function sendPasswordReset(email: string): Promise<void> {
  const auth = getFirebaseAuth();
  const actionCodeSettings = getActionCodeSettings(`${APP_URL}/auth/action?mode=resetPassword`);
  await sendPasswordResetEmail(auth, email, actionCodeSettings);
}

// Send invitation email link
export async function sendInvitationEmail(
  email: string,
  invitationToken: string
): Promise<void> {
  const auth = getFirebaseAuth();
  const continueUrl = `${APP_URL}/invite/accept?token=${invitationToken}`;
  const actionCodeSettings = getActionCodeSettings(continueUrl);

  await sendSignInLinkToEmail(auth, email, actionCodeSettings);

  // Store email for sign-in completion
  if (typeof window !== 'undefined') {
    window.localStorage.setItem('emailForSignIn', email);
  }
}

// Check if URL is a sign-in link
export function isEmailSignInLink(url: string): boolean {
  const auth = getFirebaseAuth();
  return isSignInWithEmailLink(auth, url);
}

// Complete sign-in with email link
export async function completeEmailSignIn(
  email: string,
  url: string
): Promise<User> {
  const auth = getFirebaseAuth();
  const result = await signInWithEmailLink(auth, email, url);

  // Clear stored email
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem('emailForSignIn');
  }

  return result.user;
}

// Get user profile from Firestore
export async function getUserProfile(userId: string): Promise<UserProfileData | null> {
  const db = getFirebaseDb();
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      createdAt: data.createdAt?.toDate() || new Date(),
      updatedAt: data.updatedAt?.toDate(),
    } as UserProfileData;
  }

  return null;
}

// Create or update user profile
export async function updateUserProfile(
  userId: string,
  data: Partial<UserProfileData>
): Promise<void> {
  const db = getFirebaseDb();
  const docRef = doc(db, 'users', userId);

  await setDoc(
    docRef,
    {
      ...data,
      updatedAt: serverTimestamp(),
    },
    { merge: true }
  );
}

// Check if user is banned
export async function checkUserBanned(userId: string): Promise<boolean> {
  const profile = await getUserProfile(userId);
  return profile?.isBanned || false;
}

// Delete user account and all associated data (DSGVO Art. 17)
export async function deleteUserAccount(): Promise<void> {
  const auth = getFirebaseAuth();
  const db = getFirebaseDb();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Nicht angemeldet.');
  }

  const userId = user.uid;

  // Helper function to delete all documents in a subcollection
  async function deleteSubcollection(projectId: string, subcollectionName: string) {
    const subcollectionRef = collection(db, 'projects', projectId, subcollectionName);
    const snapshot = await getDocs(subcollectionRef);

    const batch = writeBatch(db);
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    if (snapshot.docs.length > 0) {
      await batch.commit();
    }
  }

  // 1. Find and delete all projects owned by this user
  const projectsRef = collection(db, 'projects');
  const ownedProjectsQuery = query(projectsRef, where('ownerId', '==', userId));
  const ownedProjects = await getDocs(ownedProjectsQuery);

  for (const projectDoc of ownedProjects.docs) {
    const projectId = projectDoc.id;

    // Delete all subcollections
    await deleteSubcollection(projectId, 'campaigns');
    await deleteSubcollection(projectId, 'channels');
    await deleteSubcollection(projectId, 'campaignTypes');
    await deleteSubcollection(projectId, 'members');
    await deleteSubcollection(projectId, 'invitations');
    await deleteSubcollection(projectId, 'settings');

    // Delete the project document
    await deleteDoc(doc(db, 'projects', projectId));
  }

  // 2. Remove user from projects they're members of (but don't own)
  const allProjectsSnapshot = await getDocs(projectsRef);
  for (const projectDoc of allProjectsSnapshot.docs) {
    const memberRef = doc(db, 'projects', projectDoc.id, 'members', userId);
    const memberDoc = await getDoc(memberRef);
    if (memberDoc.exists()) {
      await deleteDoc(memberRef);
    }
  }

  // 3. Delete user profile from Firestore
  await deleteDoc(doc(db, 'users', userId));

  // 4. Delete Firebase Auth user (must be last)
  await deleteUser(user);

  // 5. Clear local storage
  if (typeof window !== 'undefined') {
    localStorage.removeItem('currentProjectId');
    localStorage.removeItem('pendingInvitationToken');
    localStorage.removeItem('emailForSignIn');
    localStorage.removeItem('maiflow-cookie-consent');
    sessionStorage.clear();
  }
}
