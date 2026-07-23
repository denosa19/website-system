"use client";

import {
  type ChangeEvent,
  useRef,
  useState,
} from "react";
import { documentStorage } from "@/lib/documentStorage";
import {
  createProjectDocument,
  formatFileSize,
  isSupportedDocument,
} from "@/lib/projectDocuments";
import type { ProjectDocument } from "@/types/document";

type ProjectDocumentUploadProps = {
  projectId: string;
  onDocumentCreated: (
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

export default function ProjectDocumentUpload({
  projectId,
  onDocumentCreated,
}: ProjectDocumentUploadProps) {
  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  const [isUploading, setIsUploading] =
    useState(false);

  function resetMessages() {
    setErrorMessage("");
    setSuccessMessage("");
  }

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
    resetMessages();

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

  async function handleDocumentUpload() {
    resetMessages();

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

    setIsUploading(true);

    try {
      const storageKey =
        await documentStorage.saveFile(
          selectedFile,
          projectId
        );

      const document = createProjectDocument(
        projectId,
        selectedFile,
        storageKey
      );

      onDocumentCreated(document);

      setSuccessMessage(
        `„${selectedFile.name}“ wurde gespeichert und dem Projekt hinzugefügt.`
      );

      resetFileSelection();
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Die Datei konnte nicht gespeichert werden.";

      setErrorMessage(message);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Dokument hinzufügen
        </h3>

        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Die Datei wird lokal im Browser
          gespeichert und bleibt auch nach dem
          Neuladen verfügbar.
        </p>
      </div>

      <div className="mt-5">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_FILE_TYPES}
          onChange={handleFileChange}
          disabled={isUploading}
          className="block w-full cursor-pointer rounded-lg border border-neutral-700 bg-neutral-900 text-sm text-neutral-400 file:mr-4 file:cursor-pointer file:border-0 file:bg-neutral-800 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700 disabled:cursor-not-allowed disabled:opacity-60"
        />
      </div>

      {selectedFile ? (
        <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="break-words text-sm font-medium text-white">
            {selectedFile.name}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
      ) : null}

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

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={handleDocumentUpload}
          disabled={
            !selectedFile || isUploading
          }
          className="rounded-lg bg-white px-4 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
        >
          {isUploading
            ? "Datei wird gespeichert..."
            : "Dokument hinzufügen"}
        </button>

        {selectedFile ? (
          <button
            type="button"
            onClick={() => {
              resetMessages();
              resetFileSelection();
            }}
            disabled={isUploading}
            className="rounded-lg border border-neutral-700 px-4 py-3 text-sm font-medium text-neutral-300 transition hover:border-neutral-600 hover:bg-neutral-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Auswahl entfernen
          </button>
        ) : null}
      </div>

      <p className="mt-4 text-xs leading-5 text-neutral-600">
        Unterstützt: PDF, Word, Excel, CSV,
        Bilder, ZIP, RAR, 7Z, TXT und Markdown.
        Maximale Dateigröße:{" "}
        {formatFileSize(MAXIMUM_FILE_SIZE)}.
      </p>
    </div>
  );
}