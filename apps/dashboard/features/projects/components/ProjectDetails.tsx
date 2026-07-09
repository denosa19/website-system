import type { Project } from "../../../types/project";

type Props = {
  project: Project | null;
};

export default function ProjectDetails({ project }: Props) {
  if (!project) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-neutral-400">
        Wähle ein Projekt aus, um Details zu sehen.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h2 className="text-2xl font-bold">{project.title}</h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-neutral-500">Kunde</p>
          <p className="mt-1 text-white">{project.customer}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Status</p>
          <p className="mt-1 text-white">{project.status}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Priorität</p>
          <p className="mt-1 text-white">{project.priority}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Deadline</p>
          <p className="mt-1 text-white">{project.deadline || "Keine Deadline"}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Verantwortlich</p>
          <p className="mt-1 text-white">{project.owner}</p>
        </div>

        <div>
          <p className="text-sm text-neutral-500">Fortschritt</p>
          <p className="mt-1 text-white">{project.progress}%</p>
        </div>
      </div>
    </div>
  );
}