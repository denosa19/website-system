import type { Project } from "../types/project";
import { defaultModules } from "./defaultModules";

export const projects: Project[] = [
  {
    id: "proj_001",
    title: "Adler Gebäudetechnik Website",
    customerId: "cust_001",
    customer: "Adler Gebäudetechnik",
    type: "Firmenwebseite",
    status: "Umsetzung",
    priority: "Hoch",
    progress: 65,
    deadline: "2026-07-20",
    owner: "Dennis",
    tasks: [
      {
        id: "task_001",
        title: "Kundendaten prüfen",
        completed: true,
      },
      {
        id: "task_002",
        title: "AI Studio Prompt erstellen",
        completed: true,
      },
      {
        id: "task_003",
        title: "Website prüfen",
        completed: false,
      },
      {
        id: "task_004",
        title: "SEO Grundcheck",
        completed: false,
      },
      {
        id: "task_005",
        title: "Go-Live vorbereiten",
        completed: false,
      },
    ],
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
  },
  {
    id: "proj_002",
    title: "iTouch Academy Relaunch",
    customerId: "cust_002",
    customer: "iTouch Academy",
    type: "Academy",
    status: "Angebot",
    priority: "Normal",
    progress: 20,
    deadline: "2026-08-01",
    owner: "Dennis",
    tasks: [
      {
        id: "task_006",
        title: "Anforderungen klären",
        completed: true,
      },
      {
        id: "task_007",
        title: "Angebot erstellen",
        completed: false,
      },
      {
        id: "task_008",
        title: "Website-Struktur planen",
        completed: false,
      },
    ],
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
  },
];