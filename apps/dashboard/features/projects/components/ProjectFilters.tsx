import type { ProjectStatus } from "../../../types/project";

type ProjectStatusFilter = "Alle" | ProjectStatus;

type Props = {
  search: string;
  statusFilter: ProjectStatusFilter;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: ProjectStatusFilter) => void;
};

export default function ProjectFilters({
  search,
  statusFilter,
  onSearchChange,
  onStatusChange,
}: Props) {
  return (
    <div className="flex gap-4">
      <input
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder="Projekte suchen..."
        className="w-full max-w-md rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none"
      />

      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value as ProjectStatusFilter)}
        className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-3 outline-none"
      >
        <option>Alle</option>
        <option>Anfrage</option>
        <option>Angebot</option>
        <option>Umsetzung</option>
        <option>Prüfung</option>
        <option>Online</option>
        <option>Wartung</option>
      </select>
    </div>
  );
}