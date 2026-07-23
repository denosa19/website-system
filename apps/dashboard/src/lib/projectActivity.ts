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