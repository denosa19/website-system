import type { Project, ProjectPriority, ProjectStatus } from "../../../types/project";
import ProjectCard from "./ProjectCard";

type Props = {
  projects: Project[];
  selectedProjectId?: string | null;
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onUpdateProgress: (projectId: string, progress: number) => void;
  onUpdateStatus: (projectId: string, status: ProjectStatus) => void;
  onUpdatePriority: (projectId: string, priority: ProjectPriority) => void;
};

export default function ProjectCardGrid({
  projects,
  selectedProjectId,
  onSelectProject,
  onDeleteProject,
  onUpdateProgress,
  onUpdateStatus,
  onUpdatePriority,
}: Props) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          selected={selectedProjectId === project.id}
          onSelectProject={onSelectProject}
          onDeleteProject={onDeleteProject}
          onUpdateProgress={onUpdateProgress}
          onUpdateStatus={onUpdateStatus}
          onUpdatePriority={onUpdatePriority}
        />
      ))}
    </div>
  );
}