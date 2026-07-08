import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";

const stats = [
  { label: "Kunden", value: 3 },
  { label: "Projekte", value: 2 },
  { label: "Offene Angebote", value: 1 },
  { label: "KI-Aufgaben", value: 0 },
];

const tasks = [
  "Adler Projekt prüfen",
  "iTouch Angebot vorbereiten",
  "CRM Kundendaten vervollständigen",
];

export default function DashboardHome() {
  return (
    <section>
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="mt-3 text-neutral-400">
          Überblick über Kunden, Projekte und nächste Schritte.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <p className="text-neutral-400">{stat.label}</p>
            <p className="mt-3 text-4xl font-bold">{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <Card>
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-bold">Nächste Aufgaben</h2>
            <Badge>Heute</Badge>
          </div>

          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task}
                className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-neutral-300"
              >
                {task}
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-bold">Systemstatus</h2>

          <div className="mt-5 space-y-3 text-neutral-300">
            <p>CRM Modul: vorbereitet</p>
            <p>Projektmodul: geplant</p>
            <p>Website Engine: vorhanden</p>
            <p>KI Center: noch offen</p>
          </div>
        </Card>
      </div>
    </section>
  );
}