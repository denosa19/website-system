import { projects } from "../../data/projects";
import ProjectTable from "./components/ProjectTable";

export default function ProjectsHome() {
  return (
    <section>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold">Projekte</h1>
          <p className="mt-3 text-neutral-400">
            Verwalte Website-Projekte, Deadlines, Status und Fortschritt.
          </p>
        </div>

        <button className="rounded-xl bg-white px-5 py-3 font-semibold text-black">
          + Neues Projekt
        </button>
      </div>

      <div className="mt-8">
        <ProjectTable projects={projects} />
      </div>
    </section>
  );
}