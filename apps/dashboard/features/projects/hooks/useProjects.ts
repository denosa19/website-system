"use client";

import { useMemo, useState } from "react";
import { projects as initialProjects } from "../../../data/projects";
import type {
  Project,
  ProjectPriority,
  ProjectStatus,
} from "../../../types/project";

type CreateProjectData = {
  title: string;
  customer: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string;
  owner: string;
};

type ProjectStatusFilter = "Alle" | ProjectStatus;

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ProjectStatusFilter>("Alle");

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.customer.toLowerCase().includes(search.toLowerCase()) ||
        project.owner.toLowerCase().includes(search.toLowerCase());

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

    const newProject: Project = {
      id: `proj_${Date.now()}`,
      title: data.title,
      customer: data.customer,
      status: data.status,
      priority: data.priority,
      progress: 0,
      deadline: data.deadline,
      owner: data.owner || "Dennis",
    };

    setProjects((current) => [newProject, ...current]);
  }

  function deleteProject(projectId: string) {
    setProjects((current) =>
      current.filter((project) => project.id !== projectId)
    );
  }

  function updateProjectProgress(projectId: string, progress: number) {
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? { ...project, progress: Math.min(100, Math.max(0, progress)) }
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
  };
}