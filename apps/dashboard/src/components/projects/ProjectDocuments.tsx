"use client";

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
}: ProjectDocumentsProps) {
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

  return (
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
            {projectDocuments.map((document) => (
              <article
                key={document.id}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
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
                        {formatFileSize(document.size)}
                      </span>

                      <span aria-hidden="true">
                        •
                      </span>

                      <time
                        dateTime={document.uploadedAt}
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
                  </div>

                  <span className="w-fit shrink-0 rounded-full border border-neutral-700 px-3 py-1 text-xs font-medium text-neutral-400">
                    {getDocumentCategoryLabel(
                      document.category
                    )}
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}