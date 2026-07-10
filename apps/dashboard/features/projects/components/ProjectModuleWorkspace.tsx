"use client";

import type { ProjectModule } from "../../../types/module";
import type { Project } from "../../../types/project";
import ModuleDashboard from "./ModuleDashboard";
import ModulePromptGenerator from "./ModulePromptGenerator";
import SeoAgent from "./SeoAgent";
import SeoWorkspace from "./SeoWorkspace";

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

  const showSeoWorkspace =
    module.id === "seo" || module.title.toLowerCase().includes("seo");

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <p className="text-sm text-neutral-500">Aktives Modul</p>

        <h2 className="mt-2 text-3xl font-bold">{module.title}</h2>

        <p className="mt-3 text-neutral-400">{module.description}</p>
      </div>

      <ModuleDashboard project={project} module={module} />

      {showSeoWorkspace && (
        <>
          <SeoWorkspace seo={project.seo} />
          <SeoAgent project={project} module={module} />
        </>
      )}

      <ModulePromptGenerator project={project} module={module} />
    </div>
  );
}