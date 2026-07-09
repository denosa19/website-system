"use client";

import type { Project } from "../../../types/project";
import type { ProjectModule } from "../../../types/module";
import ModulePromptGenerator from "./ModulePromptGenerator";

type Props = {
  project: Project;
  module: ProjectModule | null;
};

export default function ProjectModuleWorkspace({
  project,
  module,
}: Props) {
  if (!module) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-6 text-neutral-400">
        Wähle ein Website-Modul aus.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <div>
          <p className="text-sm text-neutral-500">Aktives Modul</p>

          <h3 className="mt-1 text-2xl font-bold">
            {module.title}
          </h3>

          <p className="mt-2 text-neutral-400">
            {module.description}
          </p>
        </div>

        <div className="mt-6 rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <h4 className="font-semibold">Nächste Schritte</h4>

          <ul className="mt-4 space-y-2 text-sm text-neutral-300">
            <li>• Anforderungen analysieren</li>
            <li>• KI-Prompt generieren</li>
            <li>• Ergebnisse dokumentieren</li>
            <li>• Modul abschließen</li>
          </ul>
        </div>
      </div>

      <ModulePromptGenerator
        project={project}
        module={module}
      />
    </div>
  );
}