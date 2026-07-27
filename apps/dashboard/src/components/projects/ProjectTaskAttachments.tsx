"use client";

import type { TaskAttachment } from "@/types/taskAttachment";

type ProjectTaskAttachmentsProps = {
  attachments: TaskAttachment[];
  onUpload: (files: FileList) => void;
  onDelete: (
    attachment: TaskAttachment
  ) => void;
};

function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(
      bytes / 1024
    ).toFixed(1)} KB`;
  }

  return `${(
    bytes /
    1024 /
    1024
  ).toFixed(1)} MB`;
}

function formatDate(
  value: string
): string {
  return new Intl.DateTimeFormat(
    "de-DE",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(new Date(value));
}

export default function ProjectTaskAttachments({
  attachments,
  onUpload,
  onDelete,
}: ProjectTaskAttachmentsProps) {
  return (
    <section className="mt-8 border-t border-neutral-800 pt-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">
          Dateianhänge
        </h3>

        <label className="cursor-pointer rounded-lg bg-white px-4 py-2 text-sm font-semibold text-neutral-950 transition hover:bg-neutral-200">
          Datei hinzufügen

          <input
            hidden
            multiple
            type="file"
            onChange={(event) => {
              if (
                event.target.files &&
                event.target.files
                  .length > 0
              ) {
                onUpload(
                  event.target.files
                );
              }

              event.target.value =
                "";
            }}
          />
        </label>
      </div>

      <div className="mt-5 space-y-3">
        {attachments.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-800 bg-neutral-900/40 p-5 text-sm text-neutral-500">
            Noch keine Dateien
            vorhanden.
          </div>
        ) : (
          attachments.map(
            (attachment) => (
              <article
                key={attachment.id}
                className="flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-900 p-4"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-white">
                    {attachment.name}
                  </p>

                  <p className="mt-1 text-xs text-neutral-500">
                    {formatFileSize(
                      attachment.size
                    )}
                    {" • "}
                    {
                      attachment.uploadedBy
                    }
                    {" • "}
                    {formatDate(
                      attachment.createdAt
                    )}
                  </p>
                </div>

                <div className="flex gap-2">
                  <a
                    href={
                      attachment.dataUrl
                    }
                    download={
                      attachment.name
                    }
                    className="rounded-lg border border-neutral-700 px-3 py-2 text-sm text-neutral-300 transition hover:bg-neutral-800 hover:text-white"
                  >
                    Download
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        attachment
                      )
                    }
                    className="rounded-lg border border-red-900/70 px-3 py-2 text-sm text-red-300 transition hover:bg-red-950/40"
                  >
                    Löschen
                  </button>
                </div>
              </article>
            )
          )
        )}
      </div>
    </section>
  );
}