"use client";

import { useEffect, useMemo, useState } from "react";
import type { SeoData } from "../../../types/seo";
import GoogleSnippetPreview from "./GoogleSnippetPreview";
import SeoScore from "./SeoScore";

type Props = {
  projectId: string;
  seo: SeoData;
  onSave: (projectId: string, seo: SeoData) => void;
};

function keywordsToText(keywords: string[]) {
  return keywords.join(", ");
}

function textToKeywords(value: string) {
  return value
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

export default function SeoWorkspace({
  projectId,
  seo,
  onSave,
}: Props) {
  const [formData, setFormData] = useState<SeoData>(seo);
  const [secondaryKeywords, setSecondaryKeywords] = useState(
    keywordsToText(seo.secondaryKeywords)
  );
  const [previewDomain, setPreviewDomain] = useState(
    "www.deine-domain.de"
  );
  const [saved, setSaved] = useState(false);

  const currentSeoData = useMemo<SeoData>(
    () => ({
      ...formData,
      secondaryKeywords: textToKeywords(secondaryKeywords),
    }),
    [formData, secondaryKeywords]
  );

  useEffect(() => {
    setFormData(seo);
    setSecondaryKeywords(
      keywordsToText(seo.secondaryKeywords)
    );
    setPreviewDomain("www.deine-domain.de");
    setSaved(false);
  }, [projectId, seo]);

  function updateField<Key extends keyof SeoData>(
    field: Key,
    value: SeoData[Key]
  ) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSave() {
    onSave(projectId, currentSeoData);
    setFormData(currentSeoData);
    setSecondaryKeywords(
      keywordsToText(currentSeoData.secondaryKeywords)
    );
    setSaved(true);
  }

  return (
    <div className="space-y-6">
      <SeoScore seo={currentSeoData} />

      <GoogleSnippetPreview
        seo={currentSeoData}
        domain={previewDomain}
        onDomainChange={setPreviewDomain}
      />

      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-neutral-500">
              Projekt-Arbeitsbereich
            </p>

            <h3 className="mt-1 text-xl font-bold">
              SEO Workspace
            </h3>

            <p className="mt-2 text-sm text-neutral-400">
              Speichere Keywords und Metadaten direkt im
              Projekt.
            </p>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-white px-5 py-2.5 font-semibold text-black transition hover:bg-neutral-200"
          >
            SEO-Daten speichern
          </button>
        </div>

        {saved && (
          <div className="mt-5 rounded-xl border border-green-900 bg-green-950/40 px-4 py-3 text-sm text-green-300">
            SEO-Daten wurden im Projekt gespeichert.
          </div>
        )}

        <div className="mt-6 grid gap-5">
          <label className="grid gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Hauptkeyword
            </span>

            <input
              type="text"
              value={formData.mainKeyword}
              onChange={(event) =>
                updateField(
                  "mainKeyword",
                  event.target.value
                )
              }
              placeholder="Zum Beispiel: Gebäudetechnik Mannheim"
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-neutral-300">
              Nebenkeywords
            </span>

            <input
              type="text"
              value={secondaryKeywords}
              onChange={(event) => {
                setSecondaryKeywords(event.target.value);
                setSaved(false);
              }}
              placeholder="Elektrotechnik, Gebäudeservice, Elektroinstallation"
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600"
            />

            <span className="text-xs text-neutral-500">
              Mehrere Keywords mit Komma trennen.
            </span>
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-neutral-300">
                Meta Title
              </span>

              <span
                className={`text-xs ${
                  formData.metaTitle.length >= 30 &&
                  formData.metaTitle.length <= 60
                    ? "text-green-400"
                    : "text-neutral-500"
                }`}
              >
                {formData.metaTitle.length}/60
              </span>
            </div>

            <input
              type="text"
              value={formData.metaTitle}
              maxLength={60}
              onChange={(event) =>
                updateField("metaTitle", event.target.value)
              }
              placeholder="Seitentitel für Google"
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600"
            />

            <span className="text-xs text-neutral-500">
              Empfohlene Länge: 30 bis 60 Zeichen.
            </span>
          </label>

          <label className="grid gap-2">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-medium text-neutral-300">
                Meta Description
              </span>

              <span
                className={`text-xs ${
                  formData.metaDescription.length >= 120 &&
                  formData.metaDescription.length <= 160
                    ? "text-green-400"
                    : "text-neutral-500"
                }`}
              >
                {formData.metaDescription.length}/160
              </span>
            </div>

            <textarea
              value={formData.metaDescription}
              maxLength={160}
              rows={4}
              onChange={(event) =>
                updateField(
                  "metaDescription",
                  event.target.value
                )
              }
              placeholder="Kurze Beschreibung für die Google-Suchergebnisse"
              className="resize-y rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600"
            />

            <span className="text-xs text-neutral-500">
              Empfohlene Länge: 120 bis 160 Zeichen.
            </span>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-medium text-neutral-300">
              H1-Überschrift
            </span>

            <input
              type="text"
              value={formData.h1}
              onChange={(event) =>
                updateField("h1", event.target.value)
              }
              placeholder="Hauptüberschrift der Startseite"
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-600"
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <div>
                <p className="font-medium text-neutral-200">
                  Robots.txt
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Datei wurde eingerichtet und geprüft.
                </p>
              </div>

              <input
                type="checkbox"
                checked={formData.robots}
                onChange={(event) =>
                  updateField(
                    "robots",
                    event.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>

            <label className="flex cursor-pointer items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <div>
                <p className="font-medium text-neutral-200">
                  Sitemap
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  XML-Sitemap wurde eingerichtet und geprüft.
                </p>
              </div>

              <input
                type="checkbox"
                checked={formData.sitemap}
                onChange={(event) =>
                  updateField(
                    "sitemap",
                    event.target.checked
                  )
                }
                className="h-5 w-5"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}