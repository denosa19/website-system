export type TaskActivityType =
  | "created"
  | "updated"
  | "comment_added"
  | "comment_updated"
  | "comment_deleted"
  | "attachment_added"
  | "attachment_deleted"
  | "status_changed"
  | "priority_changed"
  | "completed";

export interface TaskActivity {
  id: string;
  taskId: string;
  type: TaskActivityType;
  author: string;
  message: string;
  createdAt: string;
}

export type CreateTaskActivityInput = {
  taskId: string;
  type: TaskActivityType;
  author: string;
  message: string;
};