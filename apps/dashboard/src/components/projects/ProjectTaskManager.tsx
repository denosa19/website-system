"use client";

import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { tasks as initialTasks } from "@/data/tasks";
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

type ProjectTaskManagerProps = {
  projectId: string;
};

type TaskFormState = {
  title: string;
  description: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  assignee: string;
  dueDate: string;
};

const EMPTY_FORM: TaskFormState = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  assignee: "Dennis",
  dueDate: "",
};

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

const STORAGE_KEY = "dashboard-project-tasks";

function formatDate(value: string | null) {
  if (!value) {
    return "Keine Frist";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(`${value}T12:00:00`));
}

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

export default function ProjectTaskManager({
  projectId,
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

  const progress = useMemo(() => {
    return calculateTaskProgress(projectTasks);
  }, [projectTasks]);

  const completedCount = projectTasks.filter(
    (task) => task.status === "completed"
  ).length;

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

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setErrorMessage("");

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
            dueDate: form.dueDate || null,
          }
        );

        setTasks((currentTasks) =>
          replaceProjectTask(
            currentTasks,
            updatedTask
          )
        );
      } else {
        const newTask = createProjectTask({
          projectId,
          title: form.title,
          description: form.description,
          status: form.status,
          priority: form.priority,
          assignee: form.assignee,
          dueDate: form.dueDate || null,
        });

        setTasks((currentTasks) => [
          ...currentTasks,
          newTask,
        ]);
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

      <div className="mt-6 space-y-3">
        {projectTasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 px-5 py-8 text-center">
            <p className="font-medium text-white">
              Noch keine Aufgaben vorhanden
            </p>

            <p className="mt-2 text-sm text-neutral-500">
              Erstelle die erste Aufgabe für dieses
              Projekt.
            </p>
          </div>
        ) : (
          projectTasks.map((task) => {
            const overdue = isTaskOverdue(task);

            return (
              <article
                key={task.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="flex min-w-0 gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleToggleCompleted(task)
                      }
                      aria-label={
                        task.status === "completed"
                          ? "Aufgabe wieder öffnen"
                          : "Aufgabe erledigen"
                      }
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition ${
                        task.status === "completed"
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-neutral-600 text-transparent hover:border-neutral-400"
                      }`}
                    >
                      ✓
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`font-semibold ${
                            task.status ===
                            "completed"
                              ? "text-neutral-500 line-through"
                              : "text-white"
                          }`}
                        >
                          {task.title}
                        </h3>

                        <span className="rounded-full border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300">
                          {
                            STATUS_LABELS[
                              task.status
                            ]
                          }
                        </span>

                        <span className="rounded-full border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300">
                          {
                            PRIORITY_LABELS[
                              task.priority
                            ]
                          }
                        </span>

                        {overdue ? (
                          <span className="rounded-full border border-red-900 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-300">
                            Überfällig
                          </span>
                        ) : null}
                      </div>

                      {task.description ? (
                        <p className="mt-3 text-sm leading-6 text-neutral-400">
                          {task.description}
                        </p>
                      ) : null}

                      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-500">
                        <span>
                          Verantwortlich:{" "}
                          {task.assignee ||
                            "Nicht zugewiesen"}
                        </span>

                        <span>
                          Fällig:{" "}
                          {formatDate(task.dueDate)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        openEditForm(task)
                      }
                      className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                    >
                      Bearbeiten
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDelete(task)
                      }
                      className="rounded-lg border border-red-900/70 px-3 py-2 text-sm text-red-300 transition hover:bg-red-950/40"
                    >
                      Löschen
                    </button>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}