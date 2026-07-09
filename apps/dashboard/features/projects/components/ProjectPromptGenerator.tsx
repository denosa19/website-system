import type { Project } from "../../../types/project";

type Props = {
  project: Project;
};

function createPrompt(project: Project) {
  return `
Erstelle eine moderne, professionelle Website für folgendes Projekt:

Projektname:
${project.title}

Kunde:
${project.customer}

Projekttyp:
${project.type}

Status:
${project.status}

Ziel:
Eine schnelle, responsive, SEO-optimierte Website mit klarem Design und professioneller Wirkung.

Pflichtbereiche:
${project.tasks.map((task) => `- ${task.title}`).join("\n")}

Technische Anforderungen:
- Responsive Design
- Mobile First
- SEO-Grundstruktur
- Schnelle Ladezeiten
- Saubere Navigation
- Kontaktmöglichkeit
- Impressum und Datenschutz berücksichtigen

Designrichtung:
Modern, vertrauenswürdig, klar, hochwertig und passend zur Branche.

Ausgabe:
Erstelle eine vollständige Website-Struktur mit Seiten, Sektionen, Textvorschlägen und konkreten Umsetzungshinweisen.
`.trim();
}

export default function ProjectPromptGenerator({ project }: Props) {
  const prompt = createPrompt(project);

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    alert("Prompt wurde kopiert.");
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">AI-Studio-Prompt</h3>
          <p className="mt-2 text-sm text-neutral-400">
            Automatisch aus Projektdaten und Checkliste generiert.
          </p>
        </div>

        <button
          onClick={copyPrompt}
          className="rounded-xl bg-white px-4 py-2 text-sm font-semibold text-black"
        >
          Prompt kopieren
        </button>
      </div>

      <pre className="mt-6 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
        {prompt}
      </pre>
    </div>
  );
}