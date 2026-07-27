"use client";

import { useEffect } from "react";
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";

type ProjectTaskDetailPanelProps = {
  task: ProjectTask | null;
  onClose: () => void;
  onEditTask: (task: ProjectTask) => void;
  onToggleCompleted: (task: ProjectTask) => void;
  onDeleteTask: (task: ProjectTask) => void;
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

const STATUS_STYLES: Record<
  ProjectTaskStatus,
  string
> = {
  open:
    "border-amber-800/70 bg-amber-950/50 text-amber-200",
  in_progress:
    "border-blue-800/70 bg-blue-950/50 text-blue-200",
  waiting:
    "border-neutral-700 bg-neutral-800 text-neutral-200",
  completed:
    "border-emerald-800/70 bg-emerald-950/50 text-emerald-200",
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

const PRIORITY_STYLES: Record<
  ProjectTaskPriority,
  string
> = {
  low:
    "border-neutral-700 bg-neutral-900 text-neutral-300",
  medium:
    "border-blue-900/70 bg-blue-950/30 text-blue-300",
  high:
    "border-orange-900/70 bg-orange-950/30 text-orange-300",
  critical:
    "border-red-900/70 bg-red-950/40 text-red-300",
};

function formatDate(
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

function formatDateTime(
  value: string
): string {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function isTaskOverdue(
  task: ProjectTask
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

  return dueDate.getTime() < Date.now();
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 border-b border-neutral-800 py-3 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-sm text-neutral-500">
        {label}
      </dt>

      <dd className="break-words text-sm text-neutral-200">
        {value}
      </dd>
    </div>
  );
}

export default function ProjectTaskDetailPanel({
  task,
  onClose,
  onEditTask,
  onToggleCompleted,
  onDeleteTask,
}: ProjectTaskDetailPanelProps) {
  useEffect(() => {
    if (!task) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [onClose, task]);

  if (!task) {
    return null;
  }

  const overdue = isTaskOverdue(task);

  function handleEdit() {
    onEditTask(task);
    onClose();
  }

  function handleToggleCompleted() {
    onToggleCompleted(task);
  }

  function handleDelete() {
    onDeleteTask(task);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
      className="fixed inset-0 z-50"
    >
      <button
        type="button"
        aria-label="Detailansicht schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-2xl border border-neutral-800 bg-neutral-950 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-xl sm:rounded-none sm:border-y-0 sm:border-r-0">
        <header className="flex items-start justify-between gap-4 border-b border-neutral-800 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Aufgabendetails
            </p>

            <h2
              id="task-detail-title"
              className="mt-2 break-words text-xl font-semibold text-white"
            >
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Detailansicht schließen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-700 text-xl text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                STATUS_STYLES[
                  task.status
                ]
              }`}
            >
              {
                STATUS_LABELS[
                  task.status
                ]
              }
            </span>

            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                PRIORITY_STYLES[
                  task.priority
                ]
              }`}
            >
              Priorität:{" "}
              {
                PRIORITY_LABELS[
                  task.priority
                ]
              }
            </span>

            {overdue ? (
              <span className="rounded-full border border-red-800/70 bg-red-950/60 px-3 py-1.5 text-xs font-medium text-red-200">
                Überfällig
              </span>
            ) : null}
          </div>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-white">
              Beschreibung
            </h3>

            {task.description ? (
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">
                {task.description}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-neutral-600">
                Keine Beschreibung vorhanden.
              </p>
            )}
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-semibold text-white">
              Informationen
            </h3>

            <dl className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4">
              <DetailRow
                label="Verantwortlicher"
                value={
                  task.assignee ||
                  "Nicht zugewiesen"
                }
              />

              <DetailRow
                label="Fälligkeitsdatum"
                value={formatDate(
                  task.dueDate
                )}
              />

              <DetailRow
                label="Erstellt"
                value={formatDateTime(
                  task.createdAt
                )}
              />

              <DetailRow
                label="Zuletzt geändert"
                value={formatDateTime(
                  task.updatedAt
                )}
              />

              {task.completedAt ? (
                <DetailRow
                  label="Abgeschlossen"
                  value={formatDateTime(
                    task.completedAt
                  )}
                />
              ) : null}
            </dl>
          </section>
        </div>

        <footer className="border-t border-neutral-800 bg-neutral-950 px-5 py-4 sm:px-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Aufgabe bearbeiten
            </button>

            <button
              type="button"
              onClick={
                handleToggleCompleted
              }
              className="rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
            >
              {task.status ===
              "completed"
                ? "Aufgabe wieder öffnen"
                : "Als erledigt markieren"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 w-full rounded-lg border border-red-900/70 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-950/40"
          >
            Aufgabe löschen
          </button>
        </footer>
      </aside>
    </div>
  );
}