"use client";

import { useState } from "react";
import type { TaskComment } from "@/types/taskComment";

type ProjectTaskCommentsProps = {
  comments: TaskComment[];
  onAddComment: (message: string) => void;
  onUpdateComment: (
    comment: TaskComment,
    message: string
  ) => void;
  onDeleteComment: (
    comment: TaskComment
  ) => void;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
}

export default function ProjectTaskComments({
  comments,
  onAddComment,
  onUpdateComment,
  onDeleteComment,
}: ProjectTaskCommentsProps) {
  const [message, setMessage] =
    useState("");
  const [
    editingCommentId,
    setEditingCommentId,
  ] = useState<string | null>(null);
  const [
    editingMessage,
    setEditingMessage,
  ] = useState("");
  const [
    deletingCommentId,
    setDeletingCommentId,
  ] = useState<string | null>(null);

  function handleSubmit(
    event: React.FormEvent
  ) {
    event.preventDefault();

    const trimmed = message.trim();

    if (!trimmed) {
      return;
    }

    onAddComment(trimmed);
    setMessage("");
  }

  function startEditing(
    comment: TaskComment
  ) {
    setEditingCommentId(comment.id);
    setEditingMessage(comment.message);
    setDeletingCommentId(null);
  }

  function cancelEditing() {
    setEditingCommentId(null);
    setEditingMessage("");
  }

  function saveEditing(
    comment: TaskComment
  ) {
    const trimmed =
      editingMessage.trim();

    if (!trimmed) {
      return;
    }

    onUpdateComment(
      comment,
      trimmed
    );

    cancelEditing();
  }

  function confirmDelete(
    comment: TaskComment
  ) {
    onDeleteComment(comment);
    setDeletingCommentId(null);

    if (
      editingCommentId === comment.id
    ) {
      cancelEditing();
    }
  }

  return (
    <section className="mt-8 border-t border-neutral-800 pt-6">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-white">
          Kommentare
        </h3>

        <span className="text-xs text-neutral-500">
          {comments.length}{" "}
          {comments.length === 1
            ? "Kommentar"
            : "Kommentare"}
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {comments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-500">
            Noch keine Kommentare vorhanden.
          </div>
        ) : (
          comments.map((comment) => {
            const isEditing =
              editingCommentId ===
              comment.id;
            const isDeleting =
              deletingCommentId ===
              comment.id;

            return (
              <article
                key={comment.id}
                className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="font-semibold text-white">
                      {comment.author}
                    </span>

                    <p className="mt-1 text-xs text-neutral-500">
                      {formatDate(
                        comment.createdAt
                      )}
                    </p>
                  </div>

                  {!isEditing &&
                  !isDeleting ? (
                    <div className="flex shrink-0 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          startEditing(
                            comment
                          )
                        }
                        className="rounded-md border border-neutral-700 px-2.5 py-1.5 text-xs font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                      >
                        Bearbeiten
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeletingCommentId(
                            comment.id
                          )
                        }
                        className="rounded-md border border-red-900/70 px-2.5 py-1.5 text-xs font-medium text-red-300 transition hover:bg-red-950/40"
                      >
                        Löschen
                      </button>
                    </div>
                  ) : null}
                </div>

                {isEditing ? (
                  <div className="mt-4">
                    <textarea
                      value={
                        editingMessage
                      }
                      onChange={(event) =>
                        setEditingMessage(
                          event.target
                            .value
                        )
                      }
                      rows={4}
                      autoFocus
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-3 text-sm text-white outline-none transition focus:border-white"
                    />

                    <div className="mt-3 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={
                          cancelEditing
                        }
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                      >
                        Abbrechen
                      </button>

                      <button
                        type="button"
                        disabled={
                          !editingMessage.trim()
                        }
                        onClick={() =>
                          saveEditing(
                            comment
                          )
                        }
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Speichern
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-6 text-neutral-300">
                      {comment.message}
                    </p>

                    {comment.updatedAt !==
                    comment.createdAt ? (
                      <p className="mt-3 text-xs text-neutral-500">
                        Bearbeitet am{" "}
                        {formatDate(
                          comment.updatedAt
                        )}
                      </p>
                    ) : null}
                  </>
                )}

                {isDeleting ? (
                  <div className="mt-4 rounded-lg border border-red-900/60 bg-red-950/20 p-4">
                    <p className="text-sm font-medium text-red-200">
                      Kommentar wirklich
                      löschen?
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      Diese Aktion kann
                      nicht rückgängig
                      gemacht werden.
                    </p>

                    <div className="mt-4 flex flex-wrap justify-end gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setDeletingCommentId(
                            null
                          )
                        }
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                      >
                        Abbrechen
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          confirmDelete(
                            comment
                          )
                        }
                        className="rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
                      >
                        Löschen
                      </button>
                    </div>
                  </div>
                ) : null}
              </article>
            );
          })
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
            disabled={!message.trim()}
            className="rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Kommentar hinzufügen
          </button>
        </div>
      </form>
    </section>
  );
}