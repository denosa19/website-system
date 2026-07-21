"use client";

import { useState } from "react";
import Card from "../../../components/ui/Card";
import type {
  ProjectActivity,
  ProjectActivityAction,
} from "../../../types/activity";

type ProjectActivityTimelineProps = {
  activities: ProjectActivity[];
  onClear: () => void;
};

const actionIcons: Record<ProjectActivityAction, string> = {
  project_created: "+",
  project_deleted: "×",
  status_changed: "S",
  priority_changed: "P",
  progress_changed: "%",
  task_changed: "✓",
  seo_changed: "SEO",
};

function formatActivityDate(timestamp: string) {
  const date = new Date(timestamp);
  const today = new Date();

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const time = new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);

  if (isToday) {
    return `Heute, ${time}`;
  }

  const day = new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);

  return `${day}, ${time}`;
}

export default function ProjectActivityTimeline({
  activities,
  onClear,
}: ProjectActivityTimelineProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-800 px-6 py-5">
        <button
          type="button"
          onClick={() => setIsExpanded((current) => !current)}
          className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
          aria-expanded={isExpanded}
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              Letzte Änderungen
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {activities.length}{" "}
              {activities.length === 1
                ? "Aktivität"
                : "Aktivitäten"}
            </p>
          </div>

          <span
            aria-hidden="true"
            className={`text-lg text-neutral-400 transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
           ⌄
          </span>
        </button>

        {activities.length > 0 ? (
          <button
            type="button"
            onClick={onClear}
            className="shrink-0 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
          >
            Verlauf löschen
          </button>
        ) : null}
      </div>

      {isExpanded ? (
        <div className="max-h-[520px] overflow-y-auto">
          {activities.length === 0 ? (
            <div className="px-6 py-10 text-center">
              <p className="text-sm font-medium text-neutral-300">
                Noch keine Änderungen
              </p>

              <p className="mt-2 text-xs leading-5 text-neutral-500">
                Projektänderungen werden ab jetzt automatisch
                protokolliert.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-neutral-800">
              {activities.map((activity) => (
                <article
                  key={activity.id}
                  className="flex gap-4 px-6 py-5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 text-[11px] font-bold text-neutral-300">
                    {actionIcons[activity.action]}
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                      <h3 className="text-sm font-semibold text-white">
                        {activity.title}
                      </h3>

                      <time
                        dateTime={activity.timestamp}
                        className="text-xs text-neutral-500"
                      >
                        {formatActivityDate(
                          activity.timestamp
                        )}
                      </time>
                    </div>

                    <p className="mt-1 truncate text-sm text-neutral-300">
                      {activity.projectTitle}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-neutral-500">
                      {activity.description}
                    </p>

                    <p className="mt-2 text-[11px] text-neutral-600">
                      Von {activity.user}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : null}
    </Card>
  );
}