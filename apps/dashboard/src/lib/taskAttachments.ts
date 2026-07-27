import type {
  CreateTaskAttachmentInput,
  TaskAttachment,
} from "@/types/taskAttachment";

function createId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}`;
}

export function createTaskAttachment(
  input: CreateTaskAttachmentInput
): TaskAttachment {
  return {
    id: createId(),
    taskId: input.taskId,
    name: input.name,
    type: input.type,
    size: input.size,
    dataUrl: input.dataUrl,
    uploadedBy: input.uploadedBy,
    createdAt: new Date().toISOString(),
  };
}

export function getTaskAttachments(
  attachments: TaskAttachment[],
  taskId: string
): TaskAttachment[] {
  return attachments
    .filter(
      (attachment) =>
        attachment.taskId === taskId
    )
    .sort((a, b) =>
      b.createdAt.localeCompare(
        a.createdAt
      )
    );
}

export function replaceTaskAttachment(
  attachments: TaskAttachment[],
  updatedAttachment: TaskAttachment
): TaskAttachment[] {
  return attachments.map(
    (attachment) =>
      attachment.id ===
      updatedAttachment.id
        ? updatedAttachment
        : attachment
  );
}

export function deleteTaskAttachment(
  attachments: TaskAttachment[],
  attachmentId: string
): TaskAttachment[] {
  return attachments.filter(
    (attachment) =>
      attachment.id !== attachmentId
  );
}