export type ProjectTaskStatus =
  | "open"
  | "in_progress"
  | "waiting"
  | "completed";

export type ProjectTaskPriority =
  | "low"
  | "medium"
  | "high"
  | "critical";

export interface ProjectTask {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  assignee: string;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}