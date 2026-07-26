import type {
  TimelineEvent,
  TimelineEventType,
} from "@/types/timeline";

type CreateProjectActivityInput = {
  projectId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  author?: string;
};

export function createProjectActivity({
  projectId,
  type,
  title,
  description,
  author = "Dennis",
}: CreateProjectActivityInput): TimelineEvent {
  const createdAt = new Date().toISOString();

  return {
    id: `timeline_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    projectId,
    type,
    title,
    description,
    author,
    createdAt,
  };
}

export function createCommentActivity(
  projectId: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "comment_added",
    title: "Kommentar hinzugefügt",
    description: `${author} hat einen neuen Kommentar hinzugefügt.`,
    author,
  });
}

export function createCommentUpdatedActivity(
  projectId: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "comment_updated",
    title: "Kommentar bearbeitet",
    description: `${author} hat einen Kommentar bearbeitet.`,
    author,
  });
}

export function createCommentDeletedActivity(
  projectId: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "comment_deleted",
    title: "Kommentar gelöscht",
    description: `${author} hat einen Kommentar gelöscht.`,
    author,
  });
}

export function createNoteAddedActivity(
  projectId: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "note_added",
    title: "Projektnotiz hinzugefügt",
    description: `${author} hat eine neue Projektnotiz hinzugefügt.`,
    author,
  });
}

export function createNoteUpdatedActivity(
  projectId: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "note_updated",
    title: "Projektnotiz bearbeitet",
    description: `${author} hat eine Projektnotiz bearbeitet.`,
    author,
  });
}

export function createNoteDeletedActivity(
  projectId: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "note_deleted",
    title: "Projektnotiz gelöscht",
    description: `${author} hat eine Projektnotiz gelöscht.`,
    author,
  });
}

export function createDocumentAddedActivity(
  projectId: string,
  fileName: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "document_added",
    title: "Dokument hinzugefügt",
    description: `${author} hat das Dokument „${fileName}“ hinzugefügt.`,
    author,
  });
}

export function createDocumentUpdatedActivity(
  projectId: string,
  fileName: string,
  versionNumber: number,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "document_updated",
    title: "Dokument aktualisiert",
    description: `${author} hat für „${fileName}“ Version ${versionNumber} hochgeladen.`,
    author,
  });
}

export function createDocumentDeletedActivity(
  projectId: string,
  fileName: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "document_deleted",
    title: "Dokument gelöscht",
    description: `${author} hat das Dokument „${fileName}“ gelöscht.`,
    author,
  });
}

export function createTaskAddedActivity(
  projectId: string,
  taskTitle: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "task_added",
    title: "Aufgabe erstellt",
    description: `${author} hat die Aufgabe „${taskTitle}“ erstellt.`,
    author,
  });
}

export function createTaskUpdatedActivity(
  projectId: string,
  taskTitle: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "task_updated",
    title: "Aufgabe bearbeitet",
    description: `${author} hat die Aufgabe „${taskTitle}“ bearbeitet.`,
    author,
  });
}

export function createTaskCompletedActivity(
  projectId: string,
  taskTitle: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "task_completed",
    title: "Aufgabe erledigt",
    description: `${author} hat die Aufgabe „${taskTitle}“ als erledigt markiert.`,
    author,
  });
}

export function createTaskReopenedActivity(
  projectId: string,
  taskTitle: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "task_reopened",
    title: "Aufgabe wieder geöffnet",
    description: `${author} hat die Aufgabe „${taskTitle}“ wieder geöffnet.`,
    author,
  });
}

export function createTaskDeletedActivity(
  projectId: string,
  taskTitle: string,
  author = "Dennis"
): TimelineEvent {
  return createProjectActivity({
    projectId,
    type: "task_deleted",
    title: "Aufgabe gelöscht",
    description: `${author} hat die Aufgabe „${taskTitle}“ gelöscht.`,
    author,
  });
}