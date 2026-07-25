import type {
  ProjectDocument,
  ProjectDocumentCategory,
  ProjectDocumentVersion,
} from "@/types/document";

const FILE_EXTENSION_CATEGORY_MAP: Record<
  string,
  ProjectDocumentCategory
> = {
  pdf: "pdf",

  doc: "word",
  docx: "word",

  xls: "excel",
  xlsx: "excel",
  csv: "excel",

  jpg: "image",
  jpeg: "image",
  png: "image",
  gif: "image",
  webp: "image",
  svg: "image",

  zip: "archive",
  rar: "archive",
  "7z": "archive",

  txt: "text",
  md: "text",
};

export function getFileExtension(
  fileName: string
): string {
  const extension = fileName
    .split(".")
    .pop()
    ?.toLowerCase();

  if (
    !extension ||
    extension === fileName.toLowerCase()
  ) {
    return "";
  }

  return extension;
}

export function getDocumentCategory(
  fileName: string
): ProjectDocumentCategory {
  const extension = getFileExtension(fileName);

  return (
    FILE_EXTENSION_CATEGORY_MAP[extension] ??
    "other"
  );
}

export function getDocumentCategoryLabel(
  category: ProjectDocumentCategory
): string {
  switch (category) {
    case "pdf":
      return "PDF";

    case "word":
      return "Word";

    case "excel":
      return "Excel";

    case "image":
      return "Bild";

    case "archive":
      return "Archiv";

    case "text":
      return "Text";

    case "other":
      return "Sonstige Datei";

    default:
      return "Sonstige Datei";
  }
}

export function formatFileSize(
  sizeInBytes: number
): string {
  if (
    !Number.isFinite(sizeInBytes) ||
    sizeInBytes <= 0
  ) {
    return "0 Byte";
  }

  const units = [
    "Byte",
    "KB",
    "MB",
    "GB",
  ];

  const unitIndex = Math.min(
    Math.floor(
      Math.log(sizeInBytes) / Math.log(1024)
    ),
    units.length - 1
  );

  const value =
    sizeInBytes / 1024 ** unitIndex;

  const maximumFractionDigits =
    unitIndex === 0 ? 0 : 2;

  return `${new Intl.NumberFormat("de-DE", {
    maximumFractionDigits,
  }).format(value)} ${units[unitIndex]}`;
}

function createVersionId(): string {
  return `document-version_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

export function createProjectDocument(
  projectId: string,
  file: File,
  storageKey: string,
  uploadedBy = "Dennis"
): ProjectDocument {
  const uploadedAt = new Date().toISOString();

  const firstVersion: ProjectDocumentVersion = {
    id: createVersionId(),
    versionNumber: 1,
    originalName: file.name,
    mimeType:
      file.type || "application/octet-stream",
    size: file.size,
    uploadedBy,
    uploadedAt,
    storageKey,
  };

  return {
    id: `document_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`,
    projectId,
    name: file.name,
    originalName: file.name,
    category: getDocumentCategory(file.name),
    mimeType:
      file.type || "application/octet-stream",
    size: file.size,
    uploadedBy,
    uploadedAt,
    storageKey,
    currentVersionNumber: 1,
    versions: [firstVersion],
  };
}

export function getDocumentVersions(
  document: ProjectDocument
): ProjectDocumentVersion[] {
  if (
    Array.isArray(document.versions) &&
    document.versions.length > 0
  ) {
    return [...document.versions].sort(
      (firstVersion, secondVersion) =>
        secondVersion.versionNumber -
        firstVersion.versionNumber
    );
  }

  if (!document.storageKey) {
    return [];
  }

  return [
    {
      id: `legacy-version_${document.id}`,
      versionNumber: 1,
      originalName:
        document.originalName || document.name,
      mimeType:
        document.mimeType ||
        "application/octet-stream",
      size: document.size,
      uploadedBy: document.uploadedBy,
      uploadedAt: document.uploadedAt,
      storageKey: document.storageKey,
    },
  ];
}

export function createNewDocumentVersion(
  document: ProjectDocument,
  file: File,
  storageKey: string,
  uploadedBy = "Dennis"
): ProjectDocument {
  const existingVersions =
    getDocumentVersions(document);

  const highestVersionNumber =
    existingVersions.reduce(
      (highestVersion, version) =>
        Math.max(
          highestVersion,
          version.versionNumber
        ),
      0
    );

  const uploadedAt = new Date().toISOString();

  const newVersion: ProjectDocumentVersion = {
    id: createVersionId(),
    versionNumber: highestVersionNumber + 1,
    originalName: file.name,
    mimeType:
      file.type || "application/octet-stream",
    size: file.size,
    uploadedBy,
    uploadedAt,
    storageKey,
  };

  return {
    ...document,
    name: file.name,
    originalName: file.name,
    category: getDocumentCategory(file.name),
    mimeType:
      file.type || "application/octet-stream",
    size: file.size,
    uploadedBy,
    uploadedAt,
    storageKey,
    currentVersionNumber:
      newVersion.versionNumber,
    versions: [
      newVersion,
      ...existingVersions,
    ],
  };
}

export function isSupportedDocument(
  fileName: string
): boolean {
  return (
    getDocumentCategory(fileName) !== "other"
  );
}