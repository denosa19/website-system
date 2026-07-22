"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import { createCommentActivity } from "@/lib/projectActivity";
import type { ProjectComment } from "@/types/comment";
import type { TimelineEvent } from "@/types/timeline";

type ProjectCommentsProps = {
  projectId: string;
  initialComments: ProjectComment[];
  onActivityCreated: (
    activity: TimelineEvent
  ) => void;
};

function formatCommentDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProjectComments({
  projectId,
  initialComments,
  onActivityCreated,
}: ProjectCommentsProps) {
  const [comments, setComments] =
    useState<ProjectComment[]>(initialComments);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const projectComments = useMemo(
    () =>
      comments
        .filter(
          (comment) => comment.projectId === projectId
        )
        .sort(
          (firstComment, secondComment) =>
            new Date(
              secondComment.createdAt
            ).getTime() -
            new Date(
              firstComment.createdAt
            ).getTime()
        ),
    [comments, projectId]
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedMessage = message.trim();

    if (!trimmedMessage) {
      setError("Bitte gib einen Kommentar ein.");
      return;
    }

    const author = "Dennis";

    const newComment: ProjectComment = {
      id: `comment_${Date.now()}`,
      projectId,
      author,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    const commentActivity = createCommentActivity(
      projectId,
      author
    );

    setComments((currentComments) => [
      newComment,
      ...currentComments,
    ]);

    onActivityCreated(commentActivity);

    setMessage("");
    setError("");
  }

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
            Kommunikation
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Kommentare
          </h2>
        </div>

        <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
          {projectComments.length}{" "}
          {projectComments.length === 1
            ? "Kommentar"
            : "Kommentare"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        <label>
          <span className="text-sm font-medium text-neutral-300">
            Neuer Kommentar
          </span>

          <textarea
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setError("");
            }}
            rows={4}
            placeholder="Kommentar zum Projekt eingeben …"
            className="mt-2 w-full resize-y rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
          />
        </label>

        {error && (
          <p
            role="alert"
            className="mt-3 text-sm text-red-400"
          >
            {error}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Kommentar hinzufügen
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {projectComments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 px-5 py-8 text-center">
            <p className="text-sm text-neutral-500">
              Für dieses Projekt gibt es noch keine
              Kommentare.
            </p>
          </div>
        ) : (
          projectComments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
            >
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="font-medium text-white">
                  {comment.author}
                </p>

                <time
                  dateTime={comment.createdAt}
                  className="text-xs text-neutral-500"
                >
                  {formatCommentDate(
                    comment.createdAt
                  )}
                </time>
              </div>

              <p className="mt-3 whitespace-pre-wrap leading-7 text-neutral-300">
                {comment.message}
              </p>

              {comment.updatedAt && (
                <p className="mt-3 text-xs text-neutral-600">
                  Bearbeitet am{" "}
                  {formatCommentDate(
                    comment.updatedAt
                  )}
                </p>
              )}
            </article>
          ))
        )}
      </div>
    </section>
  );
}