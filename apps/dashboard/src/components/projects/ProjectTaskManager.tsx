"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tasks as initialTasks } from "@/data/tasks";
import {
  createTaskAddedActivity,
  createTaskCompletedActivity,
  createTaskDeletedActivity,
  createTaskReopenedActivity,
  createTaskUpdatedActivity,
} from "@/lib/projectActivity";
import {
  calculateTaskProgress,
  createProjectTask,
  deleteProjectTask,
  getProjectTasks,
  isTaskOverdue,
  replaceProjectTask,
  sortProjectTasks,
  toggleProjectTaskCompleted,
  updateProjectTask,
} from "@/lib/projectTasks";
import {
  createTaskActivity,
} from "@/lib/taskActivity";
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";
import type {
  TaskActivity,
  TaskActivityType,
} from "@/types/taskActivity";
import type { TimelineEvent } from "@/types/timeline";
import ProjectTaskBoard from "./ProjectTaskBoard";
import ProjectTaskCalendar from "./ProjectTaskCalendar";
import ProjectTaskDetailPanel from "./ProjectTaskDetailPanel";
import ProjectTaskFilters, {
  type PriorityFilter,
  type StatusFilter,
  type TaskSort,
} from "./ProjectTaskFilters";
import ProjectTaskForm, {
  EMPTY_TASK_FORM,
  type TaskFormState,
} from "./ProjectTaskForm";

type ProjectTaskManagerProps = {
  projectId: string;
  onTaskActivity?: (
    activity: TimelineEvent
  ) => void;
};

type TaskView = "board" | "calendar";

const STORAGE_KEY =
  "dashboard-project-tasks";

const TASK_ACTIVITIES_STORAGE_KEY =
  "website-system-task-activities";

const STATUS_LABELS: Record<
  ProjectTaskStatus,
  string
> = {
  open: "Offen",
  in_progress: "In Arbeit",
  waiting: "Wartet",
  completed: "Erledigt",
};

const PRIORITY_LABELS: Record<
  ProjectTaskPriority,
  string
> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  critical: "Kritisch",
};

const PRIORITY_ORDER: Record<
  ProjectTaskPriority,
  number
> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function loadStoredTasks(): ProjectTask[] {
  if (typeof window === "undefined") {
    return initialTasks;
  }

  const storedTasks =
    window.localStorage.getItem(
      STORAGE_KEY
    );

  if (!storedTasks) {
    return initialTasks;
  }

  try {
    const parsedTasks = JSON.parse(
      storedTasks
    ) as ProjectTask[];

    return Array.isArray(parsedTasks)
      ? parsedTasks
      : initialTasks;
  } catch {
    return initialTasks;
  }
}

function loadStoredTaskActivities():
  TaskActivity[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedActivities =
      window.localStorage.getItem(
        TASK_ACTIVITIES_STORAGE_KEY
      );

    if (!storedActivities) {
      return [];
    }

    const parsedActivities: unknown =
      JSON.parse(storedActivities);

    return Array.isArray(
      parsedActivities
    )
      ? (parsedActivities as TaskActivity[])
      : [];
  } catch {
    return [];
  }
}

function saveTaskActivity(
  taskId: string,
  type: TaskActivityType,
  message: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const activity =
    createTaskActivity({
      taskId,
      type,
      author: "Dennis",
      message,
    });

  const currentActivities =
    loadStoredTaskActivities();

  try {
    window.localStorage.setItem(
      TASK_ACTIVITIES_STORAGE_KEY,
      JSON.stringify([
        ...currentActivities,
        activity,
      ])
    );
  } catch (error) {
    console.error(
      "Die Aufgabenaktivität konnte nicht gespeichert werden.",
      error
    );
  }
}

function formatActivityDate(
  value: string | null
): string {
  if (!value) {
    return "Nicht festgelegt";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(
    new Date(`${value}T12:00:00`)
  );
}

function logTaskChanges(
  previousTask: ProjectTask,
  updatedTask: ProjectTask
) {
  if (
    previousTask.title !==
    updatedTask.title
  ) {
    saveTaskActivity(
      updatedTask.id,
      "updated",
      `Titel geändert: ${previousTask.title} → ${updatedTask.title}`
    );
  }

  if (
    previousTask.description !==
    updatedTask.description
  ) {
    saveTaskActivity(
      updatedTask.id,
      "updated",
      "Beschreibung geändert"
    );
  }

  if (
    previousTask.status !==
    updatedTask.status
  ) {
    if (
      updatedTask.status ===
      "completed"
    ) {
      saveTaskActivity(
        updatedTask.id,
        "completed",
        "Aufgabe abgeschlossen"
      );
    } else {
      saveTaskActivity(
        updatedTask.id,
        "status_changed",
        `Status geändert: ${
          STATUS_LABELS[
            previousTask.status
          ]
        } → ${
          STATUS_LABELS[
            updatedTask.status
          ]
        }`
      );
    }
  }

  if (
    previousTask.priority !==
    updatedTask.priority
  ) {
    saveTaskActivity(
      updatedTask.id,
      "priority_changed",
      `Priorität geändert: ${
        PRIORITY_LABELS[
          previousTask.priority
        ]
      } → ${
        PRIORITY_LABELS[
          updatedTask.priority
        ]
      }`
    );
  }

  if (
    previousTask.assignee !==
    updatedTask.assignee
  ) {
    const previousAssignee =
      previousTask.assignee ||
      "Nicht zugewiesen";

    const updatedAssignee =
      updatedTask.assignee ||
      "Nicht zugewiesen";

    saveTaskActivity(
      updatedTask.id,
      "updated",
      `Verantwortlicher geändert: ${previousAssignee} → ${updatedAssignee}`
    );
  }

  if (
    previousTask.dueDate !==
    updatedTask.dueDate
  ) {
    saveTaskActivity(
      updatedTask.id,
      "updated",
      `Fälligkeitsdatum geändert: ${formatActivityDate(
        previousTask.dueDate
      )} → ${formatActivityDate(
        updatedTask.dueDate
      )}`
    );
  }
}

function sortFilteredTasks(
  tasks: ProjectTask[],
  sort: TaskSort
) {
  return [...tasks].sort(
    (firstTask, secondTask) => {
      if (sort === "priority") {
        const priorityDifference =
          PRIORITY_ORDER[
            secondTask.priority
          ] -
          PRIORITY_ORDER[
            firstTask.priority
          ];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return firstTask.title.localeCompare(
          secondTask.title,
          "de"
        );
      }

      if (sort === "title") {
        return firstTask.title.localeCompare(
          secondTask.title,
          "de"
        );
      }

      if (sort === "newest") {
        return (
          new Date(
            secondTask.createdAt
          ).getTime() -
          new Date(
            firstTask.createdAt
          ).getTime()
        );
      }

      if (sort === "oldest") {
        return (
          new Date(
            firstTask.createdAt
          ).getTime() -
          new Date(
            secondTask.createdAt
          ).getTime()
        );
      }

      if (
        !firstTask.dueDate &&
        !secondTask.dueDate
      ) {
        return firstTask.title.localeCompare(
          secondTask.title,
          "de"
        );
      }

      if (!firstTask.dueDate) {
        return 1;
      }

      if (!secondTask.dueDate) {
        return -1;
      }

      const dueDateDifference =
        firstTask.dueDate.localeCompare(
          secondTask.dueDate
        );

      if (dueDateDifference !== 0) {
        return dueDateDifference;
      }

      return firstTask.title.localeCompare(
        secondTask.title,
        "de"
      );
    }
  );
}

export default function ProjectTaskManager({
  projectId,
  onTaskActivity,
}: ProjectTaskManagerProps) {
  const [tasks, setTasks] =
    useState<ProjectTask[]>(
      initialTasks
    );

  const [form, setForm] =
    useState<TaskFormState>(
      EMPTY_TASK_FORM
    );

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<string | null>(null);

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<PriorityFilter>("all");

  const [
    assigneeFilter,
    setAssigneeFilter,
  ] = useState("all");

  const [onlyOverdue, setOnlyOverdue] =
    useState(false);

  const [taskSort, setTaskSort] =
    useState<TaskSort>("due_date");

  const [taskView, setTaskView] =
    useState<TaskView>("board");

  useEffect(() => {
    setTasks(loadStoredTasks());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [isLoaded, tasks]);

  const projectTasks = useMemo(() => {
    return sortProjectTasks(
      getProjectTasks(
        tasks,
        projectId
      )
    );
  }, [projectId, tasks]);

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) {
      return null;
    }

    return (
      tasks.find(
        (task) =>
          task.id ===
          selectedTaskId
      ) ?? null
    );
  }, [selectedTaskId, tasks]);

  const assignees = useMemo(() => {
    return Array.from(
      new Set(
        projectTasks
          .map((task) =>
            task.assignee.trim()
          )
          .filter(Boolean)
      )
    ).sort(
      (
        firstAssignee,
        secondAssignee
      ) =>
        firstAssignee.localeCompare(
          secondAssignee,
          "de"
        )
    );
  }, [projectTasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch =
      searchQuery
        .trim()
        .toLowerCase();

    const matchingTasks =
      projectTasks.filter((task) => {
        const matchesSearch =
          !normalizedSearch ||
          task.title
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          task.description
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          task.assignee
            .toLowerCase()
            .includes(
              normalizedSearch
            );

        const matchesStatus =
          statusFilter === "all" ||
          task.status ===
            statusFilter;

        const matchesPriority =
          priorityFilter === "all" ||
          task.priority ===
            priorityFilter;

        const matchesAssignee =
          assigneeFilter === "all" ||
          task.assignee ===
            assigneeFilter;

        const matchesOverdue =
          !onlyOverdue ||
          isTaskOverdue(task);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee &&
          matchesOverdue
        );
      });

    return sortFilteredTasks(
      matchingTasks,
      taskSort
    );
  }, [
    assigneeFilter,
    onlyOverdue,
    priorityFilter,
    projectTasks,
    searchQuery,
    statusFilter,
    taskSort,
  ]);

  const progress = useMemo(() => {
    return calculateTaskProgress(
      projectTasks
    );
  }, [projectTasks]);

  const completedCount =
    projectTasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all" ||
    onlyOverdue ||
    taskSort !== "due_date";

  function updateForm<
    K extends keyof TaskFormState,
  >(
    key: K,
    value: TaskFormState[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_TASK_FORM);
    setEditingTaskId(null);
    setErrorMessage("");
    setIsFormOpen(false);
  }

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setOnlyOverdue(false);
    setTaskSort("due_date");
  }

  function openCreateForm() {
    setSelectedTaskId(null);
    setForm(EMPTY_TASK_FORM);
    setEditingTaskId(null);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openTaskDetails(
    task: ProjectTask
  ) {
    setSelectedTaskId(task.id);
  }

  function closeTaskDetails() {
    setSelectedTaskId(null);
  }

  function openEditForm(
    task: ProjectTask
  ) {
    setSelectedTaskId(null);

    setForm({
      title: task.title,
      description:
        task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate:
        task.dueDate ?? "",
    });

    setEditingTaskId(task.id);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function emitTaskUpdateActivity(
    previousTask: ProjectTask,
    updatedTask: ProjectTask
  ) {
    logTaskChanges(
      previousTask,
      updatedTask
    );

    if (!onTaskActivity) {
      return;
    }

    if (
      previousTask.status !==
        "completed" &&
      updatedTask.status ===
        "completed"
    ) {
      onTaskActivity(
        createTaskCompletedActivity(
          projectId,
          updatedTask.title
        )
      );

      return;
    }

    if (
      previousTask.status ===
        "completed" &&
      updatedTask.status !==
        "completed"
    ) {
      onTaskActivity(
        createTaskReopenedActivity(
          projectId,
          updatedTask.title
        )
      );

      return;
    }

    onTaskActivity(
      createTaskUpdatedActivity(
        projectId,
        updatedTask.title
      )
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    const dueDate =
      form.dueDate.trim() || null;

    try {
      if (editingTaskId) {
        const taskToUpdate =
          tasks.find(
            (task) =>
              task.id ===
              editingTaskId
          );

        if (!taskToUpdate) {
          throw new Error(
            "Die Aufgabe wurde nicht gefunden."
          );
        }

        const updatedTask =
          updateProjectTask(
            taskToUpdate,
            {
              title: form.title,
              description:
                form.description,
              status: form.status,
              priority:
                form.priority,
              assignee:
                form.assignee,
              dueDate,
            }
          );

        setTasks(
          (currentTasks) =>
            replaceProjectTask(
              currentTasks,
              updatedTask
            )
        );

        emitTaskUpdateActivity(
          taskToUpdate,
          updatedTask
        );
      } else {
        const newTask =
          createProjectTask({
            projectId,
            title: form.title,
            description:
              form.description,
            status: form.status,
            priority:
              form.priority,
            assignee:
              form.assignee,
            dueDate,
          });

        setTasks(
          (currentTasks) => [
            ...currentTasks,
            newTask,
          ]
        );

        onTaskActivity?.(
          createTaskAddedActivity(
            projectId,
            newTask.title
          )
        );
      }

      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Die Aufgabe konnte nicht gespeichert werden."
      );
    }
  }

  function handleToggleCompleted(
    task: ProjectTask
  ) {
    const updatedTask =
      toggleProjectTaskCompleted(task);

    setTasks((currentTasks) =>
      replaceProjectTask(
        currentTasks,
        updatedTask
      )
    );

    emitTaskUpdateActivity(
      task,
      updatedTask
    );
  }

  function handleStatusChange(
    task: ProjectTask,
    status: ProjectTaskStatus
  ) {
    if (task.status === status) {
      return;
    }

    const updatedTask =
      updateProjectTask(task, {
        status,
      });

    setTasks((currentTasks) =>
      replaceProjectTask(
        currentTasks,
        updatedTask
      )
    );

    emitTaskUpdateActivity(
      task,
      updatedTask
    );
  }

  function handleDelete(
    task: ProjectTask
  ) {
    const shouldDelete =
      window.confirm(
        `Möchtest du die Aufgabe „${task.title}“ wirklich löschen?`
      );

    if (!shouldDelete) {
      return;
    }

    setTasks((currentTasks) =>
      deleteProjectTask(
        currentTasks,
        task.id
      )
    );

    onTaskActivity?.(
      createTaskDeletedActivity(
        projectId,
        task.title
      )
    );

    if (
      selectedTaskId === task.id
    ) {
      setSelectedTaskId(null);
    }

    if (
      editingTaskId === task.id
    ) {
      resetForm();
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Projektorganisation
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Aufgaben
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              {completedCount} von{" "}
              {projectTasks.length} Aufgaben
              erledigt
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            Aufgabe erstellen
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">
              Projektfortschritt
            </span>

            <span className="font-semibold text-white">
              {progress} %
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {isFormOpen ? (
          <ProjectTaskForm
            form={form}
            editingTaskId={
              editingTaskId
            }
            errorMessage={errorMessage}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onClose={resetForm}
          />
        ) : null}

        <div className="mt-6">
          <ProjectTaskFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={
              priorityFilter
            }
            assigneeFilter={
              assigneeFilter
            }
            assignees={assignees}
            onlyOverdue={onlyOverdue}
            taskSort={taskSort}
            hasActiveFilters={
              hasActiveFilters
            }
            onSearchChange={
              setSearchQuery
            }
            onStatusChange={
              setStatusFilter
            }
            onPriorityChange={
              setPriorityFilter
            }
            onAssigneeChange={
              setAssigneeFilter
            }
            onOverdueChange={
              setOnlyOverdue
            }
            onSortChange={setTaskSort}
            onReset={resetFilters}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Aufgabenansicht
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {filteredTasks.length} von{" "}
              {projectTasks.length} Aufgaben
              werden angezeigt
            </p>
          </div>

          <div className="inline-flex w-fit rounded-lg border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
              onClick={() =>
                setTaskView("board")
              }
              aria-pressed={
                taskView === "board"
              }
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                taskView === "board"
                  ? "bg-white text-neutral-950"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              Kanban
            </button>

            <button
              type="button"
              onClick={() =>
                setTaskView("calendar")
              }
              aria-pressed={
                taskView === "calendar"
              }
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                taskView === "calendar"
                  ? "bg-white text-neutral-950"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              Kalender
            </button>
          </div>
        </div>

        <div className="mt-4">
          {filteredTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-12 text-center">
              <h3 className="text-sm font-semibold text-white">
                Keine Aufgaben gefunden
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Passe die Filter an oder
                erstelle eine neue Aufgabe.
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                >
                  Filter zurücksetzen
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Aufgabe erstellen
                </button>
              )}
            </div>
          ) : taskView === "calendar" ? (
            <ProjectTaskCalendar
              tasks={filteredTasks}
              onEditTask={
                openTaskDetails
              }
            />
          ) : (
            <ProjectTaskBoard
              tasks={filteredTasks}
              onEditTask={
                openTaskDetails
              }
              onToggleCompleted={
                handleToggleCompleted
              }
              onDeleteTask={
                handleDelete
              }
              onStatusChange={
                handleStatusChange
              }
            />
          )}
        </div>
      </section>

      <ProjectTaskDetailPanel
        task={selectedTask}
        onClose={closeTaskDetails}
        onEditTask={openEditForm}
        onToggleCompleted={
          handleToggleCompleted
        }
        onDeleteTask={handleDelete}
      />
    </>
  );
}
Bibliothek
/
Internet Firma
/
ProjectTaskManager.tsx


"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tasks as initialTasks } from "@/data/tasks";
import {
  createTaskAddedActivity,
  createTaskCompletedActivity,
  createTaskDeletedActivity,
  createTaskReopenedActivity,
  createTaskUpdatedActivity,
} from "@/lib/projectActivity";
import {
  calculateTaskProgress,
  createProjectTask,
  deleteProjectTask,
  getProjectTasks,
  isTaskOverdue,
  replaceProjectTask,
  sortProjectTasks,
  toggleProjectTaskCompleted,
  updateProjectTask,
} from "@/lib/projectTasks";
import {
  createTaskActivity,
} from "@/lib/taskActivity";
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";
import type {
  TaskActivity,
  TaskActivityType,
} from "@/types/taskActivity";
import type { TimelineEvent } from "@/types/timeline";
import ProjectTaskBoard from "./ProjectTaskBoard";
import ProjectTaskCalendar from "./ProjectTaskCalendar";
import ProjectTaskDetailPanel from "./ProjectTaskDetailPanel";
import ProjectTaskFilters, {
  type PriorityFilter,
  type StatusFilter,
  type TaskSort,
} from "./ProjectTaskFilters";
import ProjectTaskForm, {
  EMPTY_TASK_FORM,
  type TaskFormState,
} from "./ProjectTaskForm";

type ProjectTaskManagerProps = {
  projectId: string;
  onTaskActivity?: (
    activity: TimelineEvent
  ) => void;
};

type TaskView = "board" | "calendar";

const STORAGE_KEY =
  "dashboard-project-tasks";

const TASK_ACTIVITIES_STORAGE_KEY =
  "website-system-task-activities";

const STATUS_LABELS: Record<
  ProjectTaskStatus,
  string
> = {
  open: "Offen",
  in_progress: "In Arbeit",
  waiting: "Wartet",
  completed: "Erledigt",
};

const PRIORITY_LABELS: Record<
  ProjectTaskPriority,
  string
> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  critical: "Kritisch",
};

const PRIORITY_ORDER: Record<
  ProjectTaskPriority,
  number
> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

function loadStoredTasks(): ProjectTask[] {
  if (typeof window === "undefined") {
    return initialTasks;
  }

  const storedTasks =
    window.localStorage.getItem(
      STORAGE_KEY
    );

  if (!storedTasks) {
    return initialTasks;
  }

  try {
    const parsedTasks = JSON.parse(
      storedTasks
    ) as ProjectTask[];

    return Array.isArray(parsedTasks)
      ? parsedTasks
      : initialTasks;
  } catch {
    return initialTasks;
  }
}

function loadStoredTaskActivities():
  TaskActivity[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedActivities =
      window.localStorage.getItem(
        TASK_ACTIVITIES_STORAGE_KEY
      );

    if (!storedActivities) {
      return [];
    }

    const parsedActivities: unknown =
      JSON.parse(storedActivities);

    return Array.isArray(
      parsedActivities
    )
      ? (parsedActivities as TaskActivity[])
      : [];
  } catch {
    return [];
  }
}

function saveTaskActivity(
  taskId: string,
  type: TaskActivityType,
  message: string
) {
  if (typeof window === "undefined") {
    return;
  }

  const activity =
    createTaskActivity({
      taskId,
      type,
      author: "Dennis",
      message,
    });

  const currentActivities =
    loadStoredTaskActivities();

  try {
    window.localStorage.setItem(
      TASK_ACTIVITIES_STORAGE_KEY,
      JSON.stringify([
        ...currentActivities,
        activity,
      ])
    );
  } catch (error) {
    console.error(
      "Die Aufgabenaktivität konnte nicht gespeichert werden.",
      error
    );
  }
}

function formatActivityDate(
  value: string | null
): string {
  if (!value) {
    return "Nicht festgelegt";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(
    new Date(`${value}T12:00:00`)
  );
}

function logTaskChanges(
  previousTask: ProjectTask,
  updatedTask: ProjectTask
) {
  if (
    previousTask.title !==
    updatedTask.title
  ) {
    saveTaskActivity(
      updatedTask.id,
      "updated",
      `Titel geändert: ${previousTask.title} → ${updatedTask.title}`
    );
  }

  if (
    previousTask.description !==
    updatedTask.description
  ) {
    saveTaskActivity(
      updatedTask.id,
      "updated",
      "Beschreibung geändert"
    );
  }

  if (
    previousTask.status !==
    updatedTask.status
  ) {
    if (
      updatedTask.status ===
      "completed"
    ) {
      saveTaskActivity(
        updatedTask.id,
        "completed",
        "Aufgabe abgeschlossen"
      );
    } else {
      saveTaskActivity(
        updatedTask.id,
        "status_changed",
        `Status geändert: ${
          STATUS_LABELS[
            previousTask.status
          ]
        } → ${
          STATUS_LABELS[
            updatedTask.status
          ]
        }`
      );
    }
  }

  if (
    previousTask.priority !==
    updatedTask.priority
  ) {
    saveTaskActivity(
      updatedTask.id,
      "priority_changed",
      `Priorität geändert: ${
        PRIORITY_LABELS[
          previousTask.priority
        ]
      } → ${
        PRIORITY_LABELS[
          updatedTask.priority
        ]
      }`
    );
  }

  if (
    previousTask.assignee !==
    updatedTask.assignee
  ) {
    const previousAssignee =
      previousTask.assignee ||
      "Nicht zugewiesen";

    const updatedAssignee =
      updatedTask.assignee ||
      "Nicht zugewiesen";

    saveTaskActivity(
      updatedTask.id,
      "updated",
      `Verantwortlicher geändert: ${previousAssignee} → ${updatedAssignee}`
    );
  }

  if (
    previousTask.dueDate !==
    updatedTask.dueDate
  ) {
    saveTaskActivity(
      updatedTask.id,
      "updated",
      `Fälligkeitsdatum geändert: ${formatActivityDate(
        previousTask.dueDate
      )} → ${formatActivityDate(
        updatedTask.dueDate
      )}`
    );
  }
}

function sortFilteredTasks(
  tasks: ProjectTask[],
  sort: TaskSort
) {
  return [...tasks].sort(
    (firstTask, secondTask) => {
      if (sort === "priority") {
        const priorityDifference =
          PRIORITY_ORDER[
            secondTask.priority
          ] -
          PRIORITY_ORDER[
            firstTask.priority
          ];

        if (priorityDifference !== 0) {
          return priorityDifference;
        }

        return firstTask.title.localeCompare(
          secondTask.title,
          "de"
        );
      }

      if (sort === "title") {
        return firstTask.title.localeCompare(
          secondTask.title,
          "de"
        );
      }

      if (sort === "newest") {
        return (
          new Date(
            secondTask.createdAt
          ).getTime() -
          new Date(
            firstTask.createdAt
          ).getTime()
        );
      }

      if (sort === "oldest") {
        return (
          new Date(
            firstTask.createdAt
          ).getTime() -
          new Date(
            secondTask.createdAt
          ).getTime()
        );
      }

      if (
        !firstTask.dueDate &&
        !secondTask.dueDate
      ) {
        return firstTask.title.localeCompare(
          secondTask.title,
          "de"
        );
      }

      if (!firstTask.dueDate) {
        return 1;
      }

      if (!secondTask.dueDate) {
        return -1;
      }

      const dueDateDifference =
        firstTask.dueDate.localeCompare(
          secondTask.dueDate
        );

      if (dueDateDifference !== 0) {
        return dueDateDifference;
      }

      return firstTask.title.localeCompare(
        secondTask.title,
        "de"
      );
    }
  );
}

export default function ProjectTaskManager({
  projectId,
  onTaskActivity,
}: ProjectTaskManagerProps) {
  const [tasks, setTasks] =
    useState<ProjectTask[]>(
      initialTasks
    );

  const [form, setForm] =
    useState<TaskFormState>(
      EMPTY_TASK_FORM
    );

  const [
    editingTaskId,
    setEditingTaskId,
  ] = useState<string | null>(null);

  const [
    selectedTaskId,
    setSelectedTaskId,
  ] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [
    statusFilter,
    setStatusFilter,
  ] = useState<StatusFilter>("all");

  const [
    priorityFilter,
    setPriorityFilter,
  ] = useState<PriorityFilter>("all");

  const [
    assigneeFilter,
    setAssigneeFilter,
  ] = useState("all");

  const [onlyOverdue, setOnlyOverdue] =
    useState(false);

  const [taskSort, setTaskSort] =
    useState<TaskSort>("due_date");

  const [taskView, setTaskView] =
    useState<TaskView>("board");

  useEffect(() => {
    setTasks(loadStoredTasks());
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(tasks)
    );
  }, [isLoaded, tasks]);

  const projectTasks = useMemo(() => {
    return sortProjectTasks(
      getProjectTasks(
        tasks,
        projectId
      )
    );
  }, [projectId, tasks]);

  const selectedTask = useMemo(() => {
    if (!selectedTaskId) {
      return null;
    }

    return (
      tasks.find(
        (task) =>
          task.id ===
          selectedTaskId
      ) ?? null
    );
  }, [selectedTaskId, tasks]);

  const assignees = useMemo(() => {
    return Array.from(
      new Set(
        projectTasks
          .map((task) =>
            task.assignee.trim()
          )
          .filter(Boolean)
      )
    ).sort(
      (
        firstAssignee,
        secondAssignee
      ) =>
        firstAssignee.localeCompare(
          secondAssignee,
          "de"
        )
    );
  }, [projectTasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch =
      searchQuery
        .trim()
        .toLowerCase();

    const matchingTasks =
      projectTasks.filter((task) => {
        const matchesSearch =
          !normalizedSearch ||
          task.title
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          task.description
            .toLowerCase()
            .includes(
              normalizedSearch
            ) ||
          task.assignee
            .toLowerCase()
            .includes(
              normalizedSearch
            );

        const matchesStatus =
          statusFilter === "all" ||
          task.status ===
            statusFilter;

        const matchesPriority =
          priorityFilter === "all" ||
          task.priority ===
            priorityFilter;

        const matchesAssignee =
          assigneeFilter === "all" ||
          task.assignee ===
            assigneeFilter;

        const matchesOverdue =
          !onlyOverdue ||
          isTaskOverdue(task);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee &&
          matchesOverdue
        );
      });

    return sortFilteredTasks(
      matchingTasks,
      taskSort
    );
  }, [
    assigneeFilter,
    onlyOverdue,
    priorityFilter,
    projectTasks,
    searchQuery,
    statusFilter,
    taskSort,
  ]);

  const progress = useMemo(() => {
    return calculateTaskProgress(
      projectTasks
    );
  }, [projectTasks]);

  const completedCount =
    projectTasks.filter(
      (task) =>
        task.status ===
        "completed"
    ).length;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all" ||
    onlyOverdue ||
    taskSort !== "due_date";

  function updateForm<
    K extends keyof TaskFormState,
  >(
    key: K,
    value: TaskFormState[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_TASK_FORM);
    setEditingTaskId(null);
    setErrorMessage("");
    setIsFormOpen(false);
  }

  function resetFilters() {
    setSearchQuery("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setAssigneeFilter("all");
    setOnlyOverdue(false);
    setTaskSort("due_date");
  }

  function openCreateForm() {
    setSelectedTaskId(null);
    setForm(EMPTY_TASK_FORM);
    setEditingTaskId(null);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openTaskDetails(
    task: ProjectTask
  ) {
    setSelectedTaskId(task.id);
  }

  function closeTaskDetails() {
    setSelectedTaskId(null);
  }

  function openEditForm(
    task: ProjectTask
  ) {
    setSelectedTaskId(null);

    setForm({
      title: task.title,
      description:
        task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate:
        task.dueDate ?? "",
    });

    setEditingTaskId(task.id);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function emitTaskUpdateActivity(
    previousTask: ProjectTask,
    updatedTask: ProjectTask
  ) {
    logTaskChanges(
      previousTask,
      updatedTask
    );

    if (!onTaskActivity) {
      return;
    }

    if (
      previousTask.status !==
        "completed" &&
      updatedTask.status ===
        "completed"
    ) {
      onTaskActivity(
        createTaskCompletedActivity(
          projectId,
          updatedTask.title
        )
      );

      return;
    }

    if (
      previousTask.status ===
        "completed" &&
      updatedTask.status !==
        "completed"
    ) {
      onTaskActivity(
        createTaskReopenedActivity(
          projectId,
          updatedTask.title
        )
      );

      return;
    }

    onTaskActivity(
      createTaskUpdatedActivity(
        projectId,
        updatedTask.title
      )
    );
  }

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

    const dueDate =
      form.dueDate.trim() || null;

    try {
      if (editingTaskId) {
        const taskToUpdate =
          tasks.find(
            (task) =>
              task.id ===
              editingTaskId
          );

        if (!taskToUpdate) {
          throw new Error(
            "Die Aufgabe wurde nicht gefunden."
          );
        }

        const updatedTask =
          updateProjectTask(
            taskToUpdate,
            {
              title: form.title,
              description:
                form.description,
              status: form.status,
              priority:
                form.priority,
              assignee:
                form.assignee,
              dueDate,
            }
          );

        setTasks(
          (currentTasks) =>
            replaceProjectTask(
              currentTasks,
              updatedTask
            )
        );

        emitTaskUpdateActivity(
          taskToUpdate,
          updatedTask
        );
      } else {
        const newTask =
          createProjectTask({
            projectId,
            title: form.title,
            description:
              form.description,
            status: form.status,
            priority:
              form.priority,
            assignee:
              form.assignee,
            dueDate,
          });

        setTasks(
          (currentTasks) => [
            ...currentTasks,
            newTask,
          ]
        );

        onTaskActivity?.(
          createTaskAddedActivity(
            projectId,
            newTask.title
          )
        );
      }

      resetForm();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Die Aufgabe konnte nicht gespeichert werden."
      );
    }
  }

  function handleToggleCompleted(
    task: ProjectTask
  ) {
    const updatedTask =
      toggleProjectTaskCompleted(task);

    setTasks((currentTasks) =>
      replaceProjectTask(
        currentTasks,
        updatedTask
      )
    );

    emitTaskUpdateActivity(
      task,
      updatedTask
    );
  }

  function handleStatusChange(
    task: ProjectTask,
    status: ProjectTaskStatus
  ) {
    if (task.status === status) {
      return;
    }

    const updatedTask =
      updateProjectTask(task, {
        status,
      });

    setTasks((currentTasks) =>
      replaceProjectTask(
        currentTasks,
        updatedTask
      )
    );

    emitTaskUpdateActivity(
      task,
      updatedTask
    );
  }

  function handleDelete(
    task: ProjectTask
  ) {
    const shouldDelete =
      window.confirm(
        `Möchtest du die Aufgabe „${task.title}“ wirklich löschen?`
      );

    if (!shouldDelete) {
      return;
    }

    setTasks((currentTasks) =>
      deleteProjectTask(
        currentTasks,
        task.id
      )
    );

    onTaskActivity?.(
      createTaskDeletedActivity(
        projectId,
        task.title
      )
    );

    if (
      selectedTaskId === task.id
    ) {
      setSelectedTaskId(null);
    }

    if (
      editingTaskId === task.id
    ) {
      resetForm();
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-sm font-medium text-neutral-500">
              Projektorganisation
            </p>

            <h2 className="mt-1 text-xl font-semibold text-white">
              Aufgaben
            </h2>

            <p className="mt-2 text-sm text-neutral-400">
              {completedCount} von{" "}
              {projectTasks.length} Aufgaben
              erledigt
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateForm}
            className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
          >
            Aufgabe erstellen
          </button>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-400">
              Projektfortschritt
            </span>

            <span className="font-semibold text-white">
              {progress} %
            </span>
          </div>

          <div className="mt-2 h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>
        </div>

        {isFormOpen ? (
          <ProjectTaskForm
            form={form}
            editingTaskId={
              editingTaskId
            }
            errorMessage={errorMessage}
            onChange={updateForm}
            onSubmit={handleSubmit}
            onClose={resetForm}
          />
        ) : null}

        <div className="mt-6">
          <ProjectTaskFilters
            searchQuery={searchQuery}
            statusFilter={statusFilter}
            priorityFilter={
              priorityFilter
            }
            assigneeFilter={
              assigneeFilter
            }
            assignees={assignees}
            onlyOverdue={onlyOverdue}
            taskSort={taskSort}
            hasActiveFilters={
              hasActiveFilters
            }
            onSearchChange={
              setSearchQuery
            }
            onStatusChange={
              setStatusFilter
            }
            onPriorityChange={
              setPriorityFilter
            }
            onAssigneeChange={
              setAssigneeFilter
            }
            onOverdueChange={
              setOnlyOverdue
            }
            onSortChange={setTaskSort}
            onReset={resetFilters}
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium text-white">
              Aufgabenansicht
            </p>

            <p className="mt-1 text-xs text-neutral-500">
              {filteredTasks.length} von{" "}
              {projectTasks.length} Aufgaben
              werden angezeigt
            </p>
          </div>

          <div className="inline-flex w-fit rounded-lg border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
              onClick={() =>
                setTaskView("board")
              }
              aria-pressed={
                taskView === "board"
              }
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                taskView === "board"
                  ? "bg-white text-neutral-950"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              Kanban
            </button>

            <button
              type="button"
              onClick={() =>
                setTaskView("calendar")
              }
              aria-pressed={
                taskView === "calendar"
              }
              className={`rounded-md px-4 py-2 text-sm font-medium transition ${
                taskView === "calendar"
                  ? "bg-white text-neutral-950"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
              }`}
            >
              Kalender
            </button>
          </div>
        </div>

        <div className="mt-4">
          {filteredTasks.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 px-6 py-12 text-center">
              <h3 className="text-sm font-semibold text-white">
                Keine Aufgaben gefunden
              </h3>

              <p className="mt-2 text-sm text-neutral-500">
                Passe die Filter an oder
                erstelle eine neue Aufgabe.
              </p>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-5 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                >
                  Filter zurücksetzen
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openCreateForm}
                  className="mt-5 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
                >
                  Aufgabe erstellen
                </button>
              )}
            </div>
          ) : taskView === "calendar" ? (
            <ProjectTaskCalendar
              tasks={filteredTasks}
              onEditTask={
                openTaskDetails
              }
            />
          ) : (
            <ProjectTaskBoard
              tasks={filteredTasks}
              onEditTask={
                openTaskDetails
              }
              onToggleCompleted={
                handleToggleCompleted
              }
              onDeleteTask={
                handleDelete
              }
              onStatusChange={
                handleStatusChange
              }
            />
          )}
        </div>
      </section>

      <ProjectTaskDetailPanel
        task={selectedTask}
        onClose={closeTaskDetails}
        onEditTask={openEditForm}
        onToggleCompleted={
          handleToggleCompleted
        }
        onDeleteTask={handleDelete}
      />
    </>
  );
}