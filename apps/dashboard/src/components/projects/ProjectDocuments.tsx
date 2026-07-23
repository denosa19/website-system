"use client";

import type { ProjectDocument } from "@/types/document";
import {
  formatFileSize,
  getDocumentCategoryLabel,
} from "@/lib/projectDocuments";

type ProjectDocumentsProps = {
  projectId: string;
  documents: ProjectDocument[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export default function ProjectDocuments({
  projectId,
  documents,
}: ProjectDocumentsProps) {
  const projectDocuments = documents
    .filter(
      (document) =>
        document.projectId === projectId
    )
    .sort(
      (a, b) =>
        new Date(b.uploadedAt).getTime() -
        new Date(a.uploadedAt).getTime()
    );

  return (
    <section className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.14em] text-neutral-500">
            Dateien
          </p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Dokumente
          </h2>
        </div>

        <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
          {projectDocuments.length}
        </span>
      </div>

      <div className="mt-8">
        {projectDocuments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 py-10 text-center">
            <p className="text-neutral-500">
              Noch keine Dokumente vorhanden.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {projectDocuments.map(
              (document) => (
                <article
                  key={document.id}
                  className="rounded-xl border border-neutral-800 bg-neutral-950 p-5"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div>
                      <h3 className="font-semibold text-white">
                        {document.originalName}
                      </h3>

                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-neutral-500">
                        <span>
                          {getDocumentCategoryLabel(
                            document.category
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          {formatFileSize(
                            document.size
                          )}
                        </span>

                        <span>•</span>

                        <span>
                          {formatDate(
                            document.uploadedAt
                          )}
                        </span>
                      </div>

                      <p className="mt-2 text-sm text-neutral-400">
                        Hochgeladen von{" "}
                        {document.uploadedBy}
                      </p>
                    </div>
                  </div>
                </article>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}