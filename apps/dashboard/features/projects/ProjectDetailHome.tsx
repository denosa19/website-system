"use client";

import Link from "next/link";
import {
  type FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import ProjectCommunication from "@/components/projects/ProjectCommunication";
import { customers } from "../../data/customers";
import { projects as initialProjects } from "../../data/projects";
import type {
  Project,
  ProjectPriority,
  ProjectStatus,
  ProjectType,
} from "../../types/project";

type ProjectDetailHomeProps = {
  projectId: string;
};

type ProjectFormData = {
  title: string;
  customerId: string;
  type: ProjectType;
  status: ProjectStatus;
  priority: ProjectPriority;
  deadline: string;
  owner: string;
};

const PROJECTS_STORAGE_KEY =
  "internet-firma-projects";

const projectTypes: ProjectType[] = [
  "Firmenwebseite",
  "Landingpage",
  "Onlineshop",
  "Mitgliederportal",
  "Academy",
  "Blog",
];

const projectStatuses: ProjectStatus[] = [
  "Anfrage",
  "Angebot",
  "Umsetzung",
  "Prüfung",
  "Online",
  "Wartung",
];

const projectPriorities: ProjectPriority[] = [
  "Niedrig",
  "Normal",
  "Hoch",
];

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

function saveStoredProjects(projects: Project[]) {
  window.localStorage.setItem(
    PROJECTS_STORAGE_KEY,
    JSON.stringify(projects)
  );
}

function createProjectFormData(
  project: Project
): ProjectFormData {
  return {
    title: project.title,
    customerId: project.customerId,
    type: project.type,
    status: project.status,
    priority: project.priority,
    deadline: project.deadline,
    owner: project.owner,
  };
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

  const [isEditing, setIsEditing] =
    useState(false);

  const [formData, setFormData] =
    useState<ProjectFormData | null>(null);

  const [formError, setFormError] =
    useState("");

  const [saveMessage, setSaveMessage] =
    useState("");

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

  function startEditing() {
    if (!project) {
      return;
    }

    setFormData(createProjectFormData(project));
    setFormError("");
    setSaveMessage("");
    setIsEditing(true);
  }

  function cancelEditing() {
    if (project) {
      setFormData(createProjectFormData(project));
    }

    setFormError("");
    setIsEditing(false);
  }

  function updateFormData<
    Field extends keyof ProjectFormData
  >(
    field: Field,
    value: ProjectFormData[Field]
  ) {
    setFormData((currentFormData) => {
      if (!currentFormData) {
        return currentFormData;
      }

      return {
        ...currentFormData,
        [field]: value,
      };
    });

    setFormError("");
    setSaveMessage("");
  }

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!project || !formData) {
      return;
    }

    const title = formData.title.trim();
    const owner = formData.owner.trim();

    if (!title) {
      setFormError(
        "Bitte gib einen Projektnamen ein."
      );
      return;
    }

    if (!formData.customerId) {
      setFormError(
        "Bitte wähle einen Kunden aus."
      );
      return;
    }

    if (!owner) {
      setFormError(
        "Bitte gib einen Verantwortlichen ein."
      );
      return;
    }

    const selectedCustomer = customers.find(
      (customer) =>
        customer.id === formData.customerId
    );

    if (!selectedCustomer) {
      setFormError(
        "Der ausgewählte Kunde ist nicht verfügbar."
      );
      return;
    }

    const updatedProject: Project = {
      ...project,
      title,
      customerId: selectedCustomer.id,
      customer: selectedCustomer.company,
      type: formData.type,
      status: formData.status,
      priority: formData.priority,
      deadline: formData.deadline,
      owner,
    };

    const updatedProjects = projects.map(
      (currentProject) =>
        currentProject.id === project.id
          ? updatedProject
          : currentProject
    );

    try {
      saveStoredProjects(updatedProjects);
      setProjects(updatedProjects);
      setFormData(
        createProjectFormData(updatedProject)
      );
      setFormError("");
      setSaveMessage(
        "Projektstammdaten wurden gespeichert."
      );
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Projekt konnte nicht gespeichert werden:",
        error
      );

      setFormError(
        "Das Projekt konnte nicht gespeichert werden."
      );
    }
  }

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

        <div className="flex flex-col items-stretch gap-3 sm:flex-row xl:flex-col">
          <button
            type="button"
            onClick={startEditing}
            disabled={isEditing}
            className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Projektdaten bearbeiten
          </button>

          <div className="rounded-2xl border border-neutral-800 bg-neutral-900 px-5 py-4">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-neutral-500">
              Projekt-ID
            </p>

            <p className="mt-2 break-all font-mono text-sm text-neutral-300">
              {project.id}
            </p>
          </div>
        </div>
      </div>

      {saveMessage && (
        <div
          role="status"
          className="mt-6 rounded-xl border border-emerald-900 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-300"
        >
          {saveMessage}
        </div>
      )}

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
                Projektstammdaten
              </h2>
            </div>

            <span className="rounded-full border border-neutral-700 px-3 py-1 text-xs text-neutral-400">
              Block 43
            </span>
          </div>

          {isEditing && formData ? (
            <form
              onSubmit={handleSave}
              className="mt-6"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <label className="md:col-span-2">
                  <span className="text-sm font-medium text-neutral-300">
                    Projektname
                  </span>

                  <input
                    type="text"
                    value={formData.title}
                    onChange={(event) =>
                      updateFormData(
                        "title",
                        event.target.value
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
                    placeholder="Projektname"
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-neutral-300">
                    Kunde
                  </span>

                  <select
                    value={formData.customerId}
                    onChange={(event) =>
                      updateFormData(
                        "customerId",
                        event.target.value
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-neutral-500"
                  >
                    <option value="">
                      Kunde auswählen
                    </option>

                    {customers.map((customer) => (
                      <option
                        key={customer.id}
                        value={customer.id}
                      >
                        {customer.company}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-medium text-neutral-300">
                    Projekttyp
                  </span>

                  <select
                    value={formData.type}
                    onChange={(event) =>
                      updateFormData(
                        "type",
                        event.target.value as ProjectType
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-neutral-500"
                  >
                    {projectTypes.map((projectType) => (
                      <option
                        key={projectType}
                        value={projectType}
                      >
                        {projectType}
                      </option>
                    ))}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-medium text-neutral-300">
                    Status
                  </span>

                  <select
                    value={formData.status}
                    onChange={(event) =>
                      updateFormData(
                        "status",
                        event.target.value as ProjectStatus
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-neutral-500"
                  >
                    {projectStatuses.map(
                      (projectStatus) => (
                        <option
                          key={projectStatus}
                          value={projectStatus}
                        >
                          {projectStatus}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-medium text-neutral-300">
                    Priorität
                  </span>

                  <select
                    value={formData.priority}
                    onChange={(event) =>
                      updateFormData(
                        "priority",
                        event.target
                          .value as ProjectPriority
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-neutral-500"
                  >
                    {projectPriorities.map(
                      (projectPriority) => (
                        <option
                          key={projectPriority}
                          value={projectPriority}
                        >
                          {projectPriority}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <label>
                  <span className="text-sm font-medium text-neutral-300">
                    Deadline
                  </span>

                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(event) =>
                      updateFormData(
                        "deadline",
                        event.target.value
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition focus:border-neutral-500"
                  />
                </label>

                <label>
                  <span className="text-sm font-medium text-neutral-300">
                    Verantwortlicher
                  </span>

                  <input
                    type="text"
                    value={formData.owner}
                    onChange={(event) =>
                      updateFormData(
                        "owner",
                        event.target.value
                      )
                    }
                    className="mt-2 min-h-11 w-full rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2 text-white outline-none transition placeholder:text-neutral-600 focus:border-neutral-500"
                    placeholder="Verantwortlicher"
                  />
                </label>
              </div>

              {formError && (
                <p
                  role="alert"
                  className="mt-5 rounded-xl border border-red-900 bg-red-950/40 px-4 py-3 text-sm text-red-300"
                >
                  {formError}
                </p>
              )}

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200"
                >
                  Änderungen speichern
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex min-h-11 items-center justify-center rounded-xl border border-neutral-700 px-5 py-2 text-sm font-semibold text-neutral-300 transition hover:border-neutral-500 hover:text-white"
                >
                  Abbrechen
                </button>
              </div>
            </form>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-sm text-neutral-500">
                  Projektname
                </p>

                <p className="mt-2 font-medium text-white">
                  {project.title}
                </p>
              </div>

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

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
                <p className="text-sm text-neutral-500">
                  Deadline
                </p>

                <p className="mt-2 font-medium text-white">
                  {formatDeadline(project.deadline)}
                </p>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 sm:col-span-2">
                <p className="text-sm text-neutral-500">
                  Verantwortlicher
                </p>

                <p className="mt-2 font-medium text-white">
                  {project.owner}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
          <h2 className="text-xl font-bold text-white">
            Projektdaten
          </h2>

          <div className="mt-5 space-y-3">
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="font-medium text-neutral-200">
                Stammdaten bearbeiten
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Titel, Kunde, Typ, Status, Priorität,
                Deadline und Verantwortlicher
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="font-medium text-neutral-200">
                Projekt-ID geschützt
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Die stabile Projekt-ID wird beim Speichern
                nicht verändert.
              </p>
            </div>

            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
              <p className="font-medium text-neutral-200">
                Projektinhalte bleiben erhalten
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                Aufgaben, Module, Fortschritt und SEO-Daten
                werden unverändert übernommen.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <ProjectCommunication projectId={project.id} />
      </div>
    </section>
  );
}