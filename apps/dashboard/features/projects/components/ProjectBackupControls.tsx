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
    typeof value.timestamp === "string" &&
    typeof value.projectId === "string" &&
    typeof value.projectTitle === "string" &&
    typeof value.action === "string" &&
    typeof value.title === "string" &&
    typeof value.description === "string" &&
    typeof value.user === "string"
  );
}

function validateBackupContents(backup: BackupFile) {
  const validProjects =
    backup.data.projects.every(
      hasValidProjectBasics
    );

  const validActivities =
    backup.data.activities.every(
      hasValidActivityBasics
    );

  if (!validProjects) {
    return {
      valid: false,
      message:
        "Die Sicherung enthält ungültige oder unvollständige Projektdaten.",
    };
  }

  if (!validActivities) {
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

  return {
    valid: true,
    message: "",
  };
}

function createBackupFileName() {
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

  return `internet-firma-backup_${year}-${month}-${day}_${hours}-${minutes}.json`;
}

export default function ProjectBackupControls({
  projects,
  activities,
}: ProjectBackupControlsProps) {
  const fileInputRef =
    useRef<HTMLInputElement | null>(null);

  const [isImporting, setIsImporting] =
    useState(false);

  function handleExportBackup() {
    const backup = {
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

    const jsonContent = JSON.stringify(
      backup,
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
    downloadLink.download = createBackupFileName();

    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();

    URL.revokeObjectURL(downloadUrl);
  }

  function openImportDialog() {
    fileInputRef.current?.click();
  }

  async function handleImportBackup(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    if (
      file.type !== "application/json" &&
      !file.name.toLowerCase().endsWith(".json")
    ) {
      alert(
        "Bitte eine gültige JSON-Sicherungsdatei auswählen."
      );
      return;
    }

    setIsImporting(true);

    try {
      const fileContent = await file.text();
      const parsedBackup: unknown =
        JSON.parse(fileContent);

      if (!isBackupFile(parsedBackup)) {
        alert(
          "Die Datei ist keine gültige Internet-Firma-Sicherung oder verwendet eine nicht unterstützte Version."
        );
        return;
      }

      const validation =
        validateBackupContents(parsedBackup);

      if (!validation.valid) {
        alert(validation.message);
        return;
      }

      const exportedDate = new Date(
        parsedBackup.exportedAt
      );

      const formattedExportDate = Number.isNaN(
        exportedDate.getTime()
      )
        ? parsedBackup.exportedAt
        : new Intl.DateTimeFormat("de-DE", {
            dateStyle: "medium",
            timeStyle: "short",
          }).format(exportedDate);

      const confirmed = window.confirm(
        [
          "Datensicherung wiederherstellen?",
          "",
          `Sicherung vom: ${formattedExportDate}`,
          `Projekte: ${parsedBackup.data.projects.length}`,
          `Aktivitäten: ${parsedBackup.data.activities.length}`,
          "",
          "Die aktuell gespeicherten Projekte und der Aktivitätsverlauf werden vollständig ersetzt.",
          "Dieser Vorgang kann nicht rückgängig gemacht werden.",
        ].join("\n")
      );

      if (!confirmed) {
        return;
      }

      window.localStorage.setItem(
        PROJECTS_STORAGE_KEY,
        JSON.stringify(parsedBackup.data.projects)
      );

      window.localStorage.setItem(
        ACTIVITIES_STORAGE_KEY,
        JSON.stringify(parsedBackup.data.activities)
      );

      window.alert(
        "Die Datensicherung wurde erfolgreich wiederhergestellt. Das Dashboard wird jetzt neu geladen."
      );

      window.location.reload();
    } catch (error) {
      console.error(
        "Datensicherung konnte nicht importiert werden:",
        error
      );

      alert(
        "Die Datensicherung konnte nicht gelesen werden. Bitte prüfe, ob die JSON-Datei vollständig und unbeschädigt ist."
      );
    } finally {
      setIsImporting(false);
    }
  }

  return (
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
        disabled={isImporting}
        className="min-h-12 rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2 text-sm font-medium text-neutral-200 transition hover:border-neutral-500 hover:bg-neutral-800 hover:text-white disabled:cursor-wait disabled:text-neutral-500"
      >
        {isImporting
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
  );
}