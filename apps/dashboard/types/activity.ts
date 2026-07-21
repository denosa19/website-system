export type ProjectActivityAction =
  | "project_created"
  | "project_deleted"
  | "status_changed"
  | "priority_changed"
  | "progress_changed"
  | "task_changed"
  | "seo_changed";

export type ProjectActivity = {
  id: string;
  timestamp: string;
  user: string;
  projectId: string;
  projectTitle: string;
  action: ProjectActivityAction;
  title: string;
  description: string;
};