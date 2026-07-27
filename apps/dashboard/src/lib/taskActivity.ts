import type {
  CreateTaskActivityInput,
  TaskActivity,
} from "@/types/taskActivity";

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

export function createTaskActivity(
  input: CreateTaskActivityInput
): TaskActivity {
  return {
    id: createId(),
    taskId: input.taskId,
    type: input.type,
    author: input.author,
    message: input.message,
    createdAt: new Date().toISOString(),
  };
}

export function getTaskActivities(
  activities: TaskActivity[],
  taskId: string
): TaskActivity[] {
  return activities
    .filter(
      (activity) =>
        activity.taskId === taskId
    )
    .sort((a, b) =>
      b.createdAt.localeCompare(
        a.createdAt
      )
    );
}

export function deleteTaskActivity(
  activities: TaskActivity[],
  activityId: string
): TaskActivity[] {
  return activities.filter(
    (activity) =>
      activity.id !== activityId
  );
}