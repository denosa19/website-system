import type {
  CreateTaskCommentInput,
  TaskComment,
  UpdateTaskCommentInput,
} from "@/types/taskComment";

function generateCommentId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `comment_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function createTaskComment(
  input: CreateTaskCommentInput
): TaskComment {
  const message = input.message.trim();

  if (!message) {
    throw new Error(
      "Der Kommentar darf nicht leer sein."
    );
  }

  const author =
    input.author.trim() || "Unbekannt";

  const timestamp = new Date().toISOString();

  return {
    id: generateCommentId(),
    taskId: input.taskId,
    author,
    message,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function updateTaskComment(
  comment: TaskComment,
  input: UpdateTaskCommentInput
): TaskComment {
  const message =
    input.message !== undefined
      ? input.message.trim()
      : comment.message;

  if (!message) {
    throw new Error(
      "Der Kommentar darf nicht leer sein."
    );
  }

  return {
    ...comment,
    author:
      input.author !== undefined
        ? input.author.trim() ||
          comment.author
        : comment.author,
    message,
    updatedAt:
      new Date().toISOString(),
  };
}

export function deleteTaskComment(
  comments: TaskComment[],
  commentId: string
): TaskComment[] {
  return comments.filter(
    (comment) =>
      comment.id !== commentId
  );
}

export function replaceTaskComment(
  comments: TaskComment[],
  updatedComment: TaskComment
): TaskComment[] {
  return comments.map((comment) =>
    comment.id === updatedComment.id
      ? updatedComment
      : comment
  );
}

export function getTaskComments(
  comments: TaskComment[],
  taskId: string
): TaskComment[] {
  return comments
    .filter(
      (comment) =>
        comment.taskId === taskId
    )
    .sort(
      (firstComment, secondComment) =>
        new Date(
          firstComment.createdAt
        ).getTime() -
        new Date(
          secondComment.createdAt
        ).getTime()
    );
}