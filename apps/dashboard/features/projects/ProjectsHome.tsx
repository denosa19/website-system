"use client";

import {
  useMemo,
  useRef,
  useState,
} from "react";
import EmptyProjectsState from "./components/EmptyProjectsState";
import ProjectActivityTimeline from "./components/ProjectActivityTimeline";
import ProjectCardGrid from "./components/ProjectCardGrid";
import ProjectDetails from "./components/ProjectDetails";
import ProjectFilters from "./components/ProjectFilters";
import ProjectForm from "./components/ProjectForm";
import ProjectStats from "./components/ProjectStats";
import ProjectTable from "./components/ProjectTable";
import { useProjectActivities } from "./hooks/useProjectActivities";
import { useProjects } from "./hooks/useProjects";

type ViewMode = "table" | "cards";

type ProgressActivityGroup = {
  startValue: number;
  updatedAt: number;
};

const PROGRESS_ACTIVITY_GROUP_TIMEOUT = 1000;

export default function ProjectsHome() {
  const [viewMode, setViewMode] =
    useState<ViewMode>("table");
  const [selectedProjectId, setSelectedProjectId] =
    useState<string | null>(null);

  const progressActivityGroupsRef = useRef<
    Record<string, ProgressActivityGroup>
  >({});

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

  const {
    activities,
    addActivity,
    resetActivityGroup,
    clearActivities,
  } = useProjectActivities();

  const selectedProject = useMemo(
    () =>
      filteredProjects.find(
        (project) => project.id === selectedProjectId
      ) ?? null,
    [filteredProjects, selectedProjectId]
  );

  function findProject(projectId: string) {
    return filteredProjects.find(
      (project) => project.id === projectId
    );
  }

  function handleCreateProject(
    data: Parameters<typeof createProject>[0]
  ) {
    if (!data.title.trim() || !data.customer.trim()) {
      createProject(data);
      return;
    }

    createProject(data);
    resetActivityGroup();

    addActivity({
      projectId: `created_${Date.now()}`,
      projectTitle: data.title.trim(),
      action: "project_created",
      title: "Projekt erstellt",
      description: `Projekt für ${data.customer.trim()} wurde erstellt.`,
      user: data.owner.trim() || "Dennis",
    });
  }

  function handleDeleteProject(projectId: string) {
    const project = findProject(projectId);

    deleteProject(projectId);
    resetActivityGroup();

    if (project) {
      addActivity({
        projectId: project.id,
        projectTitle: project.title,
        action: "project_deleted",
        title: "Projekt gelöscht",
        description: `Das Projekt wurde aus der Projektverwaltung entfernt.`,
        user: project.owner,
      });
    }

    if (selectedProjectId === projectId) {
      setSelectedProjectId(null);
    }
  }

  function handleUpdateProgress(
    projectId: string,
    progress: number
  ) {
    const project = findProject(projectId);

    if (!project) {
      updateProjectProgress(projectId, progress);
      return;
    }

    const safeProgress = Math.min(
      100,
      Math.max(0, progress)
    );

    if (project.progress === safeProgress) {
      return;
    }

    const now = Date.now();
    const activeGroup =
      progressActivityGroupsRef.current[projectId];

    const startValue =
      activeGroup &&
      now - activeGroup.updatedAt <=
        PROGRESS_ACTIVITY_GROUP_TIMEOUT
        ? activeGroup.startValue
        : project.progress;

    progressActivityGroupsRef.current[projectId] = {
      startValue,
      updatedAt: now,
    };

    updateProjectProgress(projectId, safeProgress);

    addActivity(
      {
        projectId: project.id,
        projectTitle: project.title,
        action: "progress_changed",
        title: "Fortschritt geändert",
        description: `${startValue} % → ${safeProgress} %`,
        user: project.owner,
      },
      `project-progress:${projectId}`
    );
  }

  function handleUpdateStatus(
    projectId: string,
    status: Parameters<
      typeof updateProjectStatus
    >[1]
  ) {
    const project = findProject(projectId);

    if (!project || project.status === status) {
      return;
    }

    updateProjectStatus(projectId, status);
    resetActivityGroup();

    addActivity({
      projectId: project.id,
      projectTitle: project.title,
      action: "status_changed",
      title: "Status geändert",
      description: `${project.status} → ${status}`,
      user: project.owner,
    });
  }

  function handleUpdatePriority(
    projectId: string,
    priority: Parameters<
      typeof updateProjectPriority
    >[1]
  ) {
    const project = findProject(projectId);

    if (!project || project.priority === priority) {
      return;
    }

    updateProjectPriority(projectId, priority);
    resetActivityGroup();

    addActivity({
      projectId: project.id,
      projectTitle: project.title,
      action: "priority_changed",
      title: "Priorität geändert",
      description: `${project.priority} → ${priority}`,
      user: project.owner,
    });
  }

  function handleToggleTask(
    projectId: string,
    taskId: string
  ) {
    const project = findProject(projectId);
    const task = project?.tasks.find(
      (projectTask) => projectTask.id === taskId
    );

    if (!project || !task) {
      return;
    }

    toggleProjectTask(projectId, taskId);
    resetActivityGroup();

    addActivity({
      projectId: project.id,
      projectTitle: project.title,
      action: "task_changed",
      title: task.completed
        ? "Aufgabe wieder geöffnet"
        : "Aufgabe abgeschlossen",
      description: task.title,
      user: project.owner,
    });
  }

  function handleUpdateSeo(
    projectId: string,
    seo: Parameters<typeof updateProjectSeo>[1]
  ) {
    const project = findProject(projectId);

    if (!project) {
      return;
    }

    updateProjectSeo(projectId, seo);
    resetActivityGroup();

    addActivity({
      projectId: project.id,
      projectTitle: project.title,
      action: "seo_changed",
      title: "SEO-Daten geändert",
      description:
        seo.metaTitle.trim() ||
        seo.mainKeyword.trim() ||
        seo.domain.trim() ||
        "SEO-Arbeitsbereich aktualisiert",
      user: project.owner,
    });
  }

  function handleUndo() {
    undo();
    resetActivityGroup();
    progressActivityGroupsRef.current = {};
  }

  function handleRedo() {
    redo();
    resetActivityGroup();
    progressActivityGroupsRef.current = {};
  }

  return (
    <section>
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <h1 className="text-4xl font-bold">
            Projekte
          </h1>

          <p className="mt-3 text-neutral-400">
            Verwalte Website-Projekte, Deadlines, Status
            und Fortschritt.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 p-1">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              title="Rückgängig – ⌘ Z / Strg Z"
              aria-label="Letzte Änderung rückgängig machen"
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:bg-transparent"
            >
              <span
                aria-hidden="true"
                className="text-lg leading-none"
              >
                ↶
              </span>

              <span>Rückgängig</span>
            </button>

            <div className="h-6 w-px bg-neutral-800" />

            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              title="Wiederholen – ⌘ Shift Z / Strg Shift Z"
              aria-label="Rückgängig gemachte Änderung wiederherstellen"
              className="flex min-h-10 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-neutral-200 transition hover:bg-neutral-800 hover:text-white disabled:cursor-not-allowed disabled:text-neutral-600 disabled:hover:bg-transparent"
            >
              <span
                aria-hidden="true"
                className="text-lg leading-none"
              >
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
        <ProjectForm onCreate={handleCreateProject} />
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
              onUpdateProgress={handleUpdateProgress}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
            />
          ) : (
            <ProjectCardGrid
              projects={filteredProjects}
              selectedProjectId={selectedProjectId}
              onSelectProject={setSelectedProjectId}
              onDeleteProject={handleDeleteProject}
              onUpdateProgress={handleUpdateProgress}
              onUpdateStatus={handleUpdateStatus}
              onUpdatePriority={handleUpdatePriority}
            />
          )}
        </div>

        <div className="space-y-8">
          <ProjectDetails
            project={selectedProject}
            onToggleTask={handleToggleTask}
            onUpdateSeo={handleUpdateSeo}
          />

          <ProjectActivityTimeline
            activities={activities}
            onClear={clearActivities}
          />
        </div>
      </div>
    </section>
  );
}