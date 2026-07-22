import { TimelineEvent } from "@/types/timeline";

export const timeline: TimelineEvent[] = [
  {
    id: "timeline_001",
    projectId: "proj_001",
    type: "project_created",
    title: "Projekt erstellt",
    author: "Dennis",
    createdAt: "2026-07-22T09:00:00",
  },
  {
    id: "timeline_002",
    projectId: "proj_001",
    type: "status_changed",
    title: "Status geändert",
    description: "Projektstatus auf „In Umsetzung“ gesetzt.",
    author: "Dennis",
    createdAt: "2026-07-22T10:00:00",
  },
  {
    id: "timeline_003",
    projectId: "proj_001",
    type: "comment_added",
    title: "Kommentar hinzugefügt",
    description: "Erste Projektplanung abgeschlossen.",
    author: "Dennis",
    createdAt: "2026-07-22T10:30:00",
  },
];