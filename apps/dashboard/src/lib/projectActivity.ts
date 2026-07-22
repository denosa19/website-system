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