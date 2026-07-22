"use client";

import {
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import type { ProjectActivity } from "../../../types/activity";
import type { Project } from "../../../types/project";

type ProjectBackupControlsProps = {
  projects: Project[];
  activities: ProjectActivity[];
};

type BackupFile = {
  format: string;
  version: number;
  exportedAt: string;
  summary: {
    projects: number;
    activities: number;
  };
  data: {
    projects: unknown[];
    activities: unknown[];
  };
};

type PendingImport = {
  fileName: string;
  backup: BackupFile;
};

type ImportMessage = {
  type: "success" | "error";
  text: string;
} | null;

const PROJECT_BACKUP_FORMAT =
  "internet-firma-project-backup";

const PROJECT_BACKUP_VERSION = 1;

const PROJECTS_STORAGE_KEY =
  "internet-firma-projects";

const ACTIVITIES_STORAGE_KEY =
  "internet-firma-project-activities";

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isBackupFile(
  value: unknown
): value is BackupFile {
  if (!isRecord(value)) {
    return false;
  }

  if (
    value.format !== PROJECT_BACKUP_FORMAT ||
    value.version !== PROJECT_BACKUP_VERSION ||
    typeof value.exportedAt !== "string"
  ) {
    return false;
  }

  if (
    !isRecord(value.summary) ||
    typeof value.summary.projects !== "number" ||
    typeof value.summary.activities !== "number"
  ) {
    return false;
  }

  if (
    !isRecord(value.data) ||
    !Array.isArray(value.data.projects) ||
    !Array.isArray(value.data.activities)
  ) {
    return false;
  }

  return true;
}

function hasValidProjectBasics(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.title === "string" &&
    value.title.trim().length > 0 &&
    typeof value.customer === "string" &&
    value.customer.trim().length > 0
  );
}

function hasValidActivityBasics(value: unknown) {
  return (
    isRecord(value) &&
    typeof value.id === "string" &&
    value.id.trim().length > 0 &&
    typeof value.timestamp === "string" &&
    value.timestamp.trim().length > 0 &&
    typeof value.projectId === "string" &&
    value.projectId.trim().length > 0 &&
    typeof value.projectTitle === "string" &&
    typeof value.action === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.user === "string"
  );
}

function validateBackupContents(backup: BackupFile) {
  if (
    !Number.isInteger(backup.summary.projects) ||
    backup.summary.projects < 0
  ) {
    return {
      valid: false,
      message:
        "Die angegebene Projektanzahl ist ungültig.",
    };
  }

  if (
    !Number.isInteger(backup.summary.activities) ||
    backup.summary.activities < 0
  ) {
    return {
      valid: false,
      message:
        "Die angegebene Aktivitätsanzahl ist ungültig.",
    };
  }

  if (
    !backup.data.projects.every(
      hasValidProjectBasics
    )
  ) {
    return {
      valid: false,
      message:
        "Die Sicherung enthält ungültige oder unvollständige Projektdaten.",
    };
  }

  if (
    !backup.data.activities.every(
      hasValidActivityBasics
    )
  ) {
    return {
      valid: false,
      message:
        "Die Sicherung enthält ungültige oder unvollständige Aktivitäten.",
    };
  }

  if (
    backup.summary.projects !==
    backup.data.projects.length
  ) {
    return {
      valid: false,
      message:
        "Die Projektanzahl der Sicherung ist widersprüchlich.",
    };
  }

  if (
    backup.summary.activities !==
    backup.data.activities.length
  ) {
    return {
      valid: false,
      message:
        "Die Aktivitätsanzahl der Sicherung ist widersprüchlich.",
    };
  }

  const projectIds = backup.data.projects
    .filter(isRecord)
    .map((project) => project.id)
    .filter(
      (projectId): projectId is string =>
        typeof projectId === "string"
    );

  if (
    new Set(projectIds).size !== projectIds.length
  ) {
    return {
      valid: false,
      message:
        "Die Sicherung enthält mehrfach verwendete Projekt-IDs.",
    };
  }

  const activityIds = backup.data.activities
    .filter(isRecord)
    .map((activity) => activity.id)
    .filter(
      (activityId): activityId is string =>
        typeof activityId === "string"
    );

  if (
    new Set(activityIds).size !== activityIds.length
  ) {
    return {
      valid: false,
      message:
        "Die Sicherung enthält mehrfach verwendete Aktivitäts-IDs.",
    };
  }

  return {
    valid: true,
    message: "",
  };
}

function createFileTimestamp() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(
    2,
    "0"
  );
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(
    2,
    "0"
  );
  const seconds = String(now.getSeconds()).padStart(
    2,
    "0"
  );

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

function createBackupFileName(
  prefix = "internet-firma-backup"
) {
  return `${prefix}_${createFileTimestamp()}.json`;
}

function createBackupData(
  projects: Project[],
  activities: ProjectActivity[]
) {
  return {
    format: PROJECT_BACKUP_FORMAT,
    version: PROJECT_BACKUP_VERSION,
    exportedAt: new Date().toISOString(),
    summary: {
      projects: projects.length,
      activities: activities.length,
    },
    data: {
      projects,
      activities,
    },
  };
}

function downloadJsonFile(
  data: unknown,
  fileName: string
) {
  const jsonContent = JSON.stringify(
    data,
    null,
    2
  );

  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const downloadLink =
    document.createElement("a");

  downloadLink.href = downloadUrl;
  downloadLink.download = fileName;

  document.body.appendChild(downloadLink);
  downloadLink.click();
  downloadLink.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(downloadUrl);
  }, 0);
}

function formatBackupDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export default function ProjectBackupControls({
  projects,
  activities,
}: ProjectBackupControlsProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [isReadingFile, setIsReadingFile] =
    useState(false);

  const [isRestoring, setIsRestoring] =
    useState(false);

  const [pendingImport, setPendingImport] =
    useState<PendingImport | null>(null);

  const [importMessage, setImportMessage] =
    useState<ImportMessage>(null);

  function handleExportBackup() {
    const backup = createBackupData(
      projects,
      activities
    );

    downloadJsonFile(
      backup,
      createBackupFileName()
    );
  }

  function openImportDialog() {
    setImportMessage(null);
    fileInputRef.current?.click();
  }

  function closeImportPreview() {
    if (isRestoring) {
      return;
    }

    setPendingImport(null);
  }

  async function handleImportBackup(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    setImportMessage(null);

    if (
      file.type !== "application/json" &&
      !file.name.toLowerCase().endsWith(".json")
    ) {
      setImportMessage({
        type: "error",
        text: "Bitte eine gültige JSON-Sicherungsdatei auswählen.",
      });

      return;
    }

    setIsReadingFile(true);

    try {
      const fileContent = await file.text();
      const parsedBackup: unknown =
        JSON.parse(fileContent);

      if (!isBackupFile(parsedBackup)) {
        setImportMessage({
          type: "error",
          text: "Die Datei ist keine gültige Internet-Firma-Sicherung oder verwendet eine nicht unterstützte Version.",
        });

        return;
      }

      const validation =
        validateBackupContents(parsedBackup);

      if (!validation.valid) {
        setImportMessage({
          type: "error",
          text: validation.message,
        });

        return;
      }

      setPendingImport({
        fileName: file.name,
        backup: parsedBackup,
      });
    } catch (error) {
      console.error(
        "Datensicherung konnte nicht gelesen werden:",
        error
      );

      setImportMessage({
        type: "error",
        text: "Die Sicherung konnte nicht gelesen werden. Bitte prüfe, ob die JSON-Datei vollständig und unbeschädigt ist.",
      });
    } finally {
      setIsReadingFile(false);
    }
  }

  function handleRestoreBackup() {
    if (!pendingImport || isRestoring) {
      return;
    }

    setIsRestoring(true);
    setImportMessage(null);

    try {
      const currentBackup = createBackupData(
        projects,
        activities
      );

      downloadJsonFile(
        currentBackup,
        createBackupFileName(
          "internet-firma-vor-wiederherstellung"
        )
      );

      window.localStorage.setItem(
        PROJECTS_STORAGE_KEY,
        JSON.stringify(
          pendingImport.backup.data.projects
        )
      );

      window.localStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(
          pendingImport.backup.data.activities
        )
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Datensicherung konnte nicht wiederhergestellt werden:",
        error
      );

      setImportMessage({
        type: "error",
        text: "Die Sicherung konnte nicht wiederhergestellt werden. Die vorhandenen Daten wurden möglicherweise nicht vollständig ersetzt.",
      });

      setIsRestoring(false);
    }
  }

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={handleExportBackup}
          disabled={
            projects.length === 0 &&
            activities.length === 0
          }
          className="min-h-12 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:border-neutral-800 disabled:text-neutral-600 disabled:hover:bg-neutral-900"
        >
          Sicherung exportieren
        </button>

        <button
          type="button"
          onClick={openImportDialog}
          disabled={isReadingFile || isRestoring}
          className="min-h-12 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white disabled:cursor-wait disabled:text-neutral-500"
        >
          {isReadingFile
            ? "Sicherung wird geprüft …"
            : "Sicherung importieren"}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleImportBackup}
          className="hidden"
        />
      </div>

      {importMessage ? (
        <div
          role={
            importMessage.type === "error"
              ? "alert"
              : "status"
          }
          className={`fixed bottom-6 right-6 z-50 max-w-md rounded-xl border px-5 py-4 text-sm shadow-2xl ${
            importMessage.type === "error"
              ? "border-red-500/40 bg-red-950 text-red-200"
              : "border-emerald-500/40 bg-emerald-950 text-emerald-200"
          }`}
        >
          <div className="flex items-start gap-4">
            <p className="leading-6">
              {importMessage.text}
            </p>

            <button
              type="button"
              onClick={() =>
                setImportMessage(null)
              }
              aria-label="Meldung schließen"
              className="shrink-0 text-lg leading-none opacity-70 transition hover:opacity-100"
            >
              ×
            </button>
          </div>
        </div>
      ) : null}

      {pendingImport ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="backup-import-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-950 shadow-2xl">
            <div className="border-b border-neutral-800 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    id="backup-import-title"
                    className="text-xl font-bold text-white"
                  >
                    Datensicherung wiederherstellen
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-neutral-400">
                    Prüfe den neuen Stand, bevor die
                    aktuellen Daten ersetzt werden.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeImportPreview}
                  disabled={isRestoring}
                  aria-label="Import abbrechen"
                  className="rounded-lg px-2 py-1 text-2xl leading-none text-neutral-500 transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="space-y-6 px-6 py-6">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-4">
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                  Ausgewählte Datei
                </p>

                <p className="mt-2 break-all text-sm font-medium text-white">
                  {pendingImport.fileName}
                </p>

                <p className="mt-2 text-xs text-neutral-500">
                  Sicherung vom{" "}
                  {formatBackupDate(
                    pendingImport.backup.exportedAt
                  )}
                </p>

                <p className="mt-1 text-xs text-neutral-600">
                  Formatversion{" "}
                  {pendingImport.backup.version}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                    Aktueller Stand
                  </p>

                  <dl className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-sm text-neutral-400">
                        Projekte
                      </dt>

                      <dd className="text-lg font-bold text-white">
                        {projects.length}
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-sm text-neutral-400">
                        Aktivitäten
                      </dt>

                      <dd className="text-lg font-bold text-white">
                        {activities.length}
                      </dd>
                    </div>
                  </dl>
                </div>

                <div className="rounded-xl border border-white/20 bg-white/5 p-5">
                  <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-400">
                    Neuer Stand
                  </p>

                  <dl className="mt-4 space-y-3">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-sm text-neutral-300">
                        Projekte
                      </dt>

                      <dd className="text-lg font-bold text-white">
                        {
                          pendingImport.backup.data
                            .projects.length
                        }
                      </dd>
                    </div>

                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-sm text-neutral-300">
                        Aktivitäten
                      </dt>

                      <dd className="text-lg font-bold text-white">
                        {
                          pendingImport.backup.data
                            .activities.length
                        }
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-sm font-semibold text-amber-200">
                  Die aktuellen Daten werden vollständig
                  ersetzt.
                </p>

                <p className="mt-2 text-xs leading-5 text-amber-200/70">
                  Vor der Wiederherstellung wird
                  automatisch eine separate Sicherung des
                  aktuellen Stands heruntergeladen.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-3 border-t border-neutral-800 px-6 py-5 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={closeImportPreview}
                disabled={isRestoring}
                className="min-h-11 rounded-xl border border-neutral-700 px-4 py-2 text-sm font-medium text-neutral-300 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-600"
              >
                Abbrechen
              </button>

              <button
                type="button"
                onClick={handleRestoreBackup}
                disabled={isRestoring}
                className="min-h-11 rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-wait disabled:bg-neutral-600 disabled:text-neutral-300"
              >
                {isRestoring
                  ? "Wiederherstellung läuft …"
                  : "Sicherung wiederherstellen"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}