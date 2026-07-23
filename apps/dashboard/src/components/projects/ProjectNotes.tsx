"use client";

import {
  type FormEvent,
  useMemo,
  useState,
} from "react";
import type { ProjectNote } from "@/types/note";

type ProjectNotesProps = {
  projectId: string;
  notes: ProjectNote[];
  onNoteCreated: (note: ProjectNote) => void;
  onNoteUpdated: (
    noteId: string,
    content: string
  ) => void;
  onNoteDeleted: (noteId: string) => void;
};

function formatNoteDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProjectNotes({
  projectId,
  notes,
  onNoteCreated,
  onNoteUpdated,
  onNoteDeleted,
}: ProjectNotesProps) {
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const [editingNoteId, setEditingNoteId] =
    useState<string | null>(null);

  const [editingContent, setEditingContent] =
    useState("");

  const [editingError, setEditingError] =
    useState("");

  const projectNotes = useMemo(
    () =>
      notes
        .filter(
          (note) => note.projectId === projectId
        )
        .sort(
          (firstNote, secondNote) =>
            new Date(
              secondNote.createdAt
            ).getTime() -
            new Date(
              firstNote.createdAt
            ).getTime()
        ),
    [notes, projectId]
  );

  function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const trimmedContent = content.trim();

    if (!trimmedContent) {
      setError("Bitte gib eine Projektnotiz ein.");
      return;
    }

    const newNote: ProjectNote = {
      id: `note_${Date.now()}_${Math.random()
        .toString(36)
        .slice(2, 8)}`,
      projectId,
      author: "Dennis",
      content: trimmedContent,
      createdAt: new Date().toISOString(),
    };

    onNoteCreated(newNote);

    setContent("");
    setError("");
  }

  function handleEditStart(note: ProjectNote) {
    setEditingNoteId(note.id);
    setEditingContent(note.content);
    setEditingError("");
  }

  function handleEditCancel() {
    setEditingNoteId(null);
    setEditingContent("");
    setEditingError("");
  }

  function handleEditSubmit(
    event: FormEvent<HTMLFormElement>,
    noteId: string
  ) {
    event.preventDefault();

    const trimmedContent =
      editingContent.trim();

    if (!trimmedContent) {
      setEditingError(
        "Die Projektnotiz darf nicht leer sein."
      );
      return;
    }

    onNoteUpdated(noteId, trimmedContent);
    handleEditCancel();
  }

  function handleDelete(noteId: string) {
    const shouldDelete = window.confirm(
      "Möchtest du diese Projektnotiz wirklich löschen?"
    );

    if (!shouldDelete) {
      return;
    }

    onNoteDeleted(noteId);

    if (editingNoteId === noteId) {
      handleEditCancel();
    }
  }

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
            Interne Dokumentation
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Projektnotizen
          </h2>
        </div>

        <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
          {projectNotes.length}{" "}
          {projectNotes.length === 1
            ? "Notiz"
            : "Notizen"}
        </span>
      </div>

      <form
        onSubmit={handleSubmit}
        className="mt-6"
      >
        <label>
          <span className="text-sm font-medium text-neutral-300">
            Neue Projektnotiz
          </span>

          <textarea
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setError("");
            }}
            rows={5}
            placeholder="Interne Informationen, Entscheidungen oder wichtige Projektdetails festhalten …"
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
            Notiz hinzufügen
          </button>
        </div>
      </form>

      <div className="mt-8 space-y-4">
        {projectNotes.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 px-5 py-8 text-center">
            <p className="text-sm text-neutral-500">
              Für dieses Projekt gibt es noch keine
              Projektnotizen.
            </p>
          </div>
        ) : (
          projectNotes.map((note) => {
            const isEditing =
              editingNoteId === note.id;

            return (
              <article
                key={note.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <p className="font-medium text-white">
                    {note.author}
                  </p>

                  <time
                    dateTime={note.createdAt}
                    className="text-xs text-neutral-500"
                  >
                    {formatNoteDate(
                      note.createdAt
                    )}
                  </time>
                </div>

                {isEditing ? (
                  <form
                    onSubmit={(event) =>
                      handleEditSubmit(
                        event,
                        note.id
                      )
                    }
                    className="mt-4"
                  >
                    <textarea
                      value={editingContent}
                      onChange={(event) => {
                        setEditingContent(
                          event.target.value
                        );
                        setEditingError("");
                      }}
                      rows={5}
                      className="w-full resize-y rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-3 text-white outline-none transition focus:border-neutral-500"
                    />

                    {editingError && (
                      <p
                        role="alert"
                        className="mt-3 text-sm text-red-400"
                      >
                        {editingError}
                      </p>
                    )}

                    <div className="mt-4 flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={handleEditCancel}
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                      >
                        Abbrechen
                      </button>

                      <button
                        type="submit"
                        className="inline-flex min-h-10 items-center justify-center rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
                      >
                        Speichern
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <p className="mt-3 whitespace-pre-wrap leading-7 text-neutral-300">
                      {note.content}
                    </p>

                    {note.updatedAt && (
                      <p className="mt-3 text-xs text-neutral-600">
                        Bearbeitet am{" "}
                        {formatNoteDate(
                          note.updatedAt
                        )}
                      </p>
                    )}

                    <div className="mt-5 flex flex-wrap justify-end gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          handleEditStart(note)
                        }
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                      >
                        Bearbeiten
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDelete(note.id)
                        }
                        className="inline-flex min-h-10 items-center justify-center rounded-lg border border-red-900 px-4 py-2 text-sm font-medium text-red-400 transition hover:border-red-700 hover:text-red-300"
                      >
                        Löschen
                      </button>
                    </div>
                  </>
                )}
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}