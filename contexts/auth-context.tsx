'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { Firestore } from 'firebase/firestore';
import { getFirebaseAuth, getFirebaseDb } from '@/lib/firebase/config';

export type UserRole = 'admin' | 'viewer' | null;

interface AuthContextType {
  user: User | null;
  role: UserRole;
  isOffline: boolean;
  ready: boolean;
  db: Firestore | null;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [ready, setReady] = useState(false);
  const [db, setDb] = useState<Firestore | null>(null);

  useEffect(() => {
    let mounted = true;

    const init = async () => {
      try {
        const auth = getFirebaseAuth();
        const firestore = getFirebaseDb();

        if (mounted) setDb(firestore);

        try {
          await signInAnonymously(auth);
        } catch {
          if (mounted) setIsOffline(true);
        }

        onAuthStateChanged(auth, (u) => {
          if (mounted) {
            setUser(u);
            setReady(true);
          }
        });
      } catch {
        if (mounted) {
          setIsOffline(true);
          setReady(true);
          // Create a mock user for offline mode
          setUser({ uid: 'local_user', isAnonymous: true } as User);
        }
      }
    };

    init();

    return () => {
      mounted = false;
    };
  }, []);

  const logout = () => {
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, isOffline, ready, db, setRole, logout }}>
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
