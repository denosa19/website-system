"use client";

import { useState } from "react";
import type { Project } from "../../../types/project";
import { downloadTextFile } from "../../../lib/download";

type Props = {
  project: Project;
};

export default function WebsiteWizard({ project }: Props) {
  const [formData, setFormData] = useState({
    colors: "",
    style: "modern",
    targetAudience: "",
    specialFeatures: "",
    tone: "professionell",
  });

  function update(field: string, value: string) {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  }

  const prompt = `
Erstelle eine professionelle Website mit folgenden Projektdaten:

Projekt:
${project.title}

Kunde:
${project.customer}

Projekttyp:
${project.type}

Status:
${project.status}

Designfarben:
${formData.colors || "Bitte passende Farben vorschlagen."}

Designstil:
${formData.style}

Zielgruppe:
${formData.targetAudience || "Bitte anhand der Branche ableiten."}

Ton der Texte:
${formData.tone}

Besondere Funktionen:
${formData.specialFeatures || "Keine besonderen Funktionen angegeben."}

Projektaufgaben:
${project.tasks.map((task) => `- ${task.title}`).join("\n")}

Anforderungen:
- Responsive Design
- Mobile First
- SEO-Grundstruktur
- Schnelle Ladezeiten
- Vertrauenswürdiger Unternehmensauftritt
- Klare Call-to-Actions
- Saubere Seitenstruktur
- Professionelle Texte
- Kontaktmöglichkeiten
- Impressum und Datenschutz berücksichtigen

Erstelle:
1. Seitenstruktur
2. Startseitenaufbau
3. Leistungsbereiche
4. Textvorschläge
5. SEO-Titel und Meta Description
6. CTA-Vorschläge
7. Designhinweise
8. Technische Umsetzungshinweise für AI Studio
`.trim();

  async function copyPrompt() {
    await navigator.clipboard.writeText(prompt);
    alert("Wizard-Prompt kopiert.");
  }

  function exportPrompt() {
    downloadTextFile(
      `${project.title.replace(/\s+/g, "_")}_Website_Wizard_Prompt.txt`,
      prompt
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div>
        <h3 className="text-xl font-bold">Website Wizard</h3>

        <p className="mt-2 text-sm text-neutral-400">
          Ergänze Projektdetails und erzeuge daraus einen besseren AI-Studio-Prompt.
        </p>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <input
          value={formData.colors}
          onChange={(event) => update("colors", event.target.value)}
          placeholder="Farben, z. B. Blau, Weiß, Anthrazit"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
        />

        <select
          value={formData.style}
          onChange={(event) => update("style", event.target.value)}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
        >
          <option value="modern">Modern</option>
          <option value="minimalistisch">Minimalistisch</option>
          <option value="premium">Premium</option>
          <option value="sportlich">Sportlich</option>
          <option value="technisch">Technisch</option>
          <option value="klassisch">Klassisch</option>
        </select>

        <input
          value={formData.targetAudience}
          onChange={(event) => update("targetAudience", event.target.value)}
          placeholder="Zielgruppe"
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
        />

        <select
          value={formData.tone}
          onChange={(event) => update("tone", event.target.value)}
          className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none"
        >
          <option value="professionell">Professionell</option>
          <option value="locker">Locker</option>
          <option value="vertrauenswürdig">Vertrauenswürdig</option>
          <option value="direkt">Direkt</option>
          <option value="premium">Premium</option>
        </select>

        <textarea
          value={formData.specialFeatures}
          onChange={(event) => update("specialFeatures", event.target.value)}
          placeholder="Besondere Funktionen, z. B. Buchungssystem, Mitgliederbereich, Shop..."
          className="min-h-32 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 outline-none md:col-span-2"
        />
      </div>

      <div className="mt-6 flex gap-3">
        <button
          onClick={copyPrompt}
          className="rounded-xl bg-white px-5 py-3 font-semibold text-black"
        >
          Wizard-Prompt kopieren
        </button>

        <button
          onClick={exportPrompt}
          className="rounded-xl border border-neutral-700 px-5 py-3"
        >
          Exportieren
        </button>
      </div>

      <pre className="mt-6 max-h-96 overflow-auto whitespace-pre-wrap rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-sm text-neutral-300">
        {prompt}
      </pre>
    </div>
  );
}