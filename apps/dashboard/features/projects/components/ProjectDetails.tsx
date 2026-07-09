import type { Project } from "../../../types/project";
import ProjectPhaseTimeline from "./ProjectPhaseTimeline";

type Props = {
  project: Project | null;
  onToggleTask: (projectId: string, taskId: string) => void;
};

export default function ProjectDetails({
  project,
  onToggleTask,
}: Props) {
  if (!project) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-neutral-400">
        Wähle ein Projekt aus.
      </div>
    );
  }

  const completed = project.tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">

        <h2 className="text-2xl font-bold">{project.title}</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">

          <div>
            <p className="text-sm text-neutral-500">Kunde</p>
            <p>{project.customer}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Projekttyp</p>
            <p>{project.type}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Status</p>
            <p>{project.status}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Priorität</p>
            <p>{project.priority}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Deadline</p>
            <p>{project.deadline}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Fortschritt</p>
            <p>{project.progress}%</p>
          </div>

        </div>

        <div className="mt-8">

          <div className="mb-4 flex justify-between">

            <h3 className="text-xl font-bold">
              Projektcheckliste
            </h3>

            <span>
              {completed}/{project.tasks.length}
            </span>

          </div>

          <div className="space-y-3">

            {project.tasks.map((task) => (
              <label
                key={task.id}
                className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-3"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() =>
                    onToggleTask(project.id, task.id)
                  }
                />

                <span
                  className={
                    task.completed
                      ? "line-through text-neutral-500"
                      : ""
                  }
                >
                  {task.title}
                </span>
              </label>
            ))}

          </div>

        </div>

      </div>

      <ProjectPhaseTimeline project={project} />

    </div>
  );
}