"use client";

import { ChangeEvent, useRef, useState } from "react";
import { documentStorage } from "@/lib/documentStorage";
import {
  createProjectDocument,
  formatFileSize,
  isSupportedDocument,
} from "@/lib/projectDocuments";
import type { ProjectDocument } from "@/types/document";

type ProjectDocumentUploadProps = {
  projectId: string;
  onDocumentCreated: (document: ProjectDocument) => void;
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
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  function resetSelection() {
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

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    setErrorMessage("");
    setSuccessMessage("");

    const file = event.target.files?.[0] ?? null;

    if (!file) {
      resetSelection();
      return;
    }

    const validationError = validateFile(file);

    if (validationError) {
      setErrorMessage(validationError);
      resetSelection();
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload() {
    setErrorMessage("");
    setSuccessMessage("");

    if (!selectedFile) {
      setErrorMessage("Bitte wähle zuerst eine Datei aus.");
      return;
    }

    const validationError = validateFile(selectedFile);

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    setIsUploading(true);

    try {
      const storageKey = await documentStorage.saveFile(
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
        `„${selectedFile.name}“ wurde erfolgreich hochgeladen.`
      );

      resetSelection();
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Die Datei konnte nicht hochgeladen werden."
      );
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
      <h3 className="text-lg font-semibold text-white">
        Dokument hochladen
      </h3>

      <p className="mt-2 text-sm text-neutral-400">
        PDF-, Office-, Bild-, Text- und Archivdateien bis{" "}
        {formatFileSize(MAXIMUM_FILE_SIZE)}.
      </p>

      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_FILE_TYPES}
        onChange={handleFileChange}
        disabled={isUploading}
        className="mt-5 block w-full cursor-pointer rounded-lg border border-neutral-700 bg-neutral-900 text-sm text-neutral-300 file:mr-4 file:border-0 file:bg-neutral-800 file:px-4 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-neutral-700"
      />

      {selectedFile && (
        <div className="mt-4 rounded-lg border border-neutral-800 bg-neutral-900 p-4">
          <p className="font-medium text-white">
            {selectedFile.name}
          </p>

          <p className="mt-1 text-xs text-neutral-500">
            {formatFileSize(selectedFile.size)}
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="mt-4 rounded-lg border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="mt-4 rounded-lg border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300">
          {successMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleUpload}
        disabled={!selectedFile || isUploading}
        className="mt-5 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:bg-neutral-800 disabled:text-neutral-500"
      >
        {isUploading ? "Wird hochgeladen..." : "Dokument hochladen"}
      </button>
    </div>
  );
}