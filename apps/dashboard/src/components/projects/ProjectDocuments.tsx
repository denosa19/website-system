"use client";

import { useState } from "react";
import { documentStorage } from "@/lib/documentStorage";
import {
  formatFileSize,
  getDocumentCategoryLabel,
} from "@/lib/projectDocuments";
import type { ProjectDocument } from "@/types/document";
import ProjectDocumentUpload from "./ProjectDocumentUpload";

type ProjectDocumentsProps = {
  projectId: string;
  documents: ProjectDocument[];
  onDocumentCreated: (
    document: ProjectDocument
  ) => void;
  onDocumentDeleted: (
    document: ProjectDocument
  ) => void;
};

function formatDocumentDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProjectDocuments({
  projectId,
  documents,
  onDocumentCreated,
  onDocumentDeleted,
}: ProjectDocumentsProps) {
  const [errorMessage, setErrorMessage] =
    useState("");

  const [activeDocumentId, setActiveDocumentId] =
    useState<string | null>(null);

  const [
    documentPendingDeletion,
    setDocumentPendingDeletion,
  ] = useState<ProjectDocument | null>(null);

  const projectDocuments = documents
    .filter(
      (document) =>
        document.projectId === projectId
    )
    .sort(
      (firstDocument, secondDocument) =>
        new Date(
          secondDocument.uploadedAt
        ).getTime() -
        new Date(
          firstDocument.uploadedAt
        ).getTime()
    );

  async function loadDocumentFile(
    document: ProjectDocument
  ): Promise<Blob | null> {
    setErrorMessage("");

    if (!document.storageKey) {
      setErrorMessage(
        `Für „${document.name}“ ist keine gespeicherte Datei vorhanden. Der Eintrag wurde vor der echten Dateispeicherung erstellt.`
      );

      return null;
    }

    try {
      const file = await documentStorage.getFile(
        document.storageKey
      );

      if (!file) {
        setErrorMessage(
          `Die Datei „${document.name}“ wurde im Browser nicht gefunden.`
        );

        return null;
      }

      return file;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Die Datei konnte nicht geladen werden.";

      setErrorMessage(message);

      return null;
    }
  }

  async function handleOpenDocument(
    document: ProjectDocument
  ) {
    setActiveDocumentId(document.id);

    try {
      const file =
        await loadDocumentFile(document);

      if (!file) {
        return;
      }

      const fileUrl =
        window.URL.createObjectURL(file);

      const openLink =
        window.document.createElement("a");

      openLink.href = fileUrl;
      openLink.target = "_blank";
      openLink.rel = "noopener noreferrer";

      window.document.body.appendChild(openLink);
      openLink.click();
      openLink.remove();

      window.setTimeout(() => {
        window.URL.revokeObjectURL(fileUrl);
      }, 60_000);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Das Dokument konnte nicht geöffnet werden.";

      setErrorMessage(message);
    } finally {
      setActiveDocumentId(null);
    }
  }

  async function handleDownloadDocument(
    document: ProjectDocument
  ) {
    setActiveDocumentId(document.id);

    try {
      const file =
        await loadDocumentFile(document);

      if (!file) {
        return;
      }

      const fileUrl =
        window.URL.createObjectURL(file);

      const downloadLink =
        window.document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download =
        document.originalName || document.name;

      window.document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      window.URL.revokeObjectURL(fileUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Das Dokument konnte nicht heruntergeladen werden.";

      setErrorMessage(message);
    } finally {
      setActiveDocumentId(null);
    }
  }

  async function handleDeleteDocument() {
    if (!documentPendingDeletion) {
      return;
    }

    const document = documentPendingDeletion;

    setActiveDocumentId(document.id);
    setErrorMessage("");

    try {
      if (document.storageKey) {
        await documentStorage.deleteFile(
          document.storageKey
        );
      }

      onDocumentDeleted(document);
      setDocumentPendingDeletion(null);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Das Dokument konnte nicht gelöscht werden.";

      setErrorMessage(message);
    } finally {
      setActiveDocumentId(null);
    }
  }

  return (
    <>
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-neutral-500">
              Projektdateien
            </p>

            <h2 className="mt-2 text-2xl font-bold text-white">
              Dokumente
            </h2>
          </div>

          <span className="w-fit rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
            {projectDocuments.length}{" "}
            {projectDocuments.length === 1
              ? "Dokument"
              : "Dokumente"}
          </span>
        </div>

        <div className="mt-8">
          <ProjectDocumentUpload
            projectId={projectId}
            onDocumentCreated={onDocumentCreated}
          />
        </div>

        {errorMessage ? (
          <p
            role="alert"
            className="mt-6 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-6">
          {projectDocuments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 px-5 py-10 text-center">
              <p className="text-sm text-neutral-500">
                Für dieses Projekt wurden noch keine
                Dokumente hinterlegt.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {projectDocuments.map((document) => {
                const isActive =
                  activeDocumentId === document.id;

                return (
                  <article
                    key={document.id}
                    className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words font-semibold text-white">
                          {document.name}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-neutral-500">
                          <span>
                            {getDocumentCategoryLabel(
                              document.category
                            )}
                          </span>

                          <span aria-hidden="true">
                            •
                          </span>

                          <span>
                            {formatFileSize(
                              document.size
                            )}
                          </span>

                          <span aria-hidden="true">
                            •
                          </span>

                          <time
                            dateTime={
                              document.uploadedAt
                            }
                          >
                            {formatDocumentDate(
                              document.uploadedAt
                            )}
                          </time>
                        </div>

                        <p className="mt-3 text-sm text-neutral-400">
                          Hochgeladen von{" "}
                          {document.uploadedBy}
                        </p>

                        {!document.storageKey ? (
                          <p className="mt-3 text-xs text-amber-400">
                            Für diesen älteren Eintrag
                            ist kein Dateiinhalt
                            gespeichert.
                          </p>
                        ) : null}
                      </div>

                      <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <button
                          type="button"
                          onClick={() =>
                            handleOpenDocument(
                              document
                            )
                          }
                          disabled={
                            isActive ||
                            !document.storageKey
                          }
                          className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
                        >
                          {isActive
                            ? "Wird geladen..."
                            : "Öffnen"}
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleDownloadDocument(
                              document
                            )
                          }
                          disabled={
                            isActive ||
                            !document.storageKey
                          }
                          className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Herunterladen
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setErrorMessage("");
                            setDocumentPendingDeletion(
                              document
                            );
                          }}
                          disabled={isActive}
                          className="rounded-lg border border-red-900/70 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:border-red-800 hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Löschen
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {documentPendingDeletion ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 px-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-document-title"
        >
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.14em] text-red-400">
              Dokument löschen
            </p>

            <h2
              id="delete-document-title"
              className="mt-3 text-xl font-bold text-white"
            >
              Dokument wirklich löschen?
            </h2>

            <p className="mt-4 break-words leading-7 text-neutral-400">
              Das Dokument{" "}
              <span className="font-medium text-neutral-200">
                „{documentPendingDeletion.name}“
              </span>{" "}
              wird dauerhaft aus diesem Browser und
              aus dem Projekt entfernt.
            </p>

            <p className="mt-3 text-sm text-neutral-500">
              Dieser Vorgang kann nicht rückgängig
              gemacht werden.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() =>
                  setDocumentPendingDeletion(null)
                }
                disabled={
                  activeDocumentId ===
                  documentPendingDeletion.id
                }
                className="rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Abbrechen
              </button>

              <button
                type="button"
                onClick={handleDeleteDocument}
                disabled={
                  activeDocumentId ===
                  documentPendingDeletion.id
                }
                className="rounded-lg bg-red-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-red-500 disabled:cursor-not-allowed disabled:bg-red-950 disabled:text-red-500"
              >
                {activeDocumentId ===
                documentPendingDeletion.id
                  ? "Wird gelöscht..."
                  : "Endgültig löschen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}