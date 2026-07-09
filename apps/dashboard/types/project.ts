export type ProjectStatus =
  | "Anfrage"
  | "Angebot"
  | "Umsetzung"
  | "Prüfung"
  | "Online"
  | "Wartung";

export type ProjectPriority = "Niedrig" | "Normal" | "Hoch";

export type Project = {
  id: string;
  title: string;
  customer: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  deadline: string;
  owner: string;
};