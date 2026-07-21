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
  const [selectedProjectId, setSelectedProjectId] = useState<
    string | null
  >(null);

  const {
    filteredProjects,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    canUndo,
    canRedo,
    undo,
    redo,
    createProject,
    deleteProject,
    updateProjectProgress,
    updateProjectStatus,
    updateProjectPriority,
    toggleProjectTask,
    updateProjectSeo,
  } = useProjects();

  const selectedProject = useMemo(
    () =>
      filteredProjects.find(
        (project) => project.id === selectedProjectId
      ) ?? null,
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
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projekte</h1>

          <p className="mt-3 text-neutral-400">
            Verwalte Website-Projekte, Deadlines, Status und
            Fortschritt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
              onClick={undo}
              disabled={!canUndo}
              title="Rückgängig – ⌘ Z / Strg Z"
              aria-label="Letzte Änderung rückgängig machen"
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:bg-transparent"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ↶
              </span>

              <span>Rückgängig</span>
            </button>

            <div className="h-6 w-px bg-neutral-800" />

            <button
              type="button"
              onClick={redo}
              disabled={!canRedo}
              title="Wiederholen – ⌘ Shift Z / Strg Shift Z"
              aria-label="Rückgängig gemachte Änderung wiederherstellen"
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:bg-transparent"
            >
              <span aria-hidden="true" className="text-lg leading-none">
                ↷
              </span>

              <span>Wiederholen</span>
            </button>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
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
              type="button"
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
      </div>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-neutral-500">
        <span>
          Rückgängig:{" "}
          <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-sans text-neutral-400">
            ⌘ Z
          </kbd>
        </span>

        <span>
          Wiederholen:{" "}
          <kbd className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-sans text-neutral-400">
            ⌘ ⇧ Z
          </kbd>
        </span>
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
          onUpdateSeo={updateProjectSeo}
        />
      </div>
    </section>
  );
}