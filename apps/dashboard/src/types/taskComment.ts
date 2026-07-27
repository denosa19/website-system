export interface TaskComment {
  id: string;
  taskId: string;
  author: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

export type CreateTaskCommentInput = {
  taskId: string;
  author: string;
  message: string;
};

export type UpdateTaskCommentInput = {
  author?: string;
  message?: string;
};