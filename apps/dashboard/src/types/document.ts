export type ProjectDocumentCategory =
  | "pdf"
  | "word"
  | "excel"
  | "image"
  | "archive"
  | "text"
  | "other";

export interface ProjectDocumentVersion {
  id: string;
  versionNumber: number;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  storageKey: string;
}

export interface ProjectDocument {
  id: string;
  projectId: string;
  name: string;
  originalName: string;
  category: ProjectDocumentCategory;
  mimeType: string;
  size: number;
  uploadedBy: string;
  uploadedAt: string;
  storageKey?: string;
  currentVersionNumber?: number;
  versions?: ProjectDocumentVersion[];
}