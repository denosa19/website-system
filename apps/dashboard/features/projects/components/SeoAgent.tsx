"use client";

import { useMemo } from "react";
import { downloadTextFile } from "../../../lib/download";
import type { Project } from "../../../types/project";
import type { ProjectModule } from "../../../types/module";

type Props = {
  project: Project;
  module: ProjectModule;
};

function createSeoPrompt(project: Project, module: ProjectModule) {
  return `
Du bist ein erfahrener SEO-Stratege für professionelle Unternehmenswebsites.

Projekt:
${project.title}

Kunde:
${project.customer}

Projekttyp:
${project.type}

Aktives Modul:
${module.title}

Aufgabe:
Erstelle eine vollständige SEO-Grundstrategie für dieses Website-Projekt.

Bitte liefere:

1. Hauptkeyword
2. Nebenkeywords
3. Lokale Keywords
4. Meta Title für die Startseite
5. Meta Description für die Startseite
6. H1-Vorschlag
7. H2-Struktur
8. FAQ-Fragen
9. Interne Verlinkung
10. SEO-Checkliste vor Go-Live

Wichtig:
- Schreibe für den deutschen Markt.
- Priorisiere lokale Sichtbarkeit.
- Texte sollen professionell, vertrauenswürdig und verkaufsstark wirken.
- Berücksichtige den Projekttyp "${project.type}".
`.trim();
}

export default function SeoAgent({ project, module }: Props) {
  const prompt = useMemo(
    () => createSeoPrompt(project, module),
    [project, module]
  );

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    alert("SEO-Agent-Prompt kopiert.");
  }

  function exportPrompt() {
    downloadTextFile(
      `${project.title}_${module.title}_SEO_Agent.txt`.replace(/\s+/g, "_"),
      prompt
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-neutral-500">Agent</p>

          <h3 className="mt-1 text-xl font-bold">
            SEO-Agent
          </h3>

          <p className="mt-2 text-sm text-neutral-400">
            Erstellt eine SEO-Grundstrategie für dieses Projektmodul.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={copyPrompt}
            className="rounded-xl bg-white px-4 py-2 font-semibold text-black"
          >
            Kopieren
          </button>

          <button
            onClick={exportPrompt}
            className="rounded-xl border border-neutral-700 px-4 py-2"
          >
            Export
          </button>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">Output</p>
          <p className="mt-2 font-semibold">SEO-Strategie</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">Fokus</p>
          <p className="mt-2 font-semibold">Lokale Sichtbarkeit</p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <p className="text-sm text-neutral-500">Status</p>
          <p className="mt-2 font-semibold">Bereit</p>
        </div>
      </div>

      <pre className="mt-6 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
        {prompt}
      </pre>
    </div>
  );
}