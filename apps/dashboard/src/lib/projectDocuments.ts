import type {
  ProjectDocument,
  ProjectDocumentCategory,
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

export function createProjectDocument(
  projectId: string,
  file: File,
  storageKey: string,
  uploadedBy = "Dennis"
): ProjectDocument {
  const uploadedAt = new Date().toISOString();

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
  };
}

export function isSupportedDocument(
  fileName: string
): boolean {
  return (
    getDocumentCategory(fileName) !== "other"
  );
}