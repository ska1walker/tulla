'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { Project, ProjectData, CreateProjectData, UpdateProjectData, ProjectRole } from '@/types';

interface ProjectWithRole extends Project {
  role: ProjectRole;
}

export function useProjects() {
  const { user, userProfile, db, isOffline, setCurrentProject, currentProject } = useAuth();
  const [projects, setProjects] = useState<ProjectWithRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load projects the user has access to
  useEffect(() => {
    if (!user || !db || isOffline) {
      setLoading(false);
      return;
    }

    setLoading(true);

    // We need to listen to two things:
    // 1. Projects the user owns
    // 2. Projects where the user is a member

    const projectsRef = collection(db, 'projects');
    let allProjects: ProjectWithRole[] = [];
    let ownedProjectsLoaded = false;
    let memberProjectsLoaded = false;

    const checkAndSetProjects = () => {
      if (ownedProjectsLoaded && memberProjectsLoaded) {
        // Deduplicate by id
        const uniqueProjects = Array.from(
          new Map(allProjects.map((p) => [p.id, p])).values()
        ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        setProjects(uniqueProjects);
        setLoading(false);
      }
    };

    // Listen to owned projects
    const ownedQuery = query(projectsRef, where('ownerId', '==', user.uid));
    const unsubOwned = onSnapshot(
      ownedQuery,
      (snapshot) => {
        const ownedProjects = snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name,
            description: data.description,
            ownerId: data.ownerId,
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : new Date(data.createdAt),
            updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : undefined,
            role: 'owner' as ProjectRole,
          };
        });

        // Remove old owned projects and add new ones
        allProjects = allProjects.filter((p) => p.role !== 'owner');
        allProjects.push(...ownedProjects);
        ownedProjectsLoaded = true;
        checkAndSetProjects();
      },
      (err) => {
        console.error('Error loading owned projects:', err);
        ownedProjectsLoaded = true;
        checkAndSetProjects();
      }
    );

    // For member projects, we need to query the members subcollection
    // This is more complex - we need to get all projects where user is a member
    const loadMemberProjects = async () => {
      try {
        // Get all projects
        const allProjectsSnapshot = await getDocs(projectsRef);
        const memberProjectPromises = allProjectsSnapshot.docs.map(async (projectDoc) => {
          const memberRef = doc(db, 'projects', projectDoc.id, 'members', user.uid);

          return new Promise<ProjectWithRole | null>((resolve) => {
            const unsubMember = onSnapshot(
              memberRef,
              (memberSnapshot) => {
                if (memberSnapshot.exists() && memberSnapshot.data().role !== 'owner') {
                  const projectData = projectDoc.data();
                  const memberData = memberSnapshot.data();
                  resolve({
                    id: projectDoc.id,
                    name: projectData.name,
                    description: projectData.description,
                    ownerId: projectData.ownerId,
                    createdAt: projectData.createdAt instanceof Timestamp
                      ? projectData.createdAt.toDate()
                      : new Date(projectData.createdAt),
                    updatedAt: projectData.updatedAt instanceof Timestamp
                      ? projectData.updatedAt.toDate()
                      : undefined,
                    role: memberData.role as ProjectRole,
                  });
                } else {
                  resolve(null);
                }
                unsubMember();
              },
              () => {
                resolve(null);
                unsubMember();
              }
            );
          });
        });

        const memberProjects = (await Promise.all(memberProjectPromises)).filter(
          (p): p is ProjectWithRole => p !== null
        );

        allProjects = allProjects.filter((p) => p.role === 'owner');
        allProjects.push(...memberProjects);
        memberProjectsLoaded = true;
        checkAndSetProjects();
      } catch (err) {
        console.error('Error loading member projects:', err);
        memberProjectsLoaded = true;
        checkAndSetProjects();
      }
    };

    loadMemberProjects();

    return () => {
      unsubOwned();
    };
  }, [user, db, isOffline]);

  // Auto-select first project if none selected
  useEffect(() => {
    if (!loading && projects.length > 0 && !currentProject) {
      // Check localStorage for last selected project
      const savedProjectId = typeof window !== 'undefined'
        ? localStorage.getItem('currentProjectId')
        : null;

      const savedProject = savedProjectId
        ? projects.find((p) => p.id === savedProjectId)
        : null;

      const projectToSelect = savedProject || projects[0];
      setCurrentProject(projectToSelect, projectToSelect.role);
    }
  }, [loading, projects, currentProject, setCurrentProject]);

  // Create a new project
  const createProject = useCallback(
    async (data: CreateProjectData): Promise<Project> => {
      if (!user || !db) {
        throw new Error('Nicht angemeldet.');
      }

      const projectData: ProjectData = {
        name: data.name,
        ownerId: user.uid,
        createdAt: new Date(),
        ...(data.description && { description: data.description }),
      };

      const docRef = await addDoc(collection(db, 'projects'), {
        name: data.name,
        ownerId: user.uid,
        createdAt: serverTimestamp(),
        ...(data.description && { description: data.description }),
      });

      // Add owner as member
      await setDoc(doc(db, 'projects', docRef.id, 'members', user.uid), {
        role: 'owner',
        joinedAt: serverTimestamp(),
      });

      const newProject: Project = {
        id: docRef.id,
        ...projectData,
      };

      // Set as current project
      setCurrentProject(newProject, 'owner');

      return newProject;
    },
    [user, db, setCurrentProject]
  );

  // Update a project
  const updateProject = useCallback(
    async (projectId: string, data: UpdateProjectData): Promise<void> => {
      if (!db) {
        throw new Error('Nicht angemeldet.');
      }

      const projectRef = doc(db, 'projects', projectId);
      await updateDoc(projectRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
    },
    [db]
  );

  // Delete a project
  const deleteProject = useCallback(
    async (projectId: string): Promise<void> => {
      if (!db) {
        throw new Error('Nicht angemeldet.');
      }

      // Delete the project document (subcollections will remain but become orphaned)
      // In production, you'd want a Cloud Function to clean up subcollections
      const projectRef = doc(db, 'projects', projectId);
      await deleteDoc(projectRef);

      // If this was the current project, clear it
      if (currentProject?.id === projectId) {
        setCurrentProject(null, null);
      }
    },
    [db, currentProject, setCurrentProject]
  );

  // Select a project
  const selectProject = useCallback(
    (projectId: string) => {
      const project = projects.find((p) => p.id === projectId);
      if (project) {
        setCurrentProject(project, project.role);
      }
    },
    [projects, setCurrentProject]
  );

  // Get role for a specific project
  const getProjectRole = useCallback(
    (projectId: string): ProjectRole | null => {
      const project = projects.find((p) => p.id === projectId);
      return project?.role || null;
    },
    [projects]
  );

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    selectProject,
    getProjectRole,
  };
}
