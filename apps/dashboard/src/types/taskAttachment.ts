export interface TaskAttachment {
  id: string;
  taskId: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedBy: string;
  createdAt: string;
}

export type CreateTaskAttachmentInput = {
  taskId: string;
  name: string;
  type: string;
  size: number;
  dataUrl: string;
  uploadedBy: string;
};