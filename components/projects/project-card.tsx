'use client';

import { Folder, Users, Calendar, ChevronRight } from 'lucide-react';
import { Project, ProjectRole } from '@/types';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';

interface ProjectCardProps {
  project: Project & { role: ProjectRole };
  isActive?: boolean;
  onClick: () => void;
}

const roleLabels: Record<ProjectRole, string> = {
  owner: 'Eigentümer',
  editor: 'Editor',
  viewer: 'Betrachter',
};

const roleColors: Record<ProjectRole, string> = {
  owner: 'bg-rose-100 text-rose-700',
  editor: 'bg-blue-100 text-blue-700',
  viewer: 'bg-stone-100 text-stone-600',
};

export function ProjectCard({ project, isActive, onClick }: ProjectCardProps) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-5 rounded-2xl border transition-all hover:shadow-md ${
        isActive
          ? 'border-rose-300 bg-rose-50 shadow-md'
          : 'border-stone-200 bg-white hover:border-rose-200'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl ${
              isActive ? 'bg-rose-500 text-white' : 'bg-stone-100 text-stone-500'
            }`}
          >
            <Folder className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-stone-900 truncate">{project.name}</h3>
            {project.description && (
              <p className="text-sm text-stone-500 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
            <div className="flex items-center gap-4 mt-3 text-xs text-stone-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {format(project.createdAt, 'dd. MMM yyyy', { locale: de })}
              </span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  roleColors[project.role]
                }`}
              >
                {roleLabels[project.role]}
              </span>
            </div>
          </div>
        </div>
        <ChevronRight
          className={`w-5 h-5 flex-shrink-0 transition-colors ${
            isActive ? 'text-rose-500' : 'text-stone-300'
          }`}
        />
      </div>
    </button>
  );
}
