export type ProjectModuleStatus =
  | "Offen"
  | "In Arbeit"
  | "Erledigt";

export type ProjectModule = {
  id: string;
  title: string;
  description: string;
  status: ProjectModuleStatus;
};