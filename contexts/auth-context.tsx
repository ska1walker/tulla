'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { Firestore, doc, onSnapshot } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/config';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
} from '@/lib/firebase/auth';
import { UserProfile, RegisterData, LoginData, Project, ProjectRole } from '@/types';

interface AuthContextType {
  // Auth state
  user: User | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  ready: boolean;
  isOffline: boolean;
  db: Firestore | null;
  error: string | null;

  // Current project context
  currentProject: Project | null;
  currentProjectRole: ProjectRole | null;
  setCurrentProject: (project: Project | null, role?: ProjectRole | null) => void;

  // Auth methods
  register: (data: RegisterData) => Promise<void>;
  login: (data: LoginData) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;

  // Legacy compatibility
  role: 'admin' | 'viewer' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [ready, setReady] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [db, setDb] = useState<Firestore | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Current project context
  const [currentProject, setCurrentProjectState] = useState<Project | null>(null);
  const [currentProjectRole, setCurrentProjectRole] = useState<ProjectRole | null>(null);

  // Initialize Firebase and listen to auth state
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const auth = getFirebaseAuth();
        const firestore = getFirebaseDb();

        if (mounted) {
          setDb(firestore);
        }

        // Listen to auth state changes
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
          if (!mounted) return;

          setUser(firebaseUser);

          if (firebaseUser) {
            // Load user profile
            try {
              const profile = await getUserProfile(firebaseUser.uid);
              if (mounted) {
                if (profile) {
                  setUserProfile({
                    id: firebaseUser.uid,
                    ...profile,
                  });

                  // Check if user is banned
                  if (profile.isBanned) {
                    await logoutUser();
                    setError('Ihr Konto wurde gesperrt.');
                    setUserProfile(null);
                  }
                } else {
                  // Profile doesn't exist yet, create basic profile
                  const newProfile = {
                    email: firebaseUser.email!,
                    displayName: firebaseUser.displayName,
                    isAdmin: false,
                    isBanned: false,
                    createdAt: new Date(),
                  };
                  await updateUserProfile(firebaseUser.uid, newProfile);
                  setUserProfile({
                    id: firebaseUser.uid,
                    ...newProfile,
                  });
                }
              }
            } catch (err) {
              console.error('Error loading user profile:', err);
              if (mounted) {
                setIsOffline(true);
              }
            }
          } else {
            if (mounted) {
              setUserProfile(null);
              setCurrentProjectState(null);
              setCurrentProjectRole(null);
            }
          }

          if (mounted) {
            setReady(true);
          }
        });

        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.error('Firebase initialization error:', err);
        if (mounted) {
          setIsOffline(true);
          setReady(true);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  // Subscribe to user profile changes in real-time
  useEffect(() => {
    if (!user || !db) return;

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(
      userDocRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          setUserProfile({
            id: user.uid,
            email: data.email,
            displayName: data.displayName,
            isAdmin: data.isAdmin || false,
            isBanned: data.isBanned || false,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate(),
          });

          // Logout if banned
          if (data.isBanned) {
            logoutUser();
            setError('Ihr Konto wurde gesperrt.');
          }
        }
      },
      (err) => {
        console.error('Error subscribing to user profile:', err);
      }
    );

    return () => unsubscribe();
  }, [user, db]);

  // Register new user
  const register = useCallback(async (data: RegisterData) => {
    setIsLoading(true);
    setError(null);

    try {
      await registerUser(data.email, data.password, data.displayName);
    } catch (err: unknown) {
      const errorMessage = getFirebaseErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Login
  const login = useCallback(async (data: LoginData) => {
    setIsLoading(true);
    setError(null);

    try {
      await loginUser(data.email, data.password);
    } catch (err: unknown) {
      const errorMessage = getFirebaseErrorMessage(err);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setCurrentProjectState(null);
      setCurrentProjectRole(null);

      // Clear all sensitive data from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('currentProjectId');
        localStorage.removeItem('pendingInvitationToken');
        localStorage.removeItem('emailForSignIn');
        sessionStorage.clear();
      }
    } catch (err: unknown) {
      console.error('Logout error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Set current project
  const setCurrentProject = useCallback((project: Project | null, role?: ProjectRole | null) => {
    setCurrentProjectState(project);
    setCurrentProjectRole(role ?? null);

    // Persist to localStorage
    if (typeof window !== 'undefined') {
      if (project) {
        localStorage.setItem('currentProjectId', project.id);
      } else {
        localStorage.removeItem('currentProjectId');
      }
    }
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Compute legacy role for backward compatibility
  const role = userProfile
    ? currentProjectRole === 'owner' || currentProjectRole === 'editor' || userProfile.isAdmin
      ? 'admin'
      : 'viewer'
    : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        isLoading,
        ready,
        isOffline,
        db,
        error,
        currentProject,
        currentProjectRole,
        setCurrentProject,
        register,
        login,
        logout,
        clearError,
        role,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Helper function to get user-friendly error messages
function getFirebaseErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'code' in error) {
    const firebaseError = error as { code: string };
    switch (firebaseError.code) {
      case 'auth/email-already-in-use':
        return 'Diese E-Mail-Adresse wird bereits verwendet.';
      case 'auth/invalid-email':
        return 'Ungültige E-Mail-Adresse.';
      case 'auth/operation-not-allowed':
        return 'Diese Anmeldemethode ist nicht aktiviert.';
      case 'auth/weak-password':
        return 'Das Passwort ist zu schwach. Mindestens 6 Zeichen.';
      case 'auth/user-disabled':
        return 'Dieses Konto wurde deaktiviert.';
      case 'auth/user-not-found':
        return 'Kein Konto mit dieser E-Mail-Adresse gefunden.';
      case 'auth/wrong-password':
        return 'Falsches Passwort.';
      case 'auth/invalid-credential':
        return 'Ungültige Anmeldedaten.';
      case 'auth/too-many-requests':
        return 'Zu viele Anmeldeversuche. Bitte versuchen Sie es später erneut.';
      default:
        return 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
    }
  }
  return 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
}

// Export types for convenience
export type { UserProfile, Project, ProjectRole };
