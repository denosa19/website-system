import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";

export type CreateProjectTaskInput = {
  projectId: string;
  title: string;
  description?: string;
  status?: ProjectTaskStatus;
  priority?: ProjectTaskPriority;
  assignee?: string;
  dueDate?: string | null;
};

export type UpdateProjectTaskInput = {
  title?: string;
  description?: string;
  status?: ProjectTaskStatus;
  priority?: ProjectTaskPriority;
  assignee?: string;
  dueDate?: string | null;
};

function createTaskId(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `task_${crypto.randomUUID()}`;
  }

  return `task_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

function normalizeText(value: string): string {
  return value.trim();
}

function normalizeDueDate(
  dueDate: string | null | undefined
): string | null {
  if (!dueDate) {
    return null;
  }

  const normalizedDate = dueDate.trim();

  return normalizedDate || null;
}

export function createProjectTask(
  input: CreateProjectTaskInput
): ProjectTask {
  const title = normalizeText(input.title);

  if (!input.projectId.trim()) {
    throw new Error(
      "Die Aufgabe benötigt eine gültige Projekt-ID."
    );
  }

  if (!title) {
    throw new Error(
      "Bitte gib einen Titel für die Aufgabe ein."
    );
  }

  const now = new Date().toISOString();
  const status = input.status ?? "open";

  return {
    id: createTaskId(),
    projectId: input.projectId.trim(),
    title,
    description: normalizeText(input.description ?? ""),
    status,
    priority: input.priority ?? "medium",
    assignee: normalizeText(input.assignee ?? ""),
    dueDate: normalizeDueDate(input.dueDate),
    createdAt: now,
    updatedAt: now,
    completedAt:
      status === "completed" ? now : null,
  };
}

export function updateProjectTask(
  task: ProjectTask,
  input: UpdateProjectTaskInput
): ProjectTask {
  const nextTitle =
    input.title !== undefined
      ? normalizeText(input.title)
      : task.title;

  if (!nextTitle) {
    throw new Error(
      "Der Titel der Aufgabe darf nicht leer sein."
    );
  }

  const nextStatus =
    input.status ?? task.status;

  const statusChanged =
    nextStatus !== task.status;

  let completedAt = task.completedAt;

  if (
    statusChanged &&
    nextStatus === "completed"
  ) {
    completedAt = new Date().toISOString();
  }

  if (
    statusChanged &&
    nextStatus !== "completed"
  ) {
    completedAt = null;
  }

  return {
    ...task,
    title: nextTitle,
    description:
      input.description !== undefined
        ? normalizeText(input.description)
        : task.description,
    status: nextStatus,
    priority:
      input.priority ?? task.priority,
    assignee:
      input.assignee !== undefined
        ? normalizeText(input.assignee)
        : task.assignee,
    dueDate:
      input.dueDate !== undefined
        ? normalizeDueDate(input.dueDate)
        : task.dueDate,
    updatedAt: new Date().toISOString(),
    completedAt,
  };
}

export function deleteProjectTask(
  tasks: ProjectTask[],
  taskId: string
): ProjectTask[] {
  return tasks.filter(
    (task) => task.id !== taskId
  );
}

export function replaceProjectTask(
  tasks: ProjectTask[],
  updatedTask: ProjectTask
): ProjectTask[] {
  return tasks.map((task) =>
    task.id === updatedTask.id
      ? updatedTask
      : task
  );
}

export function toggleProjectTaskCompleted(
  task: ProjectTask
): ProjectTask {
  const nextStatus: ProjectTaskStatus =
    task.status === "completed"
      ? "open"
      : "completed";

  return updateProjectTask(task, {
    status: nextStatus,
  });
}

export function getProjectTasks(
  tasks: ProjectTask[],
  projectId: string
): ProjectTask[] {
  return tasks.filter(
    (task) => task.projectId === projectId
  );
}

export function getCompletedProjectTasks(
  tasks: ProjectTask[]
): ProjectTask[] {
  return tasks.filter(
    (task) => task.status === "completed"
  );
}

export function getOpenProjectTasks(
  tasks: ProjectTask[]
): ProjectTask[] {
  return tasks.filter(
    (task) => task.status !== "completed"
  );
}

export function calculateTaskProgress(
  tasks: ProjectTask[]
): number {
  if (tasks.length === 0) {
    return 0;
  }

  const completedTasks =
    getCompletedProjectTasks(tasks).length;

  return Math.round(
    (completedTasks / tasks.length) * 100
  );
}

export function isTaskOverdue(
  task: ProjectTask,
  currentDate = new Date()
): boolean {
  if (
    !task.dueDate ||
    task.status === "completed"
  ) {
    return false;
  }

  const dueDate = new Date(
    `${task.dueDate}T23:59:59.999`
  );

  return dueDate.getTime() <
    currentDate.getTime();
}

export function isTaskDueToday(
  task: ProjectTask,
  currentDate = new Date()
): boolean {
  if (
    !task.dueDate ||
    task.status === "completed"
  ) {
    return false;
  }

  const year = currentDate.getFullYear();
  const month = String(
    currentDate.getMonth() + 1
  ).padStart(2, "0");
  const day = String(
    currentDate.getDate()
  ).padStart(2, "0");

  const today = `${year}-${month}-${day}`;

  return task.dueDate === today;
}

export function sortProjectTasks(
  tasks: ProjectTask[]
): ProjectTask[] {
  const statusOrder: Record<
    ProjectTaskStatus,
    number
  > = {
    in_progress: 0,
    open: 1,
    waiting: 2,
    completed: 3,
  };

  const priorityOrder: Record<
    ProjectTaskPriority,
    number
  > = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return [...tasks].sort((firstTask, secondTask) => {
    const statusDifference =
      statusOrder[firstTask.status] -
      statusOrder[secondTask.status];

    if (statusDifference !== 0) {
      return statusDifference;
    }

    const priorityDifference =
      priorityOrder[firstTask.priority] -
      priorityOrder[secondTask.priority];

    if (priorityDifference !== 0) {
      return priorityDifference;
    }

    if (
      firstTask.dueDate &&
      secondTask.dueDate
    ) {
      return firstTask.dueDate.localeCompare(
        secondTask.dueDate
      );
    }

    if (firstTask.dueDate) {
      return -1;
    }

    if (secondTask.dueDate) {
      return 1;
    }

    return firstTask.createdAt.localeCompare(
      secondTask.createdAt
    );
  });
}