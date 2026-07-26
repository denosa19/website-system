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
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";
import type { TimelineEvent } from "@/types/timeline";
import ProjectTaskBoard from "./ProjectTaskBoard";

type ProjectTaskManagerProps = {
  projectId: string;
  onTaskActivity?: (
    activity: TimelineEvent
  ) => void;
};

type TaskFormState = {
  title: string;
  description: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  assignee: string;
  dueDate: string;
};

type StatusFilter =
  | "all"
  | ProjectTaskStatus;

type PriorityFilter =
  | "all"
  | ProjectTaskPriority;

type TaskSort =
  | "due_date"
  | "priority"
  | "title"
  | "newest"
  | "oldest";

const EMPTY_FORM: TaskFormState = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  assignee: "Dennis",
  dueDate: "",
};

const STORAGE_KEY = "dashboard-project-tasks";

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

  const storedTasks = window.localStorage.getItem(
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

function sortFilteredTasks(
  tasks: ProjectTask[],
  sort: TaskSort
) {
  return [...tasks].sort((firstTask, secondTask) => {
    if (sort === "priority") {
      const priorityDifference =
        PRIORITY_ORDER[secondTask.priority] -
        PRIORITY_ORDER[firstTask.priority];

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
        new Date(secondTask.createdAt).getTime() -
        new Date(firstTask.createdAt).getTime()
      );
    }

    if (sort === "oldest") {
      return (
        new Date(firstTask.createdAt).getTime() -
        new Date(secondTask.createdAt).getTime()
      );
    }

    if (!firstTask.dueDate && !secondTask.dueDate) {
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
      new Date(firstTask.dueDate).getTime() -
      new Date(secondTask.dueDate).getTime();

    if (dueDateDifference !== 0) {
      return dueDateDifference;
    }

    return firstTask.title.localeCompare(
      secondTask.title,
      "de"
    );
  });
}

export default function ProjectTaskManager({
  projectId,
  onTaskActivity,
}: ProjectTaskManagerProps) {
  const [tasks, setTasks] =
    useState<ProjectTask[]>(initialTasks);

  const [form, setForm] =
    useState<TaskFormState>(EMPTY_FORM);

  const [editingTaskId, setEditingTaskId] =
    useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] =
    useState(false);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [isLoaded, setIsLoaded] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [priorityFilter, setPriorityFilter] =
    useState<PriorityFilter>("all");

  const [assigneeFilter, setAssigneeFilter] =
    useState("all");

  const [onlyOverdue, setOnlyOverdue] =
    useState(false);

  const [taskSort, setTaskSort] =
    useState<TaskSort>("due_date");

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
      getProjectTasks(tasks, projectId)
    );
  }, [projectId, tasks]);

  const assignees = useMemo(() => {
    return Array.from(
      new Set(
        projectTasks
          .map((task) => task.assignee.trim())
          .filter(Boolean)
      )
    ).sort((firstAssignee, secondAssignee) =>
      firstAssignee.localeCompare(
        secondAssignee,
        "de"
      )
    );
  }, [projectTasks]);

  const filteredTasks = useMemo(() => {
    const normalizedSearch =
      searchQuery.trim().toLowerCase();

    const matchingTasks = projectTasks.filter(
      (task) => {
        const matchesSearch =
          !normalizedSearch ||
          task.title
            .toLowerCase()
            .includes(normalizedSearch) ||
          task.description
            .toLowerCase()
            .includes(normalizedSearch) ||
          task.assignee
            .toLowerCase()
            .includes(normalizedSearch);

        const matchesStatus =
          statusFilter === "all" ||
          task.status === statusFilter;

        const matchesPriority =
          priorityFilter === "all" ||
          task.priority === priorityFilter;

        const matchesAssignee =
          assigneeFilter === "all" ||
          task.assignee === assigneeFilter;

        const matchesOverdue =
          !onlyOverdue || isTaskOverdue(task);

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesAssignee &&
          matchesOverdue
        );
      }
    );

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
    return calculateTaskProgress(projectTasks);
  }, [projectTasks]);

  const completedCount = projectTasks.filter(
    (task) => task.status === "completed"
  ).length;

  const hasActiveFilters =
    searchQuery.trim() !== "" ||
    statusFilter !== "all" ||
    priorityFilter !== "all" ||
    assigneeFilter !== "all" ||
    onlyOverdue ||
    taskSort !== "due_date";

  function updateForm<K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K]
  ) {
    setForm((currentForm) => ({
      ...currentForm,
      [key]: value,
    }));
  }

  function resetForm() {
    setForm(EMPTY_FORM);
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
    setForm(EMPTY_FORM);
    setEditingTaskId(null);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function openEditForm(task: ProjectTask) {
    setForm({
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assignee: task.assignee,
      dueDate: task.dueDate ?? "",
    });

    setEditingTaskId(task.id);
    setErrorMessage("");
    setIsFormOpen(true);
  }

  function emitTaskUpdateActivity(
    previousTask: ProjectTask,
    updatedTask: ProjectTask
  ) {
    if (!onTaskActivity) {
      return;
    }

    if (
      previousTask.status !== "completed" &&
      updatedTask.status === "completed"
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
      previousTask.status === "completed" &&
      updatedTask.status !== "completed"
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

    const formData = new FormData(
      event.currentTarget
    );

    const submittedDueDate =
      formData.get("dueDate");

    const dueDate =
      typeof submittedDueDate === "string" &&
      submittedDueDate.trim()
        ? submittedDueDate.trim()
        : null;

    try {
      if (editingTaskId) {
        const taskToUpdate = tasks.find(
          (task) => task.id === editingTaskId
        );

        if (!taskToUpdate) {
          throw new Error(
            "Die Aufgabe wurde nicht gefunden."
          );
        }

        const updatedTask = updateProjectTask(
          taskToUpdate,
          {
            title: form.title,
            description: form.description,
            status: form.status,
            priority: form.priority,
            assignee: form.assignee,
            dueDate,
          }
        );

        setTasks((currentTasks) =>
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
        const newTask = createProjectTask({
          projectId,
          title: form.title,
          description: form.description,
          status: form.status,
          priority: form.priority,
          assignee: form.assignee,
          dueDate,
        });

        setTasks((currentTasks) => [
          ...currentTasks,
          newTask,
        ]);

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

    if (updatedTask.status === "completed") {
      onTaskActivity?.(
        createTaskCompletedActivity(
          projectId,
          updatedTask.title
        )
      );

      return;
    }

    onTaskActivity?.(
      createTaskReopenedActivity(
        projectId,
        updatedTask.title
      )
    );
  }

  function handleStatusChange(
    task: ProjectTask,
    status: ProjectTaskStatus
  ) {
    if (task.status === status) {
      return;
    }

    const completedAt =
      status === "completed"
        ? new Date().toISOString()
        : null;

    const updatedTask = updateProjectTask(
      task,
      {
        status,
        completedAt,
      }
    );

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

  function handleDelete(task: ProjectTask) {
    const shouldDelete = window.confirm(
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

    if (editingTaskId === task.id) {
      resetForm();
    }
  }

  return (
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
            {projectTasks.length} Aufgaben erledigt
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
        <form
          onSubmit={handleSubmit}
          className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5"
        >
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-semibold text-white">
              {editingTaskId
                ? "Aufgabe bearbeiten"
                : "Neue Aufgabe"}
            </h3>

            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-neutral-400 transition hover:text-white"
            >
              Schließen
            </button>
          </div>

          <div className="mt-5 grid gap-4">
            <label className="grid gap-2 text-sm text-neutral-300">
              Titel
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  updateForm(
                    "title",
                    event.target.value
                  )
                }
                placeholder="Zum Beispiel: Website prüfen"
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
              />
            </label>

            <label className="grid gap-2 text-sm text-neutral-300">
              Beschreibung
              <textarea
                value={form.description}
                onChange={(event) =>
                  updateForm(
                    "description",
                    event.target.value
                  )
                }
                rows={4}
                placeholder="Was muss bei dieser Aufgabe erledigt werden?"
                className="resize-y rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-neutral-300">
                Status
                <select
                  value={form.status}
                  onChange={(event) =>
                    updateForm(
                      "status",
                      event.target
                        .value as ProjectTaskStatus
                    )
                  }
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
                >
                  <option value="open">
                    Offen
                  </option>

                  <option value="in_progress">
                    In Arbeit
                  </option>

                  <option value="waiting">
                    Wartet
                  </option>

                  <option value="completed">
                    Erledigt
                  </option>
                </select>
              </label>

              <label className="grid gap-2 text-sm text-neutral-300">
                Priorität
                <select
                  value={form.priority}
                  onChange={(event) =>
                    updateForm(
                      "priority",
                      event.target
                        .value as ProjectTaskPriority
                    )
                  }
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
                >
                  <option value="low">
                    Niedrig
                  </option>

                  <option value="medium">
                    Mittel
                  </option>

                  <option value="high">
                    Hoch
                  </option>

                  <option value="critical">
                    Kritisch
                  </option>
                </select>
              </label>

              <label className="grid gap-2 text-sm text-neutral-300">
                Verantwortlicher
                <input
                  type="text"
                  value={form.assignee}
                  onChange={(event) =>
                    updateForm(
                      "assignee",
                      event.target.value
                    )
                  }
                  placeholder="Dennis"
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-500"
                />
              </label>

              <label className="grid gap-2 text-sm text-neutral-300">
                Fälligkeitsdatum
                <input
                  type="date"
                  name="dueDate"
                  value={form.dueDate}
                  onChange={(event) =>
                    updateForm(
                      "dueDate",
                      event.target.value
                    )
                  }
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
                />
              </label>
            </div>
          </div>

          {errorMessage ? (
            <p
              role="alert"
              className="mt-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300"
            >
              {errorMessage}
            </p>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row">
            <button
              type="submit"
              className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              {editingTaskId
                ? "Änderungen speichern"
                : "Aufgabe speichern"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
            >
              Abbrechen
            </button>
          </div>
        </form>
      ) : null}

      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
            <label className="grid flex-1 gap-2 text-sm text-neutral-300">
              Suche
              <input
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                placeholder="Aufgaben durchsuchen..."
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
              />
            </label>

            <label className="grid gap-2 text-sm text-neutral-300 lg:w-48">
              Status
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target
                      .value as StatusFilter
                  )
                }
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
              >
                <option value="all">
                  Alle Status
                </option>
                <option value="open">
                  Offen
                </option>
                <option value="in_progress">
                  In Arbeit
                </option>
                <option value="waiting">
                  Wartet
                </option>
                <option value="completed">
                  Erledigt
                </option>
              </select>
            </label>

            <label className="grid gap-2 text-sm text-neutral-300 lg:w-48">
              Priorität
              <select
                value={priorityFilter}
                onChange={(event) =>
                  setPriorityFilter(
                    event.target
                      .value as PriorityFilter
                  )
                }
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
              >
                <option value="all">
                  Alle Prioritäten
                </option>
                <option value="low">
                  Niedrig
                </option>
                <option value="medium">
                  Mittel
                </option>
                <option value="high">
                  Hoch
                </option>
                <option value="critical">
                  Kritisch
                </option>
              </select>
            </label>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label className="grid gap-2 text-sm text-neutral-300">
              Verantwortlicher
              <select
                value={assigneeFilter}
                onChange={(event) =>
                  setAssigneeFilter(
                    event.target.value
                  )
                }
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
              >
                <option value="all">
                  Alle Verantwortlichen
                </option>

                {assignees.map((assignee) => (
                  <option
                    key={assignee}
                    value={assignee}
                  >
                    {assignee}
                  </option>
                ))}
              </select>
            </label>

            <label className="grid gap-2 text-sm text-neutral-300">
              Sortierung
              <select
                value={taskSort}
                onChange={(event) =>
                  setTaskSort(
                    event.target.value as TaskSort
                  )
                }
                className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
              >
                <option value="due_date">
                  Fälligkeitsdatum
                </option>
                <option value="priority">
                  Priorität
                </option>
                <option value="title">
                  Titel A–Z
                </option>
                <option value="newest">
                  Neueste zuerst
                </option>
                <option value="oldest">
                  Älteste zuerst
                </option>
              </select>
            </label>

            <label className="flex min-h-[46px] items-center gap-3 self-end rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-300">
              <input
                type="checkbox"
                checked={onlyOverdue}
                onChange={(event) =>
                  setOnlyOverdue(
                    event.target.checked
                  )
                }
                className="h-4 w-4 rounded border-neutral-600 bg-neutral-900"
              />

              Nur überfällige Aufgaben
            </label>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="min-h-[46px] self-end rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
            >
              Filter zurücksetzen
            </button>
          </div>

          <div className="flex flex-col gap-1 border-t border-neutral-800 pt-4 text-sm sm:flex-row sm:items-center sm:justify-between">
            <p className="text-neutral-400">
              {filteredTasks.length} von{" "}
              {projectTasks.length} Aufgaben werden
              angezeigt
            </p>

            {hasActiveFilters ? (
              <p className="text-xs font-medium text-neutral-500">
                Filter aktiv
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <ProjectTaskBoard
          tasks={filteredTasks}
          onEditTask={openEditForm}
          onToggleCompleted={
            handleToggleCompleted
          }
          onDeleteTask={handleDelete}
          onStatusChange={handleStatusChange}
        />
      </div>
    </section>
  );
}