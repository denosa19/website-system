import type { Project } from "../../../types/project";

type Props = {
  projects: Project[];
};

export default function ProjectStats({ projects }: Props) {
  const total = projects.length;
  const active = projects.filter((project) => project.status === "Umsetzung").length;
  const online = projects.filter((project) => project.status === "Online").length;

  const averageProgress =
    total === 0
      ? 0
      : Math.round(
          projects.reduce((sum, project) => sum + project.progress, 0) / total
        );

  const stats = [
    { label: "Projekte", value: total },
    { label: "In Umsetzung", value: active },
    { label: "Online", value: online },
    { label: "Ø Fortschritt", value: `${averageProgress}%` },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6"
        >
          <p className="text-neutral-400">{stat.label}</p>
          <p className="mt-3 text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}