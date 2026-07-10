"use client";

import { useMemo, useState } from "react";
import { defaultModules } from "../../../data/defaultModules";
import { projectTemplates } from "../../../data/projectTemplates";
import { projects as initialProjects } from "../../../data/projects";
import type {
  Project,
  ProjectPriority,
  ProjectStatus,
  ProjectType,
} from "../../../types/project";

type CreateProjectData = {
  title: string;
  customer: string;
  customerId?: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string;
  owner: string;
};

type ProjectStatusFilter = "Alle" | ProjectStatus;

function createTasksFromTemplate(projectId: string, type: ProjectType) {
  return projectTemplates[type].map((title, index) => ({
    id: `${projectId}_task_${index + 1}`,
    title,
    completed: false,
  }));
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ProjectStatusFilter>("Alle");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const normalizedSearch = search.toLowerCase();

      const matchesSearch =
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.customer.toLowerCase().includes(normalizedSearch) ||
        project.owner.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Alle" || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  function createProject(data: CreateProjectData) {
    if (!data.title || !data.customer) {
      alert("Bitte mindestens Projektname und Kunde eintragen.");
      return;
    }

    const id = `proj_${Date.now()}`;

    const newProject: Project = {
      id,
      title: data.title,
      customerId: data.customerId || `manual_${Date.now()}`,
      customer: data.customer,
      type: data.type,
      status: data.status,
      priority: data.priority,
      progress: 0,
      deadline: data.deadline,
      owner: data.owner || "Dennis",
      tasks: createTasksFromTemplate(id, data.type),
      modules: structuredClone(defaultModules),
      seo: {
        mainKeyword: "",
        secondaryKeywords: [],
        metaTitle: "",
        metaDescription: "",
        h1: "",
        robots: false,
        sitemap: false,
      },
    };

    setProjects((current) => [newProject, ...current]);
  }

  function deleteProject(projectId: string) {
    setProjects((current) =>
      current.filter((project) => project.id !== projectId)
    );
  }

  function updateProjectProgress(projectId: string, progress: number) {
    const safeProgress = Math.min(100, Math.max(0, progress));

    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, progress: safeProgress }
          : project
      )
    );
  }

  function updateProjectStatus(projectId: string, status: ProjectStatus) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId ? { ...project, status } : project
      )
    );
  }

  function updateProjectPriority(
    projectId: string,
    priority: ProjectPriority
  ) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId ? { ...project, priority } : project
      )
    );
  }

  function toggleProjectTask(projectId: string, taskId: string) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? { ...task, completed: !task.completed }
                  : task
              ),
            }
          : project
      )
    );
  }

  return {
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
  };
}