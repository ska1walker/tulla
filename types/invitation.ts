// Invitation types for project invitations via magic links

import { ProjectRole } from './project';

export type InvitationStatus = 'pending' | 'accepted' | 'expired' | 'cancelled';

export interface Invitation {
  id: string;
  projectId: string;
  projectName?: string; // Populated field
  email: string;
  role: ProjectRole;
  token: string;
  status: InvitationStatus;
  invitedBy: string;
  invitedByName?: string; // Populated field
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

export interface InvitationData {
  projectId: string;
  email: string;
  role: ProjectRole;
  token: string;
  status: InvitationStatus;
  invitedBy: string;
  createdAt: Date;
  expiresAt: Date;
  acceptedAt?: Date;
}

// For creating a new invitation
export interface CreateInvitationData {
  email: string;
  role: ProjectRole;
}
