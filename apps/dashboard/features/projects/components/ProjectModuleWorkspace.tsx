import type { ProjectModule } from "../../../types/module";

type Props = {
  module: ProjectModule | null;
};

export default function ProjectModuleWorkspace({ module }: Props) {
  if (!module) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-6 text-neutral-400">
        Wähle ein Website-Modul aus.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <div>
        <p className="text-sm text-neutral-500">Aktives Modul</p>
        <h3 className="mt-1 text-2xl font-bold">{module.title}</h3>
        <p className="mt-2 text-neutral-400">{module.description}</p>
      </div>

      <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <h4 className="font-semibold">Nächste Schritte</h4>

        <ul className="mt-4 space-y-2 text-sm text-neutral-300">
          <li>• Anforderungen prüfen</li>
          <li>• passenden KI-Prompt vorbereiten</li>
          <li>• Ergebnis dokumentieren</li>
          <li>• Modulstatus aktualisieren</li>
        </ul>
      </div>

      <div className="mt-6">
        <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
          KI-Prompt für {module.title} vorbereiten
        </button>
      </div>
    </div>
  );
}