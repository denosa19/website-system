"use client";

import { useEffect, useMemo, useState } from "react";
import ProjectTaskActivity from "@/components/projects/ProjectTaskActivity";
import ProjectTaskAttachments from "@/components/projects/ProjectTaskAttachments";
import ProjectTaskComments from "@/components/projects/ProjectTaskComments";
import ProjectTaskSubtasks from "@/components/projects/ProjectTaskSubtasks";
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
import {
  createTaskSubtask,
  deleteTaskSubtask,
  getTaskSubtasks,
  replaceTaskSubtask,
  toggleTaskSubtask,
} from "@/lib/taskSubtasks";
import type {
  ProjectTask,
  ProjectTaskPriority,
  ProjectTaskStatus,
} from "@/types/task";
import type { TaskActivity } from "@/types/taskActivity";
import type { TaskAttachment } from "@/types/taskAttachment";
import type { TaskComment } from "@/types/taskComment";
import type { TaskSubtask } from "@/types/taskSubtask";

type ProjectTaskDetailPanelProps = {
  task: ProjectTask | null;
  onClose: () => void;
  onEditTask: (task: ProjectTask) => void;
  onToggleCompleted: (task: ProjectTask) => void;
  onDeleteTask: (task: ProjectTask) => void;
};

const TASK_COMMENTS_STORAGE_KEY = "website-system-task-comments";
const TASK_ATTACHMENTS_STORAGE_KEY = "website-system-task-attachments";
const TASK_ACTIVITIES_STORAGE_KEY = "website-system-task-activities";
const TASK_SUBTASKS_STORAGE_KEY = "website-system-task-subtasks";

const STATUS_LABELS: Record<ProjectTaskStatus, string> = {
  open: "Offen",
  in_progress: "In Arbeit",
  waiting: "Wartet",
  completed: "Erledigt",
};

const STATUS_STYLES: Record<ProjectTaskStatus, string> = {
  open: "border-amber-800/70 bg-amber-950/50 text-amber-200",
  in_progress: "border-blue-800/70 bg-blue-950/50 text-blue-200",
  waiting: "border-neutral-700 bg-neutral-800 text-neutral-200",
  completed: "border-emerald-800/70 bg-emerald-950/50 text-emerald-200",
};

const PRIORITY_LABELS: Record<ProjectTaskPriority, string> = {
  low: "Niedrig",
  medium: "Mittel",
  high: "Hoch",
  critical: "Kritisch",
};

const PRIORITY_STYLES: Record<ProjectTaskPriority, string> = {
  low: "border-neutral-700 bg-neutral-900 text-neutral-300",
  medium: "border-blue-900/70 bg-blue-950/30 text-blue-300",
  high: "border-orange-900/70 bg-orange-950/30 text-orange-300",
  critical: "border-red-900/70 bg-red-950/40 text-red-300",
};

function formatDate(value: string | null): string {
  if (!value) return "Nicht festgelegt";
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function isTaskOverdue(task: ProjectTask): boolean {
  if (!task.dueDate || task.status === "completed") return false;
  return new Date(`${task.dueDate}T23:59:59.999`).getTime() < Date.now();
}

function readArray<T>(key: string, fallback: T[]): T[] {
  if (typeof window === "undefined") return fallback;
  try {
    const storedValue = window.localStorage.getItem(key);
    if (!storedValue) return fallback;
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) ? (parsed as T[]) : fallback;
  } catch {
    return fallback;
  }
}

function writeArray<T>(key: string, value: T[]): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Lokale Speicherung für ${key} fehlgeschlagen.`, error);
  }
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () =>
      typeof reader.result === "string"
        ? resolve(reader.result)
        : reject(new Error("Datei konnte nicht gelesen werden."));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Datei konnte nicht gelesen werden."));
    reader.readAsDataURL(file);
  });
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1 border-b border-neutral-800 py-3 last:border-b-0 sm:grid-cols-[150px_1fr] sm:gap-4">
      <dt className="text-sm text-neutral-500">{label}</dt>
      <dd className="break-words text-sm text-neutral-200">{value}</dd>
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
  const [comments, setComments] = useState<TaskComment[]>(initialTaskComments);
  const [attachments, setAttachments] = useState<TaskAttachment[]>(initialTaskAttachments);
  const [activities, setActivities] = useState<TaskActivity[]>(initialTaskActivities);
  const [subtasks, setSubtasks] = useState<TaskSubtask[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setComments(readArray(TASK_COMMENTS_STORAGE_KEY, initialTaskComments));
    setAttachments(readArray(TASK_ATTACHMENTS_STORAGE_KEY, initialTaskAttachments));
    setActivities(readArray(TASK_ACTIVITIES_STORAGE_KEY, initialTaskActivities));
    setSubtasks(readArray<TaskSubtask>(TASK_SUBTASKS_STORAGE_KEY, []));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    writeArray(TASK_COMMENTS_STORAGE_KEY, comments);
  }, [comments, loaded]);

  useEffect(() => {
    if (!loaded) return;
    writeArray(TASK_ATTACHMENTS_STORAGE_KEY, attachments);
  }, [attachments, loaded]);

  useEffect(() => {
    if (!loaded) return;
    writeArray(TASK_ACTIVITIES_STORAGE_KEY, activities);
  }, [activities, loaded]);

  useEffect(() => {
    if (!loaded) return;
    writeArray(TASK_SUBTASKS_STORAGE_KEY, subtasks);
  }, [subtasks, loaded]);

  useEffect(() => {
    if (!task) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose, task]);

  const visibleComments = useMemo(
    () => (task ? getTaskComments(comments, task.id) : []),
    [comments, task]
  );
  const visibleAttachments = useMemo(
    () => (task ? getTaskAttachments(attachments, task.id) : []),
    [attachments, task]
  );
  const visibleActivities = useMemo(
    () => (task ? getTaskActivities(activities, task.id) : []),
    [activities, task]
  );
  const visibleSubtasks = useMemo(
    () => (task ? getTaskSubtasks(subtasks, task.id) : []),
    [subtasks, task]
  );

  if (!task) return null;

  const overdue = isTaskOverdue(task);

  function addActivity(type: TaskActivity["type"], message: string) {
    const newActivity = createTaskActivity({
      taskId: task.id,
      type,
      author: "Dennis",
      message,
    });
    setActivities((current) => [...current, newActivity]);
  }

  function handleToggleCompleted() {
    addActivity(
      task.status === "completed" ? "status_changed" : "completed",
      task.status === "completed"
        ? "Aufgabe wieder geöffnet: Erledigt → Offen"
        : "Aufgabe abgeschlossen"
    );
    onToggleCompleted(task);
  }

  function handleAddComment(message: string) {
    setComments((current) => [
      ...current,
      createTaskComment({ taskId: task.id, author: "Dennis", message }),
    ]);
    addActivity("comment_added", message);
  }

  function handleUpdateComment(comment: TaskComment, message: string) {
    setComments((current) =>
      replaceTaskComment(current, updateTaskComment(comment, { message }))
    );
    addActivity("comment_updated", message);
  }

  function handleDeleteComment(comment: TaskComment) {
    setComments((current) => deleteTaskComment(current, comment.id));
    addActivity("comment_deleted", comment.message);
  }

  async function handleUploadAttachments(files: FileList) {
    try {
      const newAttachments = await Promise.all(
        Array.from(files).map(async (file) =>
          createTaskAttachment({
            taskId: task.id,
            name: file.name,
            type: file.type || "application/octet-stream",
            size: file.size,
            dataUrl: await readFileAsDataUrl(file),
            uploadedBy: "Dennis",
          })
        )
      );
      setAttachments((current) => [...current, ...newAttachments]);
      newAttachments.forEach((attachment) =>
        addActivity("attachment_added", attachment.name)
      );
    } catch (error) {
      console.error("Dateianhang konnte nicht gespeichert werden.", error);
    }
  }

  function handleDeleteAttachment(attachment: TaskAttachment) {
    setAttachments((current) => deleteTaskAttachment(current, attachment.id));
    addActivity("attachment_deleted", attachment.name);
  }

  function handleAddSubtask(title: string) {
    setSubtasks((current) => [
      ...current,
      createTaskSubtask({ taskId: task.id, title }),
    ]);
    addActivity("subtask_added", title);
  }

  function handleToggleSubtask(subtask: TaskSubtask) {
    const updatedSubtask = toggleTaskSubtask(subtask);
    setSubtasks((current) => replaceTaskSubtask(current, updatedSubtask));
    addActivity(
      updatedSubtask.completed ? "subtask_completed" : "subtask_reopened",
      updatedSubtask.title
    );
  }

  function handleDeleteSubtask(subtask: TaskSubtask) {
    setSubtasks((current) => deleteTaskSubtask(current, subtask.id));
    addActivity("subtask_deleted", subtask.title);
  }

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="task-detail-title" className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label="Detailansicht schließen"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="absolute inset-x-0 bottom-0 flex max-h-[92vh] flex-col rounded-t-2xl border border-neutral-800 bg-neutral-950 shadow-2xl sm:inset-y-0 sm:left-auto sm:right-0 sm:max-h-none sm:w-full sm:max-w-xl sm:rounded-none sm:border-y-0 sm:border-r-0">
        <header className="flex items-start justify-between gap-4 border-b border-neutral-800 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-neutral-500">Aufgabendetails</p>
            <h2 id="task-detail-title" className="mt-2 break-words text-xl font-semibold text-white">{task.title}</h2>
          </div>
          <button type="button" onClick={onClose} aria-label="Detailansicht schließen" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-700 text-xl text-neutral-400 transition hover:bg-neutral-800 hover:text-white">×</button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}>{STATUS_LABELS[task.status]}</span>
            <span className={`rounded-full border px-3 py-1.5 text-xs font-medium ${PRIORITY_STYLES[task.priority]}`}>Priorität: {PRIORITY_LABELS[task.priority]}</span>
            {overdue ? <span className="rounded-full border border-red-800/70 bg-red-950/60 px-3 py-1.5 text-xs font-medium text-red-200">Überfällig</span> : null}
          </div>

          <section className="mt-6">
            <h3 className="text-sm font-semibold text-white">Beschreibung</h3>
            {task.description ? <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">{task.description}</p> : <p className="mt-3 text-sm italic text-neutral-600">Keine Beschreibung vorhanden.</p>}
          </section>

          <section className="mt-7">
            <h3 className="text-sm font-semibold text-white">Informationen</h3>
            <dl className="mt-3 rounded-xl border border-neutral-800 bg-neutral-900/60 px-4">
              <DetailRow label="Verantwortlicher" value={task.assignee || "Nicht zugewiesen"} />
              <DetailRow label="Fälligkeitsdatum" value={formatDate(task.dueDate)} />
              <DetailRow label="Erstellt" value={formatDateTime(task.createdAt)} />
              <DetailRow label="Zuletzt geändert" value={formatDateTime(task.updatedAt)} />
              {task.completedAt ? <DetailRow label="Abgeschlossen" value={formatDateTime(task.completedAt)} /> : null}
            </dl>
          </section>

          <ProjectTaskSubtasks
            subtasks={visibleSubtasks}
            onAdd={handleAddSubtask}
            onToggle={handleToggleSubtask}
            onDelete={handleDeleteSubtask}
          />

          <ProjectTaskAttachments attachments={visibleAttachments} onUpload={handleUploadAttachments} onDelete={handleDeleteAttachment} />
          <ProjectTaskActivity activities={visibleActivities} />
          <ProjectTaskComments comments={visibleComments} onAddComment={handleAddComment} onUpdateComment={handleUpdateComment} onDeleteComment={handleDeleteComment} />
        </div>

        <footer className="border-t border-neutral-800 bg-neutral-950 px-5 py-4 sm:px-6">
          <div className="grid gap-2 sm:grid-cols-2">
            <button type="button" onClick={() => { onEditTask(task); onClose(); }} className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">Aufgabe bearbeiten</button>
            <button type="button" onClick={handleToggleCompleted} className="rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white">{task.status === "completed" ? "Aufgabe wieder öffnen" : "Als erledigt markieren"}</button>
          </div>
          <button type="button" onClick={() => onDeleteTask(task)} className="mt-2 w-full rounded-lg border border-red-900/70 px-4 py-3 text-sm font-medium text-red-300 transition hover:bg-red-950/40">Aufgabe löschen</button>
        </footer>
      </aside>
    </div>
  );
}