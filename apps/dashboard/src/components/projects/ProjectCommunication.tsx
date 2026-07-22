"use client";

import { useState } from "react";
import { comments } from "@/data/comments";
import { timeline } from "@/data/timeline";
import type { TimelineEvent } from "@/types/timeline";
import ProjectComments from "./ProjectComments";
import ProjectTimeline from "./ProjectTimeline";

type ProjectCommunicationProps = {
  projectId: string;
};

export default function ProjectCommunication({
  projectId,
}: ProjectCommunicationProps) {
  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(timeline);

  function handleActivityCreated(
    activity: TimelineEvent
  ) {
    setTimelineEvents((currentEvents) => [
      activity,
      ...currentEvents,
    ]);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ProjectComments
        projectId={projectId}
        initialComments={comments}
        onActivityCreated={handleActivityCreated}
      />

      <ProjectTimeline
        projectId={projectId}
        events={timelineEvents}
      />
    </div>
  );
}