import type { Project } from "../../../types/project";
import ProjectPhaseTimeline from "./ProjectPhaseTimeline";
import ProjectPromptGenerator from "./ProjectPromptGenerator";
import WebsiteWizard from "./WebsiteWizard";

type Props = {
  project: Project | null;
  onToggleTask: (projectId: string, taskId: string) => void;
};

export default function ProjectDetails({ project, onToggleTask }: Props) {
  if (!project) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-800 p-8 text-neutral-400">
        Wähle ein Projekt aus, um Details, Checkliste und AI-Prompt zu sehen.
      </div>
    );
  }

  const completedTasks = project.tasks.filter((task) => task.completed).length;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
        <h2 className="text-2xl font-bold">{project.title}</h2>

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div>
            <p className="text-sm text-neutral-500">Kunde</p>
            <p className="mt-1 text-white">{project.customer}</p>
          </div>

          <div>
            <p className="text-sm text-neutral-500">Projekttyp</p>
            <p className="mt-1 text-white">{project.type}</p>
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
            <p className="mt-1 text-white">
              {project.deadline || "Keine Deadline"}
            </p>
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

        <div className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-bold">Projekt-Checkliste</h3>
            <span className="text-sm text-neutral-400">
              {completedTasks}/{project.tasks.length} erledigt
            </span>
          </div>

          <div className="space-y-3">
            {project.tasks.map((task) => (
              <label
                key={task.id}
                className="flex cursor-pointer items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-950 p-4"
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => onToggleTask(project.id, task.id)}
                />

                <span
                  className={
                    task.completed
                      ? "text-neutral-500 line-through"
                      : "text-neutral-200"
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

      <ProjectPromptGenerator project={project} />

      <WebsiteWizard project={project} />
    </div>
  );
}