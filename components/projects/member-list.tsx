'use client';

import { useState } from 'react';
import { User, MoreVertical, Trash2, Shield, Eye, Edit3, Crown, Loader2 } from 'lucide-react';
import { ProjectMember, ProjectRole } from '@/types';
import { useAuth } from '@/contexts/auth-context';

interface MemberListProps {
  members: ProjectMember[];
  loading: boolean;
  onUpdateRole: (userId: string, role: ProjectRole) => Promise<void>;
  onRemoveMember: (userId: string) => Promise<void>;
}

const roleLabels: Record<ProjectRole, string> = {
  owner: 'Eigentümer',
  editor: 'Editor',
  viewer: 'Betrachter',
};

const roleIcons: Record<ProjectRole, React.ReactNode> = {
  owner: <Crown className="w-4 h-4" />,
  editor: <Edit3 className="w-4 h-4" />,
  viewer: <Eye className="w-4 h-4" />,
};

const roleColors: Record<ProjectRole, string> = {
  owner: 'bg-rose-100 text-rose-700 border-rose-200',
  editor: 'bg-blue-100 text-blue-700 border-blue-200',
  viewer: 'bg-stone-100 text-stone-600 border-stone-200',
};

export function MemberList({
  members,
  loading,
  onUpdateRole,
  onRemoveMember,
}: MemberListProps) {
  const { user } = useAuth();
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const handleUpdateRole = async (userId: string, role: ProjectRole) => {
    setUpdatingId(userId);
    setOpenMenuId(null);
    try {
      await onUpdateRole(userId, role);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemoveMember = async (userId: string) => {
    setUpdatingId(userId);
    setOpenMenuId(null);
    try {
      await onRemoveMember(userId);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        Keine Mitglieder gefunden.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {members.map((member) => {
        const isCurrentUser = member.userId === user?.uid;
        const isOwner = member.role === 'owner';
        const canEdit = !isOwner && !isCurrentUser;

        return (
          <div
            key={member.userId}
            className="flex items-center justify-between p-4 bg-white border border-stone-200 rounded-xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900">
                  {member.displayName || member.email?.split('@')[0] || 'Unbekannt'}
                  {isCurrentUser && (
                    <span className="text-stone-400 text-sm ml-2">(Sie)</span>
                  )}
                </p>
                <p className="text-sm text-stone-500">{member.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${roleColors[member.role]}`}
              >
                {roleIcons[member.role]}
                {roleLabels[member.role]}
              </span>

              {canEdit && (
                <div className="relative">
                  {updatingId === member.userId ? (
                    <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === member.userId ? null : member.userId)
                        }
                        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === member.userId && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-10">
                          <div className="p-1">
                            <p className="px-3 py-1.5 text-xs font-medium text-stone-400">
                              Rolle ändern
                            </p>
                            {member.role !== 'editor' && (
                              <button
                                onClick={() => handleUpdateRole(member.userId, 'editor')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                              >
                                <Edit3 className="w-4 h-4" />
                                Zum Editor machen
                              </button>
                            )}
                            {member.role !== 'viewer' && (
                              <button
                                onClick={() => handleUpdateRole(member.userId, 'viewer')}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                                Zum Betrachter machen
                              </button>
                            )}
                          </div>
                          <div className="border-t border-stone-100 p-1">
                            <button
                              onClick={() => handleRemoveMember(member.userId)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Entfernen
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
