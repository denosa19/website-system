"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { projects as initialProjects } from "../../data/projects";
import type { Project } from "../../types/project";

type ProjectDetailHomeProps = {
  projectId: string;
};

const PROJECTS_STORAGE_KEY =
  "internet-firma-projects";

function loadStoredProjects(): Project[] {
  try {
    const storedProjects =
      window.localStorage.getItem(
        PROJECTS_STORAGE_KEY
      );

    if (!storedProjects) {
      return structuredClone(initialProjects);
    }

    const parsedProjects: unknown =
      JSON.parse(storedProjects);

    if (!Array.isArray(parsedProjects)) {
      return structuredClone(initialProjects);
    }

    return parsedProjects.filter(
      (project): project is Project =>
        typeof project === "object" &&
        project !== null &&
        "id" in project &&
        typeof project.id === "string" &&
        "title" in project &&
        typeof project.title === "string" &&
        "customer" in project &&
        typeof project.customer === "string"
    );
  } catch (error) {
    console.error(
      "Projekt konnte nicht geladen werden:",
      error
    );

    return structuredClone(initialProjects);
  }
}

function formatDeadline(deadline: string) {
  if (!deadline) {
    return "Keine Deadline";
  }

  const date = new Date(`${deadline}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return deadline;
  }

  return new Intl.DateTimeFormat("de-DE", {
    dateStyle: "medium",
  }).format(date);
}

export default function ProjectDetailHome({
  projectId,
}: ProjectDetailHomeProps) {
  const [projects, setProjects] = useState<Project[]>(
    []
  );

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    setProjects(loadStoredProjects());
    setIsLoading(false);
  }, []);

  const project = useMemo(
    () =>
      projects.find(
        (currentProject) =>
          currentProject.id === projectId
      ) ?? null,
    [projectId, projects]
  );

  if (isLoading) {
    return (
      <section>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Zurück zu den Projekten
        </Link>

        <div className="mt-8 rounded-2xl border border-neutral-800 bg-neutral-900 p-8">
          <p className="text-neutral-400">
            Projekt wird geladen …
          </p>
        </div>
      </section>
    );
  }

  if (!project) {
    return (
      <section>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
        >
          <span aria-hidden="true">←</span>
          Zurück zu den Projekten
        </Link>

        <div className="mt-8 rounded-2xl border border-dashed border-neutral-700 bg-neutral-900 p-8">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">
            Projekt nicht gefunden
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            Dieses Projekt ist nicht vorhanden
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-neutral-400">
            Das Projekt wurde möglicherweise gelöscht
            oder die verwendete Projekt-ID ist ungültig.
          </p>

          <Link
            href="/projects"
            className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
          >
            Projektübersicht öffnen
          </Link>
        </div>
      </section>
    );
  }

  const completedTasks = project.tasks.filter(
    (task) => task.completed
  ).length;

  const completedModules = project.modules.filter(
    (module) => module.status === "Abgeschlossen"
  ).length;

  return (
    <section>
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-neutral-400 transition hover:text-white"
      >
        <span aria-hidden="true">←</span>
        Zurück zu den Projekten
      </Link>

      <div className="mt-6 flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
              {project.type}
            </span>

            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
              {project.status}
            </span>

            <span className="rounded-full border border-neutral-700 bg-neutral-900 px-3 py-1 text-xs font-medium text-neutral-300">
              Priorität {project.priority}
            </span>
          </div>

          <h1 className="mt-4 text-4xl font-bold text-white">
            {project.title}
          </h1>

          <p className="mt-3 text-lg text-neutral-400">
            {project.customer}
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
          <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
            Projekt-ID
          </p>

          <p className="mt-2 break-all font-mono text-sm text-neutral-300">
            {project.id}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">
            Fortschritt
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {project.progress} %
          </p>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-neutral-800">
            <div
              className="h-full rounded-full bg-white transition-all"
              style={{
                width: `${Math.min(
                  100,
                  Math.max(0, project.progress)
                )}%`,
              }}
            />
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">
            Aufgaben
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {completedTasks}/{project.tasks.length}
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            Aufgaben abgeschlossen
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">
            Module
          </p>

          <p className="mt-3 text-3xl font-bold text-white">
            {completedModules}/{project.modules.length}
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            Module abgeschlossen
          </p>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
          <p className="text-sm text-neutral-500">
            Deadline
          </p>

          <p className="mt-3 text-lg font-semibold text-white">
            {formatDeadline(project.deadline)}
          </p>

          <p className="mt-2 text-sm text-neutral-500">
            Verantwortlich: {project.owner}
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
                Projektarbeitsbereich
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Projektübersicht
              </h2>
            </div>

            <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
              Block 42
            </span>
          </div>

          <p className="mt-5 max-w-3xl leading-7 text-neutral-400">
            Diese Route bildet die Grundlage für den
            vollständigen Projektarbeitsbereich. Die
            Bearbeitungsfunktionen aus der bisherigen
            Projektübersicht bleiben vorerst unverändert
            bestehen.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-500">
                Kunde
              </p>

              <p className="mt-2 font-medium text-white">
                {project.customer}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-500">
                Projekttyp
              </p>

              <p className="mt-2 font-medium text-white">
                {project.type}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-500">
                Status
              </p>

              <p className="mt-2 font-medium text-white">
                {project.status}
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="text-sm text-neutral-500">
                Priorität
              </p>

              <p className="mt-2 font-medium text-white">
                {project.priority}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-bold text-white">
            Nächste Ausbaustufen
          </h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="font-medium text-neutral-200">
                Projektdaten bearbeiten
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Titel, Kunde, Status und Deadline
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="font-medium text-neutral-200">
                Aufgaben verwalten
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Aufgaben hinzufügen, ändern und löschen
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="font-medium text-neutral-200">
                Projektnotizen
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Interne Informationen zentral speichern
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}