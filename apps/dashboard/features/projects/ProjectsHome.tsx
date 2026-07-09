"use client";

import ProjectFilters from "./components/ProjectFilters";
import ProjectForm from "./components/ProjectForm";
import ProjectTable from "./components/ProjectTable";
import { useProjects } from "./hooks/useProjects";

export default function ProjectsHome() {
  const {
    filteredProjects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    createProject,
    deleteProject,
    updateProjectProgress,
    updateProjectStatus,
  } = useProjects();

  return (
    <section>
      <div>
        <h1 className="text-4xl font-bold">Projekte</h1>
        <p className="mt-3 text-neutral-400">
          Verwalte Website-Projekte, Deadlines, Status und Fortschritt.
        </p>
      </div>

      <div className="mt-8">
        <ProjectForm onCreate={createProject} />
      </div>

      <div className="mt-8">
        <ProjectFilters
          search={search}
          statusFilter={statusFilter}
          onSearchChange={setSearch}
          onStatusChange={setStatusFilter}
        />
      </div>

      <div className="mt-8">
        <ProjectTable
          projects={filteredProjects}
          onDeleteProject={deleteProject}
          onUpdateProgress={updateProjectProgress}
          onUpdateStatus={updateProjectStatus}
        />
      </div>
    </section>
  );
}