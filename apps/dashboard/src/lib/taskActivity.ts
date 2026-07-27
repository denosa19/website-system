import type {
  CreateTaskActivityInput,
  TaskActivity,
} from "@/types/taskActivity";

function createId() {
  return `activity_${crypto.randomUUID()}`;
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

export function createTaskCreatedActivity(
  taskId: string,
  author: string
): TaskActivity {
  return createTaskActivity({
    taskId,
    author,
    type: "created",
    message: "Aufgabe erstellt",
  });
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