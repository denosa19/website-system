"use client";

import type { Project } from "../../../types/project";
import type { ProjectModule } from "../../../types/module";

type Props = {
  project: Project;
  module: ProjectModule;
};

export default function ModuleDashboard({
  project,
  module,
}: Props) {
  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

      <h3 className="text-xl font-bold">
        Modul Dashboard
      </h3>

      <div className="mt-6 grid gap-4 md:grid-cols-2">

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-sm text-neutral-500">
            Projekt
          </p>

          <h4 className="mt-2 font-semibold">
            {project.title}
          </h4>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-sm text-neutral-500">
            Modulstatus
          </p>

          <h4 className="mt-2 font-semibold">
            {module.status}
          </h4>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-sm text-neutral-500">
            KI-Agent
          </p>

          <h4 className="mt-2 font-semibold">
            Bereit
          </h4>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <p className="text-sm text-neutral-500">
            Dokumente
          </p>

          <h4 className="mt-2 font-semibold">
            0 Dateien
          </h4>
        </div>

      </div>

      <div className="mt-6 rounded-xl border border-dashed border-neutral-700 p-6">

        <h4 className="font-semibold">
          Geplante Funktionen
        </h4>

        <ul className="mt-4 space-y-2 text-sm text-neutral-400">

          <li>✓ Modul-KI</li>

          <li>✓ Dateien</li>

          <li>✓ Chat</li>

          <li>✓ Prompt Historie</li>

          <li>✓ Versionierung</li>

          <li>✓ Automatische Aufgaben</li>

        </ul>

      </div>

    </div>
  );
}