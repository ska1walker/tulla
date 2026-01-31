// Project types for multi-project support

export type ProjectRole = 'owner' | 'editor' | 'viewer';

export interface Project {
  id: string;
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProjectData {
  name: string;
  description?: string;
  ownerId: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ProjectMember {
  userId: string;
  role: ProjectRole;
  joinedAt: Date;
  // Populated fields (not stored in Firestore)
  email?: string;
  displayName?: string;
}

export interface ProjectMemberData {
  role: ProjectRole;
  joinedAt: Date;
}

// For creating a new project
export interface CreateProjectData {
  name: string;
  description?: string;
}

// For updating a project
export interface UpdateProjectData {
  name?: string;
  description?: string;
}
