"use client";

import { useMemo, useState } from "react";
import type {
  ProjectTask,
  ProjectTaskStatus,
} from "@/types/task";

type ProjectTaskCalendarProps = {
  tasks: ProjectTask[];
  onEditTask: (task: ProjectTask) => void;
};

type CalendarDay = {
  date: Date;
  dateKey: string;
  isCurrentMonth: boolean;
  isToday: boolean;
};

const WEEKDAYS = [
  "Mo",
  "Di",
  "Mi",
  "Do",
  "Fr",
  "Sa",
  "So",
];

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
    "border-amber-800/70 bg-amber-950/50 text-amber-200 hover:bg-amber-900/60",
  in_progress:
    "border-blue-800/70 bg-blue-950/50 text-blue-200 hover:bg-blue-900/60",
  waiting:
    "border-neutral-600 bg-neutral-800 text-neutral-200 hover:bg-neutral-700",
  completed:
    "border-emerald-800/70 bg-emerald-950/50 text-emerald-200 hover:bg-emerald-900/60",
};

function createDateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(
    date.getMonth() + 1
  ).padStart(2, "0");
  const day = String(date.getDate()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}`;
}

function createMonthStart(date: Date) {
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    1
  );
}

function createCalendarDays(
  visibleMonth: Date
): CalendarDay[] {
  const year = visibleMonth.getFullYear();
  const month = visibleMonth.getMonth();

  const firstDayOfMonth = new Date(
    year,
    month,
    1
  );

  const lastDayOfMonth = new Date(
    year,
    month + 1,
    0
  );

  const firstWeekday =
    (firstDayOfMonth.getDay() + 6) % 7;

  const calendarStart = new Date(
    year,
    month,
    1 - firstWeekday
  );

  const daysInMonth = lastDayOfMonth.getDate();

  const visibleDayCount =
    firstWeekday + daysInMonth <= 35
      ? 35
      : 42;

  const todayKey = createDateKey(new Date());

  return Array.from(
    { length: visibleDayCount },
    (_, index) => {
      const date = new Date(
        calendarStart.getFullYear(),
        calendarStart.getMonth(),
        calendarStart.getDate() + index
      );

      return {
        date,
        dateKey: createDateKey(date),
        isCurrentMonth:
          date.getMonth() === month &&
          date.getFullYear() === year,
        isToday:
          createDateKey(date) === todayKey,
      };
    }
  );
}

function formatMonthTitle(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatFullDate(date: Date) {
  return new Intl.DateTimeFormat("de-DE", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
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

function CalendarTask({
  task,
  onEditTask,
}: {
  task: ProjectTask;
  onEditTask: (task: ProjectTask) => void;
}) {
  const overdue = isTaskOverdue(task);

  const taskStyle = overdue
    ? "border-red-800/70 bg-red-950/60 text-red-200 hover:bg-red-900/60"
    : STATUS_STYLES[task.status];

  return (
    <button
      type="button"
      onClick={() => onEditTask(task)}
      title={`${task.title} – ${
        STATUS_LABELS[task.status]
      }`}
      className={`block w-full truncate rounded-md border px-2 py-1.5 text-left text-xs font-medium transition ${taskStyle}`}
    >
      {task.title}
    </button>
  );
}

export default function ProjectTaskCalendar({
  tasks,
  onEditTask,
}: ProjectTaskCalendarProps) {
  const [visibleMonth, setVisibleMonth] =
    useState(() =>
      createMonthStart(new Date())
    );

  const calendarDays = useMemo(() => {
    return createCalendarDays(visibleMonth);
  }, [visibleMonth]);

  const tasksByDate = useMemo(() => {
    const groupedTasks = new Map<
      string,
      ProjectTask[]
    >();

    tasks.forEach((task) => {
      if (!task.dueDate) {
        return;
      }

      const existingTasks =
        groupedTasks.get(task.dueDate) ?? [];

      groupedTasks.set(task.dueDate, [
        ...existingTasks,
        task,
      ]);
    });

    groupedTasks.forEach((dayTasks, dateKey) => {
      groupedTasks.set(
        dateKey,
        [...dayTasks].sort(
          (firstTask, secondTask) => {
            if (
              firstTask.status === "completed" &&
              secondTask.status !== "completed"
            ) {
              return 1;
            }

            if (
              firstTask.status !== "completed" &&
              secondTask.status === "completed"
            ) {
              return -1;
            }

            return firstTask.title.localeCompare(
              secondTask.title,
              "de"
            );
          }
        )
      );
    });

    return groupedTasks;
  }, [tasks]);

  const tasksWithoutDueDate = useMemo(() => {
    return tasks.filter(
      (task) => !task.dueDate
    );
  }, [tasks]);

  function showPreviousMonth() {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
    );
  }

  function showNextMonth() {
    setVisibleMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
    );
  }

  function showCurrentMonth() {
    setVisibleMonth(
      createMonthStart(new Date())
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/70">
      <div className="flex flex-col gap-4 border-b border-neutral-800 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
            Aufgaben nach Fälligkeit
          </p>

          <h3 className="mt-1 text-lg font-semibold capitalize text-white">
            {formatMonthTitle(visibleMonth)}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={showPreviousMonth}
            aria-label="Vorherigen Monat anzeigen"
            className="rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            ←
          </button>

          <button
            type="button"
            onClick={showCurrentMonth}
            className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            Heute
          </button>

          <button
            type="button"
            onClick={showNextMonth}
            aria-label="Nächsten Monat anzeigen"
            className="rounded-lg border border-neutral-700 px-3 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
          >
            →
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[980px]">
          <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-950/60">
            {WEEKDAYS.map((weekday) => (
              <div
                key={weekday}
                className="border-r border-neutral-800 px-3 py-3 text-center text-xs font-semibold uppercase tracking-wide text-neutral-500 last:border-r-0"
              >
                {weekday}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {calendarDays.map((calendarDay) => {
              const dayTasks =
                tasksByDate.get(
                  calendarDay.dateKey
                ) ?? [];

              return (
                <div
                  key={calendarDay.dateKey}
                  title={formatFullDate(
                    calendarDay.date
                  )}
                  className={`min-h-40 border-b border-r border-neutral-800 p-2 last:border-r-0 ${
                    calendarDay.isCurrentMonth
                      ? "bg-neutral-900/40"
                      : "bg-neutral-950/70"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`flex h-7 min-w-7 items-center justify-center rounded-full px-2 text-xs font-semibold ${
                        calendarDay.isToday
                          ? "bg-white text-neutral-950"
                          : calendarDay.isCurrentMonth
                            ? "text-neutral-300"
                            : "text-neutral-600"
                      }`}
                    >
                      {calendarDay.date.getDate()}
                    </span>

                    {dayTasks.length > 0 ? (
                      <span className="text-xs text-neutral-600">
                        {dayTasks.length}
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-2 space-y-1.5">
                    {dayTasks.map((task) => (
                      <CalendarTask
                        key={task.id}
                        task={task}
                        onEditTask={onEditTask}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="border-t border-neutral-800 px-4 py-4">
        <div className="flex flex-wrap gap-x-5 gap-y-2 text-xs text-neutral-400">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
            Überfällig
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Offen
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-500" />
            In Arbeit
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
            Wartet
          </span>

          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Erledigt
          </span>
        </div>
      </div>

      {tasksWithoutDueDate.length > 0 ? (
        <div className="border-t border-neutral-800 bg-neutral-950/40 px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Aufgaben ohne Fälligkeitsdatum
              </h4>

              <p className="mt-1 text-xs text-neutral-500">
                Diese Aufgaben können nicht im
                Kalender eingeordnet werden.
              </p>
            </div>

            <span className="flex h-8 min-w-8 items-center justify-center rounded-full bg-neutral-800 px-2 text-xs font-semibold text-neutral-300">
              {tasksWithoutDueDate.length}
            </span>
          </div>

          <div className="mt-4 grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {tasksWithoutDueDate.map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() => onEditTask(task)}
                className="rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-3 text-left transition hover:border-neutral-700 hover:bg-neutral-800"
              >
                <p className="truncate text-sm font-medium text-white">
                  {task.title}
                </p>

                <p className="mt-1 text-xs text-neutral-500">
                  {STATUS_LABELS[task.status]}
                </p>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}