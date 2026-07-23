"use client";

import {
  useEffect,
  useState,
} from "react";
import { comments } from "@/data/comments";
import { documents } from "@/data/documents";
import { notes } from "@/data/notes";
import { timeline } from "@/data/timeline";
import {
  createCommentDeletedActivity,
  createCommentUpdatedActivity,
  createNoteAddedActivity,
  createNoteDeletedActivity,
  createNoteUpdatedActivity,
} from "@/lib/projectActivity";
import type { ProjectComment } from "@/types/comment";
import type { ProjectDocument } from "@/types/document";
import type { ProjectNote } from "@/types/note";
import type { TimelineEvent } from "@/types/timeline";
import ProjectComments from "./ProjectComments";
import ProjectDocuments from "./ProjectDocuments";
import ProjectNotes from "./ProjectNotes";
import ProjectTimeline from "./ProjectTimeline";

type ProjectCommunicationProps = {
  projectId: string;
};

type StoredProjectCommunication = {
  comments: ProjectComment[];
  notes: ProjectNote[];
  documents: ProjectDocument[];
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

  const [projectNotes, setProjectNotes] =
    useState<ProjectNote[]>(notes);

  const [projectDocuments, setProjectDocuments] =
    useState<ProjectDocument[]>(documents);

  const [timelineEvents, setTimelineEvents] =
    useState<TimelineEvent[]>(timeline);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(false);

    const storageKey = getStorageKey(projectId);
    const storedCommunication =
      window.localStorage.getItem(storageKey);

    if (!storedCommunication) {
      setProjectComments(comments);
      setProjectNotes(notes);
      setProjectDocuments(documents);
      setTimelineEvents(timeline);
      setIsLoaded(true);
      return;
    }

    try {
      const parsedCommunication =
        JSON.parse(
          storedCommunication
        ) as Partial<StoredProjectCommunication>;

      setProjectComments(
        Array.isArray(parsedCommunication.comments)
          ? parsedCommunication.comments
          : comments
      );

      setProjectNotes(
        Array.isArray(parsedCommunication.notes)
          ? parsedCommunication.notes
          : notes
      );

      setProjectDocuments(
        Array.isArray(
          parsedCommunication.documents
        )
          ? parsedCommunication.documents
          : documents
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
      setProjectNotes(notes);
      setProjectDocuments(documents);
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
      notes: projectNotes,
      documents: projectDocuments,
      timelineEvents,
    };

    window.localStorage.setItem(
      storageKey,
      JSON.stringify(communicationToStore)
    );
  }, [
    isLoaded,
    projectComments,
    projectDocuments,
    projectId,
    projectNotes,
    timelineEvents,
  ]);

  function addTimelineEvent(
    activity: TimelineEvent
  ) {
    setTimelineEvents((currentEvents) => [
      activity,
      ...currentEvents,
    ]);
  }

  function handleCommentCreated(
    comment: ProjectComment,
    activity: TimelineEvent
  ) {
    setProjectComments((currentComments) => [
      comment,
      ...currentComments,
    ]);

    addTimelineEvent(activity);
  }

  function handleCommentUpdated(
    commentId: string,
    message: string
  ) {
    const author = "Dennis";

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

    addTimelineEvent(
      createCommentUpdatedActivity(
        projectId,
        author
      )
    );
  }

  function handleCommentDeleted(commentId: string) {
    const author = "Dennis";

    setProjectComments((currentComments) =>
      currentComments.filter(
        (comment) => comment.id !== commentId
      )
    );

    addTimelineEvent(
      createCommentDeletedActivity(
        projectId,
        author
      )
    );
  }

  function handleNoteCreated(note: ProjectNote) {
    setProjectNotes((currentNotes) => [
      note,
      ...currentNotes,
    ]);

    addTimelineEvent(
      createNoteAddedActivity(
        projectId,
        note.author
      )
    );
  }

  function handleNoteUpdated(
    noteId: string,
    content: string
  ) {
    const author = "Dennis";

    setProjectNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === noteId
          ? {
              ...note,
              content,
              updatedAt: new Date().toISOString(),
            }
          : note
      )
    );

    addTimelineEvent(
      createNoteUpdatedActivity(
        projectId,
        author
      )
    );
  }

  function handleNoteDeleted(noteId: string) {
    const author = "Dennis";

    setProjectNotes((currentNotes) =>
      currentNotes.filter(
        (note) => note.id !== noteId
      )
    );

    addTimelineEvent(
      createNoteDeletedActivity(
        projectId,
        author
      )
    );
  }

  function handleDocumentCreated(
    document: ProjectDocument
  ) {
    setProjectDocuments((currentDocuments) => [
      document,
      ...currentDocuments,
    ]);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-2">
        <ProjectComments
          projectId={projectId}
          comments={projectComments}
          onCommentCreated={handleCommentCreated}
          onCommentUpdated={handleCommentUpdated}
          onCommentDeleted={handleCommentDeleted}
        />

        <ProjectNotes
          projectId={projectId}
          notes={projectNotes}
          onNoteCreated={handleNoteCreated}
          onNoteUpdated={handleNoteUpdated}
          onNoteDeleted={handleNoteDeleted}
        />
      </div>

      <ProjectDocuments
        projectId={projectId}
        documents={projectDocuments}
        onDocumentCreated={handleDocumentCreated}
      />

      <ProjectTimeline
        projectId={projectId}
        events={timelineEvents}
      />
    </div>
  );
}