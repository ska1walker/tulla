'use client';

import { Plus, Folder, Loader2 } from 'lucide-react';
import { Project, ProjectRole } from '@/types';
import { ProjectCard } from './project-card';

interface ProjectListProps {
  projects: (Project & { role: ProjectRole })[];
  loading: boolean;
  currentProjectId?: string;
  onSelectProject: (projectId: string) => void;
  onCreateProject: () => void;
}

export function ProjectList({
  projects,
  loading,
  currentProjectId,
  onSelectProject,
  onCreateProject,
}: ProjectListProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-stone-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <Folder className="w-10 h-10 text-stone-400" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Keine Projekte</h2>
        <p className="text-stone-500 mb-8 max-w-sm mx-auto">
          Erstellen Sie Ihr erstes Projekt, um mit der Kampagnenplanung zu beginnen.
        </p>
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 px-6 py-3 bg-rose-500 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
        >
          <Plus className="w-5 h-5" />
          Neues Projekt
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-stone-900">
          Ihre Projekte ({projects.length})
        </h2>
        <button
          onClick={onCreateProject}
          className="inline-flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-200 hover:bg-rose-600 transition-all"
        >
          <Plus className="w-4 h-4" />
          Neu
        </button>
      </div>

      <div className="grid gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            isActive={project.id === currentProjectId}
            onClick={() => onSelectProject(project.id)}
          />
        ))}
      </div>
    </div>
  );
}
