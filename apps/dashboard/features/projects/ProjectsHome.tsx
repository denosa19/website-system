"use client";

import ProjectForm from "./components/ProjectForm";
import ProjectTable from "./components/ProjectTable";
import { useProjects } from "./hooks/useProjects";

export default function ProjectsHome() {
  const { projects, createProject } = useProjects();

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
        <ProjectTable projects={projects} />
      </div>
    </section>
  );
}