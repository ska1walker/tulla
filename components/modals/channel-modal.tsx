'use client';

import { useState, KeyboardEvent } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Channel } from '@/types';

interface ChannelModalProps {
  channels: Channel[];
  onClose: () => void;
  onSave: (id: string | null, data: Partial<Channel>) => void;
  onDelete: (id: string) => void;
}

export function ChannelModal({ channels, onClose, onSave, onDelete }: ChannelModalProps) {
  const [newChannelName, setNewChannelName] = useState('');

  const handleAddChannel = () => {
    if (newChannelName.trim()) {
      onSave(null, { name: newChannelName, order: channels.length });
      setNewChannelName('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newChannelName.trim()) {
      handleAddChannel();
    }
  };

  const handleEditChannel = (channel: Channel) => {
    const newName = prompt('Name:', channel.name);
    if (newName) {
      onSave(channel.id, { name: newName });
    }
  };

  const handleDeleteChannel = (channel: Channel) => {
    if (confirm('Kanal und alle Daten löschen?')) {
      onDelete(channel.id);
    }
  };

  return (
    <Modal title="Kanäle verwalten" onClose={onClose}>
      <div className="space-y-4">
        {/* Add New Channel */}
        <div className="flex gap-2">
          <input
            value={newChannelName}
            onChange={(e) => setNewChannelName(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Neuer Kanalname..."
            className="flex-1 p-3 border border-stone-200 bg-stone-50 rounded-xl font-bold outline-none"
          />
          <button
            onClick={handleAddChannel}
            className="px-4 bg-rose-500 text-white rounded-xl shadow-md"
          >
            <Plus />
          </button>
        </div>

        {/* Channel List */}
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {channels.map((c, i) => (
            <div
              key={c.id}
              className="p-4 bg-slate-50 rounded-2xl border border-stone-100 flex justify-between items-center group text-left"
            >
              <span className="font-bold text-stone-700">
                {i + 1}. {c.name}
              </span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => handleEditChannel(c)}
                  className="p-2 text-stone-400 hover:text-rose-500"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteChannel(c)}
                  className="p-2 text-stone-300 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
