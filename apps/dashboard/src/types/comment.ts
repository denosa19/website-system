export interface ProjectComment {
  id: string;
  projectId: string;
  author: string;
  message: string;
  createdAt: string;
  updatedAt?: string;
}