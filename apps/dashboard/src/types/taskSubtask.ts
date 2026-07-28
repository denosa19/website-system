export interface TaskSubtask {
  id: string;
  taskId: string;
  title: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  completedAt: string | null;
}

export type CreateTaskSubtaskInput = {
  taskId: string;
  title: string;
};