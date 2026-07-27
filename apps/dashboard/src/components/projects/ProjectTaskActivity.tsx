"use client";

import type { TaskActivity } from "@/types/taskActivity";

type ProjectTaskActivityProps = {
  activities: TaskActivity[];
};

const ACTIVITY_LABELS: Record<
  TaskActivity["type"],
  string
> = {
  created: "Aufgabe erstellt",
  updated: "Aufgabe aktualisiert",
  comment_added: "Kommentar hinzugefügt",
  comment_updated: "Kommentar bearbeitet",
  comment_deleted: "Kommentar gelöscht",
  attachment_added: "Datei hinzugefügt",
  attachment_deleted: "Datei gelöscht",
  status_changed: "Status geändert",
  priority_changed: "Priorität geändert",
  completed: "Aufgabe abgeschlossen",
};

function formatDate(
  value: string
): string {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
}

export default function ProjectTaskActivity({
  activities,
}: ProjectTaskActivityProps) {
  return (
    <section className="mt-8 border-t border-neutral-800 pt-6">
      <h3 className="text-lg font-semibold text-white">
        Verlauf
      </h3>

      <div className="mt-5 space-y-3">
        {activities.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-500">
            Noch keine Aktivitäten vorhanden.
          </div>
        ) : (
          activities.map(
            (activity) => (
              <article
                key={activity.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-white">
                    {
                      ACTIVITY_LABELS[
                        activity.type
                      ]
                    }
                  </p>

                  <time
                    dateTime={
                      activity.createdAt
                    }
                    className="text-xs text-neutral-500"
                  >
                    {formatDate(
                      activity.createdAt
                    )}
                  </time>
                </div>

                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">
                  {activity.message}
                </p>

                <p className="mt-3 text-xs text-neutral-500">
                  {activity.author}
                </p>
              </article>
            )
          )
        )}
      </div>
    </section>
  );
}