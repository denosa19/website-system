"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import { documentStorage } from "@/lib/documentStorage";
import {
  createNewDocumentVersion,
  formatFileSize,
  getDocumentVersions,
  isSupportedDocument,
} from "@/lib/projectDocuments";
import type {
  ProjectDocument,
  ProjectDocumentVersion,
} from "@/types/document";

type ProjectDocumentVersionsProps = {
  document: ProjectDocument;
  onDocumentUpdated: (
    document: ProjectDocument
  ) => void;
};

const MAXIMUM_FILE_SIZE = 10 * 1024 * 1024;

const ACCEPTED_FILE_TYPES = [
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".webp",
  ".svg",
  ".zip",
  ".rar",
  ".7z",
  ".txt",
  ".md",
].join(",");

function formatVersionDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProjectDocumentVersions({
  document,
  onDocumentUpdated,
}: ProjectDocumentVersionsProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [isHistoryOpen, setIsHistoryOpen] =
    useState(false);

  const [isUploadOpen, setIsUploadOpen] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [activeVersionId, setActiveVersionId] =
    useState<string | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const versions =
    getDocumentVersions(document);

  function resetFileSelection() {
    setSelectedFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  function validateFile(file: File): string {
    if (!isSupportedDocument(file.name)) {
      return "Dieser Dateityp wird aktuell nicht unterstützt.";
    }

    if (file.size <= 0) {
      return "Die ausgewählte Datei ist leer.";
    }

    if (file.size > MAXIMUM_FILE_SIZE) {
      return `Die Datei darf maximal ${formatFileSize(
        MAXIMUM_FILE_SIZE
      )} groß sein.`;
    }

    return "";
  }

  function handleFileChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    setErrorMessage("");
    setSuccessMessage("");

    const file =
      event.target.files?.[0] ?? null;

    if (!file) {
      resetFileSelection();
      return;
    }

    const validationError =
      validateFile(file);

    if (validationError) {
      setErrorMessage(validationError);
      resetFileSelection();
      return;
    }

    setSelectedFile(file);
  }

  async function handleVersionUpload() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedFile) {
      setErrorMessage(
        "Bitte wähle zuerst eine Datei aus."
      );
      return;
    }

    const validationError =
      validateFile(selectedFile);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setActiveVersionId("upload");

    try {
      const storageKey =
        await documentStorage.saveFile(
          selectedFile,
          document.projectId
        );

      const updatedDocument =
        createNewDocumentVersion(
          document,
          selectedFile,
          storageKey
        );

      onDocumentUpdated(updatedDocument);

      setSuccessMessage(
        `Version ${updatedDocument.currentVersionNumber} wurde erfolgreich hochgeladen.`
      );

      resetFileSelection();
      setIsUploadOpen(false);
      setIsHistoryOpen(true);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Die neue Version konnte nicht gespeichert werden.";

      setErrorMessage(message);
    } finally {
      setActiveVersionId(null);
    }
  }

  async function loadVersionFile(
    version: ProjectDocumentVersion
  ): Promise<Blob | null> {
    setErrorMessage("");

    try {
      const file =
        await documentStorage.getFile(
          version.storageKey
        );

      if (!file) {
        setErrorMessage(
          `Die Datei für Version ${version.versionNumber} wurde im Browser nicht gefunden.`
        );

        return null;
      }

      return file;
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Die Dokumentversion konnte nicht geladen werden.";

      setErrorMessage(message);

      return null;
    }
  }

  async function handleOpenVersion(
    version: ProjectDocumentVersion
  ) {
    setActiveVersionId(version.id);

    try {
      const file =
        await loadVersionFile(version);

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
    } finally {
      setActiveVersionId(null);
    }
  }

  async function handleDownloadVersion(
    version: ProjectDocumentVersion
  ) {
    setActiveVersionId(version.id);

    try {
      const file =
        await loadVersionFile(version);

      if (!file) {
        return;
      }

      const fileUrl =
        window.URL.createObjectURL(file);

      const downloadLink =
        window.document.createElement("a");

      downloadLink.href = fileUrl;
      downloadLink.download =
        version.originalName;

      window.document.body.appendChild(
        downloadLink
      );

      downloadLink.click();
      downloadLink.remove();

      window.URL.revokeObjectURL(fileUrl);
    } finally {
      setActiveVersionId(null);
    }
  }

  return (
    <div className="mt-5 border-t border-neutral-800 pt-5">
      <div className="flex flex-col gap-2 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            setErrorMessage("");
            setSuccessMessage("");
            setIsUploadOpen(
              (currentValue) => !currentValue
            );
          }}
          className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-900"
        >
          Neue Version hochladen
        </button>

        <button
          type="button"
          onClick={() => {
            setErrorMessage("");
            setIsHistoryOpen(
              (currentValue) => !currentValue
            );
          }}
          className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-900"
        >
          {isHistoryOpen
            ? "Versionen ausblenden"
            : `Versionen (${versions.length})`}
        </button>
      </div>

      {errorMessage ? (
        <p
          role="alert"
          className="mt-4 rounded-lg border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300"
        >
          {errorMessage}
        </p>
      ) : null}

      {successMessage ? (
        <p
          role="status"
          className="mt-4 rounded-lg border border-emerald-900/60 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"
        >
          {successMessage}
        </p>
      ) : null}

      {isUploadOpen ? (
        <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 p-4">
          <h4 className="font-semibold text-white">
            Neue Dokumentversion
          </h4>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Die bisherige Version bleibt erhalten.
            Die neue Datei wird als nächste Version
            gespeichert.
          </p>

          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_FILE_TYPES}
            onChange={handleFileChange}
            disabled={
              activeVersionId === "upload"
            }
            className="mt-4 block w-full cursor-pointer rounded-lg border border-neutral-700 bg-neutral-950 text-sm text-neutral-400 file:mr-4 file:cursor-pointer file:border-0 file:bg-neutral-800 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
          />

          {selectedFile ? (
            <div className="mt-3 rounded-lg border border-neutral-800 bg-neutral-950 p-3">
              <p className="break-words text-sm font-medium text-white">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-xs text-neutral-500">
                {formatFileSize(
                  selectedFile.size
                )}
              </p>
            </div>
          ) : null}

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleVersionUpload}
              disabled={
                !selectedFile ||
                activeVersionId === "upload"
              }
              className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
            >
              {activeVersionId === "upload"
                ? "Version wird gespeichert..."
                : "Version hochladen"}
            </button>

            <button
              type="button"
              onClick={() => {
                resetFileSelection();
                setIsUploadOpen(false);
              }}
              disabled={
                activeVersionId === "upload"
              }
              className="rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Abbrechen
            </button>
          </div>
        </div>
      ) : null}

      {isHistoryOpen ? (
        <div className="mt-4 space-y-3">
          {versions.length === 0 ? (
            <p className="rounded-lg border border-dashed border-neutral-700 px-4 py-5 text-sm text-neutral-500">
              Für dieses Dokument sind keine
              gespeicherten Versionen vorhanden.
            </p>
          ) : (
            versions.map((version, index) => {
              const isCurrentVersion =
                index === 0;

              const isActive =
                activeVersionId === version.id;

              return (
                <div
                  key={version.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 p-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-semibold text-white">
                          Version{" "}
                          {version.versionNumber}
                        </h4>

                        {isCurrentVersion ? (
                          <span className="rounded-full border border-emerald-800 bg-emerald-950/40 px-2.5 py-1 text-xs font-medium text-emerald-300">
                            Aktuell
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 break-words text-sm text-neutral-400">
                        {version.originalName}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-xs text-neutral-500">
                        <span>
                          {formatFileSize(
                            version.size
                          )}
                        </span>

                        <span aria-hidden="true">
                          •
                        </span>

                        <time
                          dateTime={
                            version.uploadedAt
                          }
                        >
                          {formatVersionDate(
                            version.uploadedAt
                          )}
                        </time>

                        <span aria-hidden="true">
                          •
                        </span>

                        <span>
                          {version.uploadedBy}
                        </span>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                      <button
                        type="button"
                        onClick={() =>
                          handleOpenVersion(version)
                        }
                        disabled={isActive}
                        className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
                      >
                        {isActive
                          ? "Wird geladen..."
                          : "Öffnen"}
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          handleDownloadVersion(
                            version
                          )
                        }
                        disabled={isActive}
                        className="rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-950 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Herunterladen
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : null}
    </div>
  );
}