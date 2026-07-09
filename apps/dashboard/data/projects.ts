import type { Project } from "../types/project";

export const projects: Project[] = [
  {
    id: "proj_001",
    title: "Adler Gebäudetechnik Website",
    customer: "Adler Gebäudetechnik",
    status: "Umsetzung",
    priority: "Hoch",
    progress: 65,
    deadline: "2026-07-20",
    owner: "Dennis",
  },
  {
    id: "proj_002",
    title: "iTouch Academy Relaunch",
    customer: "iTouch Academy",
    status: "Angebot",
    priority: "Normal",
    progress: 20,
    deadline: "2026-08-01",
    owner: "Dennis",
  },
];