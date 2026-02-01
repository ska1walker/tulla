'use client';

import { useState } from 'react';
import { Plus, Trash2, Check, Loader2 } from 'lucide-react';
import { CampaignType, CAMPAIGN_TYPE_COLORS } from '@/types';

interface CampaignTypeManagerProps {
  types: CampaignType[];
  onAdd: (type: Omit<CampaignType, 'id'>) => Promise<CampaignType>;
  onUpdate: (id: string, updates: Partial<Omit<CampaignType, 'id'>>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  disabled?: boolean;
}

export function CampaignTypeManager({
  types,
  onAdd,
  onUpdate,
  onDelete,
  disabled = false,
}: CampaignTypeManagerProps) {
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeColor, setNewTypeColor] = useState<string>(CAMPAIGN_TYPE_COLORS[0]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleAdd = async () => {
    if (!newTypeName.trim() || isAdding) return;

    setIsAdding(true);
    try {
      await onAdd({ name: newTypeName.trim(), color: newTypeColor });
      setNewTypeName('');
      // Pick next unused color or first one
      const usedColors = types.map((t) => t.color);
      const nextColor = CAMPAIGN_TYPE_COLORS.find((c) => !usedColors.includes(c)) || CAMPAIGN_TYPE_COLORS[0];
      setNewTypeColor(nextColor);
    } finally {
      setIsAdding(false);
    }
  };

  const handleStartEdit = (type: CampaignType) => {
    setEditingId(type.id);
    setEditName(type.name);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim()) return;
    await onUpdate(id, { name: editName.trim() });
    setEditingId(null);
  };

  const handleColorChange = async (id: string, color: string) => {
    await onUpdate(id, { color });
  };

  const handleDelete = async (id: string) => {
    if (types.length <= 1) {
      alert('Mindestens ein Typ muss vorhanden sein.');
      return;
    }

    setDeletingId(id);
    try {
      await onDelete(id);
    } catch (err) {
      console.error('Error deleting type:', err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Existing Types */}
      <div className="space-y-3">
        {types.map((type) => (
          <div
            key={type.id}
            className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200"
          >
            {/* Color Picker */}
            <div className="relative group">
              <button
                className="w-8 h-8 rounded-lg border-2 border-white shadow-sm transition-transform hover:scale-110"
                style={{ backgroundColor: type.color }}
                disabled={disabled}
              />
              <div className="absolute left-0 top-full mt-2 p-2 bg-white rounded-xl shadow-xl border border-stone-200 hidden group-hover:grid grid-cols-5 gap-1 z-20">
                {CAMPAIGN_TYPE_COLORS.map((color) => (
                  <button
                    key={color}
                    onClick={() => handleColorChange(type.id, color)}
                    className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${
                      type.color === color ? 'ring-2 ring-rose-500 ring-offset-1' : ''
                    }`}
                    style={{ backgroundColor: color }}
                    disabled={disabled}
                  />
                ))}
              </div>
            </div>

            {/* Name */}
            <div className="flex-grow">
              {editingId === type.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onBlur={() => handleSaveEdit(type.id)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(type.id)}
                  className="w-full px-3 py-1.5 bg-white border border-stone-300 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-rose-500"
                  autoFocus
                  disabled={disabled}
                />
              ) : (
                <button
                  onClick={() => !disabled && handleStartEdit(type)}
                  className="text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors text-left"
                  disabled={disabled}
                >
                  {type.name}
                </button>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => handleDelete(type.id)}
              disabled={disabled || types.length <= 1 || deletingId === type.id}
              className="p-2 text-stone-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              title={types.length <= 1 ? 'Mindestens ein Typ erforderlich' : 'Typ löschen'}
            >
              {deletingId === type.id ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Trash2 className="w-4 h-4" />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Add New Type */}
      {!disabled && (
        <div className="flex items-center gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100">
          {/* Color Picker for New Type */}
          <div className="relative group">
            <button
              className="w-8 h-8 rounded-lg border-2 border-white shadow-sm transition-transform hover:scale-110"
              style={{ backgroundColor: newTypeColor }}
            />
            <div className="absolute left-0 top-full mt-2 p-2 bg-white rounded-xl shadow-xl border border-stone-200 hidden group-hover:grid grid-cols-5 gap-1 z-20">
              {CAMPAIGN_TYPE_COLORS.map((color) => (
                <button
                  key={color}
                  onClick={() => setNewTypeColor(color)}
                  className={`w-6 h-6 rounded-md transition-transform hover:scale-110 ${
                    newTypeColor === color ? 'ring-2 ring-rose-500 ring-offset-1' : ''
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>

          {/* Name Input */}
          <input
            type="text"
            value={newTypeName}
            onChange={(e) => setNewTypeName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            placeholder="Neuer Typ..."
            className="flex-grow px-3 py-1.5 bg-white border border-stone-200 rounded-lg text-sm font-medium placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />

          {/* Add Button */}
          <button
            onClick={handleAdd}
            disabled={!newTypeName.trim() || isAdding}
            className="p-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAdding ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </button>
        </div>
      )}

      {/* Info */}
      <p className="text-xs text-stone-400">
        Klicken Sie auf die Farbe um sie zu ändern. Klicken Sie auf den Namen zum Bearbeiten.
      </p>
    </div>
  );
}
