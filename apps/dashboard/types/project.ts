export type ProjectStatus =
  | "Anfrage"
  | "Angebot"
  | "Umsetzung"
  | "Prüfung"
  | "Online"
  | "Wartung";

export type ProjectPriority = "Niedrig" | "Normal" | "Hoch";

export type ProjectType =
  | "Firmenwebseite"
  | "Landingpage"
  | "Onlineshop"
  | "Mitgliederportal"
  | "Academy"
  | "Blog";

export type ProjectTask = {
  id: string;
  title: string;
  completed: boolean;
};

export type Project = {
  id: string;
  title: string;

  customerId: string;

  customer: string;

  type: ProjectType;

  status: ProjectStatus;

  priority: ProjectPriority;

  progress: number;

  deadline: string;

  owner: string;

  tasks: ProjectTask[];
};