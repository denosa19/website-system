"use client";

import { useMemo, useState } from "react";
import EmptyProjectsState from "./components/EmptyProjectsState";
import ProjectCardGrid from "./components/ProjectCardGrid";
import ProjectDetails from "./components/ProjectDetails";
import ProjectFilters from "./components/ProjectFilters";
import ProjectForm from "./components/ProjectForm";
import ProjectStats from "./components/ProjectStats";
import ProjectTable from "./components/ProjectTable";
import { useProjects } from "./hooks/useProjects";

type ViewMode = "table" | "cards";

export default function ProjectsHome() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
    null
  );

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
    updateProjectPriority,
    toggleProjectTask,
  } = useProjects();

  const selectedProject = useMemo(
    () =>
      filteredProjects.find((project) => project.id === selectedProjectId) ??
      null,
    [filteredProjects, selectedProjectId]
  );

  function handleDeleteProject(projectId: string) {
    deleteProject(projectId);

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projekte</h1>
          <p className="mt-3 text-neutral-400">
            Verwalte Website-Projekte, Deadlines, Status und Fortschritt.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-1">
          <button
            onClick={() => setViewMode("table")}
            className={`rounded-lg px-4 py-2 text-sm ${
              viewMode === "table"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Tabelle
          </button>

          <button
            onClick={() => setViewMode("cards")}
            className={`rounded-lg px-4 py-2 text-sm ${
              viewMode === "cards"
                ? "bg-white text-black"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Karten
          </button>
        </div>
      </div>

      <div className="mt-8">
        <ProjectStats projects={filteredProjects} />
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

      <div className="mt-8 grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div>
          {filteredProjects.length === 0 ? (
            <EmptyProjectsState />
          ) : viewMode === "table" ? (
            <ProjectTable
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onDeleteProject={handleDeleteProject}
              onUpdateProgress={updateProjectProgress}
              onUpdateStatus={updateProjectStatus}
              onUpdatePriority={updateProjectPriority}
            />
          ) : (
            <ProjectCardGrid
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onDeleteProject={handleDeleteProject}
              onUpdateProgress={updateProjectProgress}
              onUpdateStatus={updateProjectStatus}
              onUpdatePriority={updateProjectPriority}
            />
          )}
        </div>

        <ProjectDetails
          project={selectedProject}
          onToggleTask={toggleProjectTask}
        />
      </div>
    </section>
  );
}