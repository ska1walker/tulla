'use client';

import { useState } from 'react';
import { User, Shield, Ban, Trash2, MoreVertical, Loader2, ShieldOff, ShieldCheck } from 'lucide-react';
import { UserProfile } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface UserTableProps {
  users: UserProfile[];
  loading: boolean;
  currentUserId?: string;
  onToggleBan: (userId: string, banned: boolean) => Promise<void>;
  onToggleAdmin: (userId: string, isAdmin: boolean) => Promise<void>;
  onDelete: (userId: string) => Promise<void>;
}

export function UserTable({
  users,
  loading,
  currentUserId,
  onToggleBan,
  onToggleAdmin,
  onDelete,
}: UserTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleAction = async (action: () => Promise<void>, userId: string) => {
    setActionLoading(userId);
    setOpenMenuId(null);
    try {
      await action();
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        Keine Benutzer gefunden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-500 text-sm">
              Benutzer
            </th>
            <th className="text-left py-3 px-4 font-medium text-stone-500 text-sm">
              Rolle
            </th>
            <th className="text-left py-3 px-4 font-medium text-stone-500 text-sm">
              Status
            </th>
            <th className="text-left py-3 px-4 font-medium text-stone-500 text-sm">
              Erstellt
            </th>
            <th className="text-right py-3 px-4 font-medium text-stone-500 text-sm">
              Aktionen
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isCurrentUser = user.id === currentUserId;
            const canManage = !isCurrentUser;

            return (
              <tr key={user.id} className="border-b border-stone-100 hover:bg-stone-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium text-stone-900">
                        {user.displayName || user.email.split('@')[0]}
                        {isCurrentUser && (
                          <span className="text-stone-400 text-sm ml-2">(Sie)</span>
                        )}
                      </p>
                      <p className="text-sm text-stone-500">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  {user.isAdmin ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-medium">
                      <Shield className="w-3 h-3" />
                      Admin
                    </span>
                  ) : (
                    <span className="text-stone-500 text-sm">Benutzer</span>
                  )}
                </td>
                <td className="py-4 px-4">
                  {user.isBanned ? (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                      <Ban className="w-3 h-3" />
                      Gesperrt
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Aktiv
                    </span>
                  )}
                </td>
                <td className="py-4 px-4 text-sm text-stone-500">
                  {format(user.createdAt, 'dd. MMM yyyy', { locale: de })}
                </td>
                <td className="py-4 px-4 text-right">
                  {canManage && (
                    <div className="relative inline-block">
                      {actionLoading === user.id ? (
                        <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                      ) : (
                        <>
                          <button
                            onClick={() =>
                              setOpenMenuId(openMenuId === user.id ? null : user.id)
                            }
                            className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </button>

                          {openMenuId === user.id && (
                            <div className="absolute right-0 top-full mt-1 w-52 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-10">
                              <div className="p-1">
                                {user.isBanned ? (
                                  <button
                                    onClick={() =>
                                      handleAction(() => onToggleBan(user.id, false), user.id)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  >
                                    <ShieldCheck className="w-4 h-4" />
                                    Entsperren
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleAction(() => onToggleBan(user.id, true), user.id)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                                  >
                                    <Ban className="w-4 h-4" />
                                    Sperren
                                  </button>
                                )}

                                {user.isAdmin ? (
                                  <button
                                    onClick={() =>
                                      handleAction(() => onToggleAdmin(user.id, false), user.id)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-stone-600 hover:bg-stone-50 rounded-lg transition-colors"
                                  >
                                    <ShieldOff className="w-4 h-4" />
                                    Admin entfernen
                                  </button>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleAction(() => onToggleAdmin(user.id, true), user.id)
                                    }
                                    className="w-full flex items-center gap-2 px-3 py-2 text-left text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                                  >
                                    <Shield className="w-4 h-4" />
                                    Zum Admin machen
                                  </button>
                                )}
                              </div>
                              <div className="border-t border-stone-100 p-1">
                                <button
                                  onClick={() =>
                                    handleAction(() => onDelete(user.id), user.id)
                                  }
                                  className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                  Löschen
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
