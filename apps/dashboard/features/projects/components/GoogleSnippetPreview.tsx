"use client";

import type { SeoData } from "../../../types/seo";

type Props = {
  seo: SeoData;
  domain: string;
  onDomainChange: (domain: string) => void;
};

type LengthStatus = {
  label: string;
  className: string;
};

function normalizeDomain(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function getTitleStatus(length: number): LengthStatus {
  if (length === 0) {
    return {
      label: "Meta Title fehlt",
      className:
        "border-red-900 bg-red-950/30 text-red-300",
    };
  }

  if (length < 30) {
    return {
      label: "Meta Title ist zu kurz",
      className:
        "border-yellow-900 bg-yellow-950/30 text-yellow-300",
    };
  }

  if (length > 60) {
    return {
      label: "Meta Title ist zu lang",
      className:
        "border-red-900 bg-red-950/30 text-red-300",
    };
  }

  return {
    label: "Meta Title hat eine gute Länge",
    className:
      "border-green-900 bg-green-950/30 text-green-300",
  };
}

function getDescriptionStatus(length: number): LengthStatus {
  if (length === 0) {
    return {
      label: "Meta Description fehlt",
      className:
        "border-red-900 bg-red-950/30 text-red-300",
    };
  }

  if (length < 120) {
    return {
      label: "Meta Description ist zu kurz",
      className:
        "border-yellow-900 bg-yellow-950/30 text-yellow-300",
    };
  }

  if (length > 160) {
    return {
      label: "Meta Description ist zu lang",
      className:
        "border-red-900 bg-red-950/30 text-red-300",
    };
  }

  return {
    label: "Meta Description hat eine gute Länge",
    className:
      "border-green-900 bg-green-950/30 text-green-300",
  };
}

export default function GoogleSnippetPreview({
  seo,
  domain,
  onDomainChange,
}: Props) {
  const normalizedDomain =
    normalizeDomain(domain) || "www.deine-domain.de";

  const previewTitle =
    seo.metaTitle.trim() || "Seitentitel für Google";

  const previewDescription =
    seo.metaDescription.trim() ||
    "Hier erscheint die Meta Description der Webseite. Sie beschreibt den Inhalt der Seite und soll Nutzer zum Anklicken des Suchergebnisses bewegen.";

  const titleStatus = getTitleStatus(seo.metaTitle.trim().length);
  const descriptionStatus = getDescriptionStatus(
    seo.metaDescription.trim().length
  );

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div>
        <p className="text-sm text-neutral-500">
          Live-Vorschau
        </p>

        <h3 className="mt-1 text-xl font-bold">
          Google-Snippet
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          So könnte die Seite ungefähr in den
          Google-Suchergebnissen erscheinen.
        </p>
      </div>

      <label className="mt-6 grid gap-2">
        <span className="text-sm font-medium text-neutral-300">
          Domain für die Vorschau
        </span>

        <input
          type="text"
          value={domain}
          onChange={(event) => onDomainChange(event.target.value)}
          placeholder="www.deine-domain.de"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600"
        />

        <span className="text-xs text-neutral-500">
          Die Domain dient momentan nur der Vorschau und wird
          noch nicht im Projekt gespeichert.
        </span>
      </label>

      <div className="mt-6 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-xs font-bold text-neutral-600">
              {normalizedDomain.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm text-neutral-800">
                {normalizedDomain}
              </p>

              <p className="truncate text-xs text-neutral-500">
                https://{normalizedDomain}
              </p>
            </div>
          </div>

          <p className="mt-3 cursor-pointer text-xl leading-7 text-[#1a0dab] hover:underline">
            {previewTitle}
          </p>

          <p className="mt-1 text-sm leading-6 text-neutral-600">
            {previewDescription}
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 md:grid-cols-2">
        <div
          className={`rounded-xl border px-4 py-3 text-sm ${titleStatus.className}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">
              {titleStatus.label}
            </span>

            <span className="shrink-0">
              {seo.metaTitle.length}/60
            </span>
          </div>
        </div>

        <div
          className={`rounded-xl border px-4 py-3 text-sm ${descriptionStatus.className}`}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="font-medium">
              {descriptionStatus.label}
            </span>

            <span className="shrink-0">
              {seo.metaDescription.length}/160
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
        <p className="text-sm text-neutral-400">
          Hinweis: Google kann Titel und Beschreibung später
          automatisch anpassen. Die Vorschau zeigt daher nur
          eine ungefähre Darstellung.
        </p>
      </div>
    </div>
  );
}