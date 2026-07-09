"use client";

import { useState } from "react";
import { projects as initialProjects } from "../../../data/projects";
import type { Project, ProjectPriority, ProjectStatus } from "../../../types/project";

type CreateProjectData = {
  title: string;
  customer: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string;
  owner: string;
};

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

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

  return {
    projects,
    createProject,
  };
}