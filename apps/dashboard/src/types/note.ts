export interface ProjectNote {
  id: string;
  projectId: string;
  author: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}