'use client';

import { useState, KeyboardEvent } from 'react';
import { Plus, Edit2, Trash2, GripVertical, Loader2 } from 'lucide-react';
import { Channel } from '@/types';

interface ChannelManagerProps {
  channels: Channel[];
  onSave: (id: string | null, data: Partial<Channel>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function ChannelManager({ channels, onSave, onDelete, disabled = false }: ChannelManagerProps) {
  const [newChannelName, setNewChannelName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAddChannel = async () => {
    if (!newChannelName.trim() || isAdding) return;

    setIsAdding(true);
    try {
      await onSave(null, { name: newChannelName.trim(), order: channels.length });
      setNewChannelName('');
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddChannel();
    }
  };

  const handleStartEdit = (channel: Channel) => {
    setEditingId(channel.id);
    setEditName(channel.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await onSave(id, { name: editName.trim() });
    setEditingId(null);
  };

  const handleDeleteChannel = async (id: string) => {
    if (!confirm('Kanal und alle zugehörigen Kampagnen löschen?')) return;

    setDeletingId(id);
    try {
      await onDelete(id);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Channel List */}
      <div className="space-y-2">
        {channels.length === 0 ? (
          <p className="text-stone-400 text-sm py-4 text-center">
            Noch keine Kanäle vorhanden.
          </p>
        ) : (
          channels.map((channel, index) => (
            <div
              key={channel.id}
              className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex items-center gap-3 group"
            >
              <GripVertical className="w-4 h-4 text-stone-300" />
              <span className="w-6 h-6 bg-stone-200 rounded-lg flex items-center justify-center text-xs font-bold text-stone-500">
                {index + 1}
              </span>

              {editingId === channel.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveEdit(channel.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(channel.id)}
                  className="flex-grow px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  autoFocus
                  disabled={disabled}
                />
              ) : (
                <span className="flex-grow font-medium text-stone-700">{channel.name}</span>
              )}

              {!disabled && (
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleStartEdit(channel)}
                    className="p-2 text-stone-400 hover:text-rose-500 transition-colors"
                    title="Bearbeiten"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteChannel(channel.id)}
                    disabled={deletingId === channel.id}
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-50"
                    title="Löschen"
                  >
                    {deletingId === channel.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add New Channel */}
      {!disabled && (
        <div className="flex gap-2 pt-2">
          <input
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Neuer Kanal..."
            className="flex-grow px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
            disabled={isAdding}
          />
          <button
            onClick={handleAddChannel}
            disabled={!newChannelName.trim() || isAdding}
            className="px-4 py-3 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>
      )}
    </div>
  );
}
