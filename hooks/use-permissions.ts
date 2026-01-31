'use client';

import { useMemo } from 'react';
import { useAuth } from '@/contexts/auth-context';
import { ProjectRole } from '@/types';

interface Permissions {
  // Project permissions
  canViewProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
  canManageMembers: boolean;
  canInviteMembers: boolean;
  canRemoveMembers: boolean;

  // Campaign permissions
  canViewCampaigns: boolean;
  canCreateCampaign: boolean;
  canEditCampaign: boolean;
  canDeleteCampaign: boolean;

  // Channel permissions
  canManageChannels: boolean;

  // Settings permissions
  canEditSettings: boolean;

  // Admin permissions
  isSystemAdmin: boolean;
  canAccessAdminDashboard: boolean;
  canBanUsers: boolean;
  canDeleteUsers: boolean;
  canManageAllProjects: boolean;
}

export function usePermissions(projectId?: string): Permissions {
  const { userProfile, currentProjectRole } = useAuth();

  return useMemo(() => {
    const isAdmin = userProfile?.isAdmin || false;
    const role = currentProjectRole;

    // Base permissions based on project role
    const isOwner = role === 'owner';
    const isEditor = role === 'editor';
    const isViewer = role === 'viewer';
    const hasProjectAccess = isOwner || isEditor || isViewer;

    return {
      // Project permissions
      canViewProject: hasProjectAccess || isAdmin,
      canEditProject: isOwner || isAdmin,
      canDeleteProject: isOwner || isAdmin,
      canManageMembers: isOwner || isAdmin,
      canInviteMembers: isOwner || isAdmin,
      canRemoveMembers: isOwner || isAdmin,

      // Campaign permissions
      canViewCampaigns: hasProjectAccess || isAdmin,
      canCreateCampaign: isOwner || isEditor || isAdmin,
      canEditCampaign: isOwner || isEditor || isAdmin,
      canDeleteCampaign: isOwner || isEditor || isAdmin,

      // Channel permissions
      canManageChannels: isOwner || isEditor || isAdmin,

      // Settings permissions
      canEditSettings: isOwner || isEditor || isAdmin,

      // Admin permissions
      isSystemAdmin: isAdmin,
      canAccessAdminDashboard: isAdmin,
      canBanUsers: isAdmin,
      canDeleteUsers: isAdmin,
      canManageAllProjects: isAdmin,
    };
  }, [userProfile, currentProjectRole]);
}

// Helper function to check if a role can perform an action
export function canRolePerform(role: ProjectRole | null, action: keyof Permissions): boolean {
  if (!role) return false;

  const rolePermissions: Record<ProjectRole, Partial<Record<keyof Permissions, boolean>>> = {
    owner: {
      canViewProject: true,
      canEditProject: true,
      canDeleteProject: true,
      canManageMembers: true,
      canInviteMembers: true,
      canRemoveMembers: true,
      canViewCampaigns: true,
      canCreateCampaign: true,
      canEditCampaign: true,
      canDeleteCampaign: true,
      canManageChannels: true,
      canEditSettings: true,
    },
    editor: {
      canViewProject: true,
      canViewCampaigns: true,
      canCreateCampaign: true,
      canEditCampaign: true,
      canDeleteCampaign: true,
      canManageChannels: true,
      canEditSettings: true,
    },
    viewer: {
      canViewProject: true,
      canViewCampaigns: true,
    },
  };

  return rolePermissions[role][action] || false;
}
