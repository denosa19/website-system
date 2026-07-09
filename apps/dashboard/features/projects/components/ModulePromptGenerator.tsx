"use client";

import { downloadTextFile } from "../../../lib/download";
import type { Project } from "../../../types/project";
import type { ProjectModule } from "../../../types/module";

type Props = {
  project: Project;
  module: ProjectModule;
};

function createModulePrompt(project: Project, module: ProjectModule) {
  return `
Du bist Experte für das Modul "${module.title}".

Projektname:
${project.title}

Kunde:
${project.customer}

Projekttyp:
${project.type}

Aktuelles Modul:
${module.title}

Beschreibung:
${module.description}

Projektstatus:
${project.status}

Aufgabe:

Bearbeite ausschließlich dieses Modul.

Erstelle:

- Analyse
- Verbesserungsvorschläge
- konkrete Umsetzung
- Checkliste
- empfohlene Dateien
- empfohlene Komponenten
- AI Studio Umsetzung

Arbeite modern, performant und SEO-konform.
`.trim();
}

export default function ModulePromptGenerator({
  project,
  module,
}: Props) {
  const prompt = createModulePrompt(project, module);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    alert("Modul-Prompt kopiert.");
  }

  function exportPrompt() {
    downloadTextFile(
      `${project.title}_${module.title}_Prompt.txt`.replace(/\s+/g, "_"),
      prompt
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold">
          KI-Prompt • {module.title}
        </h3>

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

      <pre className="mt-6 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm">
        {prompt}
      </pre>
    </div>
  );
}