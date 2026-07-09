import type {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../../../types/project";

type Props = {
  project: Project;
  selected?: boolean;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProgress: (projectId: string, progress: number) => void;
  onUpdateStatus: (projectId: string, status: ProjectStatus) => void;
  onUpdatePriority: (projectId: string, priority: ProjectPriority) => void;
};

const statuses: ProjectStatus[] = [
  "Anfrage",
  "Angebot",
  "Umsetzung",
  "Prüfung",
  "Online",
  "Wartung",
];

const priorities: ProjectPriority[] = ["Niedrig", "Normal", "Hoch"];

export default function ProjectCard({
  project,
  selected = false,
  onSelectProject,
  onDeleteProject,
  onUpdateProgress,
  onUpdateStatus,
  onUpdatePriority,
}: Props) {
  return (
    <div
      onClick={() => onSelectProject(project.id)}
      className={`cursor-pointer rounded-2xl border p-6 ${
        selected
          ? "border-white bg-neutral-800"
          : "border-neutral-800 bg-neutral-900"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-bold">{project.title}</h3>
          <p className="mt-2 text-sm text-neutral-400">{project.customer}</p>
        </div>

        <button
          onClick={(event) => {
            event.stopPropagation();
            onDeleteProject(project.id);
          }}
          className="text-sm text-red-400 hover:text-red-300"
        >
          Löschen
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <select
          value={project.status}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            onUpdateStatus(project.id, event.target.value as ProjectStatus)
          }
          className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 outline-none"
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>

        <select
          value={project.priority}
          onClick={(event) => event.stopPropagation()}
          onChange={(event) =>
            onUpdatePriority(
              project.id,
              event.target.value as ProjectPriority
            )
          }
          className="rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-neutral-300 outline-none"
        >
          {priorities.map((priority) => (
            <option key={priority}>{priority}</option>
          ))}
        </select>

        <div onClick={(event) => event.stopPropagation()}>
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

          <p className="mt-1 text-sm text-neutral-500">
            Fortschritt: {project.progress}%
          </p>
        </div>

        <div className="text-sm text-neutral-400">
          <p>Deadline: {project.deadline || "Keine Deadline"}</p>
          <p>Owner: {project.owner}</p>
        </div>
      </div>
    </div>
  );
}