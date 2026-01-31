// User types for authentication and user management

export type SystemRole = 'admin' | 'user';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface UserProfileData {
  email: string;
  displayName: string | null;
  isAdmin: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

// For registration
export interface RegisterData {
  email: string;
  password: string;
  displayName?: string;
}

// For login
export interface LoginData {
  email: string;
  password: string;
}
