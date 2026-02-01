'use client';

import { useState } from 'react';
import { Mail, Clock, CheckCircle, XCircle, AlertCircle, MoreVertical, Trash2, RefreshCw, Loader2 } from 'lucide-react';
import { Invitation, InvitationStatus, ProjectRole } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { de } from 'date-fns/locale';

interface InvitationListProps {
  invitations: Invitation[];
  loading: boolean;
  onCancel: (invitationId: string) => Promise<void>;
  onResend: (invitationId: string) => Promise<void>;
}

const statusLabels: Record<InvitationStatus, string> = {
  pending: 'Ausstehend',
  accepted: 'Angenommen',
  expired: 'Abgelaufen',
  cancelled: 'Zurückgezogen',
};

const statusIcons: Record<InvitationStatus, React.ReactNode> = {
  pending: <Clock className="w-4 h-4" />,
  accepted: <CheckCircle className="w-4 h-4" />,
  expired: <AlertCircle className="w-4 h-4" />,
  cancelled: <XCircle className="w-4 h-4" />,
};

const statusColors: Record<InvitationStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  accepted: 'bg-green-100 text-green-700 border-green-200',
  expired: 'bg-stone-100 text-stone-500 border-stone-200',
  cancelled: 'bg-red-100 text-red-600 border-red-200',
};

const roleLabels: Record<ProjectRole, string> = {
  owner: 'Eigentümer',
  editor: 'Editor',
  viewer: 'Betrachter',
};

export function InvitationList({
  invitations,
  loading,
  onCancel,
  onResend,
}: InvitationListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleCancel = async (invitationId: string) => {
    setProcessingId(invitationId);
    setOpenMenuId(null);
    try {
      await onCancel(invitationId);
    } finally {
      setProcessingId(null);
    }
  };

  const handleResend = async (invitationId: string) => {
    setProcessingId(invitationId);
    setOpenMenuId(null);
    try {
      await onResend(invitationId);
    } finally {
      setProcessingId(null);
    }
  };

  // Check if invitation is expired
  const isExpired = (invitation: Invitation): boolean => {
    return invitation.status === 'pending' && invitation.expiresAt < new Date();
  };

  // Get display status (check for expiry)
  const getDisplayStatus = (invitation: Invitation): InvitationStatus => {
    if (isExpired(invitation)) return 'expired';
    return invitation.status;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  // Filter to show only relevant invitations (not cancelled, or recently cancelled)
  const relevantInvitations = invitations.filter(
    (inv) => inv.status !== 'cancelled' ||
    (new Date().getTime() - inv.createdAt.getTime()) < 7 * 24 * 60 * 60 * 1000
  );

  if (relevantInvitations.length === 0) {
    return (
      <div className="text-center py-8 text-stone-500">
        <Mail className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p>Keine Einladungen vorhanden.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {relevantInvitations.map((invitation) => {
        const displayStatus = getDisplayStatus(invitation);
        const canManage = invitation.status === 'pending' && !isExpired(invitation);

        return (
          <div
            key={invitation.id}
            className={`flex items-center justify-between p-4 bg-white border rounded-xl transition-opacity ${
              displayStatus === 'cancelled' || displayStatus === 'expired'
                ? 'opacity-60'
                : 'border-stone-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                <Mail className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium text-stone-900">{invitation.email}</p>
                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span>Eingeladen als {roleLabels[invitation.role]}</span>
                  <span>•</span>
                  <span>
                    {formatDistanceToNow(invitation.createdAt, {
                      addSuffix: true,
                      locale: de
                    })}
                  </span>
                  {displayStatus === 'accepted' && invitation.acceptedAt && (
                    <>
                      <span>•</span>
                      <span className="text-green-600">
                        Angenommen {formatDistanceToNow(invitation.acceptedAt, {
                          addSuffix: true,
                          locale: de
                        })}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border ${statusColors[displayStatus]}`}
              >
                {statusIcons[displayStatus]}
                {statusLabels[displayStatus]}
              </span>

              {canManage && (
                <div className="relative">
                  {processingId === invitation.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === invitation.id ? null : invitation.id)
                        }
                        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === invitation.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-10">
                          <div className="p-1">
                            <button
                              onClick={() => handleResend(invitation.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                            >
                              <RefreshCw className="w-4 h-4" />
                              Erneut senden
                            </button>
                            <button
                              onClick={() => handleCancel(invitation.id)}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                              Zurückziehen
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {displayStatus === 'expired' && invitation.status === 'pending' && (
                <button
                  onClick={() => handleResend(invitation.id)}
                  disabled={processingId === invitation.id}
                  className="p-2 text-amber-600 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-colors disabled:opacity-50"
                  title="Erneut senden"
                >
                  {processingId === invitation.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <RefreshCw className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
