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
  User,
  ActionCodeSettings,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
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
