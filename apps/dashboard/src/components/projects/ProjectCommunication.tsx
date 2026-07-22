"use client";

import { useState } from "react";
import { comments } from "@/data/comments";
import { timeline } from "@/data/timeline";
import type { ProjectComment } from "@/types/comment";
import type { TimelineEvent } from "@/types/timeline";
import ProjectComments from "./ProjectComments";
import ProjectTimeline from "./ProjectTimeline";

type ProjectCommunicationProps = {
  projectId: string;
};

export default function ProjectCommunication({
  projectId,
}: ProjectCommunicationProps) {
  const [projectComments, setProjectComments] =
    useState<ProjectComment[]>(comments);

  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(timeline);

  function handleCommentCreated(
    comment: ProjectComment,
    activity: TimelineEvent
  ) {
    setProjectComments((currentComments) => [
      comment,
      ...currentComments,
    ]);

    setTimelineEvents((currentEvents) => [
      activity,
      ...currentEvents,
    ]);
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ProjectComments
        projectId={projectId}
        comments={projectComments}
        onCommentCreated={handleCommentCreated}
      />

      <ProjectTimeline
        projectId={projectId}
        events={timelineEvents}
      />
    </div>
  );
}