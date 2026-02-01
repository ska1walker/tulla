'use client';

import { useRouter } from 'next/navigation';
import { TulipLogo } from '@/components/icons/tulip-logo';
import { ProjectList } from '@/components/projects/project-list';
import { UserMenu } from '@/components/ui/user-menu';
import { useAuth } from '@/contexts/auth-context';
import { useProjects } from '@/hooks/use-projects';

export default function ProjectsPage() {
  const router = useRouter();
  const { currentProject } = useAuth();
  const { projects, loading, selectProject } = useProjects();

  const handleSelectProject = (projectId: string) => {
    selectProject(projectId);
    router.push(`/projects/${projectId}`);
  };

  const handleCreateProject = () => {
    router.push('/projects/new');
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="h-16 bg-white/90 backdrop-blur-xl border-b border-stone-200 px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center shadow-lg">
            <TulipLogo className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-lg tracking-tight"><span className="font-black text-stone-900">mai</span><span className="font-light text-rose-500 italic">flow</span></h1>
        </div>
        <UserMenu />
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-stone-900">Projekte</h1>
          <p className="text-stone-500 mt-1">
            Wählen Sie ein Projekt aus oder erstellen Sie ein neues.
          </p>
        </div>

        <ProjectList
          projects={projects}
          loading={loading}
          currentProjectId={currentProject?.id}
          onSelectProject={handleSelectProject}
          onCreateProject={handleCreateProject}
        />
      </main>
    </div>
  );
}
