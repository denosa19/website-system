import type { Project } from "../../../types/project";
import ProjectStatusBadge from "./ProjectStatusBadge";

type Props = {
  projects: Project[];
};

export default function ProjectTable({ projects }: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800">
      <div className="grid grid-cols-7 border-b border-neutral-800 bg-neutral-900 px-6 py-4 text-sm text-neutral-400">
        <div>Projekt</div>
        <div>Kunde</div>
        <div>Status</div>
        <div>Priorität</div>
        <div>Fortschritt</div>
        <div>Deadline</div>
        <div>Owner</div>
      </div>

      {projects.map((project) => (
        <div
          key={project.id}
          className="grid grid-cols-7 items-center border-b border-neutral-900 px-6 py-5 text-sm last:border-b-0 hover:bg-neutral-900"
        >
          <div className="font-medium text-white">{project.title}</div>
          <div className="text-neutral-400">{project.customer}</div>

          <div>
            <ProjectStatusBadge status={project.status} />
          </div>

          <div className="text-neutral-400">{project.priority}</div>

          <div>
            <div className="h-2 rounded-full bg-neutral-800">
              <div
                className="h-2 rounded-full bg-white"
                style={{ width: `${project.progress}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-neutral-500">{project.progress}%</p>
          </div>

          <div className="text-neutral-400">{project.deadline}</div>
          <div className="text-neutral-400">{project.owner}</div>
        </div>
      ))}
    </div>
  );
}