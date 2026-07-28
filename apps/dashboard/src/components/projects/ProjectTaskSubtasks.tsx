"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import type { TaskSubtask } from "@/types/taskSubtask";

type ProjectTaskSubtasksProps = {
  subtasks: TaskSubtask[];
  onAdd: (title: string) => void;
  onToggle: (subtask: TaskSubtask) => void;
  onDelete: (subtask: TaskSubtask) => void;
};

export default function ProjectTaskSubtasks({
  subtasks,
  onAdd,
  onToggle,
  onDelete,
}: ProjectTaskSubtasksProps) {
  const [title, setTitle] = useState("");

  const completedCount = useMemo(
    () => subtasks.filter((subtask) => subtask.completed).length,
    [subtasks]
  );

  const progress = subtasks.length
    ? Math.round((completedCount / subtasks.length) * 100)
    : 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAdd(trimmedTitle);
    setTitle("");
  }

  return (
    <section className="mt-8 border-t border-neutral-800 pt-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Unteraufgaben
          </h3>
          <p className="mt-1 text-sm text-neutral-500">
            {completedCount}/{subtasks.length} erledigt
          </p>
        </div>

        <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
          {progress}%
        </span>
      </div>

      <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
        <div
          className="h-full rounded-full bg-emerald-500 transition-[width]"
          style={{ width: `${progress}%` }}
        />
      </div>

      <form onSubmit={handleSubmit} className="mt-5 flex gap-2">
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Neue Unteraufgabe"
          className="min-w-0 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
        />
        <button
          type="submit"
          disabled={!title.trim()}
          className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Hinzufügen
        </button>
      </form>

      <div className="mt-4 space-y-2">
        {subtasks.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-500">
            Noch keine Unteraufgaben vorhanden.
          </div>
        ) : (
          subtasks.map((subtask) => (
            <article
              key={subtask.id}
              className="flex items-start gap-3 rounded-xl border border-neutral-800 bg-neutral-900 p-3"
            >
              <button
                type="button"
                onClick={() => onToggle(subtask)}
                aria-label={
                  subtask.completed
                    ? "Unteraufgabe wieder öffnen"
                    : "Unteraufgabe erledigen"
                }
                className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition ${
                  subtask.completed
                    ? "border-emerald-600 bg-emerald-600 text-white"
                    : "border-neutral-600 text-transparent hover:border-neutral-400"
                }`}
              >
                ✓
              </button>

              <p
                className={`min-w-0 flex-1 break-words text-sm leading-5 ${
                  subtask.completed
                    ? "text-neutral-500 line-through"
                    : "text-neutral-200"
                }`}
              >
                {subtask.title}
              </p>

              <button
                type="button"
                onClick={() => onDelete(subtask)}
                className="shrink-0 rounded px-2 py-1 text-xs text-neutral-500 transition hover:bg-red-950/40 hover:text-red-300"
              >
                Löschen
              </button>
            </article>
          ))
        )}
      </div>
    </section>
  );
}