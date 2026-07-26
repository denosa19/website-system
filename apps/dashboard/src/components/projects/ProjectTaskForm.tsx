"use client";

import type { FormEvent } from "react";
import type {
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";

export type TaskFormState = {
  title: string;
  description: string;
  status: ProjectTaskStatus;
  priority: ProjectTaskPriority;
  assignee: string;
  dueDate: string;
};

type ProjectTaskFormProps = {
  form: TaskFormState;
  editingTaskId: string | null;
  errorMessage: string;
  onChange: <K extends keyof TaskFormState>(
    key: K,
    value: TaskFormState[K]
  ) => void;
  onSubmit: (
    event: FormEvent<HTMLFormElement>
  ) => void;
  onClose: () => void;
};

export const EMPTY_TASK_FORM: TaskFormState = {
  title: "",
  description: "",
  status: "open",
  priority: "medium",
  assignee: "Dennis",
  dueDate: "",
};

export default function ProjectTaskForm({
  form,
  editingTaskId,
  errorMessage,
  onChange,
  onSubmit,
  onClose,
}: ProjectTaskFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 rounded-xl border border-neutral-800 bg-neutral-900 p-5"
    >
      <input
        type="hidden"
        name="dueDate"
        value={form.dueDate}
      />

      <div className="flex items-center justify-between gap-4">
        <h3 className="font-semibold text-white">
          {editingTaskId
            ? "Aufgabe bearbeiten"
            : "Neue Aufgabe"}
        </h3>

        <button
          type="button"
          onClick={onClose}
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
              onChange(
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
              onChange(
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
                onChange(
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
                onChange(
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
                onChange(
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
                onChange(
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
          onClick={onClose}
          className="rounded-lg border border-neutral-700 px-5 py-2.5 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800"
        >
          Abbrechen
        </button>
      </div>
    </form>
  );
}