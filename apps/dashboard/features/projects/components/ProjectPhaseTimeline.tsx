import type { Project } from "../../../types/project";

type Props = {
  project: Project | null;
};

const phases = [
  "Lead",
  "Angebot",
  "Kickoff",
  "Design",
  "Entwicklung",
  "SEO",
  "Abnahme",
  "Go Live",
  "Wartung",
];

export default function ProjectPhaseTimeline({ project }: Props) {
  if (!project) return null;

  const currentIndex = (() => {
    switch (project.status) {
      case "Anfrage":
        return 0;
      case "Angebot":
        return 1;
      case "Umsetzung":
        return 4;
      case "Prüfung":
        return 6;
      case "Online":
        return 7;
      case "Wartung":
        return 8;
      default:
        return 0;
    }
  })();

  return (
    <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-6">
      <h3 className="mb-6 text-xl font-bold">Projektfortschritt</h3>

      <div className="space-y-4">
        {phases.map((phase, index) => (
          <div key={phase} className="flex items-center gap-4">
            <div
              className={`h-4 w-4 rounded-full ${
                index <= currentIndex ? "bg-green-500" : "bg-neutral-700"
              }`}
            />

            <span className={index <= currentIndex ? "text-white" : "text-neutral-500"}>
              {phase}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}