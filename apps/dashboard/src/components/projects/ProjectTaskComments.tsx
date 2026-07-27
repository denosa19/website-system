"use client";

import { useState } from "react";
import type { TaskComment } from "@/types/taskComment";

type ProjectTaskCommentsProps = {
  comments: TaskComment[];
  onAddComment: (
    message: string
  ) => void;
};

function formatDate(
  value: string
) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function ProjectTaskComments({
  comments,
  onAddComment,
}: ProjectTaskCommentsProps) {
  const [message, setMessage] =
    useState("");

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmed =
      message.trim();

    if (!trimmed) {
      return;
    }

    onAddComment(trimmed);
    setMessage("");
  }

  return (
    <section className="mt-8 border-t border-neutral-800 pt-6">
      <h3 className="text-lg font-semibold text-white">
        Kommentare
      </h3>

      <div className="mt-5 space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-500">
            Noch keine Kommentare vorhanden.
          </div>
        ) : (
          comments.map((comment) => (
            <article
              key={comment.id}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="font-semibold text-white">
                  {comment.author}
                </span>

                <span className="text-xs text-neutral-500">
                  {formatDate(
                    comment.createdAt
                  )}
                </span>
              </div>

              <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-neutral-300">
                {comment.message}
              </p>

              {comment.updatedAt !==
                comment.createdAt && (
                <p className="mt-3 text-xs text-neutral-500">
                  Bearbeitet
                </p>
              )}
            </article>
          ))
        )}
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        <textarea
          value={message}
          onChange={(event) =>
            setMessage(
              event.target.value
            )
          }
          rows={4}
          placeholder="Kommentar schreiben..."
          className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
        />

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            disabled={
              !message.trim()
            }
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kommentar hinzufügen
          </button>
        </div>
      </form>
    </section>
  );
}