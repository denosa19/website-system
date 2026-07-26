"use client";

import {
  type DragEvent,
  useState,
} from "react";
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";

type ProjectTaskBoardProps = {
  tasks: ProjectTask[];
  onEditTask: (task: ProjectTask) => void;
  onToggleCompleted: (task: ProjectTask) => void;
  onDeleteTask: (task: ProjectTask) => void;
  onStatusChange: (
    task: ProjectTask,
    status: ProjectTaskStatus
  ) => void;
};

type KanbanColumn = {
  status: ProjectTaskStatus;
  title: string;
  description: string;
};

const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    status: "open",
    title: "Offen",
    description: "Noch nicht begonnene Aufgaben",
  },
  {
    status: "in_progress",
    title: "In Arbeit",
    description: "Aktuell bearbeitete Aufgaben",
  },
  {
    status: "waiting",
    title: "Wartet",
    description: "Blockierte oder wartende Aufgaben",
  },
  {
    status: "completed",
    title: "Erledigt",
    description: "Abgeschlossene Aufgaben",
  },
];

const PRIORITY_LABELS: Record<
  ProjectTaskPriority,
  string
> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  critical: "Kritisch",
};

function formatDate(value: string | null) {
  if (!value) {
    return "Keine Frist";
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(new Date(`${value}T12:00:00`));
}

function isTaskOverdue(task: ProjectTask) {
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

function ProjectTaskBoardCard({
  task,
  isDragging,
  onDragStart,
  onDragEnd,
  onEditTask,
  onToggleCompleted,
  onDeleteTask,
}: {
  task: ProjectTask;
  isDragging: boolean;
  onDragStart: (
    event: DragEvent<HTMLElement>,
    task: ProjectTask
  ) => void;
  onDragEnd: () => void;
  onEditTask: (task: ProjectTask) => void;
  onToggleCompleted: (task: ProjectTask) => void;
  onDeleteTask: (task: ProjectTask) => void;
}) {
  const overdue = isTaskOverdue(task);

  return (
    <article
      draggable
      onDragStart={(event) =>
        onDragStart(event, task)
      }
      onDragEnd={onDragEnd}
      className={`cursor-grab rounded-xl border bg-neutral-950 p-4 shadow-sm transition active:cursor-grabbing ${
        isDragging
          ? "border-neutral-500 opacity-50"
          : "border-neutral-800 hover:border-neutral-700"
      }`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="text-xs font-medium text-neutral-600">
          Ziehen zum Verschieben
        </span>

        <span
          aria-hidden="true"
          className="text-sm tracking-widest text-neutral-600"
        >
          ⋮⋮
        </span>
      </div>

      <div className="flex items-start justify-between gap-3">
        <button
          type="button"
          onClick={() => onToggleCompleted(task)}
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

        <div className="min-w-0 flex-1">
          <h3
            className={`break-words text-sm font-semibold ${
              task.status === "completed"
                ? "text-neutral-500 line-through"
                : "text-white"
            }`}
          >
            {task.title}
          </h3>

          {task.description ? (
            <p className="mt-2 line-clamp-3 text-xs leading-5 text-neutral-400">
              {task.description}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <span className="rounded-full border border-neutral-700 px-2.5 py-1 text-xs text-neutral-300">
          {PRIORITY_LABELS[task.priority]}
        </span>

        {overdue ? (
          <span className="rounded-full border border-red-900 bg-red-950/40 px-2.5 py-1 text-xs font-medium text-red-300">
            Überfällig
          </span>
        ) : null}
      </div>

      <div className="mt-4 space-y-1 text-xs text-neutral-500">
        <p>
          Verantwortlich:{" "}
          {task.assignee || "Nicht zugewiesen"}
        </p>

        <p>
          Fällig: {formatDate(task.dueDate)}
        </p>
      </div>

      <div className="mt-4 flex gap-2 border-t border-neutral-800 pt-3">
        <button
          type="button"
          onClick={() => onEditTask(task)}
          className="flex-1 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
        >
          Bearbeiten
        </button>

        <button
          type="button"
          onClick={() => onDeleteTask(task)}
          className="rounded-lg border border-red-900/70 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-950/40"
        >
          Löschen
        </button>
      </div>
    </article>
  );
}

export default function ProjectTaskBoard({
  tasks,
  onEditTask,
  onToggleCompleted,
  onDeleteTask,
  onStatusChange,
}: ProjectTaskBoardProps) {
  const [draggedTaskId, setDraggedTaskId] =
    useState<string | null>(null);

  const [activeColumn, setActiveColumn] =
    useState<ProjectTaskStatus | null>(null);

  function handleDragStart(
    event: DragEvent<HTMLElement>,
    task: ProjectTask
  ) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData(
      "text/plain",
      task.id
    );

    setDraggedTaskId(task.id);
  }

  function handleDragOver(
    event: DragEvent<HTMLElement>,
    status: ProjectTaskStatus
  ) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    setActiveColumn(status);
  }

  function handleDragLeave(
    event: DragEvent<HTMLElement>
  ) {
    const nextTarget =
      event.relatedTarget as Node | null;

    if (
      nextTarget &&
      event.currentTarget.contains(nextTarget)
    ) {
      return;
    }

    setActiveColumn(null);
  }

  function handleDrop(
    event: DragEvent<HTMLElement>,
    status: ProjectTaskStatus
  ) {
    event.preventDefault();

    const taskId =
      event.dataTransfer.getData("text/plain");

    const task = tasks.find(
      (currentTask) =>
        currentTask.id === taskId
    );

    setDraggedTaskId(null);
    setActiveColumn(null);

    if (!task || task.status === status) {
      return;
    }

    onStatusChange(task, status);
  }

  function handleDragEnd() {
    setDraggedTaskId(null);
    setActiveColumn(null);
  }

  return (
    <div className="overflow-x-auto pb-2">
      <div className="grid min-w-[1100px] grid-cols-4 gap-4">
        {KANBAN_COLUMNS.map((column) => {
          const columnTasks = tasks.filter(
            (task) =>
              task.status === column.status
          );

          const isActive =
            activeColumn === column.status;

          return (
            <section
              key={column.status}
              onDragOver={(event) =>
                handleDragOver(
                  event,
                  column.status
                )
              }
              onDragLeave={handleDragLeave}
              onDrop={(event) =>
                handleDrop(
                  event,
                  column.status
                )
              }
              className={`flex min-h-[320px] flex-col rounded-xl border bg-neutral-900/70 transition ${
                isActive
                  ? "border-white bg-neutral-800/80"
                  : "border-neutral-800"
              }`}
            >
              <header className="border-b border-neutral-800 px-4 py-4">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-white">
                    {column.title}
                  </h3>

                  <span className="flex h-7 min-w-7 items-center justify-center rounded-full bg-neutral-800 px-2 text-xs font-semibold text-neutral-300">
                    {columnTasks.length}
                  </span>
                </div>

                <p className="mt-1 text-xs text-neutral-500">
                  {column.description}
                </p>
              </header>

              <div className="flex flex-1 flex-col gap-3 p-3">
                {columnTasks.length === 0 ? (
                  <div
                    className={`flex min-h-32 items-center justify-center rounded-lg border border-dashed px-4 text-center transition ${
                      isActive
                        ? "border-white bg-neutral-800"
                        : "border-neutral-700"
                    }`}
                  >
                    <p className="text-xs leading-5 text-neutral-500">
                      {isActive
                        ? "Aufgabe hier ablegen"
                        : "Keine Aufgaben in dieser Spalte"}
                    </p>
                  </div>
                ) : (
                  columnTasks.map((task) => (
                    <ProjectTaskBoardCard
                      key={task.id}
                      task={task}
                      isDragging={
                        draggedTaskId === task.id
                      }
                      onDragStart={
                        handleDragStart
                      }
                      onDragEnd={handleDragEnd}
                      onEditTask={onEditTask}
                      onToggleCompleted={
                        onToggleCompleted
                      }
                      onDeleteTask={onDeleteTask}
                    />
                  ))
                )}

                {isActive &&
                columnTasks.length > 0 ? (
                  <div className="flex min-h-20 items-center justify-center rounded-lg border border-dashed border-white bg-neutral-800 px-4 text-center">
                    <p className="text-xs font-medium text-neutral-300">
                      Aufgabe hier ablegen
                    </p>
                  </div>
                ) : null}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}