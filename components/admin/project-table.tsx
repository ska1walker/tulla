'use client';

import { useState } from 'react';
import { Folder, Trash2, MoreVertical, Loader2, ExternalLink } from 'lucide-react';
import { Project } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import Link from 'next/link';

interface ProjectWithOwner extends Project {
  ownerEmail?: string;
}

interface ProjectTableProps {
  projects: ProjectWithOwner[];
  loading: boolean;
  onDelete: (projectId: string) => Promise<void>;
}

export function ProjectTable({ projects, loading, onDelete }: ProjectTableProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (projectId: string) => {
    setDeleteLoading(projectId);
    setOpenMenuId(null);
    setConfirmDeleteId(null);
    try {
      await onDelete(projectId);
    } finally {
      setDeleteLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-rose-500" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12 text-stone-500">
        Keine Projekte gefunden.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-stone-200">
            <th className="text-left py-3 px-4 font-medium text-stone-500 text-sm">
              Projekt
            </th>
            <th className="text-left py-3 px-4 font-medium text-stone-500 text-sm">
              Eigentümer
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
          {projects.map((project) => (
            <tr key={project.id} className="border-b border-stone-100 hover:bg-stone-50">
              <td className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-stone-100 rounded-lg flex items-center justify-center text-stone-500">
                    <Folder className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-stone-900">{project.name}</p>
                    {project.description && (
                      <p className="text-sm text-stone-500 truncate max-w-xs">
                        {project.description}
                      </p>
                    )}
                  </div>
                </div>
              </td>
              <td className="py-4 px-4 text-sm text-stone-600">
                {project.ownerEmail || project.ownerId}
              </td>
              <td className="py-4 px-4 text-sm text-stone-500">
                {format(project.createdAt, 'dd. MMM yyyy', { locale: de })}
              </td>
              <td className="py-4 px-4 text-right">
                <div className="relative inline-block">
                  {deleteLoading === project.id ? (
                    <Loader2 className="w-5 h-5 animate-spin text-stone-400" />
                  ) : (
                    <>
                      <button
                        onClick={() =>
                          setOpenMenuId(openMenuId === project.id ? null : project.id)
                        }
                        className="p-2 text-stone-400 hover:text-stone-600 hover:bg-stone-100 rounded-lg transition-colors"
                      >
                        <MoreVertical className="w-5 h-5" />
                      </button>

                      {openMenuId === project.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-xl shadow-xl overflow-hidden z-10">
                          <div className="p-1">
                            <Link
                              href={`/projects/${project.id}`}
                              className="w-full flex items-center gap-2 px-3 py-2 text-left text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                              onClick={() => setOpenMenuId(null)}
                            >
                              <ExternalLink className="w-4 h-4" />
                              Projekt öffnen
                            </Link>
                          </div>
                          <div className="border-t border-stone-100 p-1">
                            {confirmDeleteId === project.id ? (
                              <div className="p-2">
                                <p className="text-xs text-red-600 mb-2">
                                  Wirklich löschen?
                                </p>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setConfirmDeleteId(null)}
                                    className="flex-1 px-2 py-1 text-xs border border-stone-200 rounded-lg hover:bg-stone-50"
                                  >
                                    Nein
                                  </button>
                                  <button
                                    onClick={() => handleDelete(project.id)}
                                    className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700"
                                  >
                                    Ja
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setConfirmDeleteId(project.id)}
                                className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                                Löschen
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
