"use client";

import { useState } from "react";
import type {
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";

export type StatusFilter =
  | "all"
  | ProjectTaskStatus;

export type PriorityFilter =
  | "all"
  | ProjectTaskPriority;

export type TaskSort =
  | "due_date"
  | "priority"
  | "title"
  | "newest"
  | "oldest";

type ProjectTaskFiltersProps = {
  searchQuery: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  assigneeFilter: string;
  assignees: string[];
  onlyOverdue: boolean;
  taskSort: TaskSort;
  hasActiveFilters: boolean;
  onSearchChange: (value: string) => void;
  onStatusChange: (
    value: StatusFilter
  ) => void;
  onPriorityChange: (
    value: PriorityFilter
  ) => void;
  onAssigneeChange: (
    value: string
  ) => void;
  onOverdueChange: (
    value: boolean
  ) => void;
  onSortChange: (
    value: TaskSort
  ) => void;
  onReset: () => void;
};

export default function ProjectTaskFilters({
  searchQuery,
  statusFilter,
  priorityFilter,
  assigneeFilter,
  assignees,
  onlyOverdue,
  taskSort,
  hasActiveFilters,
  onSearchChange,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
  onOverdueChange,
  onSortChange,
  onReset,
}: ProjectTaskFiltersProps) {
  const [isExpanded, setIsExpanded] =
    useState(false);

  const activeFilterCount = [
    searchQuery.trim() !== "",
    statusFilter !== "all",
    priorityFilter !== "all",
    assigneeFilter !== "all",
    onlyOverdue,
    taskSort !== "due_date",
  ].filter(Boolean).length;

  return (
    <section className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70">
      <button
        type="button"
        onClick={() =>
          setIsExpanded(
            (currentValue) =>
              !currentValue
          )
        }
        aria-expanded={isExpanded}
        aria-controls="project-task-filters"
        className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition hover:bg-neutral-900"
      >
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-white">
              Filter und Suche
            </h3>

            {activeFilterCount > 0 ? (
              <span className="rounded-full border border-neutral-700 bg-neutral-950 px-2.5 py-1 text-xs font-medium text-neutral-300">
                {activeFilterCount}{" "}
                {activeFilterCount === 1
                  ? "Filter aktiv"
                  : "Filter aktiv"}
              </span>
            ) : null}
          </div>

          <p className="mt-1 text-xs text-neutral-500">
            Aufgaben durchsuchen, filtern
            und sortieren
          </p>
        </div>

        <span
          aria-hidden="true"
          className={`text-lg text-neutral-400 transition-transform ${
            isExpanded
              ? "rotate-180"
              : ""
          }`}
        >
          ↓
        </span>
      </button>

      {isExpanded ? (
        <div
          id="project-task-filters"
          className="border-t border-neutral-800 p-4"
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="grid flex-1 gap-2 text-sm text-neutral-300">
                Suche

                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) =>
                    onSearchChange(
                      event.target.value
                    )
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
                    onStatusChange(
                      event.target
                        .value as StatusFilter
                    )
                  }
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
                >
                  <option value="all">
                    Alle
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
                    onPriorityChange(
                      event.target
                        .value as PriorityFilter
                    )
                  }
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
                >
                  <option value="all">
                    Alle
                  </option>

                  <option value="critical">
                    Kritisch
                  </option>

                  <option value="high">
                    Hoch
                  </option>

                  <option value="medium">
                    Mittel
                  </option>

                  <option value="low">
                    Niedrig
                  </option>
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
              <label className="grid gap-2 text-sm text-neutral-300 lg:w-56">
                Verantwortlicher

                <select
                  value={assigneeFilter}
                  onChange={(event) =>
                    onAssigneeChange(
                      event.target.value
                    )
                  }
                  className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none focus:border-neutral-500"
                >
                  <option value="all">
                    Alle
                  </option>

                  {assignees.map(
                    (assignee) => (
                      <option
                        key={assignee}
                        value={assignee}
                      >
                        {assignee}
                      </option>
                    )
                  )}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-neutral-300 lg:w-48">
                Sortierung

                <select
                  value={taskSort}
                  onChange={(event) =>
                    onSortChange(
                      event.target
                        .value as TaskSort
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
                    Titel
                  </option>

                  <option value="newest">
                    Neueste
                  </option>

                  <option value="oldest">
                    Älteste
                  </option>
                </select>
              </label>

              <label className="flex items-center gap-3 rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-neutral-300">
                <input
                  type="checkbox"
                  checked={onlyOverdue}
                  onChange={(event) =>
                    onOverdueChange(
                      event.target.checked
                    )
                  }
                  className="h-4 w-4"
                />

                Nur überfällige
              </label>

              {hasActiveFilters ? (
                <button
                  type="button"
                  onClick={onReset}
                  className="rounded-lg border border-neutral-700 px-5 py-3 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                >
                  Filter zurücksetzen
                </button>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}