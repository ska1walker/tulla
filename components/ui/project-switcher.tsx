'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, Folder, Plus, Check, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { useProjects } from '@/hooks/use-projects';

export function ProjectSwitcher() {
  const router = useRouter();
  const { currentProject, currentProjectRole } = useAuth();
  const { projects, selectProject } = useProjects();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectProject = (projectId: string) => {
    selectProject(projectId);
    setIsOpen(false);
    router.push(`/projects/${projectId}`);
  };

  const handleNewProject = () => {
    setIsOpen(false);
    router.push('/projects/new');
  };

  const handleSettings = () => {
    setIsOpen(false);
    if (currentProject) {
      router.push(`/projects/${currentProject.id}/settings`);
    }
  };

  if (!currentProject) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors"
      >
        <Folder className="w-4 h-4 text-stone-500" />
        <span className="font-medium text-stone-700 max-w-[150px] truncate">
          {currentProject.name}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-72 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-50">
          <div className="p-2 border-b border-stone-100">
            <p className="px-3 py-1.5 text-xs font-medium text-stone-400 uppercase">
              Projekte
            </p>
          </div>

          <div className="max-h-64 overflow-y-auto p-2">
            {projects.map((project) => (
              <button
                key={project.id}
                onClick={() => handleSelectProject(project.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                  project.id === currentProject.id
                    ? 'bg-rose-50 text-rose-600'
                    : 'hover:bg-stone-50 text-stone-700'
                }`}
              >
                <Folder className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 truncate font-medium">{project.name}</span>
                {project.id === currentProject.id && (
                  <Check className="w-4 h-4 flex-shrink-0" />
                )}
              </button>
            ))}
          </div>

          <div className="p-2 border-t border-stone-100 space-y-1">
            {(currentProjectRole === 'owner' || currentProjectRole === 'editor') && (
              <button
                onClick={handleSettings}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors"
              >
                <Settings className="w-4 h-4" />
                <span className="font-medium">Projekteinstellungen</span>
              </button>
            )}
            <button
              onClick={handleNewProject}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-rose-500 hover:bg-rose-50 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">Neues Projekt</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
