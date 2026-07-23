export type TimelineEventType =
  | "project_created"
  | "comment_added"
  | "comment_updated"
  | "comment_deleted"
  | "note_added"
  | "note_updated"
  | "note_deleted"
  | "project_updated"
  | "status_changed"
  | "priority_changed"
  | "owner_changed"
  | "deadline_changed";

export interface TimelineEvent {
  id: string;
  projectId: string;
  type: TimelineEventType;
  title: string;
  description?: string;
  author: string;
  createdAt: string;
}