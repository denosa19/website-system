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

type ActivityPeriodFilter =
  | "all"
  | "today"
  | "7days"
  | "30days";

type ActivityGroup = {
  key: string;
  label: string;
  activities: ProjectActivity[];
};

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

const periodLabels: Record<
  ActivityPeriodFilter,
  string
> = {
  all: "Gesamter Zeitraum",
  today: "Heute",
  "7days": "Letzte 7 Tage",
  "30days": "Letzte 30 Tage",
};

function startOfDay(date: Date) {
  const result = new Date(date);

  result.setHours(0, 0, 0, 0);

  return result;
}

function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatActivityTime(timestamp: string) {
  return new Intl.DateTimeFormat("de-DE", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function formatExportDate(timestamp: string) {
  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(date);
}

function formatGroupDate(timestamp: string) {
  const date = startOfDay(new Date(timestamp));
  const today = startOfDay(new Date());

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.getTime() === today.getTime()) {
    return "Heute";
  }

  if (date.getTime() === yesterday.getTime()) {
    return "Gestern";
  }

  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

function matchesPeriod(
  timestamp: string,
  period: ActivityPeriodFilter
) {
  if (period === "all") {
    return true;
  }

  const activityDate = new Date(timestamp);

  if (Number.isNaN(activityDate.getTime())) {
    return false;
  }

  const today = startOfDay(new Date());
  const activityDay = startOfDay(activityDate);

  if (period === "today") {
    return activityDay.getTime() === today.getTime();
  }

  const earliestDate = new Date(today);

  if (period === "7days") {
    earliestDate.setDate(earliestDate.getDate() - 6);
  }

  if (period === "30days") {
    earliestDate.setDate(earliestDate.getDate() - 29);
  }

  return (
    activityDay.getTime() >= earliestDate.getTime() &&
    activityDay.getTime() <= today.getTime()
  );
}

function escapeCsvValue(value: string) {
  const normalizedValue = value
    .replace(/\r\n/g, " ")
    .replace(/\n/g, " ")
    .replace(/\r/g, " ");

  return `"${normalizedValue.replace(/"/g, '""')}"`;
}

function createExportFileName() {
  const now = new Date();
  const date = createDateKey(now);
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(
    2,
    "0"
  );

  return `projektaktivitaeten_${date}_${hours}-${minutes}.csv`;
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

  const [periodFilter, setPeriodFilter] =
    useState<ActivityPeriodFilter>("all");

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

      const matchesSelectedPeriod = matchesPeriod(
        activity.timestamp,
        periodFilter
      );

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
        matchesSelectedPeriod &&
        matchesSearch
      );
    });
  }, [
    activities,
    actionFilter,
    periodFilter,
    projectFilter,
    search,
  ]);

  const groupedActivities = useMemo(() => {
    const groups = new Map<string, ActivityGroup>();

    filteredActivities.forEach((activity) => {
      const activityDate = new Date(activity.timestamp);
      const key = createDateKey(activityDate);
      const existingGroup = groups.get(key);

      if (existingGroup) {
        existingGroup.activities.push(activity);
        return;
      }

      groups.set(key, {
        key,
        label: formatGroupDate(activity.timestamp),
        activities: [activity],
      });
    });

    return Array.from(groups.values());
  }, [filteredActivities]);

  const filtersAreActive =
    search.trim().length > 0 ||
    projectFilter !== "all" ||
    actionFilter !== "all" ||
    periodFilter !== "all";

  function resetFilters() {
    setSearch("");
    setProjectFilter("all");
    setActionFilter("all");
    setPeriodFilter("all");
  }

  function handleClearActivities() {
    onClear();
    resetFilters();
  }

  function handleExportActivities() {
    if (filteredActivities.length === 0) {
      return;
    }

    const headers = [
      "Datum",
      "Projekt-ID",
      "Projekt",
      "Aktivitätstyp",
      "Titel",
      "Beschreibung",
      "Benutzer",
    ];

    const rows = filteredActivities.map((activity) => [
      formatExportDate(activity.timestamp),
      activity.projectId,
      activity.projectTitle,
      actionLabels[activity.action],
      activity.title,
      activity.description,
      activity.user,
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) => escapeCsvValue(value))
          .join(";")
      )
      .join("\r\n");

    const blob = new Blob(
      [`\uFEFF${csvContent}`],
      {
        type: "text/csv;charset=utf-8",
      }
    );

    const downloadUrl = URL.createObjectURL(blob);
    const downloadLink =
      document.createElement("a");

    downloadLink.href = downloadUrl;
    downloadLink.download = createExportFileName();

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);
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
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={handleExportActivities}
              disabled={filteredActivities.length === 0}
              className="rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-600 disabled:hover:bg-transparent"
            >
              CSV exportieren
            </button>

            <button
              type="button"
              onClick={handleClearActivities}
              className="rounded-lg border border-neutral-700 px-3 py-2 text-xs font-medium text-neutral-400 transition hover:border-red-500/60 hover:bg-red-500/10 hover:text-red-300"
            >
              Verlauf löschen
            </button>
          </div>
        ) : null}
      </div>

      {isExpanded ? (
        <>
          {activities.length > 0 ? (
            <div className="space-y-4 border-b border-neutral-800 px-6 py-5">
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

              <div>
                <p className="mb-2 text-xs font-medium text-neutral-400">
                  Zeitraum
                </p>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {(
                    Object.entries(periodLabels) as [
                      ActivityPeriodFilter,
                      string,
                    ][]
                  ).map(([period, label]) => (
                    <button
                      key={period}
                      type="button"
                      onClick={() =>
                        setPeriodFilter(period)
                      }
                      className={`rounded-lg border px-3 py-2 text-xs font-medium transition ${
                        periodFilter === period
                          ? "border-white bg-white text-black"
                          : "border-neutral-700 text-neutral-400 hover:border-neutral-500 hover:bg-neutral-800 hover:text-white"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs text-neutral-500">
                  {filteredActivities.length} Treffer
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

          <div className="max-h-[580px] overflow-y-auto">
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
                  Für die aktuellen Filter und den
                  ausgewählten Zeitraum wurden keine
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
              <div>
                {groupedActivities.map((group) => (
                  <section key={group.key}>
                    <div className="sticky top-0 z-10 border-y border-neutral-800 bg-neutral-900/95 px-6 py-3 backdrop-blur">
                      <div className="flex items-center justify-between gap-4">
                        <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-neutral-400">
                          {group.label}
                        </h3>

                        <span className="text-[11px] text-neutral-600">
                          {group.activities.length}{" "}
                          {group.activities.length === 1
                            ? "Eintrag"
                            : "Einträge"}
                        </span>
                      </div>
                    </div>

                    <div className="divide-y divide-neutral-800">
                      {group.activities.map((activity) => (
                        <article
                          key={activity.id}
                          className="flex gap-4 px-6 py-5"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-neutral-700 bg-neutral-950 text-[11px] font-bold text-neutral-300">
                            {actionIcons[activity.action]}
                          </div>

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
                              <h4 className="text-sm font-semibold text-white">
                                {activity.title}
                              </h4>

                              <time
                                dateTime={
                                  activity.timestamp
                                }
                                className="text-xs text-neutral-500"
                              >
                                {formatActivityTime(
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
                  </section>
                ))}
              </div>
            )}
          </div>
        </>
      ) : null}
    </Card>
  );
}