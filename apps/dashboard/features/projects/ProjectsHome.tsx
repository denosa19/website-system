"use client";

import { useState } from "react";
import ProjectCardGrid from "./components/ProjectCardGrid";
import ProjectFilters from "./components/ProjectFilters";
import ProjectForm from "./components/ProjectForm";
import ProjectTable from "./components/ProjectTable";
import { useProjects } from "./hooks/useProjects";

type ViewMode = "table" | "cards";

export default function ProjectsHome() {
  const [viewMode, setViewMode] = useState<ViewMode>("table");

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
  } = useProjects();

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
        {viewMode === "table" ? (
          <ProjectTable
            projects={filteredProjects}
            onDeleteProject={deleteProject}
            onUpdateProgress={updateProjectProgress}
            onUpdateStatus={updateProjectStatus}
            onUpdatePriority={updateProjectPriority}
          />
        ) : (
          <ProjectCardGrid
            projects={filteredProjects}
            onDeleteProject={deleteProject}
            onUpdateProgress={updateProjectProgress}
            onUpdateStatus={updateProjectStatus}
            onUpdatePriority={updateProjectPriority}
          />
        )}
      </div>
    </section>
  );
}