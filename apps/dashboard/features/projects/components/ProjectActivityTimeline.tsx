"use client";

import {
  useMemo,
  useState,
} from "react";
import Card from "../../../components/ui/Card";
import type {
  ProjectActivity,
  ProjectActivityAction,
} from "../../../types/activity";

type ProjectActivityTimelineProps = {
  activities: ProjectActivity[];
  onClear: () => void;
};

type ActivityActionFilter =
  | "all"
  | ProjectActivityAction;

type ProjectFilter = "all" | string;

const actionIcons: Record<
  ProjectActivityAction,
  string
> = {
  project_created: "+",
  project_deleted: "×",
  status_changed: "S",
  priority_changed: "P",
  progress_changed: "%",
  task_changed: "✓",
  seo_changed: "SEO",
};

const actionLabels: Record<
  ProjectActivityAction,
  string
> = {
  project_created: "Projekt erstellt",
  project_deleted: "Projekt gelöscht",
  status_changed: "Status",
  priority_changed: "Priorität",
  progress_changed: "Fortschritt",
  task_changed: "Aufgaben",
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
  const [isExpanded, setIsExpanded] =
    useState(true);

  const [search, setSearch] = useState("");
  const [projectFilter, setProjectFilter] =
    useState<ProjectFilter>("all");

  const [actionFilter, setActionFilter] =
    useState<ActivityActionFilter>("all");

  const projectOptions = useMemo(() => {
    const projects = new Map<string, string>();

    activities.forEach((activity) => {
      if (!projects.has(activity.projectId)) {
        projects.set(
          activity.projectId,
          activity.projectTitle
        );
      }
    });

    return Array.from(projects.entries())
      .map(([id, title]) => ({
        id,
        title,
      }))
      .sort((firstProject, secondProject) =>
        firstProject.title.localeCompare(
          secondProject.title,
          "de"
        )
      );
  }, [activities]);

  const filteredActivities = useMemo(() => {
    const normalizedSearch =
      search.trim().toLowerCase();

    return activities.filter((activity) => {
      const matchesProject =
        projectFilter === "all" ||
        activity.projectId === projectFilter;

      const matchesAction =
        actionFilter === "all" ||
        activity.action === actionFilter;

      const searchableContent = [
        activity.projectTitle,
        activity.title,
        activity.description,
        activity.user,
        actionLabels[activity.action],
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        normalizedSearch.length === 0 ||
        searchableContent.includes(normalizedSearch);

      return (
        matchesProject &&
        matchesAction &&
        matchesSearch
      );
    });
  }, [
    activities,
    actionFilter,
    projectFilter,
    search,
  ]);

  const filtersAreActive =
    search.trim().length > 0 ||
    projectFilter !== "all" ||
    actionFilter !== "all";

  function resetFilters() {
    setSearch("");
    setProjectFilter("all");
    setActionFilter("all");
  }

  return (
    <Card className="overflow-hidden p-0">
      <div className="flex items-center justify-between gap-4 border-b border-neutral-800 px-6 py-5">
        <button
          type="button"
          onClick={() =>
            setIsExpanded((current) => !current)
          }
          className="flex min-w-0 flex-1 items-center justify-between gap-4 text-left"
          aria-expanded={isExpanded}
        >
          <div>
            <h2 className="text-lg font-bold text-white">
              Letzte Änderungen
            </h2>

            <p className="mt-1 text-xs text-neutral-500">
              {filtersAreActive
                ? `${filteredActivities.length} von ${activities.length}`
                : activities.length}{" "}
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
        <>
          {activities.length > 0 ? (
            <div className="space-y-3 border-b border-neutral-800 px-6 py-5">
              <div>
                <label
                  htmlFor="activity-search"
                  className="mb-2 block text-xs font-medium text-neutral-400"
                >
                  Aktivitäten durchsuchen
                </label>

                <input
                  id="activity-search"
                  type="search"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Projekt, Änderung oder Benutzer"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
                />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="activity-project-filter"
                    className="mb-2 block text-xs font-medium text-neutral-400"
                  >
                    Projekt
                  </label>

                  <select
                    id="activity-project-filter"
                    value={projectFilter}
                    onChange={(event) =>
                      setProjectFilter(
                        event.target.value
                      )
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500"
                  >
                    <option value="all">
                      Alle Projekte
                    </option>

                    {projectOptions.map((project) => (
                      <option
                        key={project.id}
                        value={project.id}
                      >
                        {project.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="activity-action-filter"
                    className="mb-2 block text-xs font-medium text-neutral-400"
                  >
                    Aktivitätstyp
                  </label>

                  <select
                    id="activity-action-filter"
                    value={actionFilter}
                    onChange={(event) =>
                      setActionFilter(
                        event.target
                          .value as ActivityActionFilter
                      )
                    }
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-neutral-500"
                  >
                    <option value="all">
                      Alle Aktivitätstypen
                    </option>

                    {Object.entries(actionLabels).map(
                      ([action, label]) => (
                        <option
                          key={action}
                          value={action}
                        >
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-500">
                  {filteredActivities.length}{" "}
                  {filteredActivities.length === 1
                    ? "Treffer"
                    : "Treffer"}
                </p>

                {filtersAreActive ? (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
                  >
                    Filter zurücksetzen
                  </button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className="max-h-[520px] overflow-y-auto">
            {activities.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-neutral-300">
                  Noch keine Änderungen
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Projektänderungen werden ab jetzt
                  automatisch protokolliert.
                </p>
              </div>
            ) : filteredActivities.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm font-medium text-neutral-300">
                  Keine passenden Aktivitäten
                </p>

                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Für die aktuellen Filter wurden keine
                  Einträge gefunden.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
                >
                  Filter zurücksetzen
                </button>
              </div>
            ) : (
              <div className="divide-y divide-neutral-800">
                {filteredActivities.map((activity) => (
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
        </>
      ) : null}
    </Card>
  );
}