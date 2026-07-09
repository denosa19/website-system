import type { ProjectStatus } from "../../../types/project";

type Props = {
  status: ProjectStatus;
};

const styles: Record<ProjectStatus, string> = {
  Anfrage: "bg-neutral-800 text-neutral-300",
  Angebot: "bg-blue-500/10 text-blue-300",
  Umsetzung: "bg-yellow-500/10 text-yellow-300",
  Prüfung: "bg-purple-500/10 text-purple-300",
  Online: "bg-green-500/10 text-green-300",
  Wartung: "bg-cyan-500/10 text-cyan-300",
};

export default function ProjectStatusBadge({ status }: Props) {
  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}