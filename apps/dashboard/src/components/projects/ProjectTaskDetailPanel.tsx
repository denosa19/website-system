"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import ProjectTaskActivity from "@/components/projects/ProjectTaskActivity";
import ProjectTaskAttachments from "@/components/projects/ProjectTaskAttachments";
import ProjectTaskComments from "@/components/projects/ProjectTaskComments";
import { taskActivities as initialTaskActivities } from "@/data/taskActivities";
import { taskAttachments as initialTaskAttachments } from "@/data/taskAttachments";
import { taskComments as initialTaskComments } from "@/data/taskComments";
import {
  createTaskAttachment,
  deleteTaskAttachment,
  getTaskAttachments,
} from "@/lib/taskAttachments";
import {
  createTaskActivity,
  getTaskActivities,
} from "@/lib/taskActivity";
import {
  createTaskComment,
  deleteTaskComment,
  getTaskComments,
  replaceTaskComment,
  updateTaskComment,
} from "@/lib/taskComments";
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";
import type { TaskActivity } from "@/types/taskActivity";
import type { TaskAttachment } from "@/types/taskAttachment";
import type { TaskComment } from "@/types/taskComment";

type ProjectTaskDetailPanelProps = {
  task: ProjectTask | null;
  onClose: () => void;
  onEditTask: (task: ProjectTask) => void;
  onToggleCompleted: (
    task: ProjectTask
  ) => void;
  onDeleteTask: (task: ProjectTask) => void;
};

const TASK_COMMENTS_STORAGE_KEY =
  "website-system-task-comments";

const TASK_ATTACHMENTS_STORAGE_KEY =
  "website-system-task-attachments";

const TASK_ACTIVITIES_STORAGE_KEY =
  "website-system-task-activities";

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
    "border-amber-800/70 bg-amber-950/50 text-amber-200",
  in_progress:
    "border-blue-800/70 bg-blue-950/50 text-blue-200",
  waiting:
    "border-neutral-700 bg-neutral-800 text-neutral-200",
  completed:
    "border-emerald-800/70 bg-emerald-950/50 text-emerald-200",
};

const PRIORITY_LABELS: Record<
  ProjectTaskPriority,
  string
> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  critical: "Kritisch",
};

const PRIORITY_STYLES: Record<
  ProjectTaskPriority,
  string
> = {
  low:
    "border-neutral-700 bg-neutral-900 text-neutral-300",
  medium:
    "border-blue-900/70 bg-blue-950/30 text-blue-300",
  high:
    "border-orange-900/70 bg-orange-950/30 text-orange-300",
  critical:
    "border-red-900/70 bg-red-950/40 text-red-300",
};

function formatDate(
  value: string | null
): string {
  if (!value) {
    return "Nicht festgelegt";
  }

  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(
    new Date(`${value}T12:00:00`)
  );
}

function formatDateTime(
  value: string
): string {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(new Date(value));
}

function isTaskOverdue(
  task: ProjectTask
): boolean {
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

function readStoredComments(): TaskComment[] {
  if (typeof window === "undefined") {
    return initialTaskComments;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        TASK_COMMENTS_STORAGE_KEY
      );

    if (!storedValue) {
      return initialTaskComments;
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return initialTaskComments;
    }

    return parsedValue as TaskComment[];
  } catch {
    return initialTaskComments;
  }
}

function readStoredAttachments(): TaskAttachment[] {
  if (typeof window === "undefined") {
    return initialTaskAttachments;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        TASK_ATTACHMENTS_STORAGE_KEY
      );

    if (!storedValue) {
      return initialTaskAttachments;
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return initialTaskAttachments;
    }

    return parsedValue as TaskAttachment[];
  } catch {
    return initialTaskAttachments;
  }
}

function readStoredActivities(): TaskActivity[] {
  if (typeof window === "undefined") {
    return initialTaskActivities;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        TASK_ACTIVITIES_STORAGE_KEY
      );

    if (!storedValue) {
      return initialTaskActivities;
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return initialTaskActivities;
    }

    return parsedValue as TaskActivity[];
  } catch {
    return initialTaskActivities;
  }
}

function readFileAsDataUrl(
  file: File
): Promise<string> {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (
          typeof reader.result !== "string"
        ) {
          reject(
            new Error(
              "Datei konnte nicht gelesen werden."
            )
          );

          return;
        }

        resolve(reader.result);
      };

      reader.onerror = () => {
        reject(
          reader.error ??
            new Error(
              "Datei konnte nicht gelesen werden."
            )
        );
      };

      reader.readAsDataURL(file);
    }
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="grid gap-1 border-b border-neutral-800 py-3 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-sm text-neutral-500">
        {label}
      </dt>

      <dd className="break-words text-sm text-neutral-200">
        {value}
      </dd>
    </div>
  );
}

export default function ProjectTaskDetailPanel({
  task,
  onClose,
  onEditTask,
  onToggleCompleted,
  onDeleteTask,
}: ProjectTaskDetailPanelProps) {
  const [comments, setComments] =
    useState<TaskComment[]>(
      initialTaskComments
    );

  const [commentsLoaded, setCommentsLoaded] =
    useState(false);

  const [attachments, setAttachments] =
    useState<TaskAttachment[]>(
      initialTaskAttachments
    );

  const [
    attachmentsLoaded,
    setAttachmentsLoaded,
  ] = useState(false);

  const [activities, setActivities] =
    useState<TaskActivity[]>(
      initialTaskActivities
    );

  const [
    activitiesLoaded,
    setActivitiesLoaded,
  ] = useState(false);

  useEffect(() => {
    setComments(readStoredComments());
    setCommentsLoaded(true);

    setAttachments(
      readStoredAttachments()
    );
    setAttachmentsLoaded(true);

    setActivities(
      readStoredActivities()
    );
    setActivitiesLoaded(true);
  }, []);

  useEffect(() => {
    if (!commentsLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        TASK_COMMENTS_STORAGE_KEY,
        JSON.stringify(comments)
      );
    } catch {
      return;
    }
  }, [comments, commentsLoaded]);

  useEffect(() => {
    if (!attachmentsLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        TASK_ATTACHMENTS_STORAGE_KEY,
        JSON.stringify(attachments)
      );
    } catch {
      return;
    }
  }, [
    attachments,
    attachmentsLoaded,
  ]);

  useEffect(() => {
    if (!activitiesLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        TASK_ACTIVITIES_STORAGE_KEY,
        JSON.stringify(activities)
      );
    } catch {
      return;
    }
  }, [
    activities,
    activitiesLoaded,
  ]);

  useEffect(() => {
    if (!task) {
      return;
    }

    function handleKeyDown(
      event: KeyboardEvent
    ) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener(
      "keydown",
      handleKeyDown
    );

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown
      );

      document.body.style.overflow =
        previousOverflow;
    };
  }, [onClose, task]);

  const visibleComments = useMemo(() => {
    if (!task) {
      return [];
    }

    return getTaskComments(
      comments,
      task.id
    );
  }, [comments, task]);

  const visibleAttachments = useMemo(() => {
    if (!task) {
      return [];
    }

    return getTaskAttachments(
      attachments,
      task.id
    );
  }, [attachments, task]);

  const visibleActivities = useMemo(() => {
    if (!task) {
      return [];
    }

    return getTaskActivities(
      activities,
      task.id
    );
  }, [activities, task]);

  if (!task) {
    return null;
  }

  const overdue = isTaskOverdue(task);

  function addActivity(
    type: TaskActivity["type"],
    message: string
  ) {
    const newActivity =
      createTaskActivity({
        taskId: task.id,
        type,
        author: "Dennis",
        message,
      });

    const storedActivities =
      readStoredActivities();

    const nextActivities = [
      ...storedActivities,
      newActivity,
    ];

    try {
      window.localStorage.setItem(
        TASK_ACTIVITIES_STORAGE_KEY,
        JSON.stringify(nextActivities)
      );
    } catch {
      // Die Aktivität bleibt trotzdem im lokalen State sichtbar.
    }

    setActivities(nextActivities);
  }

  function handleEdit() {
    onEditTask(task);
    onClose();
  }

  function handleToggleCompleted() {
    if (task.status === "completed") {
      addActivity(
        "status_changed",
        "Aufgabe wieder geöffnet: Erledigt → Offen"
      );
    } else {
      addActivity(
        "completed",
        "Aufgabe abgeschlossen"
      );
    }

    onToggleCompleted(task);
  }

  function handleDelete() {
    onDeleteTask(task);
  }

  function handleAddComment(
    message: string
  ) {
    const newComment =
      createTaskComment({
        taskId: task.id,
        author: "Dennis",
        message,
      });

    setComments((currentComments) => [
      ...currentComments,
      newComment,
    ]);

    addActivity(
      "comment_added",
      message
    );
  }

  function handleUpdateComment(
    comment: TaskComment,
    message: string
  ) {
    const updatedComment =
      updateTaskComment(comment, {
        message,
      });

    setComments((currentComments) =>
      replaceTaskComment(
        currentComments,
        updatedComment
      )
    );

    addActivity(
      "comment_updated",
      message
    );
  }

  function handleDeleteComment(
    comment: TaskComment
  ) {
    setComments((currentComments) =>
      deleteTaskComment(
        currentComments,
        comment.id
      )
    );

    addActivity(
      "comment_deleted",
      comment.message
    );
  }

  async function handleUploadAttachments(
    files: FileList
  ) {
    try {
      const newAttachments =
        await Promise.all(
          Array.from(files).map(
            async (file) => {
              const dataUrl =
                await readFileAsDataUrl(
                  file
                );

              return createTaskAttachment({
                taskId: task.id,
                name: file.name,
                type:
                  file.type ||
                  "application/octet-stream",
                size: file.size,
                dataUrl,
                uploadedBy: "Dennis",
              });
            }
          )
        );

      setAttachments(
        (currentAttachments) => [
          ...currentAttachments,
          ...newAttachments,
        ]
      );

      newAttachments.forEach(
        (attachment) => {
          addActivity(
            "attachment_added",
            attachment.name
          );
        }
      );
    } catch (error) {
      console.error(
        "Dateianhang konnte nicht gespeichert werden.",
        error
      );
    }
  }

  function handleDeleteAttachment(
    attachment: TaskAttachment
  ) {
    setAttachments(
      (currentAttachments) =>
        deleteTaskAttachment(
          currentAttachments,
          attachment.id
        )
    );

    addActivity(
      "attachment_deleted",
      attachment.name
    );
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-detail-title"
      className="fixed inset-0 z-50"
    >
      <button
        type="button"
        aria-label="Detailansicht schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-2xl border border-neutral-800 bg-neutral-950 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-xl sm:rounded-none sm:border-y-0 sm:border-r-0">
        <header className="flex items-start justify-between gap-4 border-b border-neutral-800 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">
              Aufgabendetails
            </p>

            <h2
              id="task-detail-title"
              className="mt-2 break-words text-xl font-semibold text-white"
            >
              {task.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Detailansicht schließen"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-700 text-xl text-neutral-400 transition hover:bg-neutral-800 hover:text-white"
          >
            ×
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                STATUS_STYLES[
                  task.status
                ]
              }`}
            >
              {
                STATUS_LABELS[
                  task.status
                ]
              }
            </span>

            <span
              className={`rounded-full border px-3 py-1.5 text-xs font-medium ${
                PRIORITY_STYLES[
                  task.priority
                ]
              }`}
            >
              Priorität:{" "}
              {
                PRIORITY_LABELS[
                  task.priority
                ]
              }
            </span>

            {overdue ? (
              <span className="rounded-full border border-red-800/70 bg-red-950/60 px-3 py-1.5 text-xs font-medium text-red-200">
                Überfällig
              </span>
            ) : null}
          </div>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-white">
              Beschreibung
            </h3>

            {task.description ? (
              <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">
                {task.description}
              </p>
            ) : (
              <p className="mt-3 text-sm italic text-neutral-600">
                Keine Beschreibung vorhanden.
              </p>
            )}
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-semibold text-white">
              Informationen
            </h3>

            <dl className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4">
              <DetailRow
                label="Verantwortlicher"
                value={
                  task.assignee ||
                  "Nicht zugewiesen"
                }
              />

              <DetailRow
                label="Fälligkeitsdatum"
                value={formatDate(
                  task.dueDate
                )}
              />

              <DetailRow
                label="Erstellt"
                value={formatDateTime(
                  task.createdAt
                )}
              />

              <DetailRow
                label="Zuletzt geändert"
                value={formatDateTime(
                  task.updatedAt
                )}
              />

              {task.completedAt ? (
                <DetailRow
                  label="Abgeschlossen"
                  value={formatDateTime(
                    task.completedAt
                  )}
                />
              ) : null}
            </dl>
          </section>

          <ProjectTaskAttachments
            attachments={
              visibleAttachments
            }
            onUpload={
              handleUploadAttachments
            }
            onDelete={
              handleDeleteAttachment
            }
          />

          <ProjectTaskActivity
            activities={
              visibleActivities
            }
          />

          <ProjectTaskComments
            comments={visibleComments}
            onAddComment={
              handleAddComment
            }
            onUpdateComment={
              handleUpdateComment
            }
            onDeleteComment={
              handleDeleteComment
            }
          />
        </div>

        <footer className="border-t border-neutral-800 bg-neutral-950 px-5 py-4 sm:px-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={handleEdit}
              className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200"
            >
              Aufgabe bearbeiten
            </button>

            <button
              type="button"
              onClick={
                handleToggleCompleted
              }
              className="rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
            >
              {task.status ===
              "completed"
                ? "Aufgabe wieder öffnen"
                : "Als erledigt markieren"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleDelete}
            className="mt-2 w-full rounded-lg border border-red-900/70 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-950/40"
          >
            Aufgabe löschen
          </button>
        </footer>
      </aside>
    </div>
  );
}