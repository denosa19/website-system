"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { defaultModules } from "../../../data/defaultModules";
import { projectTemplates } from "../../../data/projectTemplates";
import { projects as initialProjects } from "../../../data/projects";
import type {
  Project,
  ProjectPriority,
  ProjectStatus,
  ProjectType,
} from "../../../types/project";
import type { SeoData } from "../../../types/seo";

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

type HistoryGroup = {
  key: string;
  updatedAt: number;
};

const PROJECTS_STORAGE_KEY = "internet-firma-projects";
const MAX_HISTORY_ENTRIES = 50;
const HISTORY_GROUP_TIMEOUT = 1000;

function createTasksFromTemplate(
  projectId: string,
  type: ProjectType
) {
  return projectTemplates[type].map((title, index) => ({
    id: `${projectId}_task_${index + 1}`,
    title,
    completed: false,
  }));
}

function createEmptySeoData(): SeoData {
  return {
    domain: "",
    mainKeyword: "",
    secondaryKeywords: [],
    metaTitle: "",
    metaDescription: "",
    h1: "",
    robots: false,
    sitemap: false,
  };
}

function normalizeDomain(value: string) {
  return value
    .trim()
    .replace(/^https?:\/\//i, "")
    .replace(/\/+$/, "");
}

function isRecord(
  value: unknown
): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function cloneProjects(projects: Project[]) {
  return structuredClone(projects);
}

function migrateSeoData(value: unknown): SeoData {
  const fallback = createEmptySeoData();

  if (!isRecord(value)) {
    return fallback;
  }

  return {
    domain:
      typeof value.domain === "string"
        ? normalizeDomain(value.domain)
        : fallback.domain,
    mainKeyword:
      typeof value.mainKeyword === "string"
        ? value.mainKeyword
        : fallback.mainKeyword,
    secondaryKeywords: Array.isArray(
      value.secondaryKeywords
    )
      ? value.secondaryKeywords.filter(
          (keyword): keyword is string =>
            typeof keyword === "string"
        )
      : fallback.secondaryKeywords,
    metaTitle:
      typeof value.metaTitle === "string"
        ? value.metaTitle
        : fallback.metaTitle,
    metaDescription:
      typeof value.metaDescription === "string"
        ? value.metaDescription
        : fallback.metaDescription,
    h1:
      typeof value.h1 === "string"
        ? value.h1
        : fallback.h1,
    robots:
      typeof value.robots === "boolean"
        ? value.robots
        : fallback.robots,
    sitemap:
      typeof value.sitemap === "boolean"
        ? value.sitemap
        : fallback.sitemap,
  };
}

function migrateProject(value: unknown): Project | null {
  if (!isRecord(value)) {
    return null;
  }

  if (
    typeof value.id !== "string" ||
    typeof value.title !== "string" ||
    typeof value.customer !== "string"
  ) {
    return null;
  }

  const fallbackProject = initialProjects.find(
    (project) => project.id === value.id
  );

  const projectType =
    typeof value.type === "string"
      ? (value.type as ProjectType)
      : fallbackProject?.type ?? "Firmenwebseite";

  return {
    id: value.id,
    title: value.title,
    customerId:
      typeof value.customerId === "string"
        ? value.customerId
        : fallbackProject?.customerId ??
          `manual_${value.id}`,
    customer: value.customer,
    type: projectType,
    status:
      typeof value.status === "string"
        ? (value.status as ProjectStatus)
        : fallbackProject?.status ?? "Anfrage",
    priority:
      typeof value.priority === "string"
        ? (value.priority as ProjectPriority)
        : fallbackProject?.priority ?? "Normal",
    progress:
      typeof value.progress === "number"
        ? Math.min(100, Math.max(0, value.progress))
        : fallbackProject?.progress ?? 0,
    deadline:
      typeof value.deadline === "string"
        ? value.deadline
        : fallbackProject?.deadline ?? "",
    owner:
      typeof value.owner === "string"
        ? value.owner
        : fallbackProject?.owner ?? "Dennis",
    tasks: Array.isArray(value.tasks)
      ? value.tasks
          .filter(isRecord)
          .filter(
            (task) =>
              typeof task.id === "string" &&
              typeof task.title === "string"
          )
          .map((task) => ({
            id: task.id as string,
            title: task.title as string,
            completed:
              typeof task.completed === "boolean"
                ? task.completed
                : false,
          }))
      : fallbackProject?.tasks ??
        createTasksFromTemplate(value.id, projectType),
    modules: Array.isArray(value.modules)
      ? (value.modules as Project["modules"])
      : fallbackProject?.modules ??
        structuredClone(defaultModules),
    seo: migrateSeoData(value.seo),
  };
}

function loadStoredProjects(): Project[] {
  try {
    const storedValue = window.localStorage.getItem(
      PROJECTS_STORAGE_KEY
    );

    if (!storedValue) {
      return cloneProjects(initialProjects);
    }

    const parsedValue: unknown = JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return cloneProjects(initialProjects);
    }

    const migratedProjects = parsedValue
      .map(migrateProject)
      .filter(
        (project): project is Project => project !== null
      );

    return migratedProjects.length > 0
      ? migratedProjects
      : cloneProjects(initialProjects);
  } catch (error) {
    console.error(
      "Gespeicherte Projekte konnten nicht geladen werden:",
      error
    );

    return cloneProjects(initialProjects);
  }
}

function isEditableElement(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) {
    return false;
  }

  const tagName = target.tagName.toLowerCase();

  return (
    tagName === "input" ||
    tagName === "textarea" ||
    tagName === "select" ||
    target.isContentEditable
  );
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>(
    cloneProjects(initialProjects)
  );
  const [storageLoaded, setStorageLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<ProjectStatusFilter>("Alle");
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const projectsRef = useRef<Project[]>(
    cloneProjects(initialProjects)
  );
  const pastRef = useRef<Project[][]>([]);
  const futureRef = useRef<Project[][]>([]);
  const historyGroupRef = useRef<HistoryGroup | null>(null);

  const updateHistoryAvailability = useCallback(() => {
    setCanUndo(pastRef.current.length > 0);
    setCanRedo(futureRef.current.length > 0);
  }, []);

  const replaceProjects = useCallback(
    (nextProjects: Project[]) => {
      projectsRef.current = nextProjects;
      setProjects(nextProjects);
    },
    []
  );

  const resetHistoryGroup = useCallback(() => {
    historyGroupRef.current = null;
  }, []);

  const applyProjectChange = useCallback(
    (
      updater: (currentProjects: Project[]) => Project[],
      historyGroupKey?: string
    ) => {
      const currentProjects = projectsRef.current;
      const nextProjects = updater(currentProjects);

      if (nextProjects === currentProjects) {
        return;
      }

      const now = Date.now();
      const activeGroup = historyGroupRef.current;

      const belongsToActiveGroup =
        Boolean(historyGroupKey) &&
        activeGroup?.key === historyGroupKey &&
        now - activeGroup.updatedAt <= HISTORY_GROUP_TIMEOUT;

      if (!belongsToActiveGroup) {
        pastRef.current = [
          ...pastRef.current,
          cloneProjects(currentProjects),
        ].slice(-MAX_HISTORY_ENTRIES);
      }

      historyGroupRef.current = historyGroupKey
        ? {
            key: historyGroupKey,
            updatedAt: now,
          }
        : null;

      futureRef.current = [];

      replaceProjects(nextProjects);
      updateHistoryAvailability();
    },
    [replaceProjects, updateHistoryAvailability]
  );

  const undo = useCallback(() => {
    const previousProjects = pastRef.current.at(-1);

    if (!previousProjects) {
      return;
    }

    const currentProjects = projectsRef.current;

    resetHistoryGroup();

    pastRef.current = pastRef.current.slice(0, -1);
    futureRef.current = [
      cloneProjects(currentProjects),
      ...futureRef.current,
    ].slice(0, MAX_HISTORY_ENTRIES);

    replaceProjects(cloneProjects(previousProjects));
    updateHistoryAvailability();
  }, [
    replaceProjects,
    resetHistoryGroup,
    updateHistoryAvailability,
  ]);

  const redo = useCallback(() => {
    const nextProjects = futureRef.current[0];

    if (!nextProjects) {
      return;
    }

    const currentProjects = projectsRef.current;

    resetHistoryGroup();

    futureRef.current = futureRef.current.slice(1);
    pastRef.current = [
      ...pastRef.current,
      cloneProjects(currentProjects),
    ].slice(-MAX_HISTORY_ENTRIES);

    replaceProjects(cloneProjects(nextProjects));
    updateHistoryAvailability();
  }, [
    replaceProjects,
    resetHistoryGroup,
    updateHistoryAvailability,
  ]);

  useEffect(() => {
    const storedProjects = loadStoredProjects();

    projectsRef.current = storedProjects;
    pastRef.current = [];
    futureRef.current = [];
    historyGroupRef.current = null;

    setProjects(storedProjects);
    setStorageLoaded(true);
    updateHistoryAvailability();
  }, [updateHistoryAvailability]);

  useEffect(() => {
    if (!storageLoaded) {
      return;
    }

    try {
      window.localStorage.setItem(
        PROJECTS_STORAGE_KEY,
        JSON.stringify(projects)
      );
    } catch (error) {
      console.error(
        "Projekte konnten nicht gespeichert werden:",
        error
      );
    }
  }, [projects, storageLoaded]);

  useEffect(() => {
    function handleKeyboardShortcut(event: KeyboardEvent) {
      if (isEditableElement(event.target)) {
        return;
      }

      const modifierPressed =
        event.ctrlKey || event.metaKey;

      if (!modifierPressed) {
        return;
      }

      const pressedKey = event.key.toLowerCase();

      if (pressedKey === "z" && event.shiftKey) {
        event.preventDefault();
        redo();
        return;
      }

      if (pressedKey === "z") {
        event.preventDefault();
        undo();
        return;
      }

      if (pressedKey === "y") {
        event.preventDefault();
        redo();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyboardShortcut
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyboardShortcut
      );
    };
  }, [redo, undo]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const normalizedSearch =
        search.trim().toLowerCase();

      const matchesSearch =
        project.title
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.customer
          .toLowerCase()
          .includes(normalizedSearch) ||
        project.owner
          .toLowerCase()
          .includes(normalizedSearch);

      const matchesStatus =
        statusFilter === "Alle" ||
        project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [projects, search, statusFilter]);

  function createProject(data: CreateProjectData) {
    if (!data.title.trim() || !data.customer.trim()) {
      alert(
        "Bitte mindestens Projektname und Kunde eintragen."
      );
      return;
    }

    const id = `proj_${Date.now()}`;

    const newProject: Project = {
      id,
      title: data.title.trim(),
      customerId:
        data.customerId || `manual_${Date.now()}`,
      customer: data.customer.trim(),
      type: data.type,
      status: data.status,
      priority: data.priority,
      progress: 0,
      deadline: data.deadline,
      owner: data.owner.trim() || "Dennis",
      tasks: createTasksFromTemplate(id, data.type),
      modules: structuredClone(defaultModules),
      seo: createEmptySeoData(),
    };

    applyProjectChange((current) => [
      newProject,
      ...current,
    ]);
  }

  function deleteProject(projectId: string) {
    applyProjectChange((current) =>
      current.filter(
        (project) => project.id !== projectId
      )
    );
  }

  function updateProjectProgress(
    projectId: string,
    progress: number
  ) {
    const safeProgress = Math.min(
      100,
      Math.max(0, progress)
    );

    applyProjectChange(
      (current) =>
        current.map((project) =>
          project.id === projectId
            ? {
                ...project,
                progress: safeProgress,
              }
            : project
        ),
      `project-progress:${projectId}`
    );
  }

  function updateProjectStatus(
    projectId: string,
    status: ProjectStatus
  ) {
    applyProjectChange((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              status,
            }
          : project
      )
    );
  }

  function updateProjectPriority(
    projectId: string,
    priority: ProjectPriority
  ) {
    applyProjectChange((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              priority,
            }
          : project
      )
    );
  }

  function toggleProjectTask(
    projectId: string,
    taskId: string
  ) {
    applyProjectChange((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              tasks: project.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      completed: !task.completed,
                    }
                  : task
              ),
            }
          : project
      )
    );
  }

  function updateProjectSeo(
    projectId: string,
    seo: SeoData
  ) {
    applyProjectChange((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              seo: {
                ...seo,
                domain: normalizeDomain(seo.domain),
                mainKeyword: seo.mainKeyword.trim(),
                secondaryKeywords:
                  seo.secondaryKeywords
                    .map((keyword) => keyword.trim())
                    .filter(Boolean),
                metaTitle: seo.metaTitle.trim(),
                metaDescription:
                  seo.metaDescription.trim(),
                h1: seo.h1.trim(),
              },
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
  };
}