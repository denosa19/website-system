"use client";

import type { Project } from "../../../types/project";
import { downloadTextFile } from "../../../lib/download";

type Props = {
  project: Project;
};

function createPrompt(project: Project) {
  return `
Erstelle eine moderne, professionelle Website.

Projektname:
${project.title}

Kunde:
${project.customer}

Projekttyp:
${project.type}

Projektstatus:
${project.status}

Projektaufgaben:
${project.tasks.map((task) => `- ${task.title}`).join("\n")}

Anforderungen:

- Responsive
- Mobile First
- SEO optimiert
- Hohe Performance
- Moderne UI
- Saubere Komponentenstruktur
- Skalierbar
- Professionelles Design

Erstelle:

- komplette Seitenstruktur
- Komponenten
- Designideen
- SEO
- Texte
- CTA
- Navigation
- Footer
- Kontaktformular

Nutze aktuelle Best Practices.
`.trim();
}

export default function ProjectPromptGenerator({ project }: Props) {
  const prompt = createPrompt(project);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    alert("Prompt kopiert.");
  }

  function exportPrompt() {
    downloadTextFile(
      `${project.title.replace(/\s+/g, "_")}_Prompt.txt`,
      prompt
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between">

        <div>
          <h3 className="text-xl font-bold">
            AI Studio Prompt
          </h3>

          <p className="mt-2 text-sm text-neutral-400">
            Automatisch generiert
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

      <pre className="mt-6 max-h-[500px] overflow-auto whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-950 p-5 text-sm text-neutral-300">
        {prompt}
      </pre>
    </div>
  );
}