import type {
  CreateTaskSubtaskInput,
  TaskSubtask,
} from "@/types/taskSubtask";

function createId(): string {
  return `subtask_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 9)}`;
}

export function createTaskSubtask(
  input: CreateTaskSubtaskInput
): TaskSubtask {
  const now = new Date().toISOString();

  return {
    id: createId(),
    taskId: input.taskId,
    title: input.title.trim(),
    completed: false,
    createdAt: now,
    updatedAt: now,
    completedAt: null,
  };
}

export function getTaskSubtasks(
  subtasks: TaskSubtask[],
  taskId: string
): TaskSubtask[] {
  return subtasks
    .filter((subtask) => subtask.taskId === taskId)
    .sort((first, second) =>
      first.createdAt.localeCompare(second.createdAt)
    );
}

export function toggleTaskSubtask(
  subtask: TaskSubtask
): TaskSubtask {
  const now = new Date().toISOString();
  const completed = !subtask.completed;

  return {
    ...subtask,
    completed,
    updatedAt: now,
    completedAt: completed ? now : null,
  };
}

export function replaceTaskSubtask(
  subtasks: TaskSubtask[],
  updatedSubtask: TaskSubtask
): TaskSubtask[] {
  return subtasks.map((subtask) =>
    subtask.id === updatedSubtask.id
      ? updatedSubtask
      : subtask
  );
}

export function deleteTaskSubtask(
  subtasks: TaskSubtask[],
  subtaskId: string
): TaskSubtask[] {
  return subtasks.filter(
    (subtask) => subtask.id !== subtaskId
  );
}