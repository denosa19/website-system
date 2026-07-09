export type ProjectStatus =
  | "Anfrage"
  | "Angebot"
  | "Umsetzung"
  | "Prüfung"
  | "Online"
  | "Wartung";

export type ProjectPriority = "Niedrig" | "Normal" | "Hoch";

export type ProjectTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Project = {
  id: string;
  title: string;
  customer: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  deadline: string;
  owner: string;
  tasks: ProjectTask[];
};