"use client";

import {
  useEffect,
  useState,
} from "react";
import { comments } from "@/data/comments";
import { timeline } from "@/data/timeline";
import type { ProjectComment } from "@/types/comment";
import type { TimelineEvent } from "@/types/timeline";
import ProjectComments from "./ProjectComments";
import ProjectTimeline from "./ProjectTimeline";

type ProjectCommunicationProps = {
  projectId: string;
};

type StoredProjectCommunication = {
  comments: ProjectComment[];
  timelineEvents: TimelineEvent[];
};

function getStorageKey(projectId: string) {
  return `project-communication-${projectId}`;
}

export default function ProjectCommunication({
  projectId,
}: ProjectCommunicationProps) {
  const [projectComments, setProjectComments] =
    useState<ProjectComment[]>(comments);

  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(timeline);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storageKey = getStorageKey(projectId);
    const storedCommunication =
      window.localStorage.getItem(storageKey);

    if (!storedCommunication) {
      setProjectComments(comments);
      setTimelineEvents(timeline);
      setIsLoaded(true);
      return;
    }

    try {
      const parsedCommunication =
        JSON.parse(
          storedCommunication
        ) as StoredProjectCommunication;

      setProjectComments(
        Array.isArray(parsedCommunication.comments)
          ? parsedCommunication.comments
          : comments
      );

      setTimelineEvents(
        Array.isArray(
          parsedCommunication.timelineEvents
        )
          ? parsedCommunication.timelineEvents
          : timeline
      );
    } catch {
      setProjectComments(comments);
      setTimelineEvents(timeline);
    }

    setIsLoaded(true);
  }, [projectId]);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    const storageKey = getStorageKey(projectId);

    const communicationToStore: StoredProjectCommunication = {
      comments: projectComments,
      timelineEvents,
    };

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(communicationToStore)
    );
  }, [
    isLoaded,
    projectComments,
    projectId,
    timelineEvents,
  ]);

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

  function handleCommentUpdated(
    commentId: string,
    message: string
  ) {
    setProjectComments((currentComments) =>
      currentComments.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              message,
              updatedAt: new Date().toISOString(),
            }
          : comment
      )
    );
  }

  function handleCommentDeleted(commentId: string) {
    setProjectComments((currentComments) =>
      currentComments.filter(
        (comment) => comment.id !== commentId
      )
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <ProjectComments
        projectId={projectId}
        comments={projectComments}
        onCommentCreated={handleCommentCreated}
        onCommentUpdated={handleCommentUpdated}
        onCommentDeleted={handleCommentDeleted}
      />

      <ProjectTimeline
        projectId={projectId}
        events={timelineEvents}
      />
    </div>
  );
}