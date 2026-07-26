"use client";

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

type Props = {
  searchQuery: string;
  statusFilter: StatusFilter;
  priorityFilter: PriorityFilter;
  assigneeFilter: string;
  assignees: string[];
  onlyOverdue: boolean;
  taskSort: TaskSort;
  hasActiveFilters: boolean;

  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onPriorityChange: (
    value: PriorityFilter
  ) => void;
  onAssigneeChange: (value: string) => void;
  onOverdueChange: (
    value: boolean
  ) => void;
  onSortChange: (value: TaskSort) => void;
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
}: Props) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="grid flex-1 gap-2 text-sm text-neutral-300">
            Suche

            <input
              type="search"
              value={searchQuery}
              onChange={(e) =>
                onSearchChange(e.target.value)
              }
              placeholder="Aufgaben durchsuchen..."
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none placeholder:text-neutral-600 focus:border-neutral-500"
            />
          </label>

          <label className="grid gap-2 text-sm text-neutral-300 lg:w-48">
            Status

            <select
              value={statusFilter}
              onChange={(e) =>
                onStatusChange(
                  e.target.value as StatusFilter
                )
              }
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white"
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
              onChange={(e) =>
                onPriorityChange(
                  e.target.value as PriorityFilter
                )
              }
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white"
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
              onChange={(e) =>
                onAssigneeChange(e.target.value)
              }
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white"
            >
              <option value="all">
                Alle
              </option>

              {assignees.map((person) => (
                <option
                  key={person}
                  value={person}
                >
                  {person}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm text-neutral-300 lg:w-48">
            Sortierung

            <select
              value={taskSort}
              onChange={(e) =>
                onSortChange(
                  e.target.value as TaskSort
                )
              }
              className="rounded-lg border border-neutral-700 bg-neutral-950 px-4 py-3 text-white"
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

          <label className="flex items-center gap-3 rounded-lg border border-neutral-700 px-4 py-3 text-sm text-neutral-300">
            <input
              type="checkbox"
              checked={onlyOverdue}
              onChange={(e) =>
                onOverdueChange(
                  e.target.checked
                )
              }
            />

            Nur überfällige
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onReset}
              className="rounded-lg border border-neutral-700 px-5 py-3 text-sm text-neutral-300 transition hover:bg-neutral-800"
            >
              Filter zurücksetzen
            </button>
          )}
        </div>
      </div>
    </div>
  );
}