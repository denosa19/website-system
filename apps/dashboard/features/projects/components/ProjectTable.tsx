import type { Project } from "../../../types/project";
import ProjectStatusBadge from "./ProjectStatusBadge";

type Props = {
  projects: Project[];
  onDeleteProject: (projectId: string) => void;
  onUpdateProgress: (projectId: string, progress: number) => void;
};

export default function ProjectTable({
  projects,
  onDeleteProject,
  onUpdateProgress,
}: Props) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-800">
      <div className="grid grid-cols-8 border-b border-neutral-800 bg-neutral-900 px-6 py-4 text-sm text-neutral-400">
        <div>Projekt</div>
        <div>Kunde</div>
        <div>Status</div>
        <div>Priorität</div>
        <div>Fortschritt</div>
        <div>Deadline</div>
        <div>Owner</div>
        <div>Aktion</div>
      </div>

      {projects.map((project) => (
        <div
          key={project.id}
          className="grid grid-cols-8 items-center border-b border-neutral-900 px-6 py-5 text-sm last:border-b-0 hover:bg-neutral-900"
        >
          <div className="font-medium text-white">{project.title}</div>
          <div className="text-neutral-400">{project.customer}</div>

          <div>
            <ProjectStatusBadge status={project.status} />
          </div>

          <div className="text-neutral-400">{project.priority}</div>

          <div>
            <input
              type="range"
              min="0"
              max="100"
              value={project.progress}
              onChange={(event) =>
                onUpdateProgress(project.id, Number(event.target.value))
              }
              className="w-full"
            />
            <p className="mt-1 text-xs text-neutral-500">{project.progress}%</p>
          </div>

          <div className="text-neutral-400">{project.deadline}</div>
          <div className="text-neutral-400">{project.owner}</div>

          <button
            onClick={() => onDeleteProject(project.id)}
            className="text-left text-red-400 hover:text-red-300"
          >
            Löschen
          </button>
        </div>
      ))}
    </div>
  );
}